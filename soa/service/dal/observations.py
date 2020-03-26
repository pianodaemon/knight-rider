from dal.helper import run_stored_procedure

def _alter_observation(**kwargs):
    """Calls postgresql function in charge of creation/edition of an observation entity"""
    sql = """
        SELECT * FROM alter_observation(
            {}::integer,
            {}::integer
        )
        AS result( rc integer, msg text );
    """.format(kwargs["id"], kwargs["observation_type_id"])
    
    return run_stored_procedure(sql)


def edit(id, **kwargs):
    '''Updates an observation entity'''
    kwargs['id'] = id
    return _alter_observation(**kwargs)


def create(**kwargs):
    '''Creates an observation entity'''
    kwargs['id'] = 0
    return _alter_observation(**kwargs)