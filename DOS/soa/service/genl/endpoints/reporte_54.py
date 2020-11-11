from flask_restplus import Resource, fields
from flask import request
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_54
from misc.helperpg import ServerError
from misc.helper import verify_token, get_auth


reporte_54_ns_captions = {
    'dependencia': 'Secretaría / Entidad / Municipio',
    'tipo_obs': 'Tipo de Observacion',
    'cant_obs_solv': 'Cantidad observada (solventados)',
    'monto_solv': 'Monto (solventados)',
    'cant_obs_no_solv': 'Cant. Obs. (no solventados)',
    'monto_no_solv': 'Monto (no solventados)',
    'cant_obs_en_analisis': 'Cant. Obs. (en analisis)',
    'monto_en_analisis': 'Monto (en analisis)',
    'ejercicio_ini': 'Ejercicio (desde)',
    'ejercicio_fin': 'Ejercicio (hasta)',
    'fiscal': 'Ente Fiscalizador (asenl, asf, cytg o "")',
    'division_id': 'Id de la direccion del usuario',
}

ns = api.namespace("reporte_54", description="Observaciones por Estatus de la Observación del Informe Preliminar")

data_row = api.model('Data row (Reporte 54)', {
    'dep':         fields.String(description=reporte_54_ns_captions['dependencia']),
    'tipo_obs':    fields.String(description=reporte_54_ns_captions['tipo_obs']),
    'c_sol':       fields.Integer(description=reporte_54_ns_captions['cant_obs_solv']),
    'm_sol':       fields.Float(description=reporte_54_ns_captions['monto_solv']),
    'c_no_sol':    fields.Integer(description=reporte_54_ns_captions['cant_obs_no_solv']),
    'm_no_sol':    fields.Float(description=reporte_54_ns_captions['monto_no_solv']),
    'c_analisis':  fields.Integer(description=reporte_54_ns_captions['cant_obs_en_analisis']),
    'm_analisis':  fields.Float(description=reporte_54_ns_captions['cant_obs_en_analisis']),
})

report = api.model('Reporte 54', {
    'data_rows': fields.List(fields.Nested(data_row)),
    'ignored_audit_ids': fields.List(fields.Integer()),
})


@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Reporte54(Resource):

    @ns.marshal_with(report)
    @ns.param('ejercicio_ini', reporte_54_ns_captions['ejercicio_ini'], required=True)
    @ns.param('ejercicio_fin', reporte_54_ns_captions['ejercicio_fin'], required=True)
    @ns.param('fiscal',        reporte_54_ns_captions['fiscal'],        required=False)
    @ns.param('division_id',   reporte_54_ns_captions['division_id'],   required=True)
    def get(self):
        ''' Obtiene un arreglo con Entidad, Tipo Obs, (Cant Obs y Monto) para SOLV, EN ANALISISI o NO SOLV de Preliminares, se filtra por ente, si no se especifica devuelte por todos los entes '''
        try:
            verify_token(request.headers)
            auth = get_auth(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        ejercicio_ini = request.args.get('ejercicio_ini', '2000')
        ejercicio_fin = request.args.get('ejercicio_fin', '2040')
        fiscal        = request.args.get('fiscal',        '')
        division_id   = request.args.get('division_id',   '0')

        try:
            rep = reporte_54.get(ejercicio_ini, ejercicio_fin, fiscal, division_id, auth)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
