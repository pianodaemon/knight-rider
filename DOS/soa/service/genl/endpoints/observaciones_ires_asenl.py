from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_ires_asenl
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_ires_asenl_ns_captions = {
    'id': 'Id de la observacion de la ASENL (Informe de Resultados)',
    'observacion_pre_id': 'Id de la obs preliminar asociada a este Informe de Resultados',
    'num_oficio_of': 'Num. de Oficio del OF al Congreso (Resultados)',
    'fecha_publicacion': 'Fecha de publicación',
    'tipo_observacion_id': 'Id del tipo de observación',
    'num_observacion': 'Num. de observación',
    'observacion_final': 'Texto de la observación final (análisis)',
    'observacion_reincidente': 'Observación reincidente (Sí/No)',
    'anios_reincidencia': 'Años reincidencia',
    'monto_observado': 'Monto observado',
    'compartida_observacion': 'Observación (compartida)',
    'compartida_tipo_observacion_id': 'Tipo de observación (compartida)',
    'compartida_monto': 'Monto (compartida)',
    'comentarios': 'Comentarios',
    'clasif_final_cytg': 'Clasificación final CyTG',
    'monto_solventado': 'Monto solventado',
    'monto_pendiente_solventar': 'Monto pendiente de solventar',
    'monto_a_reintegrar': 'Monto a reintegrar',
    'acciones': 'Acciones',
    'recomendaciones': 'Recomendaciones',
    'num_oficio_recomendacion': 'Num. de Oficio de recomendación',
    'fecha_oficio_recomendacion': 'Fecha del Oficio de recomendación',
    'fecha_vencimiento_enviar_asenl': 'Fecha de vencimiento para enviar a ASENL',
    'num_oficio_dependencia': 'Num. de Oficio para dependencia',
    'fecha_oficio_dependencia': 'Fecha de Oficio para dependencia',
    'fecha_vencimiento_interna_cytg': 'Fecha de vencimiento interna CyTG',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de dependencia',
    'fecha_acuse_resp_dependencia': 'Fecha de acuse de respuesta de dependencia',
    'resp_dependencia': 'Respuesta de dependencia (acciones a realizar)',
    'num_oficio_enviar_resp_asenl': 'Num. de Oficio para enviar respuesta a la ASENL',
    'fecha_oficio_enviar_resp_asenl': 'Fecha del Oficio para enviar respuesta a la ASENL',
    'unidad_investigadora': 'Unidad investigadora',
    'num_vai': 'Num. VAI',
    'direccion_id': 'Id de la dirección (según obs preliminar)',
    'auditoria_id': 'Id de la auditoría (según obs preliminar)',
    'tipificacion_id': 'Id de la tipificación',
}

ns = api.namespace("obs_ires_asenl", description="Servicios disponibles para Observaciones de la ASENL (Informe de Resultados)")

