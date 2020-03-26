from misc.helperpg import pgslack_connected, pgslack_exec, pgslack_update


@pgslack_connected
def run_stored_procedure(conn, sql):
    """Runs a stored procedure with rich answer"""

    r = pgslack_exec(conn, sql)

    # For this case we are just expecting one row
    if len(r) != 1:
        raise Exception("unexpected result regarding execution of stored procedure")

    rcode, rmsg = r.pop()
    if rcode < 0:
        raise Exception(str(rcode) + ', ' + rmsg)

    return (rcode, rmsg)


@pgslack_connected
def exec_steady(conn, sql):
    return pgslack_exec(conn, sql)


@pgslack_connected
def update_steady(conn, sql):
    return pgslack_update(conn, sql)