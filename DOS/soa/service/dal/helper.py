from misc.helperpg import pgslack_connected, pgslack_exec, pgslack_update
from misc.helperpg import EmptySetError, ServerError

@pgslack_connected
def run_stored_procedure(conn, sql):
    """Runs a stored procedure with rich answer"""

    r = pgslack_exec(conn, sql)

    # For this case we are just expecting one row
    if len(r) != 1:
        return -1, "Unexpected result regarding execution of stored procedure"

    return r.pop()


@pgslack_connected
def exec_steady(conn, sql):
    return pgslack_exec(conn, sql)


@pgslack_connected
def update_steady(conn, sql):
    return pgslack_update(conn, sql)


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


def get_direction_str_condition(division_id):
    return 'and direccion_id = ' + str(division_id) if division_id else ''


def get_ignored_audits():
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
    return ignored_audit_set


def get_audit_set_from_anio_cuenta_pub(indirect_search_params):

    if indirect_search_params and 'anio_cuenta_pub' in indirect_search_params:
        existe = True
    else:
        existe = False
        return existe, set()
    
    audit_set = set()
    sql = '''
        SELECT auditoria_id
        FROM auditoria_anios_cuenta_pub
        WHERE anio_cuenta_pub = {}
        ORDER BY auditoria_id ASC;
    '''.format(indirect_search_params['anio_cuenta_pub'])
    
    rows = exec_steady(sql)
    for row in rows:
        audit_set.add(row[0])

    return existe, audit_set


def get_audit_set_from_dependencia(indirect_search_params):

    if indirect_search_params and 'dependencia_id' in indirect_search_params:
        existe = True
    else:
        existe = False
        return existe, set()
    
    audit_set = set()
    sql = '''
        SELECT auditoria_id
        FROM auditoria_dependencias
        WHERE dependencia_id = {}
        ORDER BY auditoria_id ASC;
    '''.format(indirect_search_params['dependencia_id'])
    
    rows = exec_steady(sql)
    for row in rows:
        audit_set.add(row[0])

    return existe, audit_set


def filter_entities(entities, indirect_search_params):

    existe_dep_param, audit_dep_set = get_audit_set_from_dependencia(indirect_search_params)
    existe_anio_param, audit_anio_set = get_audit_set_from_anio_cuenta_pub(indirect_search_params)

    if not existe_dep_param and not existe_anio_param:
        return 0
    else:
        if existe_dep_param and existe_anio_param:
            audit_result_set = audit_dep_set.intersection(audit_anio_set)
        elif existe_dep_param and not existe_anio_param:
            audit_result_set = audit_dep_set
        elif existe_anio_param and not existe_dep_param:
            audit_result_set = audit_anio_set

        deletion_idx = []
        for i, e in enumerate(entities):
            if e['auditoria_id'] not in audit_result_set:
                deletion_idx.append(i)
        
        deletion_idx.reverse()
        
        for idx in deletion_idx:
            del entities[idx]
        
        return len(deletion_idx)
