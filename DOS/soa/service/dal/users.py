import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_user(**kwargs):
    """Calls the db function in charge of creating and editing a user"""
    sql = """SELECT * FROM alter_user(
        {}::integer,
        '{}'::text,
        '{}'::text,
        {}::integer,
        {}::integer,
        '{}'::boolean)
        AS result( rc integer, msg text )""".format(
            kwargs["id"], kwargs["username"], kwargs["passwd"],
            kwargs["orgchart_role_id"], kwargs["division_id"], kwargs["disabled"]
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("users", id)
    return transform_data(ent)


def create(**kwargs):
    ''' Creates a user entity '''
    kwargs['id'] = 0
    kwargs['disabled'] = False
    return _alter_user(**kwargs)


def read(id):
    ''' Fetches a user entity '''
    ent = fetch_entity("users", id)
    return transform_data(ent)


def update(id, **kwargs):
    ''' Updates a user entity '''
    kwargs['id'] = id
    return _alter_user(**kwargs)


def delete(id):
    ''' Deletes a user entity '''
    ent = delete_entity("users", id)
    return transform_data(ent)


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Reads a page of users '''
    
    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id','username', 'orgchart_role_id', 'division_id', 'disabled'
    )
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
    total_items = count_entities('users', search_params)
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
        page_entities('users', offset + whole_pages_offset, target_items, order_by, order, search_params),
        total_items,
        total_pages
    )


def get_catalogs(table_name_list):
    ''' Fetches values and captions from a list of tables. These pairs can be used on input screens '''
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
            ent = dict(row)
            values_l.append(ent)
        
        fields_d[table] = values_l

    return fields_d


def transform_data(ent):
    attributes = set([
        'id', 'username', 'passwd', 'orgchart_role_id', 'division_id', 'disabled'
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}
    
    return mod_ent
