from flask_restplus import Resource, fields
from flask import request

from dal.helper import exec_steady, update_steady
from genl.restplus import api
from misc.helperpg import EmptySetError

ns = api.namespace("observations", description="Observations data")

observation = ns.model('Observation', {
    'id': fields.Integer(required=True, description='Observation identifier'),
    'observation_type_id': fields.Integer(required=True, description='Observation type identifier'),
})

# TODO: esta var global solo fue para pruebas de los endpoints, sera eliminada. Se inicializa al hacer
# un GET observations/
obs_last_id = 0


@ns.route('/')
@ns.response(404, 'Observation not found')
class Observations(Resource):

    @ns.marshal_list_with(observation)
    def get(self):
        global obs_last_id
        sql = """
            SELECT id, observation_type_id
            FROM observations
            ORDER BY id ASC;
        """
        try:
            rows = exec_steady(sql)
        except EmptySetError:
            ns.abort(404)

        entities = []
        for row in rows:
            entities.append(dict(row))
        
        obs_last_id = len(entities)
        return entities


    @ns.marshal_with(observation)
    @ns.param('observation_type_id', description='Observation type identifier', _in='body')
    def post(self):
        # TODO: Eliminar esta forma de obtener id consecutivo. Se usara sequence de postgres:
        global obs_last_id
        obs_last_id += 1
        obs_type_id = request.get_json()
        type_id = obs_type_id['observation_type_id']

        sql = """
            INSERT INTO observations (id, observation_type_id)
            VALUES ({}, {})
        """.format(obs_last_id, type_id)
        
        try:
            rows = update_steady(sql)
        except EmptySetError:
            ns.abort(404)

        return {'id': obs_last_id, 'observation_type_id': type_id}



@ns.route('/<int:id>')
@ns.param('id', 'Observation identifier')
@ns.response(404, 'Observation not found')
class Observation(Resource):

    @ns.marshal_with(observation)
    def get(self, id):
        sql = """
            SELECT id, observation_type_id
            FROM observations
            WHERE id = {}
        """.format(id)

        try:
            rows = exec_steady(sql)
        except EmptySetError:
            ns.abort(404)

        return dict(rows[0])


    def put(self, id):
        pass


    def delete(self, id):
        pass
