from dal.helper import exec_steady
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin):
    ''' Returns an instance of Reporte 55 '''
    
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

    data_rows = getData( ignored_audit_str, ej_ini, ej_fin, 'NO DATO' )

    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }



def getData( ignored_audit_str, ej_ini, ej_fin, str_no_atendidas ):
    rows_asf   = getFiscalData( 'observaciones_pre_asf',   ignored_audit_str, ej_ini, ej_fin )
    rows_asenl = getFiscalData( 'observaciones_pre_asenl', ignored_audit_str, ej_ini, ej_fin )
    rows_cytg  = getFiscalData( 'observaciones_pre_cytg',  ignored_audit_str, ej_ini, ej_fin )

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
        if r['resp_dependencia'] == str_no_atendidas:
            aux_dict[r['dependencia']]['c_na_' + fiscal ] += 1
            aux_dict[r['dependencia']]['m_na_' + fiscal ] += r['monto']
        else:
            aux_dict[r['dependencia']]['c_a_' + fiscal ] += 1
            aux_dict[r['dependencia']]['m_a_' + fiscal ] += r['monto']

    return aux_dict


def getFiscalData(table_name, ignored_audit_str, ej_ini, ej_fin):
    sql = '''
        select pre.id as pre_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, pre.resp_dependencia as resp_dependencia, pre.monto_observado as monto
        from {} as pre
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
        order by dependencia, pre_id;
    '''.format( table_name, ignored_audit_str, ej_ini, ej_fin )
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    return rows


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
