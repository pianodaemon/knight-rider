def get_search_params(args, fields):
    params = {}
    for key in fields:
        if args.get(key):
            params[key] = args.get(key)

    if len(params) == 0:
        return None

    return params