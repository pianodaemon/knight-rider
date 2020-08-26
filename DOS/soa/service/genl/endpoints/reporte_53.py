from flask_restplus import Resource, fields
from flask import request
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_53
from misc.helperpg import ServerError
from misc.helper import verify_token


reporte_53_ns_captions = {
    'dependencia': 'Secretaría / Entidad / Municipio',
    'ejercicio': 'Ejercicio',
    'cant_obs_asf': 'Cant. Obs. (ASF)',
    'monto_asf': 'Monto (ASF)',
    'cant_obs_sfp': 'Cant. Obs. (SFP)',
    'monto_sfp': 'Monto (SFP)',
    'cant_obs_asenl': 'Cant. Obs. (ASENL)',
    'monto_asenl': 'Monto (ASENL)',
    'cant_obs_cytg': 'Cant. Obs. (CyTG)',
    'monto_cytg': 'Monto (CyTG)',
    'ejercicio_ini': 'Ejercicio (desde)',
    'ejercicio_fin': 'Ejercicio (hasta)',
}

ns = api.namespace("reporte_53", description="Concentrado de Observaciones por Ente Fiscalizador y Entidad del Informe de Resultados")

data_row = api.model('Data row (Reporte 53)', {
    'dep': fields.String(description=reporte_53_ns_captions['dependencia']),
    'ej': fields.Integer(description=reporte_53_ns_captions['ejercicio']),
    'c_asf': fields.Integer(description=reporte_53_ns_captions['cant_obs_asf']),
    'm_asf': fields.Float(description=reporte_53_ns_captions['monto_asf']),
    'c_sfp': fields.Integer(description=reporte_53_ns_captions['cant_obs_sfp']),
    'm_sfp': fields.Float(description=reporte_53_ns_captions['monto_sfp']),
    'c_asenl': fields.Integer(description=reporte_53_ns_captions['cant_obs_asenl']),
    'm_asenl': fields.Float(description=reporte_53_ns_captions['monto_asenl']),
    'c_cytg': fields.Integer(description=reporte_53_ns_captions['cant_obs_cytg']),
    'm_cytg': fields.Float(description=reporte_53_ns_captions['monto_cytg']),
})

report = api.model('Reporte 53', {
    'data_rows': fields.List(fields.Nested(data_row)),
    'ignored_audit_ids': fields.List(fields.Integer()),
})


@ns.route('/')
@ns.response(400, 'Client error')
@ns.response(500, 'Server error')
@ns.response(401, 'Unauthorized')
class Reporte53(Resource):

    @ns.marshal_with(report)
    @ns.param('ejercicio_ini', reporte_53_ns_captions['ejercicio_ini'], required=True)
    @ns.param('ejercicio_fin', reporte_53_ns_captions['ejercicio_fin'], required=True)
    def get(self):
        ''' To fetch an instance of Reporte 53 '''
        try:
            verify_token(request.headers)
        except Exception as err:
            ns.abort(401, message=err)

        ejercicio_ini = request.args.get('ejercicio_ini', '2000')
        ejercicio_fin = request.args.get('ejercicio_fin', '2040')

        try:
            rep = reporte_53.get(ejercicio_ini, ejercicio_fin)
        except ServerError as err:
            ns.abort(500, message=err)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
