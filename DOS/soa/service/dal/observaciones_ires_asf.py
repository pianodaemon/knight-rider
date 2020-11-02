import math

from dal.helper import run_stored_procedure, exec_steady
from dal.entity import page_entities, count_entities, fetch_entity, delete_entity
from misc.helperpg import EmptySetError

def _alter_observation(**kwargs):
    seguimientos_str = seguimientos_to_comp_type_arr_lit(kwargs['seguimientos'])
    pras_str = pras_to_comp_type_lit(kwargs['pras'])

    """Calls database function in charge of creation and edition of an observation (ASF ires)"""
    sql = """SELECT * FROM alter_observacion_ires_asf(
        {}::integer,
        {}::integer,
        '{}'::character varying,
        '{}'::date,
        '{}'::date,
        '{}'::text,
        {}::integer,
        '{}'::character varying,
        '{}'::character varying,
        {}::double precision,
        {}::double precision,
        {}::double precision,
        '{}'::date,
        {}::double precision,
        {}::boolean,
        {}::seguimientos_obs_asf[],
        {}::pras_ires_asf)
        AS result( rc integer, msg text )""".format(
            kwargs['id'],
            kwargs['observacion_pre_id'],
            kwargs['num_oficio_of'],
            kwargs['fecha_recibido'],
            kwargs['fecha_vencimiento'],
            kwargs['observacion_ir'],
            kwargs['tipo_observacion_id'],
            kwargs['accion'],
            kwargs['clave_accion'],
            kwargs['monto_observado'],
            kwargs['monto_a_reintegrar'],
            kwargs['monto_reintegrado'],
            kwargs['fecha_reintegro'],
            kwargs['monto_por_reintegrar'],
            kwargs['tiene_pras'],
            seguimientos_str,
            pras_str,
        )

    rcode, rmsg = run_stored_procedure(sql)
    if rcode < 1:
        if kwargs['id'] != 0:
            raise EmptySetError(rmsg)
        else:
            raise Exception(rmsg)
    else:
        id = rcode

    ent = fetch_entity("observaciones_ires_asf", id)
    return add_observacion_data(ent)


def create(**kwargs):
    ''' Creates an observation entity '''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)


def read(id):
    ''' Fetches an observation entity '''
    ent = fetch_entity("observaciones_ires_asf", id)
    return add_observacion_data(ent)


