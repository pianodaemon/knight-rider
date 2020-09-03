from psycopg2.errors import UniqueViolation

from dal.helper import exec_steady, update_steady
from misc.helperpg import EmptySetError, ServerError


def save(org_fisc, pre_ires, obs_id, file_list):
        
    of_id, pi_id = get_ids(org_fisc, pre_ires)
    o_id = int(obs_id)

    curr_list = _read(of_id, pi_id, o_id)
    try:
        next_upload_id = curr_list[-1][3] + 1
    except:
        next_upload_id = 1

    f_list = []

    for f in file_list:

        fname = org_fisc + '/' + pre_ires + '/' + obs_id + '/' + f
        
        sql = "INSERT INTO uploads VALUES ({}, {}, {}, {}, '{}');".format(
            of_id, pi_id, o_id, next_upload_id, fname
        )
        next_upload_id += 1
        
        f_list.append(fname)

        try:
            row_count = update_steady(sql)
        except EmptySetError:
            raise
        except UniqueViolation:
            next_upload_id -= 1
        except Exception:
            raise ServerError('Error en capa de persistencia')
    
    return {'fnames': f_list}


def read(org_fisc, pre_ires, obs_id):
    of_id, pi_id = get_ids(org_fisc, pre_ires)
    o_id = int(obs_id)

    curr_list = _read(of_id, pi_id, o_id)
    f_list = []
    
    for f in curr_list:
        f_list.append(f[4])
        
    return {'fnames': f_list}


def _read(of_id, pi_id, obs_id):
    sql = '''
        SELECT org_fisc_id, obs_stage_id, obs_id, upload_id, filename
        FROM uploads
        WHERE org_fisc_id = {}
          AND obs_stage_id = {}
          AND obs_id = {}
        ORDER BY upload_id ASC;
    '''.format(of_id, pi_id, obs_id)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    
    return rows


def get_ids(org_fisc, pre_ires):
    sql = '''
        SELECT id
        FROM fiscals
        WHERE title = '{}';
    '''.format(org_fisc)

    of_id = exec_steady(sql)

    sql = '''
        SELECT id
        FROM observation_stages
        WHERE title = '{}';
    '''.format(pre_ires)

    pi_id = exec_steady(sql)

    return of_id[0][0], pi_id[0][0]
