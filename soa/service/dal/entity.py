from dal.helper import exec_steady

class NoResultFound(Exception):
    pass


class MultipleResultsFound(Exception):
    pass


def fetch_entity(table, id):
    ''' Fetches an entity '''
    
    sql = '''
        SELECT *
        FROM {}
        WHERE id = {};
    '''.format(table, id)

    rows = exec_steady(sql)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('No result found')
    elif len(rows) > 1:
        raise MultipleResultsFound('Multiple results found. Only one expected')

    return dict(rows.pop())


def delete_entity(table, id):
    ''' Deletes an entity '''
    
    sql = '''
        DELETE FROM {}
        WHERE id = {}
        RETURNING *;
    '''.format(table, id)

    rows = exec_steady(sql)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('No result found')
    elif len(rows) > 1:
        raise MultipleResultsFound('Multiple results found. Only one expected')

    return dict(rows.pop())


def page_entities(table, offset, limit, order_by, order, search_params):
    ''' Returns a set of entities '''
    
    query = '''
        SELECT *
        FROM {}
    '''.format(table)

    if search_params is not None:
        query += ' WHERE ' + _setup_search_criteria(table, search_params)

    query += ' ORDER BY {} {} LIMIT {} OFFSET {};'.format(order_by, order, limit, offset)

    try:
        rows = exec_steady(query)
    except Exception:
        return []

    entities = []
    for row in rows:
        entities.append(dict(row))

    return entities


def _setup_search_criteria(table, search_params):
    criteria = []
    for field, value in search_params.items():
        criteria.append("{}.{} = {}".format(table, field, value))

    return ' AND '.join(criteria)