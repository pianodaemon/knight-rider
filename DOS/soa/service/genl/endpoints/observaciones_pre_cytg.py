from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_pre_cytg
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_pre_cytg_ns_captions = {
    'id': 'Id de la observación de la CyTG',
    'periodo_revision_de': 'Periodo de revision (de)',
    'periodo_revision_a': 'Periodo de revision (a)',
    'direccion_id': 'Id de la Dirección',
    'fecha_captura': 'Fecha captura',
    'programa_social_id': 'Programa/Rubro',
    'auditoria_id': 'Id de la Auditoría',
    'tipo_auditoria_id': 'Tipo de Auditoría',
    'num_oficio_inicio': 'Num. de Oficio de Inicio',
    'fecha_notificacion_inicio': 'Fecha de notificación (acuse)',
    'fecha_vencimiento_nombra_enlace': 'Fecha de vencimiento (Nombramiento de enlace)',
    'num_oficio_requerimiento': 'Num. de Oficio de requerimiento',
    'fecha_notificacion_requerimiento': 'Fecha de notificación de requerimiento (acuse)',
    'fecha_vencimiento_requerimiento': 'Fecha de vencimiento (requerimiento)',
    'fecha_vencimiento_nueva': 'Fecha de nuevo vencimiento',
    'tipo_observacion_id': 'Tipo de observación preliminar',
    'num_observacion': 'Num. de observación',
    'observacion': 'Observación',
    'monto_observado': 'Monto observado',
    'num_oficio_cytg_oic_pre': 'Num. de Oficio CyTG u OIC de informe preliminar',
    'fecha_oficio_cytg_pre': 'Fecha de Oficio CyTG informe preliminar',
    'fecha_recibido_dependencia': 'Fecha de recibido de la dependencia (acuse)',
    'fecha_vencimiento_pre': 'Fecha de vencimiento (preliminares)',
    'prorroga': 'Prórroga (Sí o No)',
    'num_oficio_solic_prorroga': 'Num. de Oficio de Solicitud de prórroga',
    'fecha_oficio_solic_prorroga': 'Fecha de Oficio de Solicitud de prórroga',
    'num_oficio_contest_prorroga_cytg': 'Num. de Oficio de Contestación de prórroga',
    'fecha_oficio_contest_cytg': 'Fecha de Contestación CyTG',
    'fecha_vencimiento_pre_nueva': 'Fecha de nuevo vencimiento (informe preliminar)',
    'clasif_pre_cytg': 'Clasificación (preliminar) CyTG',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la dependencia',
    'fecha_oficio_resp': 'Fecha de Oficio de respuesta (acuse)',
    'resp_dependencia': 'Respuesta de la dependencia',
    'comentarios': 'Comentarios',
    'observacion_ires_id': 'Id de la observación de informe de resultados correspondiente',
}

ns = api.namespace("obs_pre_cytg", description="Servicios disponibles para Observaciones de la CyTG (Preliminares)")

