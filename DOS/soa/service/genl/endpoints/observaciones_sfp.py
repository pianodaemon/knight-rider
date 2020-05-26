from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observaciones_sfp
from misc.helper import get_search_params
from misc.helperpg import get_msg_pgerror, EmptySetError


obs_sfp_ns_captions = {
    'id': 'Id de la observacion de la SFP',
    'direccion_id': 'Id de la Direccion',
    'dependencia_id': 'Id de la Dependencia',
    'fecha_captura': 'Fecha de captura',
    'programa_social_id': 'Id del Programa Social',
    'auditoria_id': 'Id de la Auditoria',
    'acta_cierre': 'Acta de cierre o equivalente',
    'fecha_firma_acta_cierre': 'Fecha de firma del Acta de cierre',
    'fecha_compromiso': 'Fecha compromiso',
    'clave_observacion_id': 'Id de la clave de observacion',
    'observacion': 'Texto de la observacion',
    'acciones_correctivas': 'Acciones correctivas',
    'acciones_preventivas': 'Acciones preventivas',
    'tipo_observacion_id': 'Id del tipo de observacion',
    'monto_observado': 'Monto observado',
    'monto_a_reintegrar': 'Monto a reintegrar',
    'monto_reintegrado': 'Monto reintegrado',
    'fecha_reintegro': 'Fecha de reintegro',
    'monto_por_reintegrar': 'Monto por reintegrar',
    'num_oficio_of_vista_cytg': 'Num. de Oficio del OF que da vista a la CyTG',
    'fecha_oficio_of_vista_cytg': 'Fecha de Oficio del OF que da vista a la CyTG',
    'num_oficio_cytg_aut_invest': 'Num. de Oficio de la CyTG para la Autoridad Investigadora',
    'fecha_oficio_cytg_aut_invest': 'Fecha de Oficio de la CyTG para la Autoridad Investigadora',
    'num_carpeta_investigacion': 'Num. de Carpeta de Investigacion',
    'num_oficio_vai_municipio': 'Num. de Oficio VAI a Municipio',
    'fecha_oficio_vai_municipio': 'Fecha de Oficio VAI a Municipio',
    'autoridad_invest_id': 'Autoridad Investigadora',
    'num_oficio_pras_of': 'Num. de Oficio de PRAS del OF',
    'fecha_oficio_pras_of': 'Fecha de Oficio de PRAS del OF',
    'num_oficio_pras_cytg_dependencia': 'Num. de Oficio PRAS de la CyTG para la Dependencia',
    'num_oficio_resp_dependencia': 'Num. de Oficio de respuesta de la Dependencia',
    'fecha_oficio_resp_dependencia': 'Fecha de Oficio de respuesta de la Dependencia',
}

ns = api.namespace("obs_sfp", description="Servicios disponibles para observaciones de la SFP (Informe de Resultados)")

obs_sfp_fields = {
    'id': fields.Integer(description=obs_sfp_ns_captions['id']),
    'direccion_id': fields.Integer(description=obs_sfp_ns_captions['direccion_id']),
    'dependencia_id': fields.String(description=obs_sfp_ns_captions['dependencia_id']),
    'fecha_captura': fields.Date(description=obs_sfp_ns_captions['fecha_captura']),
    'programa_social_id': fields.Integer(description=obs_sfp_ns_captions['programa_social_id']),
    'auditoria_id': fields.Integer(description=obs_sfp_ns_captions['auditoria_id']),
    'acta_cierre': fields.String(description=obs_sfp_ns_captions['acta_cierre']),
    'fecha_firma_acta_cierre': fields.Date(description=obs_sfp_ns_captions['fecha_firma_acta_cierre']),
    'fecha_compromiso': fields.Date(description=obs_sfp_ns_captions['fecha_compromiso']),
    'clave_observacion_id': fields.Integer(description=obs_sfp_ns_captions['clave_observacion_id']),
    'observacion': fields.String(description=obs_sfp_ns_captions['observacion']),
    'acciones_correctivas': fields.String(description=obs_sfp_ns_captions['acciones_correctivas']),
    'acciones_preventivas': fields.String(description=obs_sfp_ns_captions['acciones_preventivas']),
    'tipo_observacion_id': fields.Integer(description=obs_sfp_ns_captions['tipo_observacion_id']),
    'monto_observado': fields.Float(description=obs_sfp_ns_captions['monto_observado']),
    'monto_a_reintegrar': fields.Float(description=obs_sfp_ns_captions['monto_a_reintegrar']),
    'monto_reintegrado': fields.Float(description=obs_sfp_ns_captions['monto_reintegrado']),
    'fecha_reintegro': fields.Date(description=obs_sfp_ns_captions['fecha_reintegro']),
    'monto_por_reintegrar': fields.Float(description=obs_sfp_ns_captions['monto_por_reintegrar']),
    'num_oficio_of_vista_cytg': fields.String(description=obs_sfp_ns_captions['num_oficio_of_vista_cytg']),
    'fecha_oficio_of_vista_cytg': fields.Date(description=obs_sfp_ns_captions['fecha_oficio_of_vista_cytg']),
    'num_oficio_cytg_aut_invest': fields.String(description=obs_sfp_ns_captions['num_oficio_cytg_aut_invest']),
    'fecha_oficio_cytg_aut_invest': fields.Date(description=obs_sfp_ns_captions['fecha_oficio_cytg_aut_invest']),
    'num_carpeta_investigacion': fields.String(description=obs_sfp_ns_captions['num_carpeta_investigacion']),
    'num_oficio_vai_municipio': fields.String(description=obs_sfp_ns_captions['num_oficio_vai_municipio']),
    'fecha_oficio_vai_municipio': fields.Date(description=obs_sfp_ns_captions['fecha_oficio_vai_municipio']),
    'autoridad_invest_id': fields.Integer(description=obs_sfp_ns_captions['autoridad_invest_id']),
    'num_oficio_pras_of': fields.String(description=obs_sfp_ns_captions['num_oficio_pras_of']),
    'fecha_oficio_pras_of': fields.Date(description=obs_sfp_ns_captions['fecha_oficio_pras_of']),
    'num_oficio_pras_cytg_dependencia': fields.String(description=obs_sfp_ns_captions['num_oficio_pras_cytg_dependencia']),
    'num_oficio_resp_dependencia': fields.String(description=obs_sfp_ns_captions['num_oficio_resp_dependencia']),
    'fecha_oficio_resp_dependencia': fields.Date(description=obs_sfp_ns_captions['fecha_oficio_resp_dependencia']),
}
obs_sfp = api.model('Observacion SFP', obs_sfp_fields)

