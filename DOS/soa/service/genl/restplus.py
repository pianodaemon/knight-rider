from flask_restplus import Api
from custom.profile import MSERV_NAME, MSERV_DESC


api = Api(version='1.0', title=MSERV_NAME, description=MSERV_DESC)

try:
    with open('../pem/public_key.pub', 'rb') as f:
        public_key = f.read()
except:
    public_key = None
