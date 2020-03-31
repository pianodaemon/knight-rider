import psycopg2
from dal.helper import run_stored_procedure, exec_steady
from dal.entity import delete_entity, fetch_entity, page_entities


def _alter_observation(**kwargs):
    ''' Calls postgresql function in charge of creation/edition of an observation entity '''
    sql = '''
        SELECT * FROM alter_observation(
            {}::integer,
            {}::integer,
        )
        AS result( rc integer, msg text );
    '''.format(kwargs['id'], kwargs['observation_type_id'])
    
    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 0:
        raise Exception(rmsg)


def create(**kwargs):
    '''Creates an observation entity'''
    sql = '''
        INSERT INTO observations (observation_type_id, social_program_id)
        VALUES ({}, {})
        RETURNING id, observation_type_id, social_program_id;
    '''.format(kwargs['observation_type_id'], kwargs['social_program_id'])

    rows = exec_steady(sql)
    return dict(rows.pop())


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity('observations', id)
    fields = set(['id', 'observation_type_id', 'social_program_id'])
    return {field: ent[field] for field in fields}


def update(id, **kwargs):
    '''Updates an observation entity'''
    sql = '''
        UPDATE observations
        SET observation_type_id = {}, social_program_id = {}
        WHERE id = {}
        AND blocked = false
        RETURNING id, observation_type_id, social_program_id;
    '''.format(kwargs['observation_type_id'], kwargs['social_program_id'], id)

    rows = exec_steady(sql)
    return dict(rows.pop())


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity('observations', id)
    fields = set(['id', 'observation_type_id', 'social_program_id'])
    return {field: ent[field] for field in fields}


def read_page(offset, limit, order_by, order, search_params):
    return page_entities('observations', offset, limit, order_by, order, search_params)
    