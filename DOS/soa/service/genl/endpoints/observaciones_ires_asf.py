from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_ires_asf
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_ires_asf_ns_captions = {
    'id': 'Id de la observacion de la ASF (Informe de Resultados)',
    'observacion_pre_id': 'Id de la obs preliminar asociada a este Informe de Resultados',
    'num_oficio_of': 'Num. de Oficio del OF (Resultados)',
    'fecha_recibido': 'Fecha de recibido',
    'fecha_vencimiento': 'Fecha de vencimiento (Org Fisc)',
    'observacion_ir': 'Texto de la observación',
    'tipo_observacion_id': 'Id del tipo de observación',
    'accion': 'Acción',
    'clave_accion': 'Clave de Acción',
    'monto_observado': 'Monto observado',
    'monto_a_reintegrar': 'Monto a reintegrar',
    'monto_reintegrado': 'Monto reintegrado',
    'fecha_reintegro': 'Fecha de reintegro',
    'monto_por_reintegrar': 'Monto por reintegrar',
    'seguimientos': 'Seguimientos',
    'tiene_pras': 'Flag que indica si la observación tiene campos de captura para un PRAS',
    'pras': 'Campos de captura de PRAS',
    'direccion_id': 'Id de la dirección (según obs preliminar)',
    'auditoria_id': 'Id de la auditoría (según obs preliminar)',
    'programa_social_id': 'Id del programa social (según obs preliminar)',
    'num_observacion': 'Número de observación (según obs preliminar)',
    'dependencia_id': 'Id de la Dependencia, indicada por la Auditoría',
    'anio_cuenta_pub': 'Año de la cuenta pública, indicada por la Auditoría',
    
    'observacion_id': 'Id de la observación a la que pertenece el seguimiento',
    'seguimiento_id': 'Id del seguimiento',
    'medio_notif_seguimiento_id': 'Medio notificación de seguimiento',
    'num_oficio_cytg_oic': 'Num. de Oficio CyTG u OIC',
    'fecha_oficio_cytg_oic': 'Fecha de Oficio CyTG u OIC',
    'fecha_recibido_dependencia': 'Fecha de recibido de la Dependencia (ACUSE)',
    'fecha_vencimiento_cytg': 'Fecha de vencimiento (CyTG)',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la Dependencia',
    'fecha_recibido_oficio_resp': 'Fecha de recibido del Oficio de respuesta de la Dependencia',
    'resp_dependencia': 'Respuesta de la Dependencia',
    'comentarios': 'Comentarios',
    'clasif_final_interna_cytg': 'Clasificacion final Interna CyTG',
    'num_oficio_org_fiscalizador': 'Num. de Oficio para Organo Fiscalizador',
    'fecha_oficio_org_fiscalizador': 'Fecha de Oficio para Organo Fiscalizador',
    'estatus_id': 'Estatus',
    'monto_solventado': 'Monto Solventado',
    'num_oficio_monto_solventado': 'Num. de Oficio (monto solventado)',
    'fecha_oficio_monto_solventado': 'Fecha de Oficio - acuse (monto solventado)',
    'monto_pendiente_solventar': 'Monto Pendiente de solventar',

    'pras_observacion_id': 'Id de la observación a la que pertenece el PRAS',
    'num_oficio_of_vista_cytg': 'Num. de Oficio del OF que da vista a la CyTG',
    'fecha_oficio_of_vista_cytg': 'Fecha de Oficio del OF que da vista a la CyTG',
    'num_oficio_cytg_aut_invest': 'Num. de Oficio de la CyTG para la Autoridad Investigadora',
    'fecha_oficio_cytg_aut_invest': 'Fecha de Oficio de la CyTG para la Autoridad Investigadora',
    'num_carpeta_investigacion': 'Num. de Carpeta de Investigación',
    'num_oficio_cytg_org_fiscalizador': 'Num. de Oficio de la CyTG para Órgano Fiscalizador',
    'fecha_oficio_cytg_org_fiscalizador': 'Fecha de Oficio de la CyTG para Órgano Fiscalizador',
    'num_oficio_vai_municipio': 'Num. de Oficio VAI a Municipio',
    'fecha_oficio_vai_municipio': 'Fecha de Oficio VAI a Municipio',
    'autoridad_invest_id': 'Id de la Autoridad Investigadora',
    'num_oficio_pras_of': 'Num. de Oficio de PRAS del OF',
    'fecha_oficio_pras_of': 'Fecha de Oficio de PRAS del OF',
    'num_oficio_pras_cytg_dependencia': 'Num. de Oficio PRAS de la CyTG para la dependencia',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la dependencia',
    'fecha_oficio_resp_dependencia': 'Fecha de Oficio de respuesta de la dependencia',
}

