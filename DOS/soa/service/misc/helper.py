import time
import jwt
import redis
import os

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
    
    # Expiration
    curr_time = int(time.time())
    exp_time = decoded['exp']

    if curr_time > exp_time:
        raise Exception('El token ha expirado')

    # Black list (token of logged out user)
    redis_host = os.getenv('REDIS_HOST')
    redis_port = int(os.getenv('REDIS_PORT'))
    r = redis.Redis(host=redis_host, port=redis_port, db=0)
    try:
        from_redis = r.get(headers['Authorization'])
    except:
        raise Exception('Hay un problema con el cache server')
    
    if from_redis is not None:
        raise Exception('El token no es válido (logged out)')


def get_auth(headers):
    if 'Authorization' not in headers:
        raise Exception('No se encontró un token en el request')
    
    auth = headers['Authorization'].replace('Bearer ', '')

    if public_key is None:
        raise Exception('Hay un problema con la llave pública')

    try:
        decoded = jwt.decode(auth, public_key, algorithms='RS512')
    except:
        raise Exception('El token no es válido')
    
    return decoded['authorities']
