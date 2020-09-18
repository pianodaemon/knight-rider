from dal.helper import exec_steady
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin, fiscal, obs_c, user_id):
    ''' Returns an instance of Reporte 61 and 63'''
    
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)
    str_filtro_direccion = get_direction_filter(user_id)

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')

    
    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_set = set()

    sql = '''
        select count(auditoria_id) as conteo, auditoria_id
        from auditoria_anios_cuenta_pub
        group by auditoria_id
        order by conteo desc, auditoria_id;
    '''
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    except Exception:
        raise ServerError('Hay un problema con el servidor de base de datos')

    for row in rows:
        if row[0] > 1:
            ignored_audit_set.add(row[1])
        else:
            break
    
    sql = '''
        select count(auditoria_id) as conteo, auditoria_id
        from auditoria_dependencias
        group by auditoria_id
        order by conteo desc, auditoria_id;
    '''
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []

    for row in rows:
        if row[0] > 1:
            ignored_audit_set.add(row[1])
        else:
            break
    
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(ignored_audit_set, 'ires.')
    
    
    #Organos fiscalizadores
    entes = setEntesIds()

    # Retrieve de cant. obs y montos por cada ente, empezando por ASENL
    aux_dict = {}

    data_rows = []


    if obs_c == 'pre':
        if fiscal == 'SFP':
            l = preSFP( ignored_audit_str, ej_ini, ej_fin, entes['SFP'], str_filtro_direccion )
            data_rows = setDataObj(l)
        elif fiscal == 'ASF':
            ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
            l = preASF( ignored_audit_str, ej_ini, ej_fin, entes['ASF'], str_filtro_direccion )
            data_rows = setDataObj(l)
        elif fiscal == 'CYTG':
            ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
            l = preCYTG( ignored_audit_str, ej_ini, ej_fin, entes['CyTG'], str_filtro_direccion )
            data_rows = setDataObj(l)
        elif fiscal == 'ASENL':
            ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
            l = preASENL( ignored_audit_str, ej_ini, ej_fin, entes['ASENL'], str_filtro_direccion )
            data_rows = setDataObj(l)
    else:
        if fiscal == 'SFP':
            ignored_audit_str = ignored_audit_str.replace('pre.', 'ires.')
            l = iresSFP( ignored_audit_str, ej_ini, ej_fin, entes['SFP'], str_filtro_direccion  )
            data_rows = setDataObj(l)
        elif fiscal == 'ASF':
            ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
            l = iresASF( ignored_audit_str, ej_ini, ej_fin, entes['ASF'], str_filtro_direccion  )
            data_rows = setDataObj(l)
        elif fiscal == 'CYTG':
            ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
            l = iresCYTG( ignored_audit_str, ej_ini, ej_fin, entes['CyTG'], str_filtro_direccion  )
            data_rows = setDataObj(l)
        elif fiscal == 'ASENL':
            ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
            l = iresASENL( ignored_audit_str, ej_ini, ej_fin, entes['ASENL'], str_filtro_direccion  )
            data_rows = setDataObj(l)

    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }


def setDataObj(l):
    data_rows = []
    data_rowsl = {}
    for item in l:
        o = {}
        o['dep']      = item['dependencia']
        o['n_obs']    = item['num_observacion']
        o['obs']      = item['observacion']
        o['tipo']     = item['tipo_observacion']
        o['estatus']  = item['estatus']
        o['c_obs']    = item['cant_obs']
        o['monto']    = item['monto']

        data_rows.append(o)
    return data_rows


