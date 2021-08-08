from dal.helper import exec_steady, get_direction_str_condition, get_ignored_audit_structs, get_ignored_audits
from misc.helperpg import EmptySetError, ServerError


def get(ej_ini, ej_fin, division_id, auth):
    ''' Returns an instance of Reporte 52 and 53 '''
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)
    str_filtro_direccion = get_direction_str_condition(int(division_id))

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')

    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(get_ignored_audits(), 'ires.')

    # Retrieve de cant. obs y montos por cada ente
    aux_dict1 = getRowsSFP(  ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion,        {}, ('SFPR' in auth))    # SFP
    aux_dict2 = getRowsASF(  ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict1, ('ASFR' in auth))    # ASF
    aux_dict3 = getRowsASENL(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict2, ('ASER' in auth))    # ASENL
    aux_dict4 = getRowsCyTG( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict3, ('CYTR' in auth))    # CyTG (Ires no tiene monto observado)
    
    aux_l = sorted(aux_dict4.items())

    # Arreglar data en lista de dicts que sera retornada como response

    return {
        'data_rows': set_data_rows(aux_l),
        'ignored_audit_ids': ignored_audit_ids
    }

def getRowsSFP(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict, permission):
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(ires.id) as cant_obs, sum(ires.monto_observado) as monto_observado_ires
        from observaciones_sfp as ires
            join auditoria_dependencias as dep on ires.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on ires.auditoria_id = anio.auditoria_id
        where not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    for row in rows:
        aux_dict[(row[0], row[1])] = {'sfp': (row[2], row[3])}
    return aux_dict

def getRowsASF(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict, permission):
    ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(ires.id) as cant_obs, sum(ires.monto_observado) as monto_observado_ires
        from observaciones_ires_asf as ires
            join observaciones_pre_asf as pre on ires.id = pre.observacion_ires_id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked
            and not ires.blocked
            {}
            and pre.observacion_ires_id > 0
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['asf'] = (row[2], row[3])
        else:
            aux_dict[(row[0], row[1])] = {'asf': (row[2], row[3])}
    return aux_dict

def getRowsASENL(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict, permission):
    ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(ires.id) as cant_obs, sum(ires.monto_observado) as monto_observado_ires
        from observaciones_ires_asenl as ires
            join observaciones_pre_asenl as pre on ires.id = pre.observacion_ires_id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked
            and not ires.blocked
            {}
            and pre.observacion_ires_id > 0
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['asenl'] = (row[2], row[3])
        else:
            aux_dict[(row[0], row[1])] = {'asenl': (row[2], row[3])}
    return aux_dict

def getRowsCyTG(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, aux_dict, permission):
    ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
    sql = '''
        select dep_cat.title, anio.anio_cuenta_pub, count(ires.id) as cant_obs
        from observaciones_ires_cytg as ires
            join observaciones_pre_cytg as pre on ires.id = pre.observacion_ires_id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked
            and not ires.blocked
            {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dep_cat.title, anio.anio_cuenta_pub
        order by dep_cat.title, anio.anio_cuenta_pub;
    '''.format(ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    for row in rows:
        if (row[0], row[1]) in aux_dict:
            aux_dict[(row[0], row[1])]['cytg'] = (row[2], 0)
        else:
            aux_dict[(row[0], row[1])] = {'cytg': (row[2], 0)}
    return aux_dict

def set_data_rows( aux_l ):
    data_rows = []
    for item in aux_l:
        k = item[0]
        v = item[1]
        r = {
            'dep': k[0],
            'ej': k[1],
        }

        r['c_sfp'] = 0
        r['m_sfp'] = 0.0
        r['c_asf'] = 0
        r['m_asf'] = 0.0
        r['c_asenl'] = 0
        r['m_asenl'] = 0.0
        r['c_cytg'] = 0
        r['m_cytg'] = 0.0

        if 'sfp' in v:
            r['c_sfp'] = v['sfp'][0]
            r['m_sfp'] = v['sfp'][1]

        if 'asf' in v:
            r['c_asf'] = v['asf'][0]
            r['m_asf'] = v['asf'][1]

        if 'asenl' in v:
            r['c_asenl'] = v['asenl'][0]
            r['m_asenl'] = v['asenl'][1]

        if 'cytg' in v:
            r['c_cytg'] = v['cytg'][0]
            r['m_cytg'] = v['cytg'][1]

        data_rows.append(r)
    return data_rows
