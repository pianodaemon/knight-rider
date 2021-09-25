from dal.helper import exec_steady, get_direction_str_condition, get_ignored_audit_structs, get_ignored_audits
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin, division_id, auth):
    ''' Returns an instance of Reporte 55 '''
    
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)
    str_filtro_direccion = get_direction_str_condition(int(division_id))

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')

    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(get_ignored_audits(), 'pre.')

    data_rows = getData( ignored_audit_str, ej_ini, ej_fin, 'NO DATO', str_filtro_direccion, auth )

    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }


def getData( ignored_audit_str, ej_ini, ej_fin, str_no_atendidas, str_filtro_direccion, auth ):
    rows_asf   = getFiscalData( 'observaciones_pre_asf',   ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('ASFP' in auth))
    rows_sfp   = getFiscalData2('observaciones_sfp',       ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('SFPR' in auth))
    rows_asenl = getFiscalData( 'observaciones_pre_asenl', ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('ASEP' in auth))
    rows_cytg  = getFiscalData( 'observaciones_pre_cytg',  ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('CYTP' in auth))

    aux_dict = {}
    setObjFiscal('asf',   rows_asf,   aux_dict, str_no_atendidas)
    setObjFiscal('sfp',   rows_sfp,   aux_dict, str_no_atendidas)
    setObjFiscal('asenl', rows_asenl, aux_dict, str_no_atendidas)
    setObjFiscal('cytg',  rows_cytg,  aux_dict, str_no_atendidas)

    l = []
    for i in aux_dict.values():
        i['c_na_total'] = i['c_na_asf'] + i['c_na_sfp'] + i['c_na_asenl'] + i['c_na_cytg']
        i['m_na_total'] = i['m_na_asf'] + i['m_na_sfp'] + i['m_na_asenl'] + i['m_na_cytg']
        i['c_a_total']  = i['c_a_asf']  + i['c_a_sfp']  + i['c_a_asenl']  + i['c_a_cytg']
        i['m_a_total']  = i['m_a_asf']  + i['m_a_sfp']  + i['m_a_asenl']  + i['m_a_cytg']
        l.append(i)

    return l


def setObjFiscal( fiscal, rows, aux_dict, str_no_atendidas ):

    for row in rows:
        r = dict(row)

        if r['dependencia'] not in aux_dict:
            aux_dict[r['dependencia']] = { 
                'dep': r['dependencia'], 
                'm_asf':0.0,   'c_asf':0,   'c_na_asf':0,   'm_na_asf':0.0,   'c_a_asf':0,   'm_a_asf':0.0,
                'm_sfp':0.0,   'c_sfp':0,   'c_na_sfp':0,   'm_na_sfp':0.0,   'c_a_sfp':0,   'm_a_sfp':0.0,
                'm_asenl':0.0, 'c_asenl':0, 'c_na_asenl':0, 'm_na_asenl':0.0, 'c_a_asenl':0, 'm_a_asenl':0.0,
                'm_cytg':0.0,  'c_cytg':0,  'c_na_cytg':0,  'm_na_cytg':0.0,  'c_a_cytg':0,  'm_a_cytg':0.0,
            }
        aux_dict[r['dependencia']]['c_' + fiscal ] += 1
        aux_dict[r['dependencia']]['m_' + fiscal ] += r['monto']

        if r['resp_dependencia'] == str_no_atendidas or r['resp_dependencia'] == '' :
            aux_dict[r['dependencia']]['c_na_' + fiscal ] += 1
            aux_dict[r['dependencia']]['m_na_' + fiscal ] += r['monto']
        else:
            aux_dict[r['dependencia']]['c_a_' + fiscal ] += 1
            aux_dict[r['dependencia']]['m_a_' + fiscal ] += r['monto']


def getFiscalData(table_name, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, permission):

    ires_table_name = table_name.replace('pre', 'ires')
    if ires_table_name == 'observaciones_ires_cytg':
        tabla_monto = 'pre.monto_observado'
    else:
        tabla_monto = 'ires.monto_observado'

    sql = '''
        select pre.id as pre_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, pre.resp_dependencia as resp_dependencia, {} as monto
        from {} as pre
        join {} as ires on ires.id = pre.observacion_ires_id
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked
            and not ires.blocked
            {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, pre_id;
    '''.format(tabla_monto, table_name, ires_table_name, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    return rows


def getFiscalData2(table_name, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, permission):

    ires_ignored_audit_str = ignored_audit_str.replace('pre.', 'ires.')
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, ires.num_oficio_resp_dependencia as resp_dependencia, ires.monto_observado as monto
          from {} as ires
          join auditoria_dependencias as dep on ires.auditoria_id = dep.auditoria_id
          join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
          join auditoria_anios_cuenta_pub as anio on ires.auditoria_id = anio.auditoria_id
         where not ires.blocked
           {}
           and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
           {}
         order by dependencia, ires_id;
    '''.format(table_name, ires_ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    return rows
