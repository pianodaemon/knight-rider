from flask_restplus import Resource, fields
from flask import request
import psycopg2

from genl.restplus import api
from dal import observations, helper
from misc.helper import get_search_params
from misc.helperpg import EmptySetError


ns = api.namespace("observations", description="Available services for an observation")

observation = api.model(
    'Observation model',
    {
        'id': fields.Integer(required=True, description='Observation identifier'),
        'observation_type_id': fields.Integer(required=True, description='Observation type identifier'),
        'social_program_id': fields.Integer(required=True, description='Social program identifier'),
    }
)

@ns.route('/')
class ObservationList(Resource):

    @ns.marshal_list_with(observation)
    @ns.param("offset", "Which record to start from")
    @ns.param("limit", "How many records will be returned")
    @ns.param("order_by", "Which field to order by")
    @ns.param("order", "ASC or DESC, which ordering to use")
    @ns.param("observation_type_id", "An integer id as observation type")
    @ns.param("social_program_id", "An integer id as social program")
    @ns.response(400, 'There is a problem with your query')
    def get(self):
        ''' To fetch several observations '''

        offset = request.args.get('offset', '0')
        limit = request.args.get('limit', '10')
        order_by = request.args.get('order_by', 'id')
        order = request.args.get('order', 'ASC')

        search_params = get_search_params(request.args, ['observation_type_id', 'social_program_id'])

        try:
            obs_list = observations.read_page(offset, limit, order_by, order, search_params)
        except psycopg2.Error as err:
            ns.abort(400, message=err.pgerror)
        
        return obs_list


    @ns.expect(observation)
    @ns.marshal_with(observation, code=201)
    @ns.response(400, 'There is a problem with your request data')
    def post(self):
        ''' To create an observation '''
        try:
            obs = observations.create(**api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=err.pgerror)
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception:
            ns.abort(400, message='Something in your payload is wrong')
        
        return obs, 201



@ns.route('/<int:id>')
@ns.response(404, 'Observation not found')
@ns.response(400, 'There is a problem with your request data')
@ns.param('id', 'Observation identifier')
class Observation(Resource):
    obs_not_found = 'Observation not found'

    @ns.marshal_with(observation)
    def get(self, id):
        ''' To fetch an observation '''
        try:
            obs = observations.read(id)
        except:
            ns.abort(404, message=Observation.obs_not_found)
        
        return obs


    @ns.expect(observation)
    @ns.marshal_with(observation)
    def put(self, id):
        ''' To update an observation '''
        try:
            obs = observations.update(id, **api.payload)
        except psycopg2.Error as err:
            ns.abort(400, message=err.pgerror)
        except KeyError as err:
            ns.abort(400, message='Review the keys in your payload: {}'.format(err))
        except Exception:
            ns.abort(404, message=Observation.obs_not_found)
        
        return obs


    @ns.marshal_with(observation)
    def delete(self, id):
        ''' To delete an observation '''
        try:
            obs = observations.delete(id)
        except:
            ns.abort(404, message=Observation.obs_not_found)
        
        return obs
