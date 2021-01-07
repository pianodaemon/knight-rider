import math
import psycopg2

from dal.helper import exec_steady
from dal.entity import _setup_search_criteria, NoResultFound, MultipleResultsFound
from misc.helperpg import EmptySetError

def create(**kwargs):
    ''' Crear una entidad Estatus '''

    org_fiscal = get_org_fiscal_name(kwargs['org_fiscal_id'])
    if 'pre_ires' not in kwargs:
        raise Exception('Indique si se trata de pre o ires (preliminar o informe de resultados)')
    
    pre_ires = kwargs['pre_ires'].lower()
    
    validate(org_fiscal, pre_ires)

    pre_ires = pre_ires + '_' if org_fiscal != 'SFP' else ''
    title = kwargs['title'].replace("'", "''")

    table = 'estatus_' + pre_ires + org_fiscal.lower()

    sql = """
        INSERT INTO {}
        VALUES (DEFAULT, '{}')
        RETURNING *
    """.format(table, title)

    try:
        rows = exec_steady(sql)
    except:
        raise Exception('No fue posible insertar la entrada. Verifique que el título no esté duplicado.')
    
    return dict(rows[0])


def read(org_fiscal_id, pre_ires, id):
    ''' Recuperar una entidad Estatus '''

    org_fiscal = get_org_fiscal_name(org_fiscal_id)
    pre_ires = pre_ires.lower()
    
    validate(org_fiscal, pre_ires)

    pre_ires = pre_ires + '_' if org_fiscal != 'SFP' else ''
    table = 'estatus_' + pre_ires + org_fiscal.lower()

    sql = """
        SELECT *
        FROM {}
        WHERE id = {}
    """.format(table, id)

    rows = exec_steady(sql)
    return dict(rows[0])


def update(org_fiscal_id, pre_ires, id, **kwargs):
    ''' Actualizar una entidad Estatus '''

    org_fiscal = get_org_fiscal_name(org_fiscal_id)
    pre_ires = pre_ires.lower()
    
    validate(org_fiscal, pre_ires)

    pre_ires = pre_ires + '_' if org_fiscal != 'SFP' else ''
    title = kwargs['title'].replace("'", "''")

    table = 'estatus_' + pre_ires + org_fiscal.lower()
    
    sql = """
        UPDATE {}
        SET title = '{}'
        WHERE id = {}
        RETURNING *
    """.format(table, title, id)

    rows = exec_steady(sql)
    return dict(rows[0])


def delete(org_fiscal_id, pre_ires, id):
    ''' Eliminar una entidad Estatus '''

    org_fiscal = get_org_fiscal_name(org_fiscal_id)
    pre_ires = pre_ires.lower()
    
    validate(org_fiscal, pre_ires)

    pre_ires = pre_ires + '_' if org_fiscal != 'SFP' else ''
    table = 'estatus_' + pre_ires + org_fiscal.lower()

    sql = """
        DELETE FROM {}
        WHERE id = {}
        RETURNING *
    """.format(table, id)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        raise
    except:
        raise Exception('No fue posible eliminar el estatus (id = {}).'.format(id))

    return dict(rows[0])


