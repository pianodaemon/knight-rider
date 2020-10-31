import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_audit(**kwargs):
    """Calls sp in charge of create and edit a audit"""
    dependecy_ids_str = str(set(kwargs['dependency_ids']))
    years_str = str(set(kwargs['years']))

    sql = """SELECT * FROM alter_audit(
        {}::integer,
        '{}'::character varying,
        '{}'::integer[],
        '{}'::integer[],
        {}::integer,
        {}::integer)
        AS result( rc integer, msg text )""".format(
            kwargs["id"],
            kwargs["title"],
            dependecy_ids_str,
            years_str,
            kwargs["org_fiscal_id"],
            kwargs["direccion_id"],
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("audits", id)
    return add_audit_data(ent)


def create(**kwargs):
    ''' Creates an audit entity '''
    kwargs['id'] = 0
    return _alter_audit(**kwargs)


def read(id):
    ''' Fetches an audit entity '''
    ent = fetch_entity("audits", id)
    return add_audit_data(ent)


def update(id, **kwargs):
    ''' Updates an audit entity '''
    kwargs['id'] = id
    return _alter_audit(**kwargs)


def delete(id):
    ''' Deletes an audit entity '''
    ent = delete_entity("audits", id)
    return add_audit_data(ent)


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Reads a page of audits '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")

    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = ('id', 'title')
    if order_by not in order_by_values:
        raise Exception("Value of param 'order_by' should be one of the following: " + str(order_by_values))

    order_values = ('ASC', 'DESC', 'asc', 'desc')
    if order not in order_values:
        raise Exception("Value of param 'order' should be one of the folowing: " + str(order_values))

    per_page = int(per_page)
    page = int(page)
    if per_page < 1 or page < 1:
        raise Exception("Value of params 'per_page' and 'page' should be >= 1")

    if search_params and 'direccion_id' in search_params and search_params['direccion_id'] == '0':
        del search_params['direccion_id']
        if not search_params:
            search_params = None

    # Counting total number of items and fetching target page
    total_items = count_entities('audits', search_params)
    if total_items > limit:
        total_items = limit

    total_pages = math.ceil(total_items / per_page)

    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total_items:
        return [], total_items, total_pages

    target_items = total_items - whole_pages_offset
    if target_items > per_page:
        target_items = per_page

    entities = page_entities('audits', offset + whole_pages_offset, target_items, order_by, order, search_params)
    
    # Adding some dependency and year (public account) data
    enriched_list = []
    for e in entities:
        enriched_list.append(add_audit_data(e))

    return (
        enriched_list,
        total_items,
        total_pages
    )


def get_catalogs(table_name_list, search_params):
    ''' Fetches values and captions from a list of tables, intended for use in ui screens '''
    fields_d = {}

    for table in table_name_list:
        values_l = []

        if table == 'dependencies':
            sql = '''
                SELECT dep.id, dep.title, dep.description, clasif.title as clasif_title
                FROM dependencies as dep
                JOIN dependencia_clasif AS clasif ON dep.clasif_id = clasif.id
                ORDER BY dep.id;
            '''.format(table)

        elif table == 'divisions' and search_params and 'direccion_id' in search_params and int(search_params['direccion_id']) > 0:
            sql = '''
                SELECT *
                FROM {}
                WHERE id = {};
            '''.format(table, search_params['direccion_id'])

        else:
            sql = '''
                SELECT *
                FROM {}
                ORDER BY id;
            '''.format(table)

        rows = exec_steady(sql)

        for row in rows:
            values_l.append(dict(row))
        
        fields_d[table] = values_l

    return fields_d


def add_audit_data(ent):
    attributes = set([
        'id',
        'title',
        'org_fiscal_id',
        'direccion_id',
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}

    mod_ent['dependency_ids'] = []
    sql = '''
        SELECT dependencia_id
        FROM auditoria_dependencias
        WHERE auditoria_id = {};
    '''.format(mod_ent['id'])

    rows = exec_steady(sql)
    for row in rows:
        mod_ent['dependency_ids'].append(row[0])

    mod_ent['years'] = []
    sql = '''
        SELECT anio_cuenta_pub
        FROM auditoria_anios_cuenta_pub
        WHERE auditoria_id = {};
    '''.format(mod_ent['id'])

    rows = exec_steady(sql)
    for row in rows:
        mod_ent['years'].append(row[0])

    return mod_ent
