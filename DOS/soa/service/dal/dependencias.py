import math

from dal.helper import exec_steady
from dal.entity import page_entities, count_entities
from misc.helperpg import EmptySetError

def create(**kwargs):
    ''' Crear una entidad Dependencia '''
    sql = """
        INSERT INTO dependencies
        VALUES (DEFAULT, '{}', '{}', {})
        RETURNING *
    """.format(
        kwargs['title'].replace("'", "''"),
        kwargs['description'].replace("'", "''"),
        kwargs['clasif_id']
    )

    rows = exec_steady(sql)
    return dict(rows[0])


def read(id):
    ''' Recuperar una entidad Dependencia '''
    sql = """
        SELECT *
        FROM dependencies
        WHERE id = {}
    """.format(id)

    rows = exec_steady(sql)
    return dict(rows[0])


def update(id, **kwargs):
    ''' Actualizar una entidad Dependencia '''
    sql = """
        UPDATE dependencies
        SET title = '{}', description = '{}', clasif_id = {}
        WHERE id = {}
        RETURNING *
    """.format(
        kwargs['title'].replace("'", "''"),
        kwargs['description'].replace("'", "''"),
        kwargs['clasif_id'],
        id
    )

    rows = exec_steady(sql)
    return dict(rows[0])


def delete(id):
    ''' Eliminar una entidad Dependencia '''
    sql = """
        DELETE FROM dependencies
        WHERE id = {}
        RETURNING *
    """.format(id)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        raise
    except:
        raise Exception('No fue posible eliminar la dependencia (id = {}). Verifique que ninguna auditoría esté asociada a esta.'.format(id))

    return dict(rows[0])


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Recuperar una página de entidades Dependencia '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id', 'title', 'description', 'clasif_id'
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
    table = 'dependencies'
    total_items = count_entities(table, search_params, False)
    if total_items > limit:
        total_items = limit
    
    total_pages = math.ceil(total_items / per_page)

    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total_items:
        return [], total_items, total_pages
    
    target_items = total_items - whole_pages_offset
    if target_items > per_page:
        target_items = per_page

    entities = page_entities(table, offset + whole_pages_offset, target_items, order_by, order, search_params, False)

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
