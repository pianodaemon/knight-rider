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
    rows_asf   = getFiscalData( 'observaciones_pre_asf',   ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('ASFP' in auth) )
    rows_asenl = getFiscalData( 'observaciones_pre_asenl', ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('ASEP' in auth) )
    rows_cytg  = getFiscalData( 'observaciones_pre_cytg',  ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, ('CYTP' in auth) )

    aux_dict  = setObjFiscal( 'asf',   rows_asf,   {},        str_no_atendidas )
    aux_dict1 = setObjFiscal( 'asenl', rows_asenl, aux_dict,  str_no_atendidas )
    aux_dict2 = setObjFiscal( 'cytg',  rows_cytg,  aux_dict1, str_no_atendidas )

    l = []
    for i in aux_dict2:
        aux_di = aux_dict[i]
        ob = {
            'dep':        aux_di['dep'],
            'c_asf':      aux_di['c_asf'],
            'm_asf':      aux_di['m_asf'],
            'c_na_asf':   aux_di['c_na_asf'],
            'm_na_asf':   aux_di['m_na_asf'],
            'c_a_asf':    aux_di['c_a_asf'],
            'm_a_asf':    aux_di['m_a_asf'],
            'c_asenl':    aux_di['c_asenl'],
            'm_asenl':    aux_di['m_asenl'],
            'c_na_asenl': aux_di['c_na_asenl'],
            'm_na_asenl': aux_di['m_na_asenl'],
            'c_a_asenl':  aux_di['c_a_asenl'],
            'm_a_asenl':  aux_di['m_a_asenl'],
            'c_cytg':     aux_di['c_cytg'],
            'm_cytg':     aux_di['m_cytg'],
            'c_na_cytg':  aux_di['c_na_cytg'],
            'm_na_cytg':  aux_di['m_na_cytg'],
            'c_a_cytg':   aux_di['c_a_cytg'],
            'm_a_cytg':   aux_di['m_a_cytg'],
            'c_na_total': aux_di['c_na_asf'] + aux_di['c_na_asenl'] + aux_di['c_na_cytg'],
            'm_na_total': aux_di['m_na_asf'] + aux_di['m_na_asenl'] + aux_di['m_na_cytg'],
            'c_a_total':  aux_di['c_a_asf'] + aux_di['c_a_asenl'] + aux_di['c_a_cytg'],
            'm_a_total':  aux_di['m_a_asf'] + aux_di['m_a_asenl'] + aux_di['m_a_cytg'],
        }
        l.append(ob)
    return l


def setObjFiscal( fiscal, rows, aux_dict, str_no_atendidas ):
    for row in rows:
        r = dict(row)

        if r['dependencia'] not in aux_dict:
            aux_dict[r['dependencia']] = { 
                'dep': r['dependencia'], 
                'm_asf':0.0,   'c_asf':0,   'c_na_asf':0,   'm_na_asf':0.0,   'c_a_asf':0,   'm_a_asf':0.0,
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

    return aux_dict


def getFiscalData(table_name, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, permission):
    sql = '''
        select pre.id as pre_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, pre.resp_dependencia as resp_dependencia, pre.monto_observado as monto
        from {} as pre
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, pre_id;
    '''.format( table_name, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion )
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    return rows

