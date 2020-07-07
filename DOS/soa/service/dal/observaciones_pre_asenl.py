import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    """Calls database function in charge of creation and edition of an observation (preliminar ASENL)"""
    sql = """SELECT * FROM alter_observacion_pre_asenl(
        {}::integer,
        {}::integer,
        '{}'::text,
        {}::integer,
        {}::double precision,
        '{}'::date,
        {}::integer,
        {}::integer,
        {}::integer,
        '{}'::character varying,
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
        '{}'::character varying,
        '{}'::date,
        '{}'::text,
        '{}'::text,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        {}::integer,
        {}::integer,
        {}::integer)
        AS result( rc integer, msg text )""".format(
            kwargs['id'],
            kwargs['direccion_id'],
            kwargs['compartida_observacion'],
            kwargs['compartida_tipo_observacion_id'],
            kwargs['compartida_monto'],
            kwargs['fecha_captura'],
            kwargs['programa_social_id'],
            kwargs['tipo_auditoria_id'],
            kwargs['auditoria_id'],
            kwargs['num_oficio_notif_obs_prelim'],
            kwargs['fecha_recibido'],
            kwargs['fecha_vencimiento_of'],
            kwargs['tipo_observacion_id'],
            kwargs['num_observacion'],
            kwargs['observacion'],
            kwargs['monto_observado'],
            kwargs['num_oficio_cytg_oic'],
            kwargs['fecha_oficio_cytg_oic'],
            kwargs['fecha_recibido_dependencia'],
            kwargs['fecha_vencimiento_cytg'],
            kwargs['num_oficio_resp_dependencia'],
            kwargs['fecha_oficio_resp'],
            kwargs['resp_dependencia'],
            kwargs['comentarios'],
            kwargs['clasif_final_cytg'],
            kwargs['num_oficio_org_fiscalizador'],
            kwargs['fecha_oficio_org_fiscalizador'],
            kwargs['estatus_proceso_id'],
            kwargs['proyeccion_solventacion_id'],
            kwargs['resultado_final_pub_id']
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("observaciones_pre_asenl", id)
    return add_observacion_data(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_pre_asenl", id)
    return add_observacion_data(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_pre_asenl", id)
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
    total_items = count_entities('observaciones_pre_asenl', search_params)
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
        page_entities('observaciones_pre_asenl', offset + whole_pages_offset, target_items, order_by, order, search_params),
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
                SELECT id, title
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
            '''.format(table)

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
            '''.format('ASENL')

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
        'compartida_observacion',
        'compartida_tipo_observacion_id',
        'compartida_monto',
        'fecha_captura',
        'programa_social_id',
        'tipo_auditoria_id',
        'auditoria_id',
        'num_oficio_notif_obs_prelim',
        'fecha_recibido',
        'fecha_vencimiento_of',
        'tipo_observacion_id',
        'num_observacion',
        'observacion',
        'monto_observado',
        'num_oficio_cytg_oic',
        'fecha_oficio_cytg_oic',
        'fecha_recibido_dependencia',
        'fecha_vencimiento_cytg',
        'num_oficio_resp_dependencia',
        'fecha_oficio_resp',
        'resp_dependencia',
        'comentarios',
        'clasif_final_cytg',
        'num_oficio_org_fiscalizador',
        'fecha_oficio_org_fiscalizador',
        'estatus_proceso_id',
        'proyeccion_solventacion_id',
        'resultado_final_pub_id',
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