ns = api.namespace("obs_ires_asf", description="Servicios disponibles para Observaciones de la ASF (Informe de Resultados)")

seguimiento = api.model('Seguimiento de una Observación de la ASF (Informe de Resultados)', {
    'observacion_id': fields.Integer(description=obs_ires_asf_ns_captions['observacion_id']),
    'seguimiento_id': fields.Integer(description=obs_ires_asf_ns_captions['seguimiento_id']),
    'medio_notif_seguimiento_id': fields.Integer(description=obs_ires_asf_ns_captions['medio_notif_seguimiento_id']),
    'num_oficio_cytg_oic': fields.String(description=obs_ires_asf_ns_captions['num_oficio_cytg_oic']),
    'fecha_oficio_cytg_oic': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_cytg_oic']),
    'fecha_recibido_dependencia': fields.Date(description=obs_ires_asf_ns_captions['fecha_recibido_dependencia']),
    'fecha_vencimiento_cytg': fields.Date(description=obs_ires_asf_ns_captions['fecha_vencimiento_cytg']),
    'num_oficio_resp_dependencia': fields.String(description=obs_ires_asf_ns_captions['num_oficio_resp_dependencia']),
    'fecha_recibido_oficio_resp': fields.Date(description=obs_ires_asf_ns_captions['fecha_recibido_oficio_resp']),
    'resp_dependencia': fields.String(description=obs_ires_asf_ns_captions['resp_dependencia']),
    'comentarios': fields.String(description=obs_ires_asf_ns_captions['comentarios']),
    'clasif_final_interna_cytg': fields.Integer(description=obs_ires_asf_ns_captions['clasif_final_interna_cytg']),
    'num_oficio_org_fiscalizador': fields.String(description=obs_ires_asf_ns_captions['num_oficio_org_fiscalizador']),
    'fecha_oficio_org_fiscalizador': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_org_fiscalizador']),
    'estatus_id': fields.Integer(description=obs_ires_asf_ns_captions['estatus_id']),
    'monto_solventado': fields.Float(description=obs_ires_asf_ns_captions['monto_solventado']),
    'num_oficio_monto_solventado': fields.String(description=obs_ires_asf_ns_captions['num_oficio_monto_solventado']),
    'fecha_oficio_monto_solventado': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_monto_solventado']),
    'monto_pendiente_solventar': fields.Float(description=obs_ires_asf_ns_captions['monto_pendiente_solventar']),
    'monto_a_reintegrar': fields.Float(description=obs_ires_asf_ns_captions['monto_a_reintegrar']),
    'monto_reintegrado': fields.Float(description=obs_ires_asf_ns_captions['monto_reintegrado']),
    'fecha_reintegro': fields.Date(description=obs_ires_asf_ns_captions['fecha_reintegro']),
    'monto_por_reintegrar': fields.Float(description=obs_ires_asf_ns_captions['monto_por_reintegrar']),
})

