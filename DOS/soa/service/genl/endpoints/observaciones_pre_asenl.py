from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_pre_asenl
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_pre_asenl_ns_captions = {
    'id': 'Id de la observación de la ASENL',
    'direccion_id': 'Id de la Dirección',
    'compartida_observacion': 'Observación (compartida)',
    'compartida_tipo_observacion_id': 'Tipo de Observación (compartida)',
    'compartida_monto': 'Monto observado (compartida)',
    'fecha_captura': 'Fecha de captura',
    'tipo_auditoria_id': 'Id del Tipo de Auditoría',
    'auditoria_id': 'Id de la Auditoría',
    'num_oficio_notif_obs_prelim': 'Num. de Oficio donde notifican Observación Preliminar',
    'fecha_recibido': 'Fecha recibido (Acuse)',
    'fecha_vencimiento_of': 'Fecha de vencimiento (OF)',
    'tipo_observacion_id': 'Tipo de Observación (PROYECCION)',
    'num_observacion': 'Num. de Observación',
    'observacion': 'Observación',
    'monto_observado': 'Monto observado (PROYECCION)',
    'num_oficio_cytg_oic': 'Num. de Oficio CyTG u OIC',
    'fecha_oficio_cytg_oic': 'Fecha de Oficio CyTG',
    'fecha_recibido_dependencia': 'Fecha de recibido de la dependencia (Acuse)',
    'fecha_vencimiento_cytg': 'Fecha de vencimiento',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la dependencia',
    'fecha_oficio_resp': 'Fecha de Oficio de respuesta',
    'resp_dependencia': 'Respuesta de la dependencia',
    'comentarios': 'Comentarios',
    'clasif_final_cytg': 'Clasificación final CyTG (PROYECCION)',
    'num_oficio_org_fiscalizador': 'Num. de Oficio para Órgano Fiscalizador',
    'fecha_oficio_org_fiscalizador': 'Fecha de Oficio para Órgano Fiscalizador',
    'estatus_proceso_id': 'Estatus de proceso (PROYECCION)',
    'proyeccion_solventacion_id': 'Proyección Solventación',
    'resultado_final_pub_id': 'Resultado final publicado',
    'dependencia_id': 'Id de la Dependencia, indicada por la Auditoría',
    'anio_cuenta_pub': 'Año de la cuenta pública, indicada por la Auditoría',
}

ns = api.namespace("obs_pre_asenl", description="Servicios disponibles para Observaciones de la ASENL (Preliminares)")

