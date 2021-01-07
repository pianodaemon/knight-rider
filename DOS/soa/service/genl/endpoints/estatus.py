from flask_restplus import Resource, fields
from flask import request

from genl.restplus import api
from dal import estatus
from misc.helper import get_search_params, verify_token
from misc.helperpg import EmptySetError

estatus_captions = {
    'org_fiscal_id': 'Id del órgano fiscalizador',
    'pre_ires': 'Preliminar o Informe de Resultados {pre | ires}',
    'id': 'Id del estatus',
    'title': 'Título del estatus',
}

ns = api.namespace("estatus", description="Servicios disponibles para el catálogo de estatus")

estatus_model = api.model('Estatus', {
    'org_fiscal_id': fields.Integer(description=estatus_captions['org_fiscal_id']),
    'pre_ires': fields.String(description=estatus_captions['pre_ires']),
    'id': fields.Integer(description=estatus_captions['id']),
    'title': fields.String(description=estatus_captions['title']),
})

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

catalog = api.model('Leyendas relacionadas al catálogo de Estatus', {
    'fiscals': fields.List(fields.Nested(pair)),
})


@ns.route('/')
@ns.response(401, 'Unauthorized')
class EstatusList(Resource):

    @ns.marshal_list_with(estatus_model)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("org_fiscal_id", estatus_captions['org_fiscal_id'])
    @ns.param("pre_ires", estatus_captions['pre_ires'])
    @ns.param("title", estatus_captions['title'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' Listado de estatus. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        offset   = request.args.get('offset',   '0'  )
        limit    = request.args.get('limit',    '10' )
        order_by = request.args.get('order_by', 'id' )
        order    = request.args.get('order',    'ASC')
        per_page = request.args.get('per_page', '10' )
        page     = request.args.get('page',     '1'  )

        search_params = get_search_params(
            request.args,
            ['org_fiscal_id', 'pre_ires', 'title']
        )

        try:
            estatus_list, total_items, total_pages = estatus.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except EmptySetError as err:
            ns.abort(404, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return estatus_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(estatus_model)
    @ns.marshal_with(estatus_model, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' Crear un Estatus '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            estat = estatus.create(**api.payload)
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return estat, 201



@ns.route('/<int:org_fiscal_id>/<string:pre_ires>/<int:id>')
@ns.param('org_fiscal_id', estatus_captions['org_fiscal_id'])
@ns.param('pre_ires', estatus_captions['pre_ires'])
@ns.param('id', estatus_captions['id'])
@ns.response(404, 'Estatus not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class Estatus(Resource):
    estatus_not_found = 'Estatus no encontrado'

    @ns.marshal_with(estatus_model)
    def get(self, org_fiscal_id, pre_ires, id):
        ''' Recuperar un Estatus '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            estat = estatus.read(org_fiscal_id, pre_ires, id)
        except EmptySetError:
            ns.abort(404, message=self.estatus_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return estat


    @ns.expect(estatus_model)
    @ns.marshal_with(estatus_model)
    def put(self, org_fiscal_id, pre_ires, id):
        ''' Actualizar un Estatus '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            estat = estatus.update(org_fiscal_id, pre_ires, id, **api.payload)
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=self.estatus_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return estat


    @ns.marshal_with(estatus_model)
    def delete(self, org_fiscal_id, pre_ires, id):
        ''' Eliminar un Estatus '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            estat = estatus.delete(org_fiscal_id, pre_ires, id)
        except EmptySetError:
            ns.abort(404, message=self.estatus_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return estat



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
            field_catalog = estatus.get_catalogs(['fiscals'])
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
