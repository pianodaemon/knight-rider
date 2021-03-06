from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_pre_asf
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_pre_asf_ns_captions = {
    'id': 'Id de la observación de la ASF',
    'direccion_id': 'Id de la Dirección',
    'fecha_captura': 'Fecha de captura',
    'programa_social_id': 'Id del Programa Social',
    'auditoria_id': 'Id de la Auditoría',
    'num_oficio_of': 'Num. de Oficio del OF',
    'fecha_recibido': 'Fecha recibido (Acuse)',
    'fecha_vencimiento_of': 'Fecha de vencimiento (OF)',
    'num_observacion': 'Num. de Observación',
    'observacion': 'Observación',
    'monto_observado': 'Monto observado',
    'num_oficio_cytg': 'Num. de Oficio CyTG u OIC',
    'fecha_oficio_cytg': 'Fecha de Oficio CyTG',
    'fecha_recibido_dependencia': 'Fecha de recibido de la dependencia (Acuse)',
    'fecha_vencimiento': 'Fecha de vencimiento',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la dependencia',
    'fecha_oficio_resp_dependencia': 'Fecha de Oficio de respuesta',
    'resp_dependencia': 'Respuesta de la dependencia',
    'comentarios': 'Comentarios',
    'clasif_final_cytg': 'Clasificación final CyTG',
    'num_oficio_org_fiscalizador': 'Num. de Oficio para Órgano Fiscalizador',
    'fecha_oficio_org_fiscalizador': 'Fecha de Oficio para Órgano Fiscalizador',
    'estatus_criterio_int_id': 'Estatus (criterio interno)',
    'proyecciones': 'Proyecciones',
    'dependencia_id': 'Id de la Dependencia, indicada por la Auditoría',
    'anio_cuenta_pub': 'Año de la cuenta pública, indicada por la Auditoría',
}

ns = api.namespace("obs_pre_asf", description="Servicios disponibles para Observaciones de la ASF (Preliminares)")

obs_pre_asf = api.model('Observación de la ASF (Preliminar)', {
    'id': fields.Integer(description=obs_pre_asf_ns_captions['id']),
    'direccion_id': fields.Integer(description=obs_pre_asf_ns_captions['direccion_id']),
    'fecha_captura': fields.Date(description=obs_pre_asf_ns_captions['fecha_captura']),
    'programa_social_id': fields.Integer(description=obs_pre_asf_ns_captions['programa_social_id']),
    'auditoria_id': fields.Integer(description=obs_pre_asf_ns_captions['auditoria_id']),
    'num_oficio_of': fields.String(description=obs_pre_asf_ns_captions['num_oficio_of']),
    'fecha_recibido': fields.Date(description=obs_pre_asf_ns_captions['fecha_recibido']),
    'fecha_vencimiento_of': fields.Date(description=obs_pre_asf_ns_captions['fecha_vencimiento_of']),
    'num_observacion': fields.String(description=obs_pre_asf_ns_captions['num_observacion']),
    'observacion': fields.String(description=obs_pre_asf_ns_captions['observacion']),
    'monto_observado': fields.Float(description=obs_pre_asf_ns_captions['monto_observado']),
    'num_oficio_cytg': fields.String(description=obs_pre_asf_ns_captions['num_oficio_cytg']),
    'fecha_oficio_cytg': fields.Date(description=obs_pre_asf_ns_captions['fecha_oficio_cytg']),
    'fecha_recibido_dependencia': fields.Date(description=obs_pre_asf_ns_captions['fecha_recibido_dependencia']),
    'fecha_vencimiento': fields.Date(description=obs_pre_asf_ns_captions['fecha_vencimiento']),
    'num_oficio_resp_dependencia': fields.String(description=obs_pre_asf_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp_dependencia': fields.Date(description=obs_pre_asf_ns_captions['fecha_oficio_resp_dependencia']),
    'resp_dependencia': fields.String(description=obs_pre_asf_ns_captions['resp_dependencia']),
    'comentarios': fields.String(description=obs_pre_asf_ns_captions['comentarios']),
    'clasif_final_cytg': fields.Integer(description=obs_pre_asf_ns_captions['clasif_final_cytg']),
    'num_oficio_org_fiscalizador': fields.String(description=obs_pre_asf_ns_captions['num_oficio_org_fiscalizador']),
    'fecha_oficio_org_fiscalizador': fields.Date(description=obs_pre_asf_ns_captions['fecha_oficio_org_fiscalizador']),
    'estatus_criterio_int_id': fields.Integer(description=obs_pre_asf_ns_captions['estatus_criterio_int_id']),
    'proyecciones': fields.List(fields.Integer(), description=obs_pre_asf_ns_captions['proyecciones']),
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

program  = api.model('Programa social', {
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

catalog = api.model('Leyendas y datos para la UI de Observaciones de la ASF (Preliminares)', {
    'divisions': fields.List(fields.Nested(pair)),
    'audits': fields.List(fields.Nested(audit)),
    'dependencies': fields.List(fields.Nested(dependency)),
    'social_programs': fields.List(fields.Nested(program)),
    'clasifs_internas_cytg': fields.List(fields.Nested(clasif_interna_cytg)),
    'estatus_pre_asf': fields.List(fields.Nested(pair)),
    'proyecciones_asf': fields.List(fields.Nested(pair)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class ObservacionPreAsfList(Resource):

    @ns.marshal_list_with(obs_pre_asf)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("programa_social_id", obs_pre_asf_ns_captions['programa_social_id'])
    @ns.param("auditoria_id", obs_pre_asf_ns_captions['auditoria_id'])
    @ns.param("observacion", obs_pre_asf_ns_captions['observacion'])
    @ns.param("num_observacion", obs_pre_asf_ns_captions['num_observacion'])
    @ns.param("direccion_id", obs_pre_asf_ns_captions['direccion_id'])
    @ns.param("dependencia_id", obs_pre_asf_ns_captions['dependencia_id'])
    @ns.param("anio_cuenta_pub", obs_pre_asf_ns_captions['anio_cuenta_pub'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (preliminares de la ASF). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['programa_social_id', 'auditoria_id', 'observacion', 'num_observacion', 'direccion_id']
        )
        indirect_search_params = get_search_params(
            request.args,
            ['dependencia_id', 'anio_cuenta_pub']
        )

        try:
            obs_pre_asf_list, total_items, total_pages = observaciones_pre_asf.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page, indirect_search_params
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_pre_asf_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(obs_pre_asf)
    @ns.marshal_with(obs_pre_asf, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation (preliminar de la ASF). '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asf.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una observación (preliminar de la ASF)')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ObservacionPreAsf(Resource):
    obs_not_found = 'Observación no encontrada'

    @ns.marshal_with(obs_pre_asf)
    def get(self, id):
        ''' To fetch an observation (preliminar de la ASF) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asf.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionPreAsf.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(obs_pre_asf)
    @ns.marshal_with(obs_pre_asf)
    def put(self, id):
        ''' To update an observation (preliminar de la ASF) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asf.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionPreAsf.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.marshal_with(obs_pre_asf)
    def delete(self, id):
        ''' To delete an observation (preliminar de la ASF) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_asf.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionPreAsf.obs_not_found)
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
            field_catalog = observaciones_pre_asf.get_catalogs(
                [
                    'divisions',
                    'audits',
                    'dependencies',
                    'social_programs',
                    'clasifs_internas_cytg',
                    'estatus_pre_asf',
                    'proyecciones_asf',
                ],
                search_params
            )
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