obs_pre_asenl = api.model('Observación de la ASENL (Preliminar)', {
    'id': fields.Integer(description=obs_pre_asenl_ns_captions['id']),
    'direccion_id': fields.Integer(description=obs_pre_asenl_ns_captions['direccion_id']),
    'compartida_observacion': fields.String(description=obs_pre_asenl_ns_captions['compartida_observacion']),
    'compartida_tipo_observacion_id': fields.Integer(description=obs_pre_asenl_ns_captions['compartida_tipo_observacion_id']),
    'compartida_monto': fields.Float(description=obs_pre_asenl_ns_captions['compartida_monto']),
    'fecha_captura': fields.Date(description=obs_pre_asenl_ns_captions['fecha_captura']),
    'tipo_auditoria_id': fields.Integer(description=obs_pre_asenl_ns_captions['tipo_auditoria_id']),
    'auditoria_id': fields.Integer(description=obs_pre_asenl_ns_captions['auditoria_id']),
    'num_oficio_notif_obs_prelim': fields.String(description=obs_pre_asenl_ns_captions['num_oficio_notif_obs_prelim']),
    'fecha_recibido': fields.Date(description=obs_pre_asenl_ns_captions['fecha_recibido']),
    'fecha_vencimiento_of': fields.Date(description=obs_pre_asenl_ns_captions['fecha_vencimiento_of']),
    'tipo_observacion_id': fields.Integer(description=obs_pre_asenl_ns_captions['tipo_observacion_id']),
    'num_observacion': fields.String(description=obs_pre_asenl_ns_captions['num_observacion']),
    'observacion': fields.String(description=obs_pre_asenl_ns_captions['observacion']),
    'monto_observado': fields.Float(description=obs_pre_asenl_ns_captions['monto_observado']),
    'num_oficio_cytg_oic': fields.String(description=obs_pre_asenl_ns_captions['num_oficio_cytg_oic']),
    'fecha_oficio_cytg_oic': fields.Date(description=obs_pre_asenl_ns_captions['fecha_oficio_cytg_oic']),
    'fecha_recibido_dependencia': fields.Date(description=obs_pre_asenl_ns_captions['fecha_recibido_dependencia']),
    'fecha_vencimiento_cytg': fields.Date(description=obs_pre_asenl_ns_captions['fecha_vencimiento_cytg']),
    'num_oficio_resp_dependencia': fields.String(description=obs_pre_asenl_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp': fields.Date(description=obs_pre_asenl_ns_captions['fecha_oficio_resp']),
    'resp_dependencia': fields.String(description=obs_pre_asenl_ns_captions['resp_dependencia']),
    'comentarios': fields.String(description=obs_pre_asenl_ns_captions['comentarios']),
    'clasif_final_cytg': fields.Integer(description=obs_pre_asenl_ns_captions['clasif_final_cytg']),
    'num_oficio_org_fiscalizador': fields.String(description=obs_pre_asenl_ns_captions['num_oficio_org_fiscalizador']),
    'fecha_oficio_org_fiscalizador': fields.Date(description=obs_pre_asenl_ns_captions['fecha_oficio_org_fiscalizador']),
    'estatus_proceso_id': fields.Integer(description=obs_pre_asenl_ns_captions['estatus_proceso_id']),
    'proyeccion_solventacion_id': fields.Integer(description=obs_pre_asenl_ns_captions['proyeccion_solventacion_id']),
    'resultado_final_pub_id': fields.Integer(description=obs_pre_asenl_ns_captions['resultado_final_pub_id']),
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

dependency = api.model('Dependencia', {
    'id': fields.Integer(description='Id de la Dependencia'),
    'title': fields.String(description='Título o siglas de la Dependencia'),
    'description': fields.String(description='Descripción de la Dependencia'),
    'clasif_title': fields.String(description='Clasificación de la Dependencia'),
})

clasif_interna_pair = api.model('Par que asocia sorting_value y el title para la Clasificación interna CyTG', {
    'sorting_val': fields.Integer(description='Valor para ordenamiento'),
    'title': fields.String(description='Título de la Clasficación interna CyTG'),
})

clasif_interna_cytg = api.model('Clasificaciones internas CyTG para una Dirección', {
    'direccion_id': fields.Integer(description='Id de la Dirección'),
    'clasifs_internas_pairs': fields.List(fields.Nested(clasif_interna_pair)),
})

catalog = api.model('Leyendas y datos para la UI de Observaciones de la ASENL (Preliminares)', {
    'divisions': fields.List(fields.Nested(pair)),
    'audits': fields.List(fields.Nested(audit)),
    'dependencies': fields.List(fields.Nested(dependency)),
    'clasifs_internas_cytg': fields.List(fields.Nested(clasif_interna_cytg)),
    'estatus_pre_asenl': fields.List(fields.Nested(pair)),
    'proyecciones_asenl': fields.List(fields.Nested(pair)),
    'auditoria_tipos': fields.List(fields.Nested(pair)),
    'observation_types': fields.List(fields.Nested(pair)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class ObservacionPreAsenlList(Resource):

    @ns.marshal_list_with(obs_pre_asenl)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("tipo_observacion_id", obs_pre_asenl_ns_captions['tipo_observacion_id'])
    @ns.param("auditoria_id", obs_pre_asenl_ns_captions['auditoria_id'])
    @ns.param("observacion", obs_pre_asenl_ns_captions['observacion'])
    @ns.param("num_observacion", obs_pre_asenl_ns_captions['num_observacion'])
    @ns.param("direccion_id", obs_pre_asenl_ns_captions['direccion_id'])
    @ns.param("dependencia_id", obs_pre_asenl_ns_captions['dependencia_id'])
    @ns.param("anio_cuenta_pub", obs_pre_asenl_ns_captions['anio_cuenta_pub'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (preliminares de la ASENL). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['tipo_observacion_id', 'auditoria_id', 'observacion', 'num_observacion', 'direccion_id']
        )
        indirect_search_params = get_search_params(
            request.args,
            ['dependencia_id', 'anio_cuenta_pub']
        )

        try:
            obs_pre_asenl_list, total_items, total_pages = observaciones_pre_asenl.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page, indirect_search_params
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_pre_asenl_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(obs_pre_asenl)
    @ns.marshal_with(obs_pre_asenl, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation (preliminar de la ASENL). '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asenl.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una observación (preliminar de la ASENL)')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ObservacionPreAsenl(Resource):
    obs_not_found = 'Observación no encontrada'

    @ns.marshal_with(obs_pre_asenl)
    def get(self, id):
        ''' To fetch an observation (preliminar de la ASENL) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asenl.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionPreAsenl.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(obs_pre_asenl)
    @ns.marshal_with(obs_pre_asenl)
    def put(self, id):
        ''' To update an observation (preliminar de la ASENL) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asenl.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionPreAsenl.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.marshal_with(obs_pre_asenl)
    def delete(self, id):
        ''' To delete an observation (preliminar de la ASENL) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asenl.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionPreAsenl.obs_not_found)
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

        search_params = get_search_params(request.args, ['direccion_id'])

        try:
            field_catalog = observaciones_pre_asenl.get_catalogs(
                [
                    'divisions',
                    'audits',
                    'dependencies',
                    'clasifs_internas_cytg',
                    'estatus_pre_asenl',
                    'proyecciones_asenl',
                    'auditoria_tipos',
                    'observation_types',
                ],
                search_params
            )
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
