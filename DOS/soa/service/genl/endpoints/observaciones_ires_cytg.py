from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_ires_cytg
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_ires_cytg_ns_captions = {
    'id': 'Id de la observacion de la CyTG (resultados)',
    'observacion_pre_id': 'Id de la observación preliminar vinculada a la presente observación de resultados',
    'num_observacion': 'Num. de observación',
    'observacion': 'Observación',
    'tipo_observacion_id': 'Id del tipo de observacion',
    'estatus_info_resultados_id': 'Estatus informe de resultados',
    'acciones_preventivas': 'Acciones preventivas',
    'acciones_correctivas': 'Acciones correctivas',
    'clasif_final_cytg': 'Clasificación final CyTG',
    'monto_solventado': 'Monto solventado (informe de resultados)',
    'monto_pendiente_solventar': 'Monto pendiente de solventar (informe de resultados)',
    'monto_a_reintegrar': 'Monto a reintegrar',
    'monto_reintegrado': 'Monto reintegrado',
    'fecha_reintegro': 'Fecha del reintegro',
    'monto_por_reintegrar': 'Monto por reintegrar',
    'num_oficio_cytg_aut_invest': 'Num. de Oficio de la CyTG para la Autoridad investigadora',
    'fecha_oficio_cytg_aut_invest': 'Fecha de Oficio de la CyTG para la Autoridad investigadora',
    'num_carpeta_investigacion': 'Num. de carpeta de investigación',
    'num_oficio_vai_municipio': 'Num. de Oficio VAI a municipio',
    'fecha_oficio_vai_municipio': 'Fecha de Oficio VAI a municipio',
    'num_oficio_pras_cytg_dependencia': 'Num. de Oficio PRAS/PFRA de la CyTG para la Dependencia',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la Dependencia',
    'fecha_oficio_resp_dependencia': 'Fecha de Oficio de respuesta de la Dependencia',

    'observacion_id': 'Id de la observación de informe de resultados a la que pertenece el seguimiento',
    'seguimiento_id': 'Id del seguimiento',
    'num_oficio_ires': 'Num. de Oficio del informe de resultados/cédula de seguimiento',
    'fecha_notif_ires': 'Fecha de notificación (acuse)',
    'fecha_vencimiento_ires': 'Fecha de vencimiento (resultados/cédula)',
    'prorroga': 'Prórroga (Sí o No)',
    'num_oficio_solic_prorroga': 'Num. de Oficio de Solicitud de prórroga',
    'fecha_oficio_solic_prorroga': 'Fecha de Oficio de Solicitud de prórroga (acuse)',
    'num_oficio_contest_prorroga': 'Num. de Oficio de Contestación de prórroga',
    'fecha_oficio_contest': 'Fecha de Oficio de Contestación de prórroga',
    'fecha_vencimiento_ires_nueva': 'Fecha de nuevo vencimiento (informe de resultados)',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la Dependencia',
    'fecha_oficio_resp_dependencia': 'Fecha de Oficio de respuesta de la Dependencia',
    'resp_dependencia': 'Respuesta de la Dependencia',
    'comentarios': 'Comentarios',
    'estatus_seguimiento_id': 'Id del estatus del seguimiento',
    'monto_solventado': 'Monto solventado',
    'monto_pendiente_solventar': 'Monto pendiente de solventar',
    
    'seguimientos': 'Seguimientos (lista de cédulas)',
    'direccion_id': 'Id de la dirección (según obs preliminar)',
    'auditoria_id': 'Id de la auditoría (según obs preliminar)',
    'programa_social_id': 'Id del programa social (según obs preliminar)',
}

ns = api.namespace("obs_ires_cytg", description="Servicios disponibles para Observaciones de la CyTG (Informe de Resultados)")

