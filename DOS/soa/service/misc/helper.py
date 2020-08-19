import jwt
import time

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
    
    auth = headers['Authorization']
    auth = auth.replace('Bearer ', '')

    with open('../pem/public_key.pub', 'rb') as f:
        public_key = f.read()

    try:
        decoded = jwt.decode(auth, public_key, algorithms='RS512')
    except:
        raise Exception('El token no es válido')
    
    curr_time = int(time.time())
    exp_time = decoded['exp']

    if curr_time > exp_time:
        raise Exception('El token ha expirado')