def preASF( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, pre.direccion_id as direccion_id, pre.num_observacion as num_observacion, pre.observacion as observacion, estatus_pre_asf.title as estatus, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto
        from observaciones_pre_asf as pre
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join estatus_pre_asf as estatus_pre_asf on pre.estatus_criterio_int_id = estatus_pre_asf.id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dependencia, num_observacion, observacion, estatus, ejercicio, direccion_id
        order by dependencia, ejercicio;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    l = []
    for row in rows:
        r = dict(row)
        r['tipo_observacion'] = ''  #Pre no tiene este campo
        l.append(r)

    return l

def preSFP( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, ires.observacion, tipos.title as tipo_observacion, ires.direccion_id as direccion_id, ires.clave_observacion as num_observacion, ires.observacion, count(ires.id) as cant_obs, sum(ires.monto_observado) as monto
        from observaciones_sfp as ires
        join auditoria_dependencias     as dep      on ires.auditoria_id        = dep.auditoria_id
        join dependencies               as dep_cat  on dep.dependencia_id       = dep_cat.id
        join auditoria_anios_cuenta_pub as anio     on ires.auditoria_id        = anio.auditoria_id
        join observation_types          as tipos    on ires.tipo_observacion_id = tipos.id
        where not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dependencia, num_observacion, observacion, tipo_observacion, ejercicio, direccion_id, ires_id
        order by dep_cat.title, anio.anio_cuenta_pub, tipos.title, ires_id;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    l = []
    for row in rows:
        r = dict(row)
        r['estatus'] = ''
        l.append(r)

    return l

def preCYTG( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select pre.id as pre_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, pre.direccion_id as direccion_id, pre.num_observacion as num_observacion, pre.observacion as observacion, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto
        from observaciones_pre_cytg as pre
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on pre.tipo_observacion_id = tipos.id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dependencia, pre.num_observacion, pre.observacion, tipo_observacion, pre_id, ejercicio, direccion_id
        order by dependencia, ejercicio, tipo_observacion;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    l = []
    for row in rows:
        r = dict(row)
        r['estatus'] = ''
        l.append(r)

    return l

def preASENL( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, pre.direccion_id as direccion_id, pre.num_observacion as num_observacion, pre.observacion as observacion, count(pre.id) as cant_obs, sum(pre.monto_observado) as monto, estatus_pre_asenl.title as estatus
        from observaciones_pre_asenl as pre
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on pre.tipo_observacion_id = tipos.id
        join estatus_pre_asenl as estatus_pre_asenl on pre.estatus_proceso_id = estatus_pre_asenl.id
        where not pre.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dependencia, pre.num_observacion, observacion, tipo_observacion, estatus, ejercicio, direccion_id
        order by dependencia, ejercicio, tipo_observacion;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)
    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    l = []
    for row in rows:
        r = dict(row)
        l.append(r)

    return l


def iresASF( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, pre.direccion_id as direccion_id, pre.num_observacion as num_observacion, ires.observacion_ir as observacion, ires.monto_observado as monto
        from observaciones_ires_asf as ires
        join observaciones_pre_asf as pre on ires.id = pre.observacion_ires_id 
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on ires.tipo_observacion_id = tipos.id
        where not pre.blocked
    	    and not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, num_observacion, tipo_observacion, ires_id;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []


    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.estatus_id estatus_id, estatus_ires.title as estatus 
            from seguimientos_obs_asf as seg 
            join estatus_ires_asf as estatus_ires on seg.estatus_id = estatus_ires.id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['ires_id'] )

        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            
            
        r['estatus']         = ''
        r['num_observacion'] = ''   #No lo tiene como campo 
        r['cant_obs']        = 1    #No se agrupa -> 1
        if seg:
            segd = dict(seg[0])
            r['estatus']         = segd['estatus']
        
        l.append(r)

    return l



def iresCYTG( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, ires.clasif_final_cytg as clasif_final_cytg, ires.num_observacion as num_observacion, ires.observacion as observacion
        from observaciones_ires_cytg as ires
        join observaciones_pre_cytg as pre on ires.observacion_pre_id = pre.id
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on ires.tipo_observacion_id = tipos.id
        where not pre.blocked
    	    and not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dependencia, ejercicio, tipo_observacion;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []

    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.estatus_seguimiento_id estatus_id, estatus_ires.title as estatus 
            from seguimientos_obs_cytg as seg 
            join estatus_ires_cytg as estatus_ires on seg.estatus_seguimiento_id = estatus_ires.id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['ires_id'] )

        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            

        r['estatus']    = ''
        r['cant_obs']  = 1
        r['monto']     = 0
        if seg:
            segd = dict(seg[0])
            r['estatus']    = segd['estatus']
        l.append(r)

    return l


def iresASENL( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, tipos.title as tipo_observacion, ires.num_observacion as num_observacion, ires.observacion_final as observacion, count(pre.id) as cant_obs, sum(ires.monto_observado) as monto
        from observaciones_ires_asenl as ires
        join observaciones_pre_asenl as pre on ires.observacion_pre_id = pre.id
        join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
        join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
        join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
        join observation_types as tipos on ires.tipo_observacion_id = tipos.id
        where not pre.blocked
    	    and not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        group by dependencia, pre.num_observacion, observacion, tipo_observacion, ires_id, ejercicio, direccion_id
        order by dependencia, num_observacion, tipo_observacion;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []
    l = []
    for row in rows:
        r = dict(row)
        r['estatus']   = ''
        l.append(r)

    return l


def iresSFP( ignored_audit_str, ej_ini, ej_fin, ente, str_filtro_direccion ):
    sql = '''
        select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, ires.observacion, tipos.title as tipo_observacion, ires.direccion_id as direccion_id, ires.clave_observacion as num_observacion, ires.observacion, ires.monto_observado as monto
        from observaciones_sfp as ires
        join auditoria_dependencias     as dep      on ires.auditoria_id        = dep.auditoria_id
        join dependencies               as dep_cat  on dep.dependencia_id       = dep_cat.id
        join auditoria_anios_cuenta_pub as anio     on ires.auditoria_id        = anio.auditoria_id
        join observation_types          as tipos    on ires.tipo_observacion_id = tipos.id
        where not ires.blocked {}
            and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
            {}
        order by dep_cat.title, tipos.title, ires_id;
    '''.format( ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion)

    try:
        rows = exec_steady(sql)
    except EmptySetError:
        rows = []

    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.estatus_id estatus_id, estatus_ires.title as estatus 
            from seguimientos_obs_sfp as seg 
            join estatus_sfp as estatus_ires on seg.estatus_id = estatus_ires.id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['ires_id'] )

        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            

        r['estatus']  = ''
        r['cant_obs'] = 1
        if seg:
            segd = dict(seg[0])
            r['estatus']    = segd['estatus']

        l.append(r)
    return l

def setEntesIds():
    entesSql = "select * from fiscals;"
    try:
        entesRows = exec_steady(entesSql)
    except EmptySetError:
        rows = []

    entes = {}
    for e in entesRows:
        entes[e[1]] = e[0]

    return entes

def get_direction_filter(user_id):
    sql = 'select division_id from users where id = ' + str(user_id) + ' ;'
    try:
        direccion_id = exec_steady(sql)[0][0]
    except EmptySetError:
        direccion_id = 0
    str_filtro_direccion = 'and direccion_id = ' + str(direccion_id) if int(direccion_id) else ''
    return str_filtro_direccion

def get_ignored_audit_structs(ignored_audit_set, prefix):
    s = ''
    l = []
    while True:
        try:
            aud = str(ignored_audit_set.pop())
            l.append(aud)
            s += ' and ' + prefix + 'auditoria_id <> ' + aud
        except:
            break
    
    return s, l

