import logging
from flask import Blueprint, Flask

from genl.endpoints import (
    audits,
    users,
    observaciones_sfp,
    observaciones_pre_asf,
    observaciones_ires_asf,
    observaciones_pre_asenl,
    observaciones_ires_asenl,
    observaciones_pre_cytg,
    observaciones_ires_cytg,
    reporte_53,
    reporte_54,
    reporte_55,
    reporte_56,
    reporte_57,
    reporte_61,
    file_services,
    programas_sociales,
    dependencias,
)
from genl.restplus import api


def setup_app(flask_app):
    """Setup flask app instance"""
    blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
    api.init_app(blueprint)
    
    api.add_namespace(audits.ns)
    api.add_namespace(users.ns)
    api.add_namespace(observaciones_sfp.ns)
    api.add_namespace(observaciones_pre_asf.ns)
    api.add_namespace(observaciones_ires_asf.ns)
    api.add_namespace(observaciones_pre_asenl.ns)
    api.add_namespace(observaciones_ires_asenl.ns)
    api.add_namespace(observaciones_pre_cytg.ns)
    api.add_namespace(observaciones_ires_cytg.ns)
    api.add_namespace(reporte_53.ns)
    api.add_namespace(reporte_54.ns)
    api.add_namespace(reporte_55.ns)
    api.add_namespace(reporte_56.ns)
    api.add_namespace(reporte_57.ns)
    api.add_namespace(reporte_61.ns)
    api.add_namespace(file_services.ns)
    api.add_namespace(programas_sociales.ns)
    api.add_namespace(dependencias.ns)

    flask_app.register_blueprint(blueprint)


app = Flask(__name__)
setup_app(app)


if __name__ == "__main__":
    # For the sake of faster development
    app.run(host="0.0.0.0")
else:
    # On production It is needed for WSGI
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
