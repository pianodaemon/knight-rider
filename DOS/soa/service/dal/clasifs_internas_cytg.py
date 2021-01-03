import math

from dal.helper import exec_steady
from dal.entity import page_entities, count_entities
from misc.helperpg import EmptySetError

def create(**kwargs):
    ''' Crear una entidad Clasificación interna de CyTG '''

    org_fiscal_id = kwargs['org_fiscal_id']
    direccion_id = kwargs['direccion_id']

    sql = """
        SELECT title
        FROM fiscals
        WHERE id = {}
    """.format(org_fiscal_id)
    
    rows = exec_steady(sql)
    org_fiscal = rows.pop()[0]

    sql = """
        SELECT title
        FROM divisions
        WHERE id = {}
    """.format(direccion_id)
    
    rows = exec_steady(sql)
    direccion = rows.pop()[0]

    seq_name = 'clasifs_internas_' + org_fiscal.lower() + '_' + direccion.lower() + '_seq'
    title = kwargs['title'].replace("'", "''")

    sql = """
        INSERT INTO clasifs_internas_cytg
        VALUES ({}, {}, nextval('{}'::regclass), '{}')
        RETURNING *
    """.format(org_fiscal_id, direccion_id, seq_name, title)

    rows = exec_steady(sql)
    return dict(rows[0])


def read(org_fiscal_id, direccion_id, id):
    ''' Recuperar una entidad Clasificación interna de CyTG '''
    sql = """
        SELECT *
        FROM clasifs_internas_cytg
        WHERE NOT blocked
        AND org_fiscal_id = {}
        AND direccion_id = {}
        AND sorting_val = {}
    """.format(org_fiscal_id, direccion_id, id)

    rows = exec_steady(sql)
    return dict(rows[0])


def update(org_fiscal_id, direccion_id, id, **kwargs):
    ''' Actualizar una entidad Clasificación interna de CyTG '''
    title = kwargs['title'].replace("'", "''")
    
    sql = """
        UPDATE clasifs_internas_cytg
        SET title = '{}'
        WHERE NOT blocked
        AND org_fiscal_id = {}
        AND direccion_id = {}
        AND sorting_val = {}
        RETURNING *
    """.format(title, org_fiscal_id, direccion_id, id)

    rows = exec_steady(sql)
    return dict(rows[0])


def delete(org_fiscal_id, direccion_id, id):
    ''' Eliminar una entidad Clasificación interna de CyTG '''
    sql = """
        UPDATE clasifs_internas_cytg
        SET blocked = TRUE
        WHERE NOT blocked
        AND org_fiscal_id = {}
        AND direccion_id = {}
        AND sorting_val = {}
        RETURNING *
    """.format(org_fiscal_id, direccion_id, id)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        raise
    except:
        raise Exception('No fue posible eliminar la clasificación interna (id = {}). Verifique que ninguna auditoría esté asociada a esta.'.format(id))

    return dict(rows[0])


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Recuperar una página de entidades Clasificación interna de CyTG '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'sorting_val', 'org_fiscal_id', 'direccion_id', 'title'
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
    table = 'clasifs_internas_cytg'
    total_items = count_entities(table, search_params, True, 'sorting_val')
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
