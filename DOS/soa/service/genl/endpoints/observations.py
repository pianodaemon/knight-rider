from flask_restplus import Resource, fields
from flask import request, make_response
import psycopg2

from genl.restplus import api
from dal import observations
from misc.helper import get_search_params
from misc.helperpg import get_msg_pgerror, EmptySetError


ns = api.namespace("observations", description="Available services for an observation")

observation = api.model(
    'Observation model',
    {
        'id': fields.Integer(required=False, description='Observation identifier'),
        'observation_type_id': fields.Integer(required=True, description='Observation type identifier'),
        'social_program_id': fields.Integer(required=True, description='Social program identifier'),
        'audit_id': fields.Integer(required=True, description='Audit identifier'),
        'fiscal_id': fields.Integer(required=True, description='Fiscal entity that audits'),
        'title': fields.String(required=True, description='Desc of observation'),
        'amount_observed': fields.Float(required=True, description='Observed amount'),
        'observation_code_id': fields.Integer(required=True, description='Observation code identifier'),
        'observation_bis_code_id': fields.Integer(required=True, description='Observation bis code identifier'),
    }
)

@ns.route('/')
class ObservationList(Resource):

    @ns.marshal_list_with(observation)
    @ns.param("offset", "Which record to start from, default is 0")
    @ns.param("limit", "How many records will be returned at most, default is 10")
    @ns.param("order_by", "Which field to order by, default is id column")
    @ns.param("order", "ASC or DESC, which ordering to use, default is ASC")
    @ns.param("per_page", "How many items per page, default is 10")
    @ns.param("page", "Which page to fetch, default is 1")
    @ns.param("observation_type_id", "An integer as observation type identifier")
    @ns.param("social_program_id", "An integer as social program identifier")
    @ns.param("audit_id", "An integer as audit identifier")
    @ns.param("fiscal_id", "Fiscal entity that audits")
    @ns.param("title", "Description of observation")
    @ns.param("observation_code_id", "An integer identifying the observation codes")
    @ns.param("observation_bis_code_id", "An integer identifying the observation bis codes")
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations. On Success it returns two custom headers: X-SOA-Total-Items, X-SOA-Total-Pages '''

        offset = request.args.get('offset', '0')
        limit = request.args.get('limit', '10')
        order_by = request.args.get('order_by', 'id')
        order = request.args.get('order', 'ASC')
        per_page = request.args.get('per_page', '10')
        page = request.args.get('page', '1')

        search_params = get_search_params(
            request.args,
            [
                'observation_type_id', 'social_program_id', 'audit_id', 'fiscal_id', 'title',
                'observation_code_id', 'observation_bis_code_id'
            ]
        )

        try:
            obs_list, total_items, total_pages = observations.read_per_page(
                offset, limit, order_by, order, search_params, per_page, page
            )
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs_list, 200, {'X-SOA-Total-Items': total_items, 'X-SOA-Total-Pages': total_pages}


    @ns.expect(observation)
    # @ns.marshal_with(observation, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation '''
        try:
            obs = observations.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs, 201



@ns.route('/<int:id>')
@ns.param('id', 'Observation identifier')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
class Observation(Resource):
    obs_not_found = 'Observation not found'

    # @ns.marshal_with(observation)
    def get(self, id):
        ''' To fetch an observation '''
        try:
            obs = observations.read(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=Observation.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    @ns.expect(observation)
    # @ns.marshal_with(observation)
    def put(self, id):
        ''' To update an observation '''
        try:
            obs = observations.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except EmptySetError:
            ns.abort(404, message=Observation.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs


    # @ns.marshal_with(observation)
    def delete(self, id):
        ''' To delete an observation '''
        try:
            obs = observations.delete(id)
        except psycopg2.Error as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=Observation.obs_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return obs



@ns.route('/catalog')
@ns.response(500, 'Server error')
class Catalog(Resource):

    def get(self):
        ''' To fetch an object containing data for screen fields (key: table name, value: list of id/title pairs) '''
        try:
            field_catalog = observations.get_catalogs(
                ['observation_types', 'social_programs', 'audits', 'fiscals', 'observation_codes']
            )
        except psycopg2.Error as err:
            ns.abort(500, message=get_msg_pgerror(err))
        except Exception as err:
            ns.abort(500, message=err)
                
        return field_catalog
