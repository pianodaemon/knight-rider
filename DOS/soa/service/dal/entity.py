import psycopg2
from dal.helper import exec_steady, update_steady


class NoResultFound(Exception):
    pass


class MultipleResultsFound(Exception):
    pass


def fetch_entity(table, id):
    ''' Fetches an entity '''
    
    sql = '''
        SELECT *
        FROM {}
        WHERE id = {}
        AND NOT blocked;
    '''.format(table, id)

    rows = exec_steady(sql)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('No result found')
    elif len(rows) > 1:
        raise MultipleResultsFound('Only one result expected, but multiple found')

    return dict(rows.pop())


def delete_entity(table, id):
    ''' Deletes an entity '''
    
    sql = '''
        UPDATE {}
        SET blocked = true
        WHERE id = {}
        AND NOT blocked
        RETURNING *;
    '''.format(table, id)

    rows = exec_steady(sql)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('No result found')
    elif len(rows) > 1:
        raise MultipleResultsFound('Only one result expected, but multiple found')

    return dict(rows.pop())


def page_entities(table, offset, limit, order_by, order, search_params, not_blocked_clause):
    ''' Returns a set of entities '''
    
    clause = ' AND NOT blocked' if not_blocked_clause else ''

    query = '''
        SELECT *
        FROM {}
        WHERE TRUE {}
    '''.format(table, clause)

    if search_params is not None:
        query += ' AND ' + _setup_search_criteria(table, search_params)

    query += ' ORDER BY {} {} LIMIT {} OFFSET {};'.format(order_by, order, limit, offset)

    try:
        rows = exec_steady(query)
    except psycopg2.Error:
        raise
    except:
        return []

    entities = []
    for row in rows:
        r = dict(row)
        entities.append(r)

    return entities


def _setup_search_criteria(table, search_params):
    criteria = []
    text_field = {
        'title',
        'clave_observacion',
        'num_observacion',
        'description'
    }
    for field, value in search_params.items():
        # For text fields... a different condition syntax is needed
        # TODO: Figure out a better method to identify fields of text type
        if field in text_field or field[:11] == 'observacion':
            criteria.append("{}.{} ILIKE '%{}%'".format(table, field, value.replace("'", "''")))
        else:
            criteria.append("{}.{} = {}".format(table, field, value))

    return ' AND '.join(criteria)


def count_entities(table, search_params, not_blocked_clause, count_by_field='id'):
    ''' Counts non-blocked entities '''
    
    clause = ' AND NOT blocked' if not_blocked_clause else ''

    query = '''
        SELECT count({})::int as total
        FROM {}
        WHERE TRUE {}
    '''.format(count_by_field, table, clause)

    if search_params is not None:
        query += ' AND ' + _setup_search_criteria(table, search_params)
    
    rows = exec_steady(query)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('Just expecting one total as a result')
    elif len(rows) > 1:
        raise MultipleResultsFound('Multiple results found, but only one expected')

    return rows.pop()['total']


def count_entities_join_tables(table, search_params, joins, conditions):
    ''' Counts non-blocked entities '''

    query = '''
        SELECT count({}.id)::integer as total
            FROM {}
            {}
            WHERE NOT {}.blocked
    '''.format(table, table, joins, table)

    if search_params is not None:
        query += ' AND ' + _setup_search_criteria(table, search_params)
    
    query += conditions
    
    rows = exec_steady(query)

    # For this case we are just expecting one row
    if len(rows) == 0:
        raise NoResultFound('Just expecting one total as a result')
    elif len(rows) > 1:
        raise MultipleResultsFound('Multiple results found, but only one expected')

    return rows.pop()['total']


def page_entities_join_tables(table, offset, limit, order_by, order, search_params, selects, joins, conditions):
    ''' Returns a set of entities '''

    query = '''
        SELECT {}.*{}
        FROM {}
        {}
        WHERE NOT {}.blocked
    '''.format(table, selects, table, joins, table)

    if search_params is not None:
        query += ' AND ' + _setup_search_criteria(table, search_params)
    
    query += conditions
    query += ' ORDER BY {} {} LIMIT {} OFFSET {};'.format(order_by, order, limit, offset)

    try:
        rows = exec_steady(query)
    except psycopg2.Error:
        raise
    except:
        return []

    entities = []
    for row in rows:
        r = dict(row)
        entities.append(r)

    return entities


def get_joins_and_conditions(indirect_search_params, join_details):

    joins       = ''
    conditions  = ''

    if indirect_search_params is None:
        return joins, conditions, []

    target_fields_joined = []
    join_list = []

    for target_field, target_value in indirect_search_params.items():
        
        if target_field not in join_details:
            continue
        
        join_table, join_field, from_table, from_field, dependent_upon, text_field = join_details[target_field]
        
        if dependent_upon and dependent_upon not in target_fields_joined:
            join = get_join(dependent_upon, join_details)
            if join not in join_list:
                joins += join
                join_list.append(join)
            target_fields_joined.append(dependent_upon)
        
        if target_field not in target_fields_joined:
            join = ' JOIN {} ON {}.{} = {}.{}'.format(join_table, join_table, join_field, from_table, from_field)
            if join not in join_list:
                joins += join
                join_list.append(join)
            target_fields_joined.append(target_field)
        
        if text_field:
            conditions += " AND {}.{} ILIKE '%{}%'".format(join_table, target_field, target_value.replace("'", "''"))
        else:
            conditions += ' AND {}.{} = {}'.format(join_table, target_field, target_value)
    
    return joins, conditions, join_list


def get_join(target_field, join_details):

    join_table, join_field, from_table, from_field, _, _ = join_details[target_field]
    return ' JOIN {} ON {}.{} = {}.{}'.format(join_table, join_table, join_field, from_table, from_field)