def update(id, **kwargs):
    ''' Updates an observation entity '''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def delete(id):
    ''' Deletes an observation entity '''
    ent = delete_entity("observaciones_ires_asf", id)
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
        'id', 'tipo_observacion_id', 'observacion_ir'
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
    total_items = count_entities('observaciones_ires_asf', search_params)
    if total_items > limit:
        total_items = limit
    
    total_pages = math.ceil(total_items / per_page)

    whole_pages_offset = per_page * (page - 1)
    if whole_pages_offset >= total_items:
        return [], total_items, total_pages
    
    target_items = total_items - whole_pages_offset
    if target_items > per_page:
        target_items = per_page

    entities = page_entities('observaciones_ires_asf', offset + whole_pages_offset, target_items, order_by, order, search_params)

    # Adding some obs preliminares' data
    for e in entities:
        add_preliminar_data(e)

    return (entities, total_items, total_pages)


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
            '''.format('ASF')

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
        'observacion_pre_id',
        'num_oficio_of',
        'fecha_recibido',
        'fecha_vencimiento',
        'observacion_ir',
        'tipo_observacion_id',
        'accion',
        'clave_accion',
        'monto_observado',
        'monto_a_reintegrar',
        'monto_reintegrado',
        'fecha_reintegro',
        'monto_por_reintegrar',
        'tiene_pras'
    ])
    mod_ent = {attr: ent[attr] for attr in attributes}

    sql = '''
        SELECT *
        FROM seguimientos_obs_asf
        WHERE observacion_id = {}
        ORDER BY seguimiento_id ASC;
    '''.format(mod_ent['id'])
    
    rows = exec_steady(sql)
    
    mod_ent['seguimientos'] = []
    for row in rows:
        mod_ent['seguimientos'].append(dict(row))

    if mod_ent['tiene_pras']:
        sql = '''
            SELECT *
            FROM pras_ires_asf
            WHERE pras_observacion_id = {};
        '''.format(mod_ent['id'])
        
        rows = exec_steady(sql)
        
        mod_ent['pras'] = dict(rows[0])
    
    else:
        mod_ent['pras'] = None

    # Add obs preliminar data
    add_preliminar_data(mod_ent)

    return mod_ent


def seguimientos_to_comp_type_arr_lit(seguimientos):
    segs_str = "array["
    first = True
    
    for s in seguimientos:
        if not first:
            segs_str += ", "
        
        segs_str += (
            "(" +
            str(s['observacion_id']) + ", " +
            str(s['seguimiento_id']) + ", " +
            str(s['medio_notif_seguimiento_id']) + ", " +
            "'" + s['num_oficio_cytg_oic'] + "', " +
            "'" + s['fecha_oficio_cytg_oic'] + "', " +
            "'" + s['fecha_recibido_dependencia'] + "', " +
            "'" + s['fecha_vencimiento_cytg'] + "', " +
            "'" + s['num_oficio_resp_dependencia'] + "', " +
            "'" + s['fecha_recibido_oficio_resp'] + "', " +
            "'" + s['resp_dependencia'] + "', " +
            "'" + s['comentarios'] + "', " +
            str(s['clasif_final_interna_cytg']) + ", " +
            "'" + s['num_oficio_org_fiscalizador'] + "', " +
            "'" + s['fecha_oficio_org_fiscalizador'] + "', " +
            str(s['estatus_id']) + ", " +
            str(s['monto_solventado']) + ", " +
            "'" + s['num_oficio_monto_solventado'] + "', " +
            "'" + s['fecha_oficio_monto_solventado'] + "', " +
            str(s['monto_pendiente_solventar']) + ", " +
            str(s['monto_a_reintegrar']) + ", " +
            str(s['monto_reintegrado']) + ", " +
            "'" + s['fecha_reintegro'] + "', " +
            str(s['monto_por_reintegrar']) +
            ")"
        )

        first = False
    
    segs_str += "]"

    return segs_str


def pras_to_comp_type_lit(pras):
    l = []
    l.append(pras['pras_observacion_id'])
    l.append(pras['num_oficio_of_vista_cytg'])
    l.append(pras['fecha_oficio_of_vista_cytg'])
    l.append(pras['num_oficio_cytg_aut_invest'])
    l.append(pras['fecha_oficio_cytg_aut_invest'])
    l.append(pras['num_carpeta_investigacion'])
    l.append(pras['num_oficio_cytg_org_fiscalizador'])
    l.append(pras['fecha_oficio_cytg_org_fiscalizador'])
    l.append(pras['num_oficio_vai_municipio'])
    l.append(pras['fecha_oficio_vai_municipio'])
    l.append(pras['autoridad_invest_id'])
    l.append(pras['num_oficio_pras_of'])
    l.append(pras['fecha_oficio_pras_of'])
    l.append(pras['num_oficio_pras_cytg_dependencia'])
    l.append(pras['num_oficio_resp_dependencia'])
    l.append(pras['fecha_oficio_resp_dependencia'])
    m = str(l)
    pras_str = "(" + m[1:-1] + ")"

    return pras_str


def add_preliminar_data(ent):
    if ent['observacion_pre_id'] <= 0:
        ent['direccion_id'] = None
        ent['programa_social_id'] = None
        ent['auditoria_id'] = None
        ent['num_observacion'] = None
    else:
        sql = '''
            SELECT direccion_id, programa_social_id, auditoria_id, num_observacion
            FROM observaciones_pre_asf
            WHERE id = {}
            AND NOT blocked;
        '''.format(ent['observacion_pre_id'])

        try:
            rows = exec_steady(sql)
            row = dict(rows[0])
            ent['direccion_id'] = row['direccion_id']
            ent['programa_social_id'] = row['programa_social_id']
            ent['auditoria_id'] = row['auditoria_id']
            ent['num_observacion'] = row['num_observacion']
        except Exception as err:
            ent['direccion_id'] = None
            ent['programa_social_id'] = None
            ent['auditoria_id'] = None
            ent['num_observacion'] = None


def transform_list_into_dict(input_list):
    output_dict = {}
    
    for i in input_list:
        if i[0] not in output_dict:
            output_dict[i[0]] = [i[1]]
        else:
            output_dict[i[0]].append(i[1])

    return output_dict
