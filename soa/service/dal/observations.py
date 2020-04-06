from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities

def _alter_observation(**kwargs):
    """Calls sp in charge of create and edit a observation"""
    sql = """SELECT * FROM alter_provider(
        {}::integer,
        {}::integer,
        {}::integer,
        {}::integer,
        {}::integer,
        '{}'::text)
        AS result( rc integer, msg text )""".format(
        kwargs["id"], kwargs["observation_type_id"],  kwargs["social_program_id"],
        kwargs["audit_id"], kwargs["fiscal_id"], kwargs["title"]
    )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 0:
        raise Exception(rmsg)


def create(**kwargs):
    '''Creates an observation entity'''
    sql = '''
        INSERT INTO observations (observation_type_id, social_program_id, audit_id)
        VALUES ({}, {}, {})
        RETURNING id, observation_type_id, social_program_id, audit_id;
    '''.format(kwargs['observation_type_id'], kwargs['social_program_id'], kwargs['audit_id'])

    rows = exec_steady(sql)
    return dict(rows.pop())


def read(id):
    ''' Fetches an observation entity '''
    sql = '''
        SELECT id, observation_type_id, social_program_id, audit_id
        FROM observations
        WHERE id = {}
        AND blocked = false;
    '''.format(id)

    rows = exec_steady(sql)
    return dict(rows.pop())


def update(id, **kwargs):
    '''Updates an observation entity'''
    sql = '''
        UPDATE observations
        SET observation_type_id = {}, social_program_id = {}, audit_id = {}
        WHERE id = {}
        AND blocked = false
        RETURNING id, observation_type_id, social_program_id, audit_id;
    '''.format(kwargs['observation_type_id'], kwargs['social_program_id'], kwargs['audit_id'], id)

    rows = exec_steady(sql)
    return dict(rows.pop())


def delete(id):
    ''' Deletes an observation entity '''
    sql = '''
        UPDATE observations
        SET blocked = true
        WHERE id = {}
        AND blocked = false
        RETURNING id, observation_type_id, social_program_id, audit_id;
    '''.format(id)
  
    rows = exec_steady(sql)
    return dict(rows.pop())


def read_page(offset, limit, order_by, order, search_params):
    ''' Reads a page of observations '''
    return page_entities('observations', offset, limit, order_by, order, search_params)


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Reads a page of observations '''
    limit = int(limit)
    per_page = int(per_page)
    page = int(page)

    total = count_entities('observations', search_params)
    if total > limit:
        total = limit
    
    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total:
        return []
    
    target_items_qty = total - whole_pages_offset
    if target_items_qty > per_page:
        target_items_qty = per_page

    return page_entities('observations', int(offset) + whole_pages_offset, target_items_qty, order_by, order, search_params)


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
            values_l.append(dict(row))
        
        fields_d[table] = values_l

    return fields_d
