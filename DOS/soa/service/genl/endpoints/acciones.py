from flask_restplus import Resource, fields
from flask import request

from genl.restplus import api
from dal import acciones
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


ns = api.namespace("acciones", description="Servicios disponibles para el catálogo de acciones (ASF y ASENL)")

accion = api.model('Acción (ASENL)', {
    'org_fiscal_id': fields.Integer(description='Id del órgano fiscalizador'),
    'id': fields.Integer(description='Id de la acción'),
    'title': fields.String(description='Siglas de la acción'),
    'description': fields.String(description='Nombre de la acción'),
})

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

catalog = api.model('Leyendas relacionadas al catálogo de Acciones (ASF y ASENL)', {
    'fiscals': fields.List(fields.Nested(pair)),
})


@ns.route('/')
@ns.response(401, 'Unauthorized')
class AccionList(Resource):

    @ns.marshal_list_with(accion)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("org_fiscal_id", "Id del órgano fiscalizador para la acción")
    @ns.param("title", "Título o siglas de la acción")
    @ns.param("description", "Descripción de la acción")
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' Listado de acciones. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['org_fiscal_id', 'title', 'description']
        )

        try:
            accion_list, total_items, total_pages = acciones.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except EmptySetError as err:
            ns.abort(404, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return accion_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(accion)
    @ns.marshal_with(accion, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' Crear una Acción '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            acc = acciones.create(**api.payload)
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return acc, 201



@ns.route('/<int:org_fiscal_id>/<int:id>')
@ns.param('id', 'Id de una Acción')
@ns.response(404, 'Acción not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class Accion(Resource):
    accion_not_found = 'Acción no encontrada'

    @ns.marshal_with(accion)
    def get(self, org_fiscal_id, id):
        ''' Recuperar una Acción '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            acc = acciones.read(org_fiscal_id, id)
        except EmptySetError:
            ns.abort(404, message=self.accion_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return acc


    @ns.expect(accion)
    @ns.marshal_with(accion)
    def put(self, org_fiscal_id, id):
        ''' Actualizar una Acción '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            acc = acciones.update(org_fiscal_id, id, **api.payload)
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=self.accion_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return acc


    @ns.marshal_with(accion)
    def delete(self, org_fiscal_id, id):
        ''' Eliminar una Acción '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            acc = acciones.delete(org_fiscal_id, id)
        except EmptySetError:
            ns.abort(404, message=self.accion_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return acc



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
            field_catalog = acciones.get_catalogs(['fiscals'])
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
