from flask_restplus import Resource, fields
from flask import request

# from dal.helper import exec_steady, update_steady
from dal import observations, helper
from genl.restplus import api
from misc.helperpg import EmptySetError

ns = api.namespace("observations", description="Observation services")

observation = api.model(
    'Observation model',
    {
        'id': fields.Integer(required=True, description='Observation identifier'),
        'observation_type_id': fields.Integer(required=True, description='Observation type identifier'),
    }
)

@ns.route('/')
class ObservationList(Resource):

    @ns.marshal_list_with(observation)
    def get(self):
        ''' To fetch several observations '''

        sql = """
            SELECT id, observation_type_id
            FROM observations
            ORDER BY id ASC;
        """
        try:
            rows = helper.exec_steady(sql)
        except EmptySetError:
            return []
        except:
            ns.abort(500)

        entities = []
        for row in rows:
            entities.append(dict(row))
        
        return entities


    @ns.expect(observation)
    @ns.marshal_with(observation, code=201)
    # @ns.param('observation_data', description='Observation data (json)', _in='body')
    def post(self):
        ''' To create an observation '''
        
        # TODO: validate payload before calling stored proc...

        try:
            id, rmsg = observations.create(**api.payload)
        except:
            ns.abort(500)
        
        return (
            {
                'id': id,
                'observation_type_id': api.payload['observation_type_id']
            },
            201
        )



@ns.route('/<int:id>')
@ns.response(404, 'Observation not found')
@ns.param('id', 'Observation identifier')
class Observation(Resource):

    @ns.marshal_with(observation)
    def get(self, id):
        ''' To fetch an observation '''

        sql = """
            SELECT id, observation_type_id
            FROM observations
            WHERE id = {};
        """.format(id)

        try:
            rows = helper.exec_steady(sql)
        except EmptySetError:
            ns.abort(404)
        except:
            ns.abort(500)

        return dict(rows[0])


    @ns.expect(observation)
    @ns.marshal_with(observation)
    def put(self, id):
        ''' To update an observation '''

        # TODO: validate payload before calling stored proc...

        try:
            _, rmsg = observations.edit(id, **api.payload)
        except:
            ns.abort(404)

        return {
            'id': id,
            'observation_type_id': api.payload['observation_type_id']
        }


    @ns.marshal_with(observation)
    def delete(self, id):
        ''' To delete an observation '''
        pass