pras = api.model('Campos de captura para un PRAS', {
    'pras_observacion_id': fields.Integer(description=obs_ires_asf_ns_captions['pras_observacion_id']),
    'num_oficio_of_vista_cytg': fields.String(description=obs_ires_asf_ns_captions['num_oficio_of_vista_cytg']),
    'fecha_oficio_of_vista_cytg': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_of_vista_cytg']),
    'num_oficio_cytg_aut_invest': fields.String(description=obs_ires_asf_ns_captions['num_oficio_cytg_aut_invest']),
    'fecha_oficio_cytg_aut_invest': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_cytg_aut_invest']),
    'num_carpeta_investigacion': fields.String(description=obs_ires_asf_ns_captions['num_carpeta_investigacion']),
    'num_oficio_cytg_org_fiscalizador': fields.String(description=obs_ires_asf_ns_captions['num_oficio_cytg_org_fiscalizador']),
    'fecha_oficio_cytg_org_fiscalizador': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_cytg_org_fiscalizador']),
    'num_oficio_vai_municipio': fields.String(description=obs_ires_asf_ns_captions['num_oficio_vai_municipio']),
    'fecha_oficio_vai_municipio': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_vai_municipio']),
    'autoridad_invest_id': fields.Integer(description=obs_ires_asf_ns_captions['autoridad_invest_id']),
    'num_oficio_pras_of': fields.String(description=obs_ires_asf_ns_captions['num_oficio_pras_of']),
    'fecha_oficio_pras_of': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_pras_of']),
    'num_oficio_pras_cytg_dependencia': fields.String(description=obs_ires_asf_ns_captions['num_oficio_pras_cytg_dependencia']),
    'num_oficio_resp_dependencia': fields.String(description=obs_ires_asf_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp_dependencia': fields.Date(description=obs_ires_asf_ns_captions['fecha_oficio_resp_dependencia']),
})

obs_ires_asf = api.model('Observación de la ASF (Informe de Resultados)', {
    'id': fields.Integer(description=obs_ires_asf_ns_captions['id']),
    'observacion_pre_id': fields.Integer(description=obs_ires_asf_ns_captions['observacion_pre_id']),
    'num_oficio_of': fields.String(description=obs_ires_asf_ns_captions['num_oficio_of']),
    'fecha_recibido': fields.Date(description=obs_ires_asf_ns_captions['fecha_recibido']),
    'fecha_vencimiento': fields.Date(description=obs_ires_asf_ns_captions['fecha_vencimiento']),
    'observacion_ir': fields.String(description=obs_ires_asf_ns_captions['observacion_ir']),
    'tipo_observacion_id': fields.Integer(description=obs_ires_asf_ns_captions['tipo_observacion_id']),
    'accion': fields.Integer(description=obs_ires_asf_ns_captions['accion']),
    'clave_accion': fields.String(description=obs_ires_asf_ns_captions['clave_accion']),
    'monto_observado': fields.Float(description=obs_ires_asf_ns_captions['monto_observado']),
    'monto_a_reintegrar': fields.Float(description=obs_ires_asf_ns_captions['monto_a_reintegrar']),
    'monto_reintegrado': fields.Float(description=obs_ires_asf_ns_captions['monto_reintegrado']),
    'fecha_reintegro': fields.Date(description=obs_ires_asf_ns_captions['fecha_reintegro']),
    'monto_por_reintegrar': fields.Float(description=obs_ires_asf_ns_captions['monto_por_reintegrar']),
    'seguimientos': fields.List(fields.Nested(seguimiento), description=obs_ires_asf_ns_captions['seguimientos']),
    'tiene_pras': fields.Boolean(description=obs_ires_asf_ns_captions['tiene_pras']),
    'pras': fields.Nested(pras, description=obs_ires_asf_ns_captions['pras']),
    'direccion_id': fields.Integer(description=obs_ires_asf_ns_captions['direccion_id']),
    'auditoria_id': fields.Integer(description=obs_ires_asf_ns_captions['auditoria_id']),
    'programa_social_id': fields.Integer(description=obs_ires_asf_ns_captions['programa_social_id']),
    'num_observacion': fields.String(description=obs_ires_asf_ns_captions['num_observacion']),
})


pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

audit = api.model('Auditoría', {
    'id': fields.Integer(description='Id de la auditoría'),
    'title': fields.String(description='Título de la auditoría'),
    'org_fiscal_id': fields.Integer(description='Id del Órgano Fiscalizador'),
    'direccion_id': fields.Integer(description='Id de la Dirección'),
    'dependency_ids': fields.List(fields.Integer(), description='List of dependency ids'),
    'years': fields.List(fields.Integer(), description='List of years (public account)'),
})

dependency = api.model('Datos de una Dependencia', {
    'id': fields.Integer(description='Id de la Dependencia'),
    'title': fields.String(description='Título de la Dependencia'),
    'description': fields.String(description='Descripción de la Dependencia'),
    'clasif_title': fields.String(description='Clasificación de la Dependencia'),
})

program  = api.model('Datos de un Programa social', {
    'id': fields.Integer(description='Id del programa social'),
    'title': fields.String(description='Siglas del programa social'),
    'description': fields.String(description='Nombre del programa social'),
    'central': fields.Boolean(description='Vinculado a Central'),
    'paraestatal': fields.Boolean(description='Vinculado a Paraestatal'),
    'obra_pub': fields.Boolean(description='Vinculado a Obra pública'),
})

clasif_interna_pair = api.model('Par que asocia sorting_value y el title para la Clasificación interna CyTG', {
    'sorting_val': fields.Integer(description='Valor para ordenamiento'),
    'title': fields.String(description='Título de la Clasficación interna CyTG'),
})

clasif_interna_cytg = api.model('Clasificaciones internas CyTG para una Dirección', {
    'direccion_id': fields.Integer(description='Id de la Dirección'),
    'clasifs_internas_pairs': fields.List(fields.Nested(clasif_interna_pair)),
})

catalog = api.model('Leyendas y datos para la UI de Observaciones de la ASF (Informe de Resultados)', {
    'medios_notif_seguimiento_asf': fields.List(fields.Nested(pair)),
    'estatus_ires_asf': fields.List(fields.Nested(pair)),
    'autoridades_invest': fields.List(fields.Nested(pair)),
    'clasifs_internas_cytg': fields.List(fields.Nested(clasif_interna_cytg)),
    'observation_types': fields.List(fields.Nested(pair)),
    'audits': fields.List(fields.Nested(audit)),
    'dependencies': fields.List(fields.Nested(dependency)),
    'divisions': fields.List(fields.Nested(pair)),
    'social_programs': fields.List(fields.Nested(program)),
    'acciones_asf': fields.List(fields.Nested(pair)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class ObservacionIResASFList(Resource):

    @ns.marshal_list_with(obs_ires_asf)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("tipo_observacion_id", obs_ires_asf_ns_captions['tipo_observacion_id'])
    @ns.param("observacion_ir", obs_ires_asf_ns_captions['observacion_ir'])
    @ns.param("direccion_id", obs_ires_asf_ns_captions['direccion_id'])
    @ns.param("auditoria_id", obs_ires_asf_ns_captions['auditoria_id'])
    @ns.param("programa_social_id", obs_ires_asf_ns_captions['programa_social_id'])
    @ns.param("num_observacion", obs_ires_asf_ns_captions['num_observacion'])
    @ns.param("dependencia_id", obs_ires_asf_ns_captions['dependencia_id'])
    @ns.param("anio_cuenta_pub", obs_ires_asf_ns_captions['anio_cuenta_pub'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (Informes de Resultados de la ASF). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        offset = request.args.get('offset', '0')
        limit = request.args.get('limit', '10')
        order_by = request.args.get('order_by', 'id')
        order = request.args.get('order', 'ASC')
        per_page = request.args.get('per_page', '10')
        page = request.args.get('page', '1')

        search_params = get_search_params(
            request.args,
            ['tipo_observacion_id', 'observacion_ir']
        )
        indirect_search_params = get_search_params(
            request.args,
            ['direccion_id', 'auditoria_id', 'programa_social_id', 'num_observacion', 'dependencia_id', 'anio_cuenta_pub']
        )

        try:
            obs_ires_asf_list, total_items, total_pages = observaciones_ires_asf.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page, indirect_search_params
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_ires_asf_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(obs_ires_asf)
    @ns.marshal_with(obs_ires_asf, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation (Informe de Resultados de la ASF). '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asf.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una observacion (Informe de Resultados de la ASF)')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ObservacionIResASF(Resource):
    obs_not_found = 'Observación no encontrada'

    @ns.marshal_with(obs_ires_asf)
    def get(self, id):
        ''' To fetch an observation (Informe de Resultados de la ASF) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asf.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionIResASF.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(obs_ires_asf)
    @ns.marshal_with(obs_ires_asf)
    def put(self, id):
        ''' To update an observation (Informe de Resultados de la ASF) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asf.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionIResASF.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.marshal_with(obs_ires_asf)
    def delete(self, id):
        ''' To delete an observation (Informe de Resultados de la ASF) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asf.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionIResASF.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs



@ns.route('/catalog')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Catalog(Resource):

    @ns.marshal_with(catalog)
    def get(self):
        ''' To fetch an object containing data for screen fields (key: table name, value: list of table rows) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            field_catalog = observaciones_ires_asf.get_catalogs([
                'medios_notif_seguimiento_asf',
                'estatus_ires_asf',
                'autoridades_invest',
                'clasifs_internas_cytg',
                'observation_types',
                'audits',
                'dependencies',
                'divisions',
                'social_programs',
                'acciones_asf',
            ])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
