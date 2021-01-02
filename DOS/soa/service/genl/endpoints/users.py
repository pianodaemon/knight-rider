from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import users
from misc.helper import get_search_params, verify_token
from misc.helperpg import get_msg_pgerror, EmptySetError


user_ns_captions = {
    'id':'User identifier',
    'username': 'Username',
    'passwd': 'Password for the username',
    'orgchart_role_id': 'Role id from organization chart',
    'division_id': 'Controller\'s office (Direccion de contraloria)',
    'disabled': 'Flag to put the user in state \'disabled\'',
    'first_name': 'User\'s first name',
    'last_name': 'User\'s last name',
}

ns = api.namespace("users", description="Available services for a user")

usr_fields = {
    'id': fields.Integer(description=user_ns_captions['id']),
    'username': fields.String(description=user_ns_captions['username']),
    'passwd': fields.String(description=user_ns_captions['passwd']),
    'orgchart_role_id': fields.Integer(description=user_ns_captions['orgchart_role_id']),
    'division_id': fields.Integer(description=user_ns_captions['division_id']),
    'disabled': fields.Boolean(description=user_ns_captions['disabled']),
    'first_name': fields.String(description=user_ns_captions['first_name']),
    'last_name': fields.String(description=user_ns_captions['last_name']),
}
user = api.model('User', usr_fields)

usr_fields_ext = dict(usr_fields)
usr_fields_ext['access_vector'] = fields.List(fields.Integer(description='Authority id'))
user_ext = api.model('Extended User', usr_fields_ext)

pair = api.model('Id-Title pair', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'title': fields.String(description='Entry title'),
})

authority = api.model('Authority', {
    'id': fields.Integer(description='An integer as entry identifier'),
    'description': fields.String(description='Entry description'),
    'screen_order': fields.Integer(description="An integer showing the entry's order in the UI"),
})

catalog = api.model('Users screen data (catalog of Id-Title pairs for screen fields)', {
    'divisions': fields.List(fields.Nested(pair)),
    'orgchart_roles': fields.List(fields.Nested(pair)),
    'authorities': fields.List(fields.Nested(authority)),
})

@ns.route('/')
@ns.response(401, 'Unauthorized')
class UserList(Resource):

    @ns.marshal_list_with(user)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("username", user_ns_captions["username"])
    @ns.param("orgchart_role_id", user_ns_captions["orgchart_role_id"])
    @ns.param("division_id", user_ns_captions["division_id"])
    @ns.param("disabled", user_ns_captions["disabled"])
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several users. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''
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
            ['username', 'orgchart_role_id', 'division_id', 'disabled']
        )

        try:
            users_list, total_items, total_pages = users.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return users_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(user_ext)
    @ns.marshal_with(user_ext, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create a user. Key \'disabled\' is ignored as this is automatically set to false at creation '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            usr = users.create(**api.payload)
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
@ns.response(401, 'Unauthorized')
class User(Resource):
    user_not_found = 'User not found'

    @ns.marshal_with(user_ext)
    def get(self, id):
        ''' To fetch a user '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            usr = users.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=User.user_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr


    @ns.expect(user_ext)
    @ns.marshal_with(user_ext)
    def put(self, id):
        ''' To update a user '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            usr = users.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError as err:
            ns.abort(404, message=User.user_not_found + '. ' + str(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr


    @ns.marshal_with(user_ext)
    def delete(self, id):
        ''' To delete a user '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        try:
            usr = users.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=User.user_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return usr



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
            field_catalog = users.get_catalogs(['divisions', 'orgchart_roles', 'authorities'])
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
