from dal.helper import exec_steady, get_direction_str_condition, get_ignored_audit_structs, get_ignored_audits
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin, fiscal, division_id, auth):
    ''' Returns an instance of Reporte 54 '''
    
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)
    str_filtro_direccion = get_direction_str_condition(int(division_id))

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')
    
    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(get_ignored_audits(), 'pre.')

    # Retrieve de cant. obs y montos por cada ente, empezando por ASENL
    aux_dict1 = getRowsASENL(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, fiscal,        {}, ('ASEP' in auth))
    aux_dict2 = getRowsASF(  ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, fiscal, aux_dict1, ('ASFP' in auth))
    aux_dict3 = getRowsCYTG( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, fiscal, aux_dict2, ('CYTP' in auth))
        
    aux_l = sorted(aux_dict3.items())
    
    # Arreglar data en lista de dicts que sera retornada como response
    data_rows = []
    
    for item in aux_l:
        k = item[0]
        v = item[1]
        r = {
            'dep': k[0],
        }

        r['tipo_obs'] = '' if k[1] == 'no_data' else k[1]

        r['c_analisis'] = 0
        r['m_analisis'] = 0.0
        r['c_sol'] = 0
        r['m_sol'] = 0.0
        r['c_no_sol'] = 0
        r['m_no_sol'] = 0.0

        # estatus_pre_asenl no tiene las opciones solventadas ni no solventadas (Las 3 se consideraran en analisis)
        # -En análisis de la CYTG
        # -En análisis del organismo/dependencia
        # -En análisis del ente fiscalizador

        # estatus_pre_asf (Las primeras 3 se consideraran en analisis)
        # -Observaciones Preliminares
        # -Respuestas atendida a Preliminares
        # -En análisis del ente fiscalizador
        # -Solventada
        # -No solventada

        for ob in v:
            if ob == 'to_ana' :
                r['c_analisis'] = v[ob][1]
                r['m_analisis'] = v[ob][2]
            elif ob == 'to_sol':
                r['c_sol'] = v[ob][1]
                r['m_sol'] = v[ob][2]
            elif ob == 'to_not':
                r['c_no_sol'] = v[ob][1]
                r['m_no_sol'] = v[ob][2]

        data_rows.append(r)
    
    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }

def getRowsASENL(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, fiscal, aux_dict, permission):
    estatuses = getArrayEstatusASENL('estatus_pre_asenl')
    sql = '''
        select dep_cat.title as dependencia, tipos.title as tipo_obs, pre.estatus_proceso_id as estatus, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto_observado_pre
        from observaciones_pre_asenl as pre
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
			join observation_types as tipos on pre.tipo_observacion_id = tipos.id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, tipos.title, pre.estatus_proceso_id
        order by dep_cat.title, tipos.title, pre.estatus_proceso_id;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if ((fiscal == '' or fiscal == 'asenl') and permission ) else []
    except EmptySetError:
        rows = []
    for row in rows:
        estatusStr = estatuses[row[2]] if isinstance(row[2], int) else '_none'
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])][ 'to' + estatusStr ] = ( 'asenl', row[3], row[4])
        else:
            aux_dict[(row[0], row[1])] = { 'to' + estatusStr: ( 'asenl', row[3], row[4])}
    return aux_dict

def getRowsASF(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, fiscal, aux_dict, permission):
    estatuses = getArrayEstatusASENL('estatus_pre_asf')
    sql = '''
        select dep_cat.title as dependencia, pre.estatus_criterio_int_id as estatus, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto_observado_pre
        from observaciones_pre_asf as pre
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, pre.estatus_criterio_int_id
        order by dep_cat.title, pre.estatus_criterio_int_id;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if ((fiscal == '' or fiscal == 'asf') and permission ) else []
    except EmptySetError:
        rows = []
    for row in rows:
        estatusStr = estatuses[row[1]] if isinstance(row[1], int) else '_none'
        if (row[0], 'no_data') in aux_dict:
            t = aux_dict[(row[0], 'no_data')]['to' + estatusStr]
            aux_dict[(row[0], 'no_data')]['to' + estatusStr] = ('asf', t[1] + row[2], t[2] + row[3])
        else:
            aux_dict[(row[0], 'no_data')] = {'to' + estatusStr: ('asf', row[2], row[3])}
    return aux_dict

def getRowsCYTG(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, fiscal, aux_dict, permission):
    estatuses = getArrayEstatusASENL('estatus_pre_cytg')
    sql = '''
        select dep_cat.title as dependencia, tipos.title as tipo_obs, pre.estatus_id as estatus, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto_observado_pre
        from observaciones_pre_cytg as pre
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
			join observation_types as tipos on pre.tipo_observacion_id = tipos.id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, tipos.title, estatus 
        order by dep_cat.title, tipos.title, estatus;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if ((fiscal == '' or fiscal == 'cytg') and permission ) else []
    except EmptySetError:
        rows = []
    for row in rows:
        estatusStr = estatuses[row[2]] if isinstance(row[2], int) else '_none'
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])][ 'to' + estatusStr ] = ( 'cytg', row[3], row[4])
        else:
            aux_dict[(row[0], row[1])] = { 'to' + estatusStr : ( 'cytg', row[3], row[4])}
    return aux_dict

def getArrayEstatusASENL(tableEstatusName):
    sql = 'select id, title from '+ tableEstatusName + ';'
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    estatuses = ['none']
    for row in rows:
        title = row[1].lower()
        if 'no solventada' == title:
            estatuses.append('_not')
        elif 'solventada' == title:
            estatuses.append('_sol')
        else:
            estatuses.append('_ana')
    return estatuses