usr_fields_ext = dict(obs_sfp_fields)
usr_fields_ext['access_vector'] = fields.List(fields.Integer(description='Authority id'), required=True)
user_ext = api.model('Extended User', usr_fields_ext)

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

pair2 = api.model('Id-Description pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'description': fields.String(description='Entry description'),
})

catalog = api.model('Users screen data (catalog of Id-Title pairs for screen fields)', {
    'divisions': fields.List(fields.Nested(pair)),
    'orgchart_roles': fields.List(fields.Nested(pair)),
    'authorities': fields.List(fields.Nested(pair2)),
})

@ns.route('/')
class ObservacionSfpList(Resource):

    @ns.marshal_list_with(obs_sfp)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("tipo_observacion_id", obs_sfp_ns_captions['tipo_observacion_id'])
    @ns.param("programa_social_id", obs_sfp_ns_captions['programa_social_id'])
    @ns.param("auditoria_id", obs_sfp_ns_captions['auditoria_id'])
    @ns.param("observacion", obs_sfp_ns_captions['observacion'])
    @ns.param("clave_observacion_id", obs_sfp_ns_captions['clave_observacion_id'])
    @ns.param("direccion_id", obs_sfp_ns_captions['direccion_id'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations (SFP). On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''

        offset = request.args.get('offset', '0')
        limit = request.args.get('limit', '10')
        order_by = request.args.get('order_by', 'id')
        order = request.args.get('order', 'ASC')
        per_page = request.args.get('per_page', '10')
        page = request.args.get('page', '1')

        search_params = get_search_params(
            request.args,
            ['tipo_observacion_id', 'programa_social_id', 'auditoria_id', 'observacion', 'clave_observacion_id', 'direccion_id']
        )

        try:
            obs_sfp_list, total_items, total_pages = observaciones_sfp.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_sfp_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(user_ext)
    @ns.marshal_with(user_ext, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' Not available yet. To create a user. Key \'disabled\' is ignored as this is automatically set to false at creation '''
        try:
            usr = observaciones_sfp.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr, 201



@ns.route('/<int:id>')
@ns.param('id', 'User identifier')
@ns.response(404, 'User not found')
@ns.response(400, 'There is a problem with your request data')
class ObservacionSfp(Resource):
    obs_not_found = 'Observacion no encontrada'

    @ns.marshal_with(user_ext)
    def get(self, id):
        ''' Not available yet. To fetch a user '''
        try:
            usr = observaciones_sfp.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionSfp.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr


    @ns.expect(user_ext)
    @ns.marshal_with(user_ext)
    def put(self, id):
        ''' Not available yet. To update a user '''
        try:
            usr = observaciones_sfp.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=ObservacionSfp.obs_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr


    @ns.marshal_with(user_ext)
    def delete(self, id):
        ''' Not available yet. To delete a user '''
        try:
            usr = observaciones_sfp.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=ObservacionSfp.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr



@ns.route('/catalog')
@ns.response(500, 'Server error')
class Catalog(Resource):

    @ns.marshal_with(catalog)
    def get(self):
        ''' Not available yet. To fetch an object containing data for screen fields (key: table name, value: list of table rows) '''
        try:
            field_catalog = observaciones_sfp.get_catalogs(['divisions', 'orgchart_roles', 'authorities'])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
