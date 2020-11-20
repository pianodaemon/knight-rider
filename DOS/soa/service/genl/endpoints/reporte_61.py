from flask_restplus import Resource, fields
from flask import request
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_61
from misc.helperpg import ServerError
from misc.helper import verify_token, get_auth


reporte_61_ns_captions = {
    'dependencia': 'Secretaría / Entidad / Municipio',
    'ej': 'Ejercicio-Anio',
    'tipo': 'Tipo de Obs',
    'c_obs': 'Cant. Obs.',
    'monto': 'Monto ',
    'ejercicio_ini': 'Ejercicio (desde)',
    'ejercicio_fin': 'Ejercicio (hasta)',
    'fiscal': 'Ente Fiscalizador (ASENL/ASF/SFP/CYTG)',
    'obs_c': 'pre/ires',
    'n_obs': 'Num. observacion',
    'obs': 'Observacion',
    'estatus': 'Estatus de la observacion',
    'division_id': 'Id de la direccion del usuario',
    'm_sol': 'Monto solventado',
}

ns = api.namespace("reporte_61", description="(Reporte 61 y 63) Reporte de Detalle de la Observación, Estatus, Entidad, Tipo de Observación y Ente Fiscalizador")

data_row = api.model('Data row (Reporte 61)', {
    'dep':          fields.String(description=reporte_61_ns_captions['dependencia']),
    'n_obs':        fields.String(description=reporte_61_ns_captions['n_obs']),
    'obs':          fields.String(description=reporte_61_ns_captions['obs']),
    'tipo':         fields.String(description=reporte_61_ns_captions['tipo']),
    'estatus':      fields.String(description=reporte_61_ns_captions['estatus']),
    'c_obs':        fields.Integer(description=reporte_61_ns_captions['c_obs']),
    'monto':        fields.Float(description=reporte_61_ns_captions['monto']),
    'm_sol':        fields.Float(description=reporte_61_ns_captions['m_sol']),
})

report = api.model('Reporte 61', {
    'data_rows': fields.List(fields.Nested(data_row)),
    'ignored_audit_ids': fields.List(fields.Integer()),
})


@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Reporte61(Resource):

    @ns.marshal_with(report)
    @ns.param('ejercicio_ini', reporte_61_ns_captions['ejercicio_ini'], required=True)
    @ns.param('ejercicio_fin', reporte_61_ns_captions['ejercicio_fin'], required=True)
    @ns.param('fiscal',        reporte_61_ns_captions['fiscal'],        required=False)
    @ns.param('obs_c',         reporte_61_ns_captions['obs_c'],         required=False)
    @ns.param('division_id',   reporte_61_ns_captions['division_id'],   required=True)
    def get(self):
        ''' Obtiene un arreglo con Entidad, Cant Obs, Num Obs, Observacion, Tipo Obs, Monto y Estatus para PRE e IRES, se filtra por ente y pre o ires '''
        try:
            verify_token(request.headers)
            auth = get_auth(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        ejercicio_ini = request.args.get('ejercicio_ini', '2000')
        ejercicio_fin = request.args.get('ejercicio_fin', '2040')
        fiscal        = request.args.get('fiscal',        'SFP')
        obs_c         = request.args.get('obs_c',         'pre')
        division_id   = request.args.get('division_id',   '0')

        try:
            rep = reporte_61.get(ejercicio_ini, ejercicio_fin, fiscal, obs_c, division_id, auth)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
