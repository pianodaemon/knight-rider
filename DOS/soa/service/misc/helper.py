import jwt
import time
from genl.restplus import public_key

def get_search_params(args, fields):
    params = {}
    for key in fields:
        if args.get(key):
            params[key] = args.get(key)

    if len(params) == 0:
        return None

    return params


def verify_token(headers):
    if 'Authorization' not in headers:
        raise Exception('No se encontró un token en el request')
    
    auth = headers['Authorization'].replace('Bearer ', '')

    if public_key is None:
        raise Exception('Hay un problema con la llave pública')

    try:
        decoded = jwt.decode(auth, public_key, algorithms='RS512')
    except:
        raise Exception('El token no es válido')
    
    curr_time = int(time.time())
    exp_time = decoded['exp']

    if curr_time > exp_time:
        raise Exception('El token ha expirado')