obs_ires_asenl = api.model('Observación de la ASENL (Informe de Resultados)', {
    'id': fields.Integer(description=obs_ires_asenl_ns_captions['id']),
    'observacion_pre_id': fields.Integer(description=obs_ires_asenl_ns_captions['observacion_pre_id']),
    'num_oficio_of': fields.String(description=obs_ires_asenl_ns_captions['num_oficio_of']),
    'fecha_publicacion': fields.Date(description=obs_ires_asenl_ns_captions['fecha_publicacion']),
    'tipo_observacion_id': fields.Integer(description=obs_ires_asenl_ns_captions['tipo_observacion_id']),
    'num_observacion': fields.String(description=obs_ires_asenl_ns_captions['num_observacion']),
    'observacion_final': fields.String(description=obs_ires_asenl_ns_captions['observacion_final']),
    'observacion_reincidente': fields.Boolean(description=obs_ires_asenl_ns_captions['observacion_reincidente']),
    'anios_reincidencia': fields.String(description=obs_ires_asenl_ns_captions['anios_reincidencia']),
    'monto_observado': fields.Float(description=obs_ires_asenl_ns_captions['monto_observado']),
    'compartida_observacion': fields.String(description=obs_ires_asenl_ns_captions['compartida_observacion']),
    'compartida_tipo_observacion_id': fields.Integer(description=obs_ires_asenl_ns_captions['compartida_tipo_observacion_id']),
    'compartida_monto': fields.Float(description=obs_ires_asenl_ns_captions['compartida_monto']),
    'comentarios': fields.String(description=obs_ires_asenl_ns_captions['comentarios']),
    'clasif_final_cytg': fields.Integer(description=obs_ires_asenl_ns_captions['clasif_final_cytg']),
    'monto_solventado': fields.Float(description=obs_ires_asenl_ns_captions['monto_solventado']),
    'monto_pendiente_solventar': fields.Float(description=obs_ires_asenl_ns_captions['monto_pendiente_solventar']),
    'monto_a_reintegrar': fields.Float(description=obs_ires_asenl_ns_captions['monto_a_reintegrar']),
    'acciones': fields.List(fields.Integer(), description=obs_ires_asenl_ns_captions['acciones']),
    'recomendaciones': fields.String(description=obs_ires_asenl_ns_captions['recomendaciones']),
    'num_oficio_recomendacion': fields.String(description=obs_ires_asenl_ns_captions['num_oficio_recomendacion']),
    'fecha_oficio_recomendacion': fields.Date(description=obs_ires_asenl_ns_captions['fecha_oficio_recomendacion']),
    'fecha_vencimiento_enviar_asenl': fields.Date(description=obs_ires_asenl_ns_captions['fecha_vencimiento_enviar_asenl']),
    'num_oficio_dependencia': fields.String(description=obs_ires_asenl_ns_captions['num_oficio_dependencia']),
    'fecha_oficio_dependencia': fields.Date(description=obs_ires_asenl_ns_captions['fecha_oficio_dependencia']),
    'fecha_vencimiento_interna_cytg': fields.Date(description=obs_ires_asenl_ns_captions['fecha_vencimiento_interna_cytg']),
    'num_oficio_resp_dependencia': fields.String(description=obs_ires_asenl_ns_captions['num_oficio_resp_dependencia']),
    'fecha_acuse_resp_dependencia': fields.Date(description=obs_ires_asenl_ns_captions['fecha_acuse_resp_dependencia']),
    'resp_dependencia': fields.String(description=obs_ires_asenl_ns_captions['resp_dependencia']),
    'num_oficio_enviar_resp_asenl': fields.String(description=obs_ires_asenl_ns_captions['num_oficio_enviar_resp_asenl']),
    'fecha_oficio_enviar_resp_asenl': fields.Date(description=obs_ires_asenl_ns_captions['fecha_oficio_enviar_resp_asenl']),
    'unidad_investigadora': fields.String(description=obs_ires_asenl_ns_captions['unidad_investigadora']),
    'num_vai': fields.String(description=obs_ires_asenl_ns_captions['num_vai']),
    'tipificacion_id': fields.Integer(description=obs_ires_asenl_ns_captions['tipificacion_id']),
    'direccion_id': fields.Integer(description=obs_ires_asenl_ns_captions['direccion_id']),
    'auditoria_id': fields.Integer(description=obs_ires_asenl_ns_captions['auditoria_id']),
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

accion = api.model('Acción (ASENL)', {
    'id': fields.Integer(description='Id de la acción'),
    'title': fields.String(description='Siglas de la acción'),
    'description': fields.String(description='Nombre de la acción'),
})

clasif_final_pair = api.model('Par que asocia sorting_value y el title para la Clasificación interna CyTG', {
    'sorting_val': fields.Integer(description='Valor para ordenamiento'),
    'title': fields.String(description='Título de la Clasficación interna CyTG'),
})

clasif_final_cytg = api.model('Clasificaciones internas CyTG para una Dirección', {
    'direccion_id': fields.Integer(description='Id de la Dirección'),
    'clasifs_internas_pairs': fields.List(fields.Nested(clasif_final_pair)),
})

catalog = api.model('Leyendas y datos para la UI de Observaciones de la ASENL (Informe de Resultados)', {
    'clasifs_internas_cytg': fields.List(fields.Nested(clasif_final_cytg)),
    'observation_types': fields.List(fields.Nested(pair)),
    'audits': fields.List(fields.Nested(audit)),
    'dependencies': fields.List(fields.Nested(dependency)),
    'divisions': fields.List(fields.Nested(pair)),
    'acciones_asenl': fields.List(fields.Nested(accion)),
    'tipificaciones_ires_asenl': fields.List(fields.Nested(pair)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class ObservacionIResAsenlList(Resource):

    @ns.marshal_list_with(obs_ires_asenl)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("tipo_observacion_id", obs_ires_asenl_ns_captions['tipo_observacion_id'])
    @ns.param("observacion_final", obs_ires_asenl_ns_captions['observacion_final'])
    @ns.param("direccion_id", obs_ires_asenl_ns_captions['direccion_id'])
    @ns.param("auditoria_id", obs_ires_asenl_ns_captions['auditoria_id'])
    @ns.param("num_observacion", obs_ires_asenl_ns_captions['num_observacion'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (Informes de Resultados de la ASENL). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['tipo_observacion_id', 'observacion_final']
        )
        preliminar_search_params = get_search_params(
            request.args,
            ['direccion_id', 'auditoria_id', 'num_observacion']
        )

        try:
            obs_ires_asenl_list, total_items, total_pages = observaciones_ires_asenl.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page, preliminar_search_params
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_ires_asenl_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(obs_ires_asenl)
    @ns.marshal_with(obs_ires_asenl, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation (Informe de Resultados de la ASENL). '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asenl.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una observacion (Informe de Resultados de la ASENL)')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ObservacionIResAsenl(Resource):
    obs_not_found = 'Observación no encontrada'

    @ns.marshal_with(obs_ires_asenl)
    def get(self, id):
        ''' To fetch an observation (Informe de Resultados de la ASENL) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asenl.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionIResAsenl.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(obs_ires_asenl)
    @ns.marshal_with(obs_ires_asenl)
    def put(self, id):
        ''' To update an observation (Informe de Resultados de la ASENL) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asenl.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionIResAsenl.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.marshal_with(obs_ires_asenl)
    def delete(self, id):
        ''' To delete an observation (Informe de Resultados de la ASENL) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_asenl.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionIResAsenl.obs_not_found)
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
            field_catalog = observaciones_ires_asenl.get_catalogs([
                'clasifs_internas_cytg',
                'observation_types',
                'audits',
                'dependencies',
                'divisions',
                'acciones_asenl',
                'tipificaciones_ires_asenl',
            ])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
