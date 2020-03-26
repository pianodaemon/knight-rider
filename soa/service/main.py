import logging

from flask import Blueprint, Flask

from genl.endpoints import observations
from genl.restplus import api


def setup_app(flask_app):
    """Setup flask app instance"""
    blueprint = Blueprint("api", __name__, url_prefix="/api/v1")
    api.init_app(blueprint)
    
    api.add_namespace(observations.ns)

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