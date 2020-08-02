from dal.helper import exec_steady


def get(**kwargs):
    ''' Returns an instance of Reporte 53 '''
    
    # Tratamiento de filtros
    ej_ini = kwargs['ejercicio_ini']
    ej_fin = kwargs['ejercicio_fin']

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
    except:
        rows = []

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
    except:
        rows = []

    for row in rows:
        if row[0] > 1:
            ignored_audit_set.add(row[1])
        else:
            break
    
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(ignored_audit_set, 'ires.')
    
    
    # Retrieve de cant. obs y montos por cada ente, empezando por SFP
    aux_dict = {}
    
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(ires.id) as cant_obs, sum(ires.monto_observado) as monto_observado_ires
        from observaciones_sfp as ires
            join auditoria_dependencias as dep on ires.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on ires.auditoria_id = anio.auditoria_id
        where not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin)

    try:
        rows = exec_steady(sql)
    except:
        rows = []
    
    for row in rows:
        aux_dict[(row[0], row[1])] = {'sfp': (row[2], row[3])}

    
    # ASF
    ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')

    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(pre.id) as cant_obs, sum(ires.monto_observado) as monto_observado_ires
        from observaciones_pre_asf as pre
            join observaciones_ires_asf as ires on pre.observacion_ires_id = ires.id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and pre.observacion_ires_id > 0
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin)
    
    try:
        rows = exec_steady(sql)
    except:
        rows = []

    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['asf'] = (row[2], row[3])
        else:
            aux_dict[(row[0], row[1])] = {'asf': (row[2], row[3])}


    # ASENL
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(pre.id) as cant_obs, sum(ires.monto_observado) as monto_observado_ires
        from observaciones_pre_asenl as pre
            join observaciones_ires_asenl as ires on pre.observacion_ires_id = ires.id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and pre.observacion_ires_id > 0
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin)
    
    try:
        rows = exec_steady(sql)
    except:
        rows = []

    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['asenl'] = (row[2], row[3])
        else:
            aux_dict[(row[0], row[1])] = {'asenl': (row[2], row[3])}


    # CyTG
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto_observado_pre
        from observaciones_pre_cytg as pre
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin)

    try:
        rows = exec_steady(sql)
    except:
        rows = []

    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['cytg'] = (row[2], row[3])
        else:
            aux_dict[(row[0], row[1])] = {'cytg': (row[2], row[3])}
    
    aux_l = sorted(aux_dict.items())

    
    # Arreglar data en lista de dicts que sera retornada como response
    data_rows = []
    
    for item in aux_l:
        k = item[0]
        v = item[1]
        r = {
            'dep': k[0],
            'ej': k[1],
        }
        if 'sfp' in v:
            r['c_sfp'] = v['sfp'][0]
            r['m_sfp'] = v['sfp'][1]
        else:
            r['c_sfp'] = 0
            r['m_sfp'] = 0.0

        if 'asf' in v:
            r['c_asf'] = v['asf'][0]
            r['m_asf'] = v['asf'][1]
        else:
            r['c_asf'] = 0
            r['m_asf'] = 0.0

        if 'asenl' in v:
            r['c_asenl'] = v['asenl'][0]
            r['m_asenl'] = v['asenl'][1]
        else:
            r['c_asenl'] = 0
            r['m_asenl'] = 0.0

        if 'cytg' in v:
            r['c_cytg'] = v['cytg'][0]
            r['m_cytg'] = v['cytg'][1]
        else:
            r['c_cytg'] = 0
            r['m_cytg'] = 0.0

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
