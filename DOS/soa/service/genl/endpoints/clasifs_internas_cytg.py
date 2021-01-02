from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import clasifs_internas_cytg
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


clasif_interna_ns_captions = {
    'org_fiscal_id': 'Id del órgano fiscalizador para la Clasificación interna',
    'direccion_id': 'Id de la dirección para la Clasificación interna',
    'sorting_val': 'Id de la Clasificación interna',
    'title': 'Título o siglas de la Clasificación interna',
}

ns = api.namespace("clasifs_internas", description="Servicios disponibles para las clasificaciones internas de CyTG")

clasif_interna = api.model('Clasificaciones internas de CyTG', {
    'org_fiscal_id': fields.Integer(description=clasif_interna_ns_captions['org_fiscal_id']),
    'direccion_id': fields.Integer(description=clasif_interna_ns_captions['direccion_id']),
    'sorting_val': fields.Integer(description=clasif_interna_ns_captions['sorting_val']),
    'title': fields.String(description=clasif_interna_ns_captions['title']),
})

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

catalog = api.model('Leyendas relacionadas con las Clasificaciones internas de CyTG', {
    'fiscals': fields.List(fields.Nested(pair)),
    'divisions': fields.List(fields.Nested(pair)),
})


@ns.route('/')
@ns.response(401, 'Unauthorized')
class ClasificacionInternaCyTGList(Resource):

    @ns.marshal_list_with(clasif_interna)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("org_fiscal_id", clasif_interna_ns_captions["org_fiscal_id"])
    @ns.param("direccion_id", clasif_interna_ns_captions["direccion_id"])
    @ns.param("title", clasif_interna_ns_captions["title"])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' Listado de clasificaciones internas de CyTG. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        offset   = request.args.get('offset',   '0'  )
        limit    = request.args.get('limit',    '10' )
        order_by = request.args.get('order_by', 'sorting_val')
        order    = request.args.get('order',    'ASC')
        per_page = request.args.get('per_page', '10' )
        page     = request.args.get('page',     '1'  )

        search_params = get_search_params(
            request.args,
            ['org_fiscal_id', 'direccion_id', 'title']
        )

        try:
            clasif_interna_list, total_items, total_pages = clasifs_internas_cytg.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return clasif_interna_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(clasif_interna)
    @ns.marshal_with(clasif_interna, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' Crear una Clasificación interna '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            clasif = clasifs_internas_cytg.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return clasif, 201



@ns.route('/<int:org_fiscal_id>/<int:direccion_id>/<int:id>')
@ns.param('id', 'Id de una Clasificación interna')
@ns.response(404, 'Clasificación interna not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ClasificacionInternaCyTG(Resource):
    clasif_not_found = 'Clasificación interna no encontrada'

    @ns.marshal_with(clasif_interna)
    def get(self, org_fiscal_id, direccion_id, id):
        ''' Recuperar una Clasificación interna '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            clasif = clasifs_internas_cytg.read(org_fiscal_id, direccion_id, id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=self.clasif_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return clasif


    @ns.expect(clasif_interna)
    @ns.marshal_with(clasif_interna)
    def put(self, org_fiscal_id, direccion_id, id):
        ''' Actualizar una Clasificación interna '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            clasif = clasifs_internas_cytg.update(org_fiscal_id, direccion_id, id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=self.clasif_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return clasif


    @ns.marshal_with(clasif_interna)
    def delete(self, org_fiscal_id, direccion_id, id):
        ''' Eliminar una Clasificación interna '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            clasif = clasifs_internas_cytg.delete(org_fiscal_id, direccion_id, id)
        except EmptySetError:
            ns.abort(404, message=self.clasif_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return clasif



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
            field_catalog = clasifs_internas_cytg.get_catalogs([
                'fiscals',
                'divisions',
            ])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
