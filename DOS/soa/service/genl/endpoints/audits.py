from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import audits
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


ns = api.namespace("audits", description="Available services for an audit")

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

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

catalog = api.model('Catálogo para pantalla de Auditorías', {
    'fiscals': fields.List(fields.Nested(pair)),
    'divisions': fields.List(fields.Nested(pair)),
    'dependencies': fields.List(fields.Nested(dependency)),
})


@ns.route('/')
@ns.response(401, 'Unauthorized')
class AuditList(Resource):

    @ns.marshal_list_with(audit)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("title", "Alphanumeric audit's identifier")
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several audits. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['title']
        )

        try:
            audits_list, total_items, total_pages = audits.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return audits_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(audit)
    @ns.marshal_with(audit, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an audit '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            aud = audits.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return aud, 201



@ns.route('/<int:id>')
@ns.param('id', 'Audit identifier')
@ns.response(404, 'Audit not found')
@ns.response(400, 'There is a problem with your request data')
@ns.response(401, 'Unauthorized')
class Audit(Resource):
    audit_not_found = 'Audit not found'

    @ns.marshal_with(audit)
    def get(self, id):
        ''' To fetch an audit '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            aud = audits.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=Audit.audit_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return aud


    @ns.expect(audit)
    @ns.marshal_with(audit)
    def put(self, id):
        ''' To update an audit '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            aud = audits.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=Audit.audit_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return aud


    @ns.marshal_with(audit)
    def delete(self, id):
        ''' To delete an audit '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            aud = audits.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=Audit.audit_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return aud



@ns.route('/catalog')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Catalog(Resource):

    @ns.marshal_with(catalog)
    @ns.param("direccion_id", "Id de la Dirección")
    def get(self):
        ''' To fetch an object containing data for screen fields (key: table name, value: list of table rows) '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        search_params = get_search_params(request.args, ['direccion_id'])

        try:
            field_catalog = audits.get_catalogs(
                [
                    'fiscals',
                    'divisions',
                    'dependencies',
                ],
                search_params,
            )
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
