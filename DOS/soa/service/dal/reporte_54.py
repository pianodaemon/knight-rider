from dal.helper import exec_steady
from misc.helperpg import EmptySetError, ServerError


def get(ej_ini, ej_fin):
    ''' Returns an instance of Reporte 53 '''
    
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
    
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(ignored_audit_set, 'pre.')
    
    
    # Retrieve de cant. obs y montos por cada ente, empezando por ASENL
    aux_dict = {}
    
    sql = '''
        select dep_cat.title as dependencia, tipos.title as tipo_obs, pre.estatus_proceso_id as estatus, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto_observado_pre
        from observaciones_pre_asenl as pre
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
			join observation_types as tipos on pre.tipo_observacion_id = tipos.id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        group by dep_cat.title, tipos.title, pre.estatus_proceso_id
        order by dep_cat.title, tipos.title, pre.estatus_proceso_id;
    '''.format(ignored_audit_str, ej_ini, ej_fin)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    
    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['e_asenl_' + str(row[2])] = (row[3], row[4])
        else:
            aux_dict[(row[0], row[1])] = {'e_asenl_' + str(row[2]) : (row[3], row[4])}

    
    # ASF
    ignored_audit_str = ignored_audit_str.replace('pre.', 'pre.')

    sql = '''
        select dep_cat.title as dependencia, pre.estatus_criterio_int_id as estatus, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto_observado_pre
        from observaciones_pre_asf as pre
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        group by dep_cat.title, pre.estatus_criterio_int_id
        order by dep_cat.title, pre.estatus_criterio_int_id;
    '''.format(ignored_audit_str, ej_ini, ej_fin)
    
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []

    for row in rows:
        if (row[0], 'no_obs') in aux_dict:
            aux_dict[(row[0], 'no_obs')]['e_asf_' + str(row[1])] = (row[2], row[3])
        else:
            aux_dict[(row[0], 'no_obs')] = {'e_asf_' + str(row[1]) : (row[2], row[3])}

        
    aux_l = sorted(aux_dict.items())

    
    # Arreglar data en lista de dicts que sera retornada como response
    data_rows = []
    
    for item in aux_l:
        k = item[0]
        v = item[1]
        r = {
            'dep': k[0],
        }

        if k[1] == 'no_obs': 
            r['tipo_obs'] = ''

            if 'e_asenl_1' in v:
                r['c_analisis'] = v['e_asenl_1'][0]
                r['m_analisis'] = v['e_asenl_1'][1]
            else: 
                r['c_analisis'] = 0
                r['m_analisis'] = 0.0

            if 'e_asenl_2' in v:
                r['c_analisis'] = v['e_asenl_2'][0]
                r['m_analisis'] = v['e_asenl_2'][1]
            else: 
                r['c_analisis'] = 0
                r['m_analisis'] = 0.

            if 'e_asenl_3' in v:
                r['c_analisis'] = v['e_asenl_3'][0]
                r['m_analisis'] = v['e_asenl_3'][1]
            else: 
                r['c_analisis'] = 0
                r['m_analisis'] = 0.0       

            if 'e_asenl_4' in v:
                r['c_sol'] = v['e_asenl_4'][0]
                r['m_sol'] = v['e_asenl_4'][1]
            else: 
                r['c_sol'] = 0
                r['m_sol'] = 0.0
      

            if 'e_asenl_5' in v:
                r['c_no_sol'] = v['e_asenl_5'][0]
                r['m_no_sol'] = v['e_asenl_5'][1]
            else: 
                r['c_no_sol'] = 0
                r['m_no_sol'] = 0.0
       

        
        else:
            r['tipo_obs'] = k[1]

            if 'e_asenl_1' in v:
                r['c_sol'] = v['e_asenl_1'][0]
                r['m_sol'] = v['e_asenl_1'][1]
            else: 
                r['c_sol'] = 0
                r['m_sol'] = 0.0

            if 'e_asenl_2' in v:
                r['c_no_sol'] = v['e_asenl_2'][0]
                r['m_no_sol'] = v['e_asenl_2'][1]
            else: 
                r['c_no_sol'] = 0
                r['m_no_sol'] = 0.0


            if 'e_asenl_3' in v:
                r['c_analisis'] = v['e_asenl_3'][0]
                r['m_analisis'] = v['e_asenl_3'][1]
            else: 
                r['c_analisis'] = 0
                r['m_analisis'] = 0.0


        data_rows.append(r)

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
