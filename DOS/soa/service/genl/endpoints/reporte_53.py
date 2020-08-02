from flask_restplus import Resource, fields
from psycopg2 import Error as pg_err

from genl.restplus import api
from dal import reporte_53
from misc.helperpg import get_msg_pgerror, EmptySetError


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
    'ejercicio_ini': 'Ejercicio (de)',
    'ejercicio_fin': 'Ejercicio (a)',
}

ns = api.namespace("reporte_53", description="Concentrado de Observaciones por Ente Fiscalizador y Entidad del Informe de Resultados")

filters = api.model('Filtros del reporte)', {
    'ejercicio_ini': fields.Integer(description=reporte_53_ns_captions['ejercicio_ini']),
    'ejercicio_fin': fields.Integer(description=reporte_53_ns_captions['ejercicio_fin']),
})

data_row = api.model('Data row)', {
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
@ns.response(404, 'Data not found')
@ns.response(400, 'There is a problem with your request data')
class Reporte53(Resource):
    data_not_found = 'Datos no encontrados'

    @ns.expect(filters)
    @ns.marshal_with(report)
    def get(self):
        ''' To fetch an instance of Reporte 53 '''
        try:
            rep = reporte_53.get(**api.payload)
        except pg_err as err:
            ns.abort(400, message=get_msg_pgerror(err))
        except EmptySetError:
            ns.abort(404, message=Reporte53.data_not_found)
        except Exception as err:
            ns.abort(400, message=err)
        
        return rep
