import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    """Calls database function in charge of creation and edition of an observation (preliminar CyTG)"""
    sql = """SELECT * FROM alter_observacion_pre_cytg(
        {}::integer,
        '{}'::date,
        '{}'::date,
        {}::integer,
        '{}'::date,
        {}::integer,
        {}::integer,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::date,
        {}::integer,
        '{}'::character varying,
        '{}'::text,
        {}::double precision,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::date,
        {}::boolean,
        '{}'::character varying,
        '{}'::date,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        '{}'::text,
        '{}'::text)
        AS result( rc integer, msg text )""".format(
            kwargs['id'],
            kwargs['periodo_revision_de'],
            kwargs['periodo_revision_a'],
            kwargs['direccion_id'],
            kwargs['fecha_captura'],
            kwargs['programa_social_id'],
            kwargs['auditoria_id'],
            kwargs['tipo_auditoria_id'],
            kwargs['num_oficio_inicio'],
            kwargs['fecha_notificacion_inicio'],
            kwargs['fecha_vencimiento_nombra_enlace'],
            kwargs['num_oficio_requerimiento'],
            kwargs['fecha_notificacion_requerimiento'],
            kwargs['fecha_vencimiento_requerimiento'],
            kwargs['fecha_vencimiento_nueva'],
            kwargs['tipo_observacion_id'],
            kwargs['num_observacion'],
            kwargs['observacion'],
            kwargs['monto_observado'],
            kwargs['num_oficio_cytg_oic_pre'],
            kwargs['fecha_oficio_cytg_pre'],
            kwargs['fecha_recibido_dependencia'],
            kwargs['fecha_vencimiento_pre'],
            kwargs['prorroga'],
            kwargs['num_oficio_solic_prorroga'],
            kwargs['fecha_oficio_solic_prorroga'],
            kwargs['num_oficio_contest_prorroga_cytg'],
            kwargs['fecha_oficio_contest_cytg'],
            kwargs['fecha_vencimiento_pre_nueva'],
            kwargs['clasif_pre_cytg'],
            kwargs['num_oficio_resp_dependencia'],
            kwargs['fecha_oficio_resp'],
            kwargs['resp_dependencia'],
            kwargs['comentarios'],
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("observaciones_pre_cytg", id)
    return add_observacion_data(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_pre_cytg", id)
    return add_observacion_data(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_pre_cytg", id)
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
        'id', 'tipo_observacion_id', 'programa_social_id', 'auditoria_id', 'observacion', 'num_observacion', 'direccion_id'
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
    total_items = count_entities('observaciones_pre_cytg', search_params)
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
        page_entities('observaciones_pre_cytg', offset + whole_pages_offset, target_items, order_by, order, search_params),
        total_items,
        total_pages
    )


def get_catalogs(table_name_list, search_params):
    ''' Fetches values and captions from a list of tables. These pairs can be used on input screens '''
    fields_d = {}

    for table in table_name_list:
        values_l = []
        
        if table == 'audits':
            
            sql = '''
                SELECT aud.id, dep.dependencia_id
                FROM audits AS aud
                JOIN auditoria_dependencias AS dep ON aud.id = dep.auditoria_id
                WHERE NOT aud.blocked;
            '''

            dependencias = exec_steady(sql)
            d = transform_list_into_dict(dependencias)
            
            sql = '''
                SELECT aud.id, ani.anio_cuenta_pub
                FROM audits AS aud
                JOIN auditoria_anios_cuenta_pub AS ani ON aud.id = ani.auditoria_id
                WHERE NOT aud.blocked;
            '''

            anios = exec_steady(sql)
            a = transform_list_into_dict(anios)

            sql = '''
                SELECT id, title, org_fiscal_id, direccion_id
                FROM audits
                WHERE NOT blocked
                ORDER BY title;
            '''

            rows = exec_steady(sql)

            for row in rows:
                r = dict(row)
                r['dependency_ids'] = d[row[0]]
                r['years'] = a[row[0]]
                values_l.append(r)

        elif table == 'dependencies':
            sql = '''
                SELECT dep.id, dep.title, dep.description, clasif.title as clasif_title
                FROM dependencies as dep
                JOIN dependencia_clasif AS clasif ON dep.clasif_id = clasif.id
                ORDER BY dep.id;
            '''

            rows = exec_steady(sql)
            for row in rows:
                values_l.append(dict(row))
        
        elif table == 'clasifs_internas_cytg':
            sql = '''
                SELECT clas.direccion_id, clas.sorting_val, clas.title
                FROM fiscals AS fisc
                JOIN clasifs_internas_cytg AS clas ON fisc.id = clas.org_fiscal_id
                WHERE fisc.title = '{}'
                ORDER BY clas.direccion_id, clas.sorting_val;
            '''.format('CyTG')

            rows = exec_steady(sql)

            first_dir = 0

            for row in rows:
                if row[0] != first_dir:
                    clasif = {
                        'direccion_id': row[0],
                        'clasifs_internas_pairs': [{
                            'sorting_val': row[1],
                            'title': row[2]
                        }]
                    }
                    values_l.append(clasif)
                else:
                    clasif['clasifs_internas_pairs'].append({
                        'sorting_val': row[1],
                        'title': row[2]
                    })
                
                first_dir = row[0]

        elif table == 'divisions' and search_params and 'direccion_id' in search_params:
            sql = '''
                SELECT *
                FROM divisions
                WHERE id = {};
            '''.format(search_params['direccion_id'])

            rows = exec_steady(sql)
            for row in rows:
                values_l.append(dict(row))

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
        'periodo_revision_de',
        'periodo_revision_a',
        'direccion_id',
        'fecha_captura',
        'programa_social_id',
        'auditoria_id',
        'tipo_auditoria_id',
        'num_oficio_inicio',
        'fecha_notificacion_inicio',
        'fecha_vencimiento_nombra_enlace',
        'num_oficio_requerimiento',
        'fecha_notificacion_requerimiento',
        'fecha_vencimiento_requerimiento',
        'fecha_vencimiento_nueva',
        'tipo_observacion_id',
        'num_observacion',
        'observacion',
        'monto_observado',
        'num_oficio_cytg_oic_pre',
        'fecha_oficio_cytg_pre',
        'fecha_recibido_dependencia',
        'fecha_vencimiento_pre',
        'prorroga',
        'num_oficio_solic_prorroga',
        'fecha_oficio_solic_prorroga',
        'num_oficio_contest_prorroga_cytg',
        'fecha_oficio_contest_cytg',
        'fecha_vencimiento_pre_nueva',
        'clasif_pre_cytg',
        'num_oficio_resp_dependencia',
        'fecha_oficio_resp',
        'resp_dependencia',
        'comentarios',
        'observacion_ires_id',
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}

    return mod_ent


def transform_list_into_dict(input_list):
    output_dict = {}
    
    for i in input_list:
        if i[0] not in output_dict:
            output_dict[i[0]] = [i[1]]
        else:
            output_dict[i[0]].append(i[1])

    return output_dict
