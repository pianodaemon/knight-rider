from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import programas_sociales
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


programa_soc_ns_captions = {
    'id': 'Id del programa social',
    'title': 'Siglas del programa social',
    'description': 'Nombre del programa social',
    'central': 'Flag que indica vinculación con Central (true | false)',
    'paraestatal': 'Flag que indica vinculación con Paraestatal (true | false)',
    'obra_pub': 'Flag que indica vinculación con Obra Pública (true | false)',
}

ns = api.namespace("programas_soc", description="Servicios disponibles para los programas sociales")

programa_soc = api.model('Programa social', {
    'id': fields.Integer(description=programa_soc_ns_captions['id']),
    'title': fields.String(description=programa_soc_ns_captions['title']),
    'description': fields.String(description=programa_soc_ns_captions['description']),
    'central': fields.Boolean(description=programa_soc_ns_captions['central']),
    'paraestatal': fields.Boolean(description=programa_soc_ns_captions['paraestatal']),
    'obra_pub': fields.Boolean(description=programa_soc_ns_captions['obra_pub']),
})


@ns.route('/')
@ns.response(401, 'Unauthorized')
class ProgramaSocialList(Resource):

    @ns.marshal_list_with(programa_soc)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("title", programa_soc_ns_captions['title'])
    @ns.param("description", programa_soc_ns_captions['description'])
    @ns.param("central", programa_soc_ns_captions['central'])
    @ns.param("paraestatal", programa_soc_ns_captions['paraestatal'])
    @ns.param("obra_pub", programa_soc_ns_captions['obra_pub'])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' Listado de programas sociales. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['title', 'description', 'central', 'paraestatal', 'obra_pub']
        )

        try:
            programa_soc_list, total_items, total_pages = programas_sociales.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return programa_soc_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(programa_soc)
    @ns.marshal_with(programa_soc, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' Crear un programa social '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            prog = programas_sociales.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return prog, 201



@ns.route('/<int:id>')
@ns.param('id', 'Id de un programa social')
@ns.response(404, 'Programa social not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class ProgramaSocial(Resource):
    progr_not_found = 'Programa social no encontrado'

    @ns.marshal_with(programa_soc)
    def get(self, id):
        ''' Recuperar un programa social '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            prog = programas_sociales.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=self.progr_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return prog


    @ns.expect(programa_soc)
    @ns.marshal_with(programa_soc)
    def put(self, id):
        ''' Actualizar un programa social '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            prog = programas_sociales.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the attributes in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=self.progr_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return prog


    @ns.marshal_with(programa_soc)
    def delete(self, id):
        ''' Eliminar un programa social '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            prog = programas_sociales.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=self.progr_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return prog
