import math

from dal.helper import exec_steady
from dal.entity import page_entities, count_entities

def create(**kwargs):
    ''' Creates a social program entity '''
    sql = """
        INSERT INTO social_programs
        VALUES (DEFAULT, '{}', '{}', {}, {}, {})
        RETURNING *
    """.format(
        kwargs['title'].replace("'", "''"),
        kwargs['description'].replace("'", "''"),
        kwargs['central'],
        kwargs['paraestatal'],
        kwargs['obra_pub']
    )

    rows = exec_steady(sql)
    return dict(rows[0])


def read(id):
    ''' Fetches a social program entity '''
    sql = """
        SELECT *
        FROM social_programs
        WHERE id = {}
    """.format(id)

    rows = exec_steady(sql)
    return dict(rows[0])


def update(id, **kwargs):
    ''' Updates a social program entity '''
    sql = """
        UPDATE social_programs
        SET title = '{}', description = '{}', central = {}, paraestatal = {}, obra_pub = {}
        WHERE id = {}
        RETURNING *
    """.format(
        kwargs['title'].replace("'", "''"),
        kwargs['description'].replace("'", "''"),
        kwargs['central'],
        kwargs['paraestatal'],
        kwargs['obra_pub'],
        id
    )

    rows = exec_steady(sql)
    return dict(rows[0])


def delete(id):
    ''' Deletes a social program entity '''
    sql = """
        DELETE FROM social_programs
        WHERE id = {}
        RETURNING *
    """.format(id)

    rows = exec_steady(sql)
    return dict(rows[0])


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Reads a page of social program entities '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id', 'title', 'description', 'central', 'paraestatal', 'obra_pub'
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
    table = 'social_programs'
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