seguimiento = api.model('Seguimiento de una Observación CyTG (resultados)', {
    'observacion_id': fields.Integer(description=obs_ires_cytg_ns_captions['observacion_id']),
    'seguimiento_id': fields.Integer(description=obs_ires_cytg_ns_captions['seguimiento_id']),
    'num_oficio_ires': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_ires']),
    'fecha_notif_ires': fields.Date(description=obs_ires_cytg_ns_captions['fecha_notif_ires']),
    'fecha_vencimiento_ires': fields.Date(description=obs_ires_cytg_ns_captions['fecha_vencimiento_ires']),
    'prorroga': fields.Boolean(description=obs_ires_cytg_ns_captions['prorroga']),
    'num_oficio_solic_prorroga': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_solic_prorroga']),
    'fecha_oficio_solic_prorroga': fields.Date(description=obs_ires_cytg_ns_captions['fecha_oficio_solic_prorroga']),
    'num_oficio_contest_prorroga': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_contest_prorroga']),
    'fecha_oficio_contest': fields.Date(description=obs_ires_cytg_ns_captions['fecha_oficio_contest']),
    'fecha_vencimiento_ires_nueva': fields.Date(description=obs_ires_cytg_ns_captions['fecha_vencimiento_ires_nueva']),
    'num_oficio_resp_dependencia': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp_dependencia': fields.Date(description=obs_ires_cytg_ns_captions['fecha_oficio_resp_dependencia']),
    'resp_dependencia': fields.String(description=obs_ires_cytg_ns_captions['resp_dependencia']),
    'comentarios': fields.String(description=obs_ires_cytg_ns_captions['comentarios']),
    'estatus_seguimiento_id': fields.Integer(description=obs_ires_cytg_ns_captions['estatus_seguimiento_id']),
    'monto_solventado': fields.Float(description=obs_ires_cytg_ns_captions['monto_solventado']),
    'monto_pendiente_solventar': fields.Float(description=obs_ires_cytg_ns_captions['monto_pendiente_solventar']),
    'monto_a_reintegrar': fields.Float(description=obs_ires_cytg_ns_captions['monto_a_reintegrar']),
    'monto_reintegrado': fields.Float(description=obs_ires_cytg_ns_captions['monto_reintegrado']),
    'fecha_reintegro': fields.Date(description=obs_ires_cytg_ns_captions['fecha_reintegro']),
    'monto_por_reintegrar': fields.Float(description=obs_ires_cytg_ns_captions['monto_por_reintegrar']),
})

