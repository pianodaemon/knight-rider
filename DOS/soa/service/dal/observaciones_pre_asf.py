import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    proyecciones_str = str(set(kwargs['proyecciones']))

    """Calls database function in charge of creation and edition of an observation (preliminar ASF)"""
    sql = """SELECT * FROM alter_observacion_pre_asf(
        {}::integer,
        {}::integer,
        '{}'::date,
        {}::integer,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        {}::integer,
        '{}'::text,
        {}::double precision,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::date,
        '{}'::character varying,
        '{}'::date,
        '{}'::text,
        '{}'::text,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        {}::integer,
        '{}'::integer[])
        AS result( rc integer, msg text )""".format(
            kwargs['id'],
            kwargs['direccion_id'],
            kwargs['fecha_captura'],
            kwargs['programa_social_id'],
            kwargs['auditoria_id'],
            kwargs['num_oficio_of'],
            kwargs['fecha_recibido'],
            kwargs['fecha_vencimiento_of'],
            kwargs['num_observacion'],
            kwargs['observacion'],
            kwargs['monto_observado'],
            kwargs['num_oficio_cytg'],
            kwargs['fecha_oficio_cytg'],
            kwargs['fecha_recibido_dependencia'],
            kwargs['fecha_vencimiento'],
            kwargs['num_oficio_resp_dependencia'],
            kwargs['fecha_oficio_resp_dependencia'],
            kwargs['resp_dependencia'],
            kwargs['comentarios'],
            kwargs['clasif_final_cytg'],
            kwargs['num_oficio_org_fiscalizador'],
            kwargs['fecha_oficio_org_fiscalizador'],
            kwargs['estatus_criterio_int_id'],
            proyecciones_str,
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("observaciones_pre_asf", id)
    return add_observacion_data(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_pre_asf", id)
    return add_observacion_data(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_pre_asf", id)
    return add_observacion_data(ent)


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
        'id', 'programa_social_id', 'auditoria_id', 'observacion', 'direccion_id'
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
    total_items = count_entities('observaciones_pre_asf', search_params)
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
        page_entities('observaciones_pre_asf', offset + whole_pages_offset, target_items, order_by, order, search_params),
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
                SELECT id, title, dependency_id, year
                FROM {}
                WHERE NOT blocked
                ORDER BY title;
            '''.format(table)
        elif table == 'dependencies':
            sql = '''
                SELECT dep.id, dep.title, dep.description, clasif.title as clasif_title
                FROM dependencies as dep
                JOIN dependencia_clasif AS clasif ON dep.clasif_id = clasif.id
                ORDER BY dep.id;
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


def add_observacion_data(ent):
    attributes = set([
        'id',
        'direccion_id',
        'fecha_captura',
        'programa_social_id',
        'auditoria_id',
        'num_oficio_of',
        'fecha_recibido',
        'fecha_vencimiento_of',
        'num_observacion',
        'observacion',
        'monto_observado',
        'num_oficio_cytg',
        'fecha_oficio_cytg',
        'fecha_recibido_dependencia',
        'fecha_vencimiento',
        'num_oficio_resp_dependencia',
        'fecha_oficio_resp_dependencia',
        'resp_dependencia',
        'comentarios',
        'clasif_final_cytg',
        'num_oficio_org_fiscalizador',
        'fecha_oficio_org_fiscalizador',
        'estatus_criterio_int_id',
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}

    sql = '''
        SELECT proyeccion_id
        FROM proyecciones_obs_asf
        WHERE observacion_id = {}
        ORDER BY proyeccion_id;
    '''.format(mod_ent['id'])

    rows = exec_steady(sql)

    mod_ent['proyecciones'] = []
    for row in rows:
        mod_ent['proyecciones'].append(row[0])

    return mod_ent
