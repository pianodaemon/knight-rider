from dal.helper import exec_steady
from misc.helperpg import EmptySetError, ServerError
from flask import current_app

def get(ej_ini, ej_fin, fiscal):
    ''' Returns an instance of Reporte 56 '''
    
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')

    
    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_set = set()

    sql = '''
        select count(auditoria_id) as conteo, auditoria_id
        from auditoria_anios_cuenta_pub
        group by auditoria_id
        order by conteo desc, auditoria_id;
    '''
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    except Exception:
        raise ServerError('Hay un problema con el servidor de base de datos')

    for row in rows:
        if row[0] > 1:
            ignored_audit_set.add(row[1])
        else:
            break
    
    sql = '''
        select count(auditoria_id) as conteo, auditoria_id
        from auditoria_dependencias
        group by auditoria_id
        order by conteo desc, auditoria_id;
    '''
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []

    for row in rows:
        if row[0] > 1:
            ignored_audit_set.add(row[1])
        else:
            break
    
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(ignored_audit_set, 'ires.')
    
    
    #Organos fiscalizadores
    entesSql = "select * from fiscals;"
    try:
        entesRows = exec_steady(entesSql)
    except EmptySetError:
        rows = []

    entes = {}
    for e in entesRows:
        entes[e[1]] = e[0]


    # Retrieve de cant. obs y montos por cada ente, empezando por ASENL
    aux_dict = {}

    data_rows = []
    
    if fiscal == 'SFP':
        sql = '''
            select ires.id, dep_cat.title, anio.anio_cuenta_pub, tipos.title as tipo_observacion, ires.direccion_id
            from observaciones_sfp as ires
            join auditoria_dependencias     as dep      on ires.auditoria_id        = dep.auditoria_id
            join dependencies               as dep_cat  on dep.dependencia_id       = dep_cat.id
            join auditoria_anios_cuenta_pub as anio     on ires.auditoria_id        = anio.auditoria_id
            join observation_types          as tipos    on ires.tipo_observacion_id = tipos.id
            where not ires.blocked {}
                and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            group by dep_cat.title, anio.anio_cuenta_pub, tipos.title, ires.id
            order by dep_cat.title, anio.anio_cuenta_pub, tipos.title, ires.id;
        '''.format(ignored_audit_str, ej_ini, ej_fin)


        try:
            rows = exec_steady(sql)
        except EmptySetError:
            rows = []

        ente = entes['SFP']
        
        l = []
        for row in rows:
            r = dict(row)
            sql = '''
                select seg.clasif_final_interna_cytg, seg.monto_pendiente_solventar, clas.title
                from seguimientos_obs_sfp as seg 
                join clasifs_internas_cytg as clas on seg.clasif_final_interna_cytg = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
                where observacion_id = {}
                order by seguimiento_id desc
                limit 1;
            '''.format(row[4], ente, row[0])

            try:
                seg = exec_steady(sql)
            except EmptySetError:
                seg = []            

            r['clasif_id'] = seg[0][0]
            r['monto'] = seg[0][1]
            r['clasif_name'] = seg[0][2]
            l.append(r)
            


        data_rowsl = {}
        for i in l:
            key = (i['title'], i['anio_cuenta_pub'], i['tipo_observacion'], i['clasif_id'])
            if key in data_rowsl:
                data_rowsl[key]['cant_obs'] += 1
                data_rowsl[key]['monto'] += i['monto']
            else:
                data_rowsl[key] = {'cant_obs': 1, 'monto': i['monto'], 'clasif_name': i['clasif_name']}

        for item in data_rowsl:
            value = data_rowsl[item]
            
            o = {}
            o['dep']              = item[0]
            o['ej']               = item[1]
            o['tipo']             = item[2]
            o['clasif_name']      = value['clasif_name']
            o['c_obs']            = value['cant_obs']
            o['monto']            = value['monto']
        
            data_rows.append(o)
    

    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }


def get_ignored_audit_structs(ignored_audit_set, prefix):
    s = ''
    l = []
    while True:
        try:
            aud = str(ignored_audit_set.pop())
            l.append(aud)
            s += ' and ' + prefix + 'auditoria_id <> ' + aud
        except:
            break
    
    return s, l
