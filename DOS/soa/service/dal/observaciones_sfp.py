import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    """Calls database function in charge of creation and edition of an observation (sfp)"""
    sql = """SELECT * FROM alter_observacion_sfp(
        {}::integer,
        '{}'::integer[],
        {}::integer,
        {}::integer,
        {}::integer,
        {}::integer,
        {}::integer,
        {}::integer,
        '{}'::text,
        {}::double precision,
        {}::double precision,
        {}::double precision,
        '{}'::text,
        '{}'::date,
        '{}'::date,
        '{}'::date,
        '{}'::date,
        '{}'::date,
        '{}'::text,
        '{}'::text,
        '{}'::text,
        '{}'::text,
        '{}'::text,
        {}::integer,
        '{}'::text,
        '{}'::date,
        '{}'::date,
        '{}'::date)
        AS result( rc integer, msg text )""".format(
            kwargs["id"], str(set(kwargs["anios_cta_publica"])), kwargs["observation_type_id"], kwargs["observation_code_id"],
            kwargs["observation_bis_code_id"], kwargs["social_program_id"],
            kwargs["audit_id"], kwargs["fiscal_id"], kwargs["title"],
            kwargs["amount_observed"], kwargs["projected"], kwargs["solved"],
            kwargs["comments"], kwargs["reception_date"], kwargs["expiration_date"],
            kwargs["doc_a_date"], kwargs["doc_b_date"], kwargs["doc_c_date"],
            kwargs["doc_a"], kwargs["doc_b"], kwargs["doc_c"], kwargs['dep_response'],
            kwargs['dep_resp_comments'], kwargs['division_id'], kwargs['hdr_doc'],
            kwargs['hdr_reception_date'], kwargs['hdr_expiration1_date'], kwargs['hdr_expiration2_date']
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("observaciones_sfp", id)
    return add_observation_amounts(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_sfp", id)
    return add_observation_amounts(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_sfp", id)
    return add_observation_amounts(ent)


def read_page(offset, limit, order_by, order, search_params):
    ''' Reads a page of observations '''
    return page_entities('observaciones_sfp', offset, limit, order_by, order, search_params)


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Reads a page of observations '''
    
    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id', 'tipo_observacion_id', 'programa_social_id', 'auditoria_id', 'observacion', 'clave_observacion_id', 'direccion_id'
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
    total_items = count_entities('observaciones_sfp', search_params)
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
        page_entities('observaciones_sfp', offset + whole_pages_offset, target_items, order_by, order, search_params),
        total_items,
        total_pages
    )


def get_catalogs(table_name_list):
    ''' Fetches values and captions from a list of tables. These pairs can be used on input screens '''
    fields_d = {}

    for table in table_name_list:
        values_l = []
        
        if table == 'audits':
            sql = '''
                SELECT *
                FROM {}
                WHERE NOT blocked
                ORDER BY id;
            '''.format(table)
        elif table == 'fiscals':
            sql = '''
                SELECT fiscals.id, fiscals.title, fiscals.description
                FROM observation_stages AS stages
                JOIN observation_stages_conf AS conf ON stages.id = conf.observation_stage_id
                JOIN fiscals ON conf.fiscal_id = fiscals.id
                WHERE stages.title = 'PRELIMINAR'
                ORDER BY conf.fiscal_id;
            '''
        else:
            sql = '''
                SELECT *
                FROM {}
                ORDER BY id;
            '''.format(table)

        rows = exec_steady(sql)
        
        for row in rows:
            ent = dict(row)
            if table == 'audits':
                transform_data(ent)
            values_l.append(ent)
        
        fields_d[table] = values_l

    return fields_d


def add_observation_amounts(ent):
    attributes = set([
        'id', 'observation_type_id', 'social_program_id', 'audit_id', 'title', 'fiscal_id', 'amount_observed',
        'observation_code_id', 'observation_bis_code_id', 'reception_date', 'expiration_date', 'doc_a_date',
        'doc_b_date', 'doc_c_date', 'doc_a', 'doc_b', 'doc_c', 'dep_response', 'dep_resp_comments',
        'division_id', 'hdr_doc', 'hdr_reception_date', 'hdr_expiration1_date', 'hdr_expiration2_date',
        'observation_stage_id',
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}
    mod_ent['reception_date'] = mod_ent['reception_date'].__str__()
    mod_ent['expiration_date'] = mod_ent['expiration_date'].__str__()
    mod_ent['doc_a_date'] = mod_ent['doc_a_date'].__str__()
    mod_ent['doc_b_date'] = mod_ent['doc_b_date'].__str__()
    mod_ent['doc_c_date'] = mod_ent['doc_c_date'].__str__()
    mod_ent['hdr_reception_date'] = mod_ent['hdr_reception_date'].__str__()
    mod_ent['hdr_expiration1_date'] = mod_ent['hdr_expiration1_date'].__str__()
    mod_ent['hdr_expiration2_date'] = mod_ent['hdr_expiration2_date'].__str__()

    sql = '''
        SELECT *
        FROM amounts
        WHERE observation_id = {}
        ORDER BY id DESC;
    '''.format(mod_ent['id'])
    
    rows = exec_steady(sql)
    
    mod_ent['amounts'] = []
    for row in rows:
        row_dict = dict(row)
        row_dict['inception_time'] = row_dict['inception_time'].__str__()
        mod_ent['amounts'].append(row_dict)

    return mod_ent


def transform_data(ent):
    ent['inception_time'] = ent['inception_time'].__str__()
    ent['touch_latter_time'] = ent['touch_latter_time'].__str__()