obs_pre_cytg = api.model('Observación de la CyTG (Preliminar)', {
    'id': fields.Integer(description=obs_pre_cytg_ns_captions['id']),
    'periodo_revision_de': fields.Date(description=obs_pre_cytg_ns_captions['periodo_revision_de']),
    'periodo_revision_a': fields.Date(description=obs_pre_cytg_ns_captions['periodo_revision_a']),
    'direccion_id': fields.Integer(description=obs_pre_cytg_ns_captions['direccion_id']),
    'fecha_captura': fields.Date(description=obs_pre_cytg_ns_captions['fecha_captura']),
    'programa_social_id': fields.Integer(description=obs_pre_cytg_ns_captions['programa_social_id']),
    'auditoria_id': fields.Integer(description=obs_pre_cytg_ns_captions['auditoria_id']),
    'tipo_auditoria_id': fields.Integer(description=obs_pre_cytg_ns_captions['tipo_auditoria_id']),
    'num_oficio_inicio': fields.String(description=obs_pre_cytg_ns_captions['num_oficio_inicio']),
    'fecha_notificacion_inicio': fields.Date(description=obs_pre_cytg_ns_captions['fecha_notificacion_inicio']),
    'fecha_vencimiento_nombra_enlace': fields.Date(description=obs_pre_cytg_ns_captions['fecha_vencimiento_nombra_enlace']),
    'num_oficio_requerimiento': fields.String(description=obs_pre_cytg_ns_captions['num_oficio_requerimiento']),
    'fecha_notificacion_requerimiento': fields.Date(description=obs_pre_cytg_ns_captions['fecha_notificacion_requerimiento']),
    'fecha_vencimiento_requerimiento': fields.Date(description=obs_pre_cytg_ns_captions['fecha_vencimiento_requerimiento']),
    'fecha_vencimiento_nueva': fields.Date(description=obs_pre_cytg_ns_captions['fecha_vencimiento_nueva']),
    'tipo_observacion_id': fields.Integer(description=obs_pre_cytg_ns_captions['tipo_observacion_id']),
    'num_observacion': fields.String(description=obs_pre_cytg_ns_captions['num_observacion']),
    'observacion': fields.String(description=obs_pre_cytg_ns_captions['observacion']),
    'monto_observado': fields.Float(description=obs_pre_cytg_ns_captions['monto_observado']),
    'num_oficio_cytg_oic_pre': fields.String(description=obs_pre_cytg_ns_captions['num_oficio_cytg_oic_pre']),
    'fecha_oficio_cytg_pre': fields.Date(description=obs_pre_cytg_ns_captions['fecha_oficio_cytg_pre']),
    'fecha_recibido_dependencia': fields.Date(description=obs_pre_cytg_ns_captions['fecha_recibido_dependencia']),
    'fecha_vencimiento_pre': fields.Date(description=obs_pre_cytg_ns_captions['fecha_vencimiento_pre']),
    'prorroga': fields.Boolean(description=obs_pre_cytg_ns_captions['prorroga']),
    'num_oficio_solic_prorroga': fields.String(description=obs_pre_cytg_ns_captions['num_oficio_solic_prorroga']),
    'fecha_oficio_solic_prorroga': fields.Date(description=obs_pre_cytg_ns_captions['fecha_oficio_solic_prorroga']),
    'num_oficio_contest_prorroga_cytg': fields.String(description=obs_pre_cytg_ns_captions['num_oficio_contest_prorroga_cytg']),
    'fecha_oficio_contest_cytg': fields.Date(description=obs_pre_cytg_ns_captions['fecha_oficio_contest_cytg']),
    'fecha_vencimiento_pre_nueva': fields.Date(description=obs_pre_cytg_ns_captions['fecha_vencimiento_pre_nueva']),
    'clasif_pre_cytg': fields.Integer(description=obs_pre_cytg_ns_captions['clasif_pre_cytg']),
    'num_oficio_resp_dependencia': fields.String(description=obs_pre_cytg_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp': fields.Date(description=obs_pre_cytg_ns_captions['fecha_oficio_resp']),
    'resp_dependencia': fields.String(description=obs_pre_cytg_ns_captions['resp_dependencia']),
    'comentarios': fields.String(description=obs_pre_cytg_ns_captions['comentarios']),
    'observacion_ires_id': fields.Integer(description=obs_pre_cytg_ns_captions['observacion_ires_id']),
})

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

audit = api.model('Datos de una auditoría', {
    'id': fields.Integer(description='Id de la auditoría'),
    'title': fields.String(description='Título de la auditoría'),
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

catalog = api.model('Leyendas y datos para la UI de Observaciones de la CyTG (Preliminares)', {
    'divisions': fields.List(fields.Nested(pair)),
    'audits': fields.List(fields.Nested(audit)),
    'auditoria_tipos_cytg': fields.List(fields.Nested(pair)),
    'dependencies': fields.List(fields.Nested(dependency)),
    'social_programs': fields.List(fields.Nested(program)),
    'clasifs_internas_cytg': fields.List(fields.Nested(clasif_interna_cytg)),
    'observation_types': fields.List(fields.Nested(pair)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class ObservacionPreCytgList(Resource):

    @ns.marshal_list_with(obs_pre_cytg)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("programa_social_id", obs_pre_cytg_ns_captions['programa_social_id'])
    @ns.param("auditoria_id", obs_pre_cytg_ns_captions['auditoria_id'])
    @ns.param("observacion", obs_pre_cytg_ns_captions['observacion'])
    @ns.param("direccion_id", obs_pre_cytg_ns_captions['direccion_id'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (preliminares de la CyTG). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['programa_social_id', 'auditoria_id', 'observacion', 'direccion_id']
        )

        try:
            obs_pre_cytg_list, total_items, total_pages = observaciones_pre_cytg.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_pre_cytg_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(obs_pre_cytg)
    @ns.marshal_with(obs_pre_cytg, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation (preliminar de la CyTG). '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_cytg.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una observación (preliminar de la CyTG)')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ObservacionPreCytg(Resource):
    obs_not_found = 'Observación no encontrada'

    @ns.marshal_with(obs_pre_cytg)
    def get(self, id):
        ''' To fetch an observation (preliminar de la CyTG) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_cytg.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionPreCytg.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(obs_pre_cytg)
    @ns.marshal_with(obs_pre_cytg)
    def put(self, id):
        ''' To update an observation (preliminar de la CyTG) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_cytg.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionPreCytg.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.marshal_with(obs_pre_cytg)
    def delete(self, id):
        ''' To delete an observation (preliminar de la CyTG) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_pre_cytg.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionPreCytg.obs_not_found)
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
            field_catalog = observaciones_pre_cytg.get_catalogs([
                'divisions',
                'audits',
                'auditoria_tipos_cytg',
                'dependencies',
                'social_programs',
                'clasifs_internas_cytg',
                'observation_types',
            ])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
