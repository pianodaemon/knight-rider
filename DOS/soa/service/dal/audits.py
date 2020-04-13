import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity

def _alter_audit(**kwargs):
    """Calls sp in charge of create and edit a audit"""
    sql = """SELECT * FROM alter_audit(
        {}::integer,
        '{}'::character varying,
        {}::integer,
        {}::integer)
        AS result( rc integer, msg text )""".format(
            kwargs["id"], kwargs["title"],
            kwargs["dependency_id"], kwargs["year"]
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("audits", id)
    ent['inception_time'] = ent['inception_time'].__str__()
    ent['touch_latter_time'] = ent['touch_latter_time'].__str__()
    return ent


def create(**kwargs):
    ''' Creates an audit entity '''
    kwargs['id'] = 0
    return _alter_audit(**kwargs)


def read(id):
    ''' Fetches an audit entity '''
    return fetch_entity("audits", id)


def update(id, **kwargs):
    ''' Updates an audit entity '''
    kwargs['id'] = id
    return _alter_audit(**kwargs)


def delete(id):
    ''' Deletes an audit entity '''
    return delete_entity("audits", id)


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Reads a page of audits '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")

    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = ('id','audit_type_id', 'social_program_id', 'audit_id', 'fiscal_id', 'title')
    if order_by not in order_by_values:
        raise Exception("Value of param 'order_by' should be one of the following: " + str(order_by_values))

    order_values = ('ASC', 'DESC', 'asc', 'desc')
    if order not in order_values:
        raise Exception("Value of param 'order' should be one of the folowing: " + str(order_values))

    per_page = int(per_page)
    page = int(page)
    if per_page < 1 or page < 1:
        raise Exception("Value of params 'per_page' and 'page' should be >= 1")

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

    return (
        page_entities('audits', offset + whole_pages_offset, target_items, order_by, order, search_params),
        total_items,
        total_pages
    )


def get_catalogs(table_name_list):
    ''' Fetches values and captions from a list of tables, intended for use in ui screens '''
    fields_d = {}

    for table in table_name_list:
        values_l = []
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