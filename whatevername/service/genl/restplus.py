from flask_restplus import Api
from custom.profile import MSERV_NAME, MSERV_DESC


api = Api(version='1.0', title=MSERV_NAME, description=MSERV_DESC)