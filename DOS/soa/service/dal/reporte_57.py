from dal.helper import exec_steady, get_direction_str_condition, get_ignored_audit_structs, get_ignored_audits
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin, fiscal, onlyObras, division_id, auth):
    ''' Returns an instance of Reporte 57 and 59'''
    
    # Tratamiento de filtros
    ej_ini     = int(ej_ini)
    ej_fin     = int(ej_fin)
    only_obras = True if onlyObras else False
    str_filtro_direccion = get_direction_filter(int(division_id), only_obras)

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')

    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(get_ignored_audits(), 'ires.')

    #Organos fiscalizadores
    entes = setEntesIds()

    data_rows = []
    if fiscal == 'SFP':
        data_rows = getDataSFP(   ignored_audit_str, ej_ini, ej_fin,   entes['SFP'], only_obras, str_filtro_direccion, ('SFPR' in auth) )
    elif fiscal == 'ASF':
        ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
        data_rows = getDataASF(   ignored_audit_str, ej_ini, ej_fin,   entes['ASF'], only_obras, str_filtro_direccion, ('ASFR' in auth) )
    elif fiscal == 'CYTG':
        ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
        data_rows = getDataCYTG(  ignored_audit_str, ej_ini, ej_fin,  entes['CyTG'], only_obras, str_filtro_direccion, ('CYTR' in auth) )
    elif fiscal == 'ASENL':
        ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
        data_rows = getDataASENL( ignored_audit_str, ej_ini, ej_fin, entes['ASENL'], only_obras, str_filtro_direccion, ('ASER' in auth) )

    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }



