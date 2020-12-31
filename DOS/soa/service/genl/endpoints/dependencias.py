from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import dependencias
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


dependencia_ns_captions = {
    'id': 'Id de la Dependencia',
    'title': 'Título o siglas de la Dependencia',
    'description': 'Descripción de la Dependencia',
    'clasif_id': 'Id de la clasificación de la Dependencia',
}

ns = api.namespace("dependencias", description="Servicios disponibles para las dependencias")

dependencia = api.model('Dependencia (con id de su clasificación)', {
    'id': fields.Integer(description=dependencia_ns_captions['id']),
    'title': fields.String(description=dependencia_ns_captions['title']),
    'description': fields.String(description=dependencia_ns_captions['description']),
    'clasif_id': fields.Integer(description=dependencia_ns_captions['clasif_id']),
})

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

catalog = api.model('Leyendas relacionadas con las Dependencias', {
    'dependencia_clasif': fields.List(fields.Nested(pair)),
})


@ns.route('/')
@ns.response(401, 'Unauthorized')
class DependenciaList(Resource):

    @ns.marshal_list_with(dependencia)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("title", dependencia_ns_captions['title'])
    @ns.param("description", dependencia_ns_captions['description'])
    @ns.param("clasif_id", dependencia_ns_captions['clasif_id'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' Listado de dependencias. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['title', 'description', 'clasif_id']
        )

        try:
            dependencia_list, total_items, total_pages = dependencias.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return dependencia_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(dependencia)
    @ns.marshal_with(dependencia, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' Crear una dependencia '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            dep = dependencias.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return dep, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de una dependencia')
@ns.response(404, 'Dependencia not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class Dependencia(Resource):
    dep_not_found = 'Dependencia no encontrada'

    @ns.marshal_with(dependencia)
    def get(self, id):
        ''' Recuperar una dependencia '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            dep = dependencias.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=self.dep_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return dep


    @ns.expect(dependencia)
    @ns.marshal_with(dependencia)
    def put(self, id):
        ''' Actualizar una dependencia '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            dep = dependencias.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=self.dep_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return dep


    @ns.marshal_with(dependencia)
    def delete(self, id):
        ''' Eliminar una dependencia '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            dep = dependencias.delete(id)
        except EmptySetError:
            ns.abort(404, message=self.dep_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return dep



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
            field_catalog = dependencias.get_catalogs(['dependencia_clasif'])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