obs_ires_cytg = api.model('Observación CyTG (resultados)', {
    'id': fields.Integer(description=obs_ires_cytg_ns_captions['id']),
    'observacion_pre_id': fields.Integer(description=obs_ires_cytg_ns_captions['observacion_pre_id']),
    'num_observacion': fields.String(description=obs_ires_cytg_ns_captions['num_observacion']),
    'observacion': fields.String(description=obs_ires_cytg_ns_captions['observacion']),
    'tipo_observacion_id': fields.Integer(description=obs_ires_cytg_ns_captions['tipo_observacion_id']),
    'estatus_info_resultados_id': fields.Integer(description=obs_ires_cytg_ns_captions['estatus_info_resultados_id']),
    'acciones_preventivas': fields.String(description=obs_ires_cytg_ns_captions['acciones_preventivas']),
    'acciones_correctivas': fields.String(description=obs_ires_cytg_ns_captions['acciones_correctivas']),
    'clasif_final_cytg': fields.Integer(description=obs_ires_cytg_ns_captions['clasif_final_cytg']),
    'monto_solventado': fields.Float(description=obs_ires_cytg_ns_captions['monto_solventado']),
    'monto_pendiente_solventar': fields.Float(description=obs_ires_cytg_ns_captions['monto_pendiente_solventar']),
    'monto_a_reintegrar': fields.Float(description=obs_ires_cytg_ns_captions['monto_a_reintegrar']),
    'monto_reintegrado': fields.Float(description=obs_ires_cytg_ns_captions['monto_reintegrado']),
    'fecha_reintegro': fields.Date(description=obs_ires_cytg_ns_captions['fecha_reintegro']),
    'monto_por_reintegrar': fields.Float(description=obs_ires_cytg_ns_captions['monto_por_reintegrar']),
    'num_oficio_cytg_aut_invest': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_cytg_aut_invest']),
    'fecha_oficio_cytg_aut_invest': fields.Date(description=obs_ires_cytg_ns_captions['fecha_oficio_cytg_aut_invest']),
    'num_carpeta_investigacion': fields.String(description=obs_ires_cytg_ns_captions['num_carpeta_investigacion']),
    'num_oficio_vai_municipio': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_vai_municipio']),
    'fecha_oficio_vai_municipio': fields.Date(description=obs_ires_cytg_ns_captions['fecha_oficio_vai_municipio']),
    'num_oficio_pras_cytg_dependencia': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_pras_cytg_dependencia']),
    'num_oficio_resp_dependencia': fields.String(description=obs_ires_cytg_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp_dependencia': fields.Date(description=obs_ires_cytg_ns_captions['fecha_oficio_resp_dependencia']),
    'seguimientos': fields.List(fields.Nested(seguimiento), description=obs_ires_cytg_ns_captions['seguimientos']),
    'direccion_id': fields.Integer(description=obs_ires_cytg_ns_captions['direccion_id']),
    'auditoria_id': fields.Integer(description=obs_ires_cytg_ns_captions['auditoria_id']),
    'programa_social_id': fields.Integer(description=obs_ires_cytg_ns_captions['programa_social_id']),
})


pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

audit = api.model('Datos de una Auditoría', {
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

catalog = api.model('Leyendas y datos para la UI de Observaciones CyTG (resultados)', {
    'estatus_ires_cytg': fields.List(fields.Nested(pair)),
    'clasifs_internas_cytg': fields.List(fields.Nested(clasif_interna_cytg)),
    'observation_types': fields.List(fields.Nested(pair)),
    'audits': fields.List(fields.Nested(audit)),
    'dependencies': fields.List(fields.Nested(dependency)),
    'divisions': fields.List(fields.Nested(pair)),
    'social_programs': fields.List(fields.Nested(program)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class ObservacionCyTGList(Resource):

    @ns.marshal_list_with(obs_ires_cytg)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("tipo_observacion_id", obs_ires_cytg_ns_captions['tipo_observacion_id'])
    @ns.param("observacion", obs_ires_cytg_ns_captions['observacion'])
    @ns.param("direccion_id", obs_ires_cytg_ns_captions['direccion_id'])
    @ns.param("auditoria_id", obs_ires_cytg_ns_captions['auditoria_id'])
    @ns.param("num_observacion", obs_ires_cytg_ns_captions['num_observacion'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (CyTG (resultados)). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['tipo_observacion_id', 'observacion']
        )
        preliminar_search_params = get_search_params(
            request.args,
            ['direccion_id', 'auditoria_id', 'num_observacion']
        )

        try:
            obs_ires_cytg_list, total_items, total_pages = observaciones_ires_cytg.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page, preliminar_search_params
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_ires_cytg_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(obs_ires_cytg)
    @ns.marshal_with(obs_ires_cytg, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation (CyTG (resultados)). '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_cytg.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una observacion (CyTG (resultados))')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ObservacionCyTG(Resource):
    obs_not_found = 'Observacion no encontrada'

    @ns.marshal_with(obs_ires_cytg)
    def get(self, id):
        ''' To fetch an observation (CyTG (resultados)) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_cytg.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionCyTG.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(obs_ires_cytg)
    @ns.marshal_with(obs_ires_cytg)
    def put(self, id):
        ''' To update an observation (CyTG (resultados)) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_cytg.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionCyTG.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.marshal_with(obs_ires_cytg)
    def delete(self, id):
        ''' To delete an observation (CyTG (resultados)) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            obs = observaciones_ires_cytg.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionCyTG.obs_not_found)
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
            field_catalog = observaciones_ires_cytg.get_catalogs([
                'estatus_ires_cytg',
                'clasifs_internas_cytg',
                'observation_types',
                'audits',
                'dependencies',
                'divisions',
                'social_programs',
            ])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
