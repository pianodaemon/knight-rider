import math

from dal.helper import exec_steady
from dal.entity import page_entities, count_entities
from misc.helperpg import EmptySetError

def create(**kwargs):
    ''' Crear una entidad Acción '''

    org_fiscal = get_org_fiscal_name(kwargs['org_fiscal_id'])

    table = 'acciones_' + org_fiscal.lower()
    seq_name = table + '_seq'
    
    title = kwargs['title'].replace("'", "''")
    description = ", '{}'".format(kwargs['description'].replace("'", "''")) if org_fiscal == "ASENL" else ""

    sql = """
        INSERT INTO {}
        VALUES (nextval('{}'::regclass), '{}'{})
        RETURNING *
    """.format(table, seq_name, title, description)

    try:
        rows = exec_steady(sql)
    except:
        raise Exception('No fue posible insertar la entrada. Verifique que el título no esté duplicado.')
    
    return dict(rows[0])


def read(org_fiscal_id, id):
    ''' Recuperar una entidad Acción '''
    org_fiscal = get_org_fiscal_name(org_fiscal_id)
    table = 'acciones_' + org_fiscal.lower()

    sql = """
        SELECT *
        FROM {}
        WHERE NOT blocked
        AND id = {}
    """.format(table, id)

    rows = exec_steady(sql)
    return dict(rows[0])


def update(org_fiscal_id, id, **kwargs):
    ''' Actualizar una entidad Acción '''
    org_fiscal = get_org_fiscal_name(org_fiscal_id)
    table = 'acciones_' + org_fiscal.lower()
    title = kwargs['title'].replace("'", "''")
    description = ", description = '{}'".format(kwargs['description'].replace("'", "''")) if org_fiscal == "ASENL" else ""
    
    sql = """
        UPDATE {}
        SET title = '{}'{}
        WHERE NOT blocked
        AND id = {}
        RETURNING *
    """.format(table, title, description, id)

    rows = exec_steady(sql)
    return dict(rows[0])


def delete(org_fiscal_id, id):
    ''' Eliminar una entidad Acción '''
    org_fiscal = get_org_fiscal_name(org_fiscal_id)
    table = 'acciones_' + org_fiscal.lower()

    sql = """
        UPDATE {}
        SET blocked = TRUE
        WHERE NOT blocked
        AND id = {}
        RETURNING *
    """.format(table, id)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        raise
    except:
        raise Exception('No fue posible eliminar la acción (id = {}).'.format(id))

    return dict(rows[0])


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Recuperar una página de entidades Acción '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id', 'org_fiscal_id', 'title'
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
    if search_params and 'org_fiscal_id' in search_params:
        org_fiscal = get_org_fiscal_name(search_params['org_fiscal_id'])
        table = 'acciones_' + org_fiscal.lower()
        
        del search_params['org_fiscal_id']
        if len(search_params) == 0:
            search_params = None
    else:
        return [], 0, 0
    
    total_items = count_entities(table, search_params, True)
    if total_items > limit:
        total_items = limit
    
    total_pages = math.ceil(total_items / per_page)

    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total_items:
        return [], total_items, total_pages
    
    target_items = total_items - whole_pages_offset
    if target_items > per_page:
        target_items = per_page

    entities = page_entities(table, offset + whole_pages_offset, target_items, order_by, order, search_params, True)

    return (entities, total_items, total_pages)


def get_catalogs(table_name_list):
    ''' Fetches values and captions from a list of tables. These pairs can be used on input screens '''
    fields_d = {}

    for table in table_name_list:
        values_l = []
        
        if table == 'fiscals':
            sql = '''
                SELECT *
                FROM {}
                WHERE title = 'ASF' OR title = 'ASENL'
                ORDER BY id;
            '''.format(table)
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


def get_org_fiscal_name(org_fiscal_id):
    sql = """
        SELECT title
        FROM fiscals
        WHERE id = {}
    """.format(org_fiscal_id)

    rows = exec_steady(sql)
    org_fiscal = rows.pop()[0]
    
    if org_fiscal not in {'ASF', 'ASENL'}:
        raise Exception('Órgano fiscalizador {} no tiene acciones asociadas.'.format(org_fiscal))
    else:
        return org_fiscal