def read_per_page(offset, limit, order_by, order, search_params, per_page, page):
    ''' Recuperar una página de entidades Estatus '''

    # Some validations
    offset = int(offset)
    if offset < 0:
        raise Exception("Value of param 'offset' should be >= 0")
    
    limit = int(limit)
    if limit < 1:
        raise Exception("Value of param 'limit' should be >= 1")

    order_by_values = (
        'id', 'org_fiscal_id', 'pre_ires', 'title'
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
    total_items = _count_entities(search_params, False)
    if total_items > limit:
        total_items = limit
    
    total_pages = math.ceil(total_items / per_page)

    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total_items:
        return [], total_items, total_pages
    
    target_items = total_items - whole_pages_offset
    if target_items > per_page:
        target_items = per_page

    entities = _page_entities(offset + whole_pages_offset, target_items, order_by, order, search_params, False)

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


def get_org_fiscal_name(org_fiscal_id):
    sql = """
        SELECT title
        FROM fiscals
        WHERE id = {}
    """.format(org_fiscal_id)

    rows = exec_steady(sql)
    return rows.pop()[0]


def _count_entities(search_params, not_blocked_clause, count_by_field='id'):
    ''' Counts non-blocked entities '''
    
    clause = ' AND NOT blocked' if not_blocked_clause else ''
    sql = '''
        SELECT count({})::int as total
        FROM {}
        WHERE TRUE {}
    '''
    count   = 0
    _search_params = search_params.copy() if search_params is not None else {}
    concerned_fiscals = get_org_fiscals(_search_params)
    try:
        del _search_params['org_fiscal_id']
    except:
        pass

    pre_ires = {_search_params['pre_ires']} if 'pre_ires' in _search_params else {'pre', 'ires'}
    try:
        del _search_params['pre_ires']
    except:
        pass

    if 'ASENL' in concerned_fiscals:

        if 'pre' in pre_ires:
            table = 'estatus_pre_asenl'
            count += execute_count(sql, count_by_field, table, clause, _search_params)
    
    if 'ASF' in concerned_fiscals:

        if 'pre' in pre_ires:
            table = 'estatus_pre_asf'
            count += execute_count(sql, count_by_field, table, clause, _search_params)
        
        if 'ires' in pre_ires:
            table = 'estatus_ires_asf'
            count += execute_count(sql, count_by_field, table, clause, _search_params)
    
    if 'SFP' in concerned_fiscals:

        if 'ires' in pre_ires:
            table = 'estatus_sfp'
            count += execute_count(sql, count_by_field, table, clause, _search_params)
    
    if 'CyTG' in concerned_fiscals:

        if 'pre' in pre_ires:
            table = 'estatus_pre_cytg'
            count += execute_count(sql, count_by_field, table, clause, _search_params)

        if 'ires' in pre_ires:
            table = 'estatus_ires_cytg'
            count += execute_count(sql, count_by_field, table, clause, _search_params)

    return count


def _page_entities(offset, limit, order_by, order, search_params, not_blocked_clause):
    ''' Returns a set of entities '''
    
    clause = ' AND NOT blocked' if not_blocked_clause else ''
    sql = '''
        SELECT *
        FROM {}
        WHERE TRUE {}
    '''
    _search_params = search_params.copy() if search_params is not None else {}
    concerned_fiscals = get_org_fiscals(_search_params)
    try:
        del _search_params['org_fiscal_id']
    except:
        pass

    pre_ires = {_search_params['pre_ires']} if 'pre_ires' in _search_params else {'pre', 'ires'}
    try:
        del _search_params['pre_ires']
    except:
        pass

    entities = []

    if 'ASENL' in concerned_fiscals:

        if 'pre' in pre_ires:
            table = 'estatus_pre_asenl'
            entities += execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, concerned_fiscals['ASENL'], 'pre')

    if 'ASF' in concerned_fiscals:

        if 'pre' in pre_ires:
            table = 'estatus_pre_asf'
            entities += execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, concerned_fiscals['ASF'], 'pre')
        
        if 'ires' in pre_ires:
            table = 'estatus_ires_asf'
            entities += execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, concerned_fiscals['ASF'], 'ires')
    
    if 'SFP' in concerned_fiscals:

        if 'ires' in pre_ires:
            table = 'estatus_sfp'
            entities += execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, concerned_fiscals['SFP'], 'ires')
    
    if 'CyTG' in concerned_fiscals:

        if 'pre' in pre_ires:
            table = 'estatus_pre_cytg'
            entities += execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, concerned_fiscals['CyTG'], 'pre')
        
        if 'ires' in pre_ires:
            table = 'estatus_ires_cytg'
            entities += execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, concerned_fiscals['CyTG'], 'ires')

    return entities


def get_org_fiscals(search_params):
    if search_params and 'org_fiscal_id' in search_params:
        condition = 'id = {}'.format(search_params['org_fiscal_id'])
    else:
        condition = "title = 'ASENL' or title = 'ASF' or title = 'SFP' or title = 'CyTG'"
    
    sql = """
        SELECT id, title
        FROM fiscals
        WHERE {}
    """.format(condition)

    rows = exec_steady(sql)
    d = {}
    for row in rows:
        d[row[1]] = row[0]

    return d


def execute_count(sql, count_by_field, table, clause, _search_params):
    query = sql.format(count_by_field, table, clause)

    if _search_params:
        query += ' AND ' + _setup_search_criteria(table, _search_params)
    
    rows = exec_steady(query)
    if len(rows) == 0:
        raise NoResultFound('Just expecting one total as a result')
    elif len(rows) > 1:
        raise MultipleResultsFound('Multiple results found, but only one expected')

    return rows.pop()['total']


def execute_fetch(sql, table, clause, _search_params, order_by, order, limit, offset, org_fiscal_id, pre_ires):
    query = sql.format(table, clause)

    if _search_params:
        query += ' AND ' + _setup_search_criteria(table, _search_params)

    query += ' ORDER BY {} {} LIMIT {} OFFSET {};'.format(order_by, order, limit, offset)

    try:
        rows = exec_steady(query)
    except psycopg2.Error:
        raise Exception('Error en base de datos.')
    except Exception as err:
        rows = []

    entities = []
    for row in rows:
        r = dict(row)
        r['org_fiscal_id'] = org_fiscal_id
        r['pre_ires'] = pre_ires
        entities.append(r)
    
    return entities


def validate(org_fiscal, pre_ires):
    if pre_ires not in {'pre', 'ires'}:
        raise Exception('Indique un valor correcto: pre o ires')
    if org_fiscal == 'SFP' and pre_ires == 'pre':
        raise Exception('SFP no cuenta con preliminares')
    if org_fiscal == 'ASENL' and pre_ires == 'ires':
        raise Exception('ASENL no maneja estatus en sus informes de resultados')
