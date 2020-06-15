import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    anios_cta_publica_str = str(set(kwargs['anios_cuenta_publica']))
    seguimientos_str = seguimientos_to_comp_type_arr_lit(kwargs['seguimientos'])

    """Calls database function in charge of creation and edition of an observation (sfp)"""
    sql = """SELECT * FROM alter_observacion_sfp(
        {}::integer,
        '{}'::integer[],
        {}::integer,
        '{}'::date,
        {}::integer,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        {}::integer,
        '{}'::text,
        '{}'::character varying,
        '{}'::character varying,
        {}::integer,
        {}::double precision,
        {}::seguimientos_obs_sfp[],
        {}::double precision,
        {}::double precision,
        '{}'::date,
        {}::double precision,
        '{}'::character varying,
        '{}'::date,
        '{}'::character varying,
        '{}'::date,
        '{}'::character varying,
        '{}'::character varying,
        '{}'::date,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        '{}'::character varying,
        '{}'::character varying,
        '{}'::date)
        AS result( rc integer, msg text )""".format(
            kwargs['id'],
            anios_cta_publica_str,
            kwargs['direccion_id'],
            kwargs['fecha_captura'],
            kwargs['programa_social_id'],
            kwargs['auditoria_id'],
            kwargs['acta_cierre'],
            kwargs['fecha_firma_acta_cierre'],
            kwargs['fecha_compromiso'],
            kwargs['clave_observacion_id'],
            kwargs['observacion'],
            kwargs['acciones_correctivas'],
            kwargs['acciones_preventivas'],
            kwargs['tipo_observacion_id'],
            kwargs['monto_observado'],
            seguimientos_str,
            kwargs['monto_a_reintegrar'],
            kwargs['monto_reintegrado'],
            kwargs['fecha_reintegro'],
            kwargs['monto_por_reintegrar'],
            kwargs['num_oficio_of_vista_cytg'],
            kwargs['fecha_oficio_of_vista_cytg'],
            kwargs['num_oficio_cytg_aut_invest'],
            kwargs['fecha_oficio_cytg_aut_invest'],
            kwargs['num_carpeta_investigacion'],
            kwargs['num_oficio_vai_municipio'],
            kwargs['fecha_oficio_vai_municipio'],
            kwargs['autoridad_invest_id'],
            kwargs['num_oficio_pras_of'],
            kwargs['fecha_oficio_pras_of'],
            kwargs['num_oficio_pras_cytg_dependencia'],
            kwargs['num_oficio_resp_dependencia'],
            kwargs['fecha_oficio_resp_dependencia'],
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
    return add_observacion_data(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_sfp", id)
    return add_observacion_data(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_sfp", id)
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
        'acta_cierre',
        'fecha_firma_acta_cierre',
        'fecha_compromiso',
        'clave_observacion_id',
        'observacion',
        'acciones_correctivas',
        'acciones_preventivas',
        'tipo_observacion_id',
        'monto_observado',
        'monto_a_reintegrar',
        'monto_reintegrado',
        'fecha_reintegro',
        'monto_por_reintegrar',
        'num_oficio_of_vista_cytg',
        'fecha_oficio_of_vista_cytg',
        'num_oficio_cytg_aut_invest',
        'fecha_oficio_cytg_aut_invest',
        'num_carpeta_investigacion',
        'num_oficio_vai_municipio',
        'fecha_oficio_vai_municipio',
        'autoridad_invest_id',
        'num_oficio_pras_of',
        'fecha_oficio_pras_of',
        'num_oficio_pras_cytg_dependencia',
        'num_oficio_resp_dependencia',
        'fecha_oficio_resp_dependencia',
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}

    sql = '''
        SELECT *
        FROM seguimientos_obs_sfp
        WHERE observacion_id = {}
        ORDER BY seguimiento_id ASC;
    '''.format(mod_ent['id'])
    
    rows = exec_steady(sql)
    
    mod_ent['seguimientos'] = []
    for row in rows:
        mod_ent['seguimientos'].append(dict(row))

    sql = '''
        SELECT anio_cuenta_publica
        FROM anios_cuenta_publica_obs_sfp
        WHERE observacion_id = {}
        ORDER BY anio_cuenta_publica;
    '''.format(mod_ent['id'])

    rows = exec_steady(sql)

    mod_ent['anios_cuenta_publica'] = []
    for row in rows:
        mod_ent['anios_cuenta_publica'].append(row[0])

    return mod_ent


def seguimientos_to_comp_type_arr_lit(seguimientos):
    segs_str = "array["
    first = True
    
    for s in seguimientos:
        if not first:
            segs_str += ", "
        
        l = []
        l.append(s['observacion_id'])
        l.append(s['seguimiento_id'])
        l.append(s['num_oficio_cytg_oic'])
        l.append(s['fecha_oficio_cytg_oic'])
        l.append(s['fecha_recibido_dependencia'])
        l.append(s['fecha_vencimiento_cytg'])
        l.append(s['num_oficio_resp_dependencia'])
        l.append(s['fecha_recibido_oficio_resp'])
        l.append(s['resp_dependencia'])
        l.append(s['comentarios'])
        l.append(s['clasif_final_interna_cytg'])
        l.append(s['num_oficio_org_fiscalizador'])
        l.append(s['fecha_oficio_org_fiscalizador'])
        l.append(s['estatus_id'])
        l.append(s['monto_solventado'])
        l.append(s['monto_pendiente_solventar'])
        m = str(l)
        segs_str += "(" + m[1:-1] + ")"
        first = False
    
    segs_str += "]"

    return segs_str
