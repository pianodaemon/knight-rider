from flask_restplus import Resource, fields
from flask import request
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_56
from misc.helperpg import ServerError
from misc.helper import verify_token, get_auth


reporte_56_ns_captions = {
    'dependencia': 'Secretaría / Entidad / Municipio',
    'ej': 'Ejercicio-Anio',
    'tipo': 'Tipo de Obs',
    'clasif_name': 'Clasificacion',
    'c_obs': 'Cant. Obs.',
    'monto': 'Monto ',
    'ejercicio_ini': 'Ejercicio (desde)',
    'ejercicio_fin': 'Ejercicio (hasta)',
    'fiscal': 'Ente Fiscalizador (ASENL/ASF/SFP/CYTG)',
    'reporte_num': 'Numero de reporte (reporte56 o reporte58)',
    'division_id': 'Id de la direccion del usuario',
    'is_clasif': 'True si obtendra la clasificacion',
}

ns = api.namespace("reporte_56", description="(Reporte 56 y 58) Observaciones Pendientes de Solventar por Ente Fiscalizador")

data_row = api.model('Data row (Reporte 56)', {
    'dep':          fields.String(description=reporte_56_ns_captions['dependencia']),
    'ej':           fields.Integer(description=reporte_56_ns_captions['ej']),
    'tipo':         fields.String(description=reporte_56_ns_captions['tipo']),
    'clasif_name':  fields.String(description=reporte_56_ns_captions['clasif_name']),
    'c_obs':        fields.Integer(description=reporte_56_ns_captions['c_obs']),
    'monto':        fields.Float(description=reporte_56_ns_captions['monto']),
})

report = api.model('Reporte 56', {
    'data_rows': fields.List(fields.Nested(data_row)),
    'ignored_audit_ids': fields.List(fields.Integer()),
})


@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Reporte56(Resource):

    @ns.marshal_with(report)
    @ns.param('ejercicio_ini', reporte_56_ns_captions['ejercicio_ini'], required=True)
    @ns.param('ejercicio_fin', reporte_56_ns_captions['ejercicio_fin'], required=True)
    @ns.param('fiscal',        reporte_56_ns_captions['fiscal'],        required=False)
    @ns.param('reporte_num',   reporte_56_ns_captions['reporte_num'],   required=False)
    @ns.param('division_id',   reporte_56_ns_captions['division_id'],   required=True)
    @ns.param('is_clasif',     reporte_56_ns_captions['is_clasif'],     required=False)
    def get(self):
        ''' Obtiene un arreglo con Entidad, Ejercicio, Tipo, Clasificacion, Cant Obs y Monto para IRES, se filtra por ente '''
        try:
            verify_token(request.headers)
            auth = get_auth(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        ejercicio_ini = request.args.get('ejercicio_ini', '2000')
        ejercicio_fin = request.args.get('ejercicio_fin', '2040')
        fiscal        = request.args.get('fiscal',        'SFP')
        reporte_num   = request.args.get('reporte_num',   'reporte56')
        division_id   = request.args.get('division_id',   '0')
        is_clasif     = request.args.get('is_clasif',   'True')

        try:
            rep = reporte_56.get(ejercicio_ini, ejercicio_fin, fiscal, reporte_num, division_id, auth, is_clasif)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