def getDataASF( ignored_audit_str, ej_ini, ej_fin, ente, only_obras, str_filtro_direccion, permission ):
    data_rows = []
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, pre.direccion_id as direccion_id, ires.monto_observado as monto_observado
        from observaciones_ires_asf as ires
        join observaciones_pre_asf as pre on ires.id = pre.observacion_ires_id
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on ires.tipo_observacion_id = tipos.id
        where not pre.blocked
    	    and not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, tipo_observacion, ejercicio, ires_id;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)

    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []

    l = []
    for row in rows:
        r = dict(row)
        
        sql = '''
            select seg.clasif_final_interna_cytg, seg.monto_pendiente_solventar, clas.title
            from seguimientos_obs_asf as seg 
            join clasifs_internas_cytg as clas on seg.clasif_final_interna_cytg = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['direccion_id'], ente, r['ires_id'])

        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            

        r['monto'] = r['monto_observado']
        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = segd['clasif_final_interna_cytg']
            r['clasif_name'] = segd['title']
        else:
            r['clasif_id']   = 0
            r['clasif_name'] = 'Sin Clasificación'
        l.append(r)

    data_rowsl = {}

    for i in l:
        key = (i['dependencia'], i['tipo_observacion'])
        if key in data_rowsl:
            data_rowsl[key]['cant_obs'] += 1
            data_rowsl[key]['monto'] += i['monto']
        else:
            data_rowsl[key] = {'cant_obs': 1, 'monto': i['monto'], 'clasif_name': i['clasif_name']}

    for item in data_rowsl:
        value = data_rowsl[item]
        
        o = {}
        o['dep']              = item[0]
        o['tipo']             = item[1]
        o['c_obs']            = value['cant_obs']
        o['monto']            = value['monto']
    
        data_rows.append(o)

    return data_rows


def getDataCYTG( ignored_audit_str, ej_ini, ej_fin, ente, only_obras, str_filtro_direccion, permission ):
    data_rows = []
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, pre.direccion_id as direccion_id, ires.clasif_final_cytg as clasif_final_cytg,
               pre.monto_observado
        from observaciones_ires_cytg as ires
        join observaciones_pre_cytg as pre on ires.observacion_pre_id = pre.id
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on ires.tipo_observacion_id = tipos.id
        where not pre.blocked
            and not ires.blocked
            {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, tipo_observacion, ejercicio, ires_id;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion )
        
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    
    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.monto_pendiente_solventar, clas.title
            from seguimientos_obs_cytg as seg 
            join clasifs_internas_cytg as clas on {} = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['clasif_final_cytg'], r['direccion_id'], ente, r['ires_id'])
    
        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            

        r['monto'] = r['monto_observado']
        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = r['clasif_final_cytg']
            r['clasif_name'] = segd['title']
        else:
            r['clasif_id']   = 0
            r['clasif_name'] = 'Sin Clasificación'
        l.append(r)
    
    data_rowsl = {}
    
    for i in l:
        key = (i['dependencia'], i['tipo_observacion'])
        if key in data_rowsl:
            data_rowsl[key]['cant_obs'] += 1
            data_rowsl[key]['monto'] += i['monto']
        else:
            data_rowsl[key] = {'cant_obs': 1, 'monto': i['monto'], 'clasif_name': i['clasif_name']}
    
    for item in data_rowsl:
        value = data_rowsl[item]
        
        o = {}
        o['dep']              = item[0]
        o['tipo']             = item[1]
        o['c_obs']            = value['cant_obs']
        o['monto']            = value['monto']
    
        data_rows.append(o)
    
    return data_rows



def getDataSFP( ignored_audit_str, ej_ini, ej_fin, ente, only_obras, str_filtro_direccion, permission ):
    data_rows = []
    sql = '''
        select ires.id as ires_id, dep_cat.title, anio.anio_cuenta_pub, tipos.title as tipo_observacion, ires.direccion_id, ires.monto_observado as monto_observado
        from observaciones_sfp as ires
        join auditoria_dependencias     as dep      on ires.auditoria_id        = dep.auditoria_id
        join dependencies               as dep_cat  on dep.dependencia_id       = dep_cat.id
        join auditoria_anios_cuenta_pub as anio     on ires.auditoria_id        = anio.auditoria_id
        join observation_types          as tipos    on ires.tipo_observacion_id = tipos.id
        where not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dep_cat.title, tipos.title, anio.anio_cuenta_pub, ires_id;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion )

    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []

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
        '''.format(r['direccion_id'], ente, r['ires_id'])

        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []              
            
        r['monto'] = r['monto_observado']
        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = segd['clasif_final_interna_cytg']
            r['clasif_name'] = segd['title']
        else:
            r['clasif_id']   = 0
            r['clasif_name'] = 'Sin Clasificación'
        l.append(r)

    data_rowsl = {}
    for i in l:
        key = (i['title'], i['tipo_observacion'])
        if key in data_rowsl:
            data_rowsl[key]['cant_obs'] += 1
            data_rowsl[key]['monto'] += i['monto']
        else:
            data_rowsl[key] = { 'cant_obs': 1, 'monto': i['monto'] }

    for item in data_rowsl:
        value = data_rowsl[item]

        o = {}
        o['dep']              = item[0]
        o['tipo']             = item[1]
        o['c_obs']            = value['cant_obs']
        o['monto']            = value['monto']
    
        data_rows.append(o)

    return data_rows



def getDataASENL( ignored_audit_str, ej_ini, ej_fin, ente, only_obras, str_filtro_direccion, permission ):
    data_rows = []
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, pre.direccion_id as direccion_id, ires.clasif_final_cytg as clasif_final_cytg, ires.monto_pendiente_solventar as monto_pendiente_solventar, ires.monto_observado as monto_observado  
        from observaciones_ires_asenl as ires
        join observaciones_pre_asenl as pre on ires.observacion_pre_id = pre.id
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on ires.tipo_observacion_id = tipos.id
        where not pre.blocked
            and not ires.blocked
            {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, ejercicio, tipo_observacion, ires_id;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion )
        
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    
    l = []
    for row in rows:
        r = dict(row)
 
        r['clasif_id']   = r['clasif_final_cytg']
        r['monto']       = r['monto_observado']
        l.append(r)
    
    data_rowsl = {}
    
    for i in l:
        key = (i['dependencia'], i['tipo_observacion'] )
        if key in data_rowsl:
            data_rowsl[key]['cant_obs'] += 1
            data_rowsl[key]['monto'] += i['monto']
        else:
            data_rowsl[key] = { 'cant_obs': 1, 'monto': i['monto'] }
    
    for item in data_rowsl:
        value = data_rowsl[item]
        
        o = {}
        o['dep']              = item[0]
        o['tipo']             = item[1]
        o['c_obs']            = value['cant_obs']
        o['monto']            = value['monto']
    
        data_rows.append(o)
    
    return data_rows


def setEntesIds():
    entesSql = "select * from fiscals;"
    try:
        entesRows = exec_steady(entesSql)
    except EmptySetError:
        rows = []

    entes = {}
    for e in entesRows:
        entes[e[1]] = e[0]

    return entes


def getObraPublicaId():
    sql = "select id from divisions where title = 'OBRAS';"
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    
    return rows[0][0]

def get_direction_filter(division_id, only_obras):
    if only_obras:
        idObraPublica = getObraPublicaId()
        if division_id == idObraPublica or division_id == 0:    #Condicion solo los usuarios con direccion de obra publica o el usuario que puede puede ver todas las direcciones
            str_filtro_direccion = 'and direccion_id = %i' % idObraPublica
        else:
            str_filtro_direccion = 'and direccion_id = 0'       #No hay direcciones con ese id, el query estara vacio
    else: 
        str_filtro_direccion = 'and direccion_id = ' + str(division_id) if int(division_id) else ''

    return str_filtro_direccion

