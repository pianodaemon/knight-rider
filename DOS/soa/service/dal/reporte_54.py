from dal.helper import exec_steady
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin, fiscal, user_id):
    ''' Returns an instance of Reporte 54 '''
    
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)
    str_filtro_direccion = get_direction_filter(user_id)

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
    
    if fiscal == '' or fiscal == 'asenl':
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
            rows = exec_steady(sql)
        except EmptySetError:
            rows = []
        
 
        for row in rows:
            if (row[0], row[1]) in aux_dict:
                aux_dict[(row[0], row[1])][ 'to' + str(row[2])] = ( 'asenl', row[3], row[4])
            else:
                aux_dict[(row[0], row[1])] = { 'to' + str(row[2]): ( 'asenl', row[3], row[4])}


    # ASF
    ignored_audit_str = ignored_audit_str.replace('pre.', 'pre.')

    if fiscal == '' or fiscal == 'asf':
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
            rows = exec_steady(sql)
        except EmptySetError:
            rows = []


        for row in rows:
            if (row[0], 'no_data') in aux_dict:
                aux_dict[(row[0], 'no_data')]['to' + str(row[1])] = ('asf', row[2], row[3])
            else:
                aux_dict[(row[0], 'no_data')] = {'to' + str(row[1]): ('asf', row[2], row[3])}


    aux_l = sorted(aux_dict.items())

    
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
            if ob == 'to1' or ob == 'to2' or ob == 'to3' :
                r['c_analisis'] = v[ob][1]
                r['m_analisis'] = v[ob][2]
            elif ob == 'to4':
                r['c_sol'] = v[ob][1]
                r['m_sol'] = v[ob][2]
            elif ob == 'to5':
                r['c_no_sol'] = v[ob][1]
                r['m_no_sol'] = v[ob][2]

        data_rows.append(r)
    
    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }

def get_direction_filter(user_id):
    sql = 'select division_id from users where id = ' + str(user_id) + ' ;'
    try:
        direccion_id = exec_steady(sql)[0][0]
    except EmptySetError:
        direccion_id = 0
    str_filtro_direccion = 'and direccion_id = ' + str(direccion_id) if int(direccion_id) else ''
    return str_filtro_direccion

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
