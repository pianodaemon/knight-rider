from dal.helper import exec_steady, get_direction_str_condition, get_ignored_audit_structs, get_ignored_audits
from misc.helperpg import EmptySetError, ServerError

def get(ej_ini, ej_fin, fiscal, reporte_num, division_id, auth, is_clasif):
    ''' Returns an instance of Reporte 56 and 58'''
    
    # Tratamiento de filtros
    ej_ini = int(ej_ini)
    ej_fin = int(ej_fin)
    reporte_num = str(reporte_num)
    str_filtro_direccion = get_direction_str_condition(int(division_id))
    is_clasif = True if is_clasif == 'True' else False

    if ej_fin < ej_ini:
        raise Exception('Verifique los valores del ejercicio ingresados')

    # Buscar las auditorias que seran ignoradas (multi-dependencia y multi-anio)
    ignored_audit_str, ignored_audit_ids = get_ignored_audit_structs(get_ignored_audits(), 'ires.')

    #Organos fiscalizadores
    entes = setEntesIds()

    if fiscal == 'SFP':
        sql = setSQLs( ignored_audit_str, ej_ini, ej_fin, reporte_num, 'SFP', str_filtro_direccion)
        l = getDataSFP( sql, entes['SFP'], ('SFPR' in auth) )
    elif fiscal == 'ASF':
        ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
        sql = setSQLs( ignored_audit_str, ej_ini, ej_fin, reporte_num, 'ASF', str_filtro_direccion)
        l = getDataASF( sql, entes['ASF'], ('ASFR' in auth) )
    elif fiscal == 'CYTG':
        ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
        sql = setSQLs( ignored_audit_str, ej_ini, ej_fin, reporte_num, 'CYTG', str_filtro_direccion)
        l = getDataCYTG( sql, entes['CyTG'], ('CYTR' in auth) )
    elif fiscal == 'ASENL':
        ignored_audit_str = ignored_audit_str.replace('ires.', 'pre.')
        sql = setSQLs( ignored_audit_str, ej_ini, ej_fin, reporte_num, 'ASENL', str_filtro_direccion)
        l = getDataASENL( sql, entes['ASENL'], ('ASER' in auth) )
    else:
        l = []

    if is_clasif:
        data_rows = setDataObj56(l) if (reporte_num == 'reporte56') else (setDataObj58(l) if (reporte_num == 'reporte58') else [])
    else:
        data_rows = setDataObjObs56(l) if (reporte_num == 'reporte56') else []

    return {
        'data_rows': data_rows,
        'ignored_audit_ids': ignored_audit_ids
    }



def getDataASF( sql, ente, permission ):
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []

    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.clasif_final_interna_cytg, seg.monto_pendiente_solventar, clas.title
            from seguimientos_obs_asf as seg 
            join clasifs_internas_cytg as clas on seg.clasif_final_interna_cytg = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['direccion_id'], ente, r['ires_id'])

        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            
            
        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = segd['clasif_final_interna_cytg']
            r['monto']       = segd['monto_pendiente_solventar']
            r['clasif_name'] = segd['title']
            l.append(r)

    return l


def getDataCYTG( sql, ente, permission ):
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    
    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.monto_pendiente_solventar, clas.title
            from seguimientos_obs_cytg as seg 
            join clasifs_internas_cytg as clas on {} = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format( r['clasif_final_cytg'], r['direccion_id'], ente, r['ires_id'])
    
        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            
            
        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = r['clasif_final_cytg']
            r['monto']       = segd['monto_pendiente_solventar']
            r['clasif_name'] = segd['title']
            l.append(r)
    
    return l



def getDataSFP( sql, ente, permission ):
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []

    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select seg.clasif_final_interna_cytg, seg.monto_pendiente_solventar, clas.title
            from seguimientos_obs_sfp as seg 
            join clasifs_internas_cytg as clas on seg.clasif_final_interna_cytg = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
            where observacion_id = {}
            order by seguimiento_id desc
            limit 1;
        '''.format(r['direccion_id'], ente, r['ires_id'])


        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []              
            
        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = segd['clasif_final_interna_cytg']
            r['monto']       = segd['monto_pendiente_solventar']
            r['clasif_name'] = segd['title']
            l.append(r)

    return l


def getDataASENL( sql, ente, permission ):
    try:
        rows = exec_steady(sql) if permission else []
    except EmptySetError:
        rows = []
    
    l = []
    for row in rows:
        r = dict(row)
        sql = '''
            select title 
            from clasifs_internas_cytg as clas 
            where {} = clas.sorting_val and {} = clas.direccion_id and {} = clas.org_fiscal_id
            limit 1;
        '''.format( r['clasif_final_cytg'], r['direccion_id'], ente, r['ires_id'])
    
        try:
            seg = exec_steady(sql)
        except EmptySetError:
            seg = []            

        if seg:
            segd = dict(seg[0])
            r['clasif_id']   = r['clasif_final_cytg']
            r['monto']       = r['monto_pendiente_solventar']
            r['clasif_name'] = segd['title']
            l.append(r)
    
    return l


def setDataObj56(l):
    data_rows = []
    data_rowsl = {}
    for i in l:
        key = (i['dependencia'], i['ejercicio'], i['tipo_observacion'], i['clasif_id'])
        if key in data_rowsl:
            data_rowsl[key]['cant_obs'] += 1
            data_rowsl[key]['monto'] += i['monto']
        else:
            data_rowsl[key] = {'cant_obs': 1, 'monto': i['monto'], 'clasif_name': i['clasif_name']}
    for item in data_rowsl:
        value = data_rowsl[item]
        o = {}
        o['dep']              = item[0]
        o['ej']               = item[1]
        o['tipo']             = item[2]
        o['clasif_name']      = value['clasif_name']
        o['c_obs']            = value['cant_obs']
        o['monto']            = value['monto']
        data_rows.append(o)
    return data_rows

def setDataObjObs56(l):
    data_rows = []
    for item in l:
        o = {}
        o['dep']              = item['dependencia']
        o['ej']               = item['ejercicio']
        o['tipo']             = item['tipo_observacion']
        o['clasif_name']      = item['observacion']
        o['c_obs']            = 1
        o['monto']            = item['monto']
        data_rows.append(o)
    return data_rows

def setDataObj58(l):
    data_rows = []
    data_rowsl = {}
    for i in l:
        key = (i['dependencia'], i['clasif_id'])
        if key in data_rowsl:
            data_rowsl[key]['cant_obs'] += 1
            data_rowsl[key]['monto'] += i['monto']
        else:
            data_rowsl[key] = {'cant_obs': 1, 'monto': i['monto'], 'clasif_name': i['clasif_name']}
    for item in data_rowsl:
        value = data_rowsl[item]
        o = {}
        o['dep']              = item[0]
        o['ej']               = 0
        o['tipo']             = ''
        o['clasif_name']      = value['clasif_name']
        o['c_obs']            = value['cant_obs']
        o['monto']            = value['monto']
        data_rows.append(o)
    return data_rows


def setSQLs( ignored_audit_str, ej_ini, ej_fin, repNum, ent, str_filtro_direccion ):
    if repNum == 'reporte56':
        strSelectTipo = ' tipos.title as tipo_observacion,'
        strJOINTipo = 'join observation_types as tipos on ires.tipo_observacion_id = tipos.id'
        strOrderBy = ', ejercicio, tipo_observacion '
    else:
        strSelectTipo = ''
        strJOINTipo = ''
        strOrderBy = ''

    sqls = {
        'ASF': '''
            select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, {} pre.direccion_id as direccion_id, ires.observacion_ir as observacion
            from observaciones_ires_asf as ires
            join observaciones_pre_asf as pre on ires.id = pre.observacion_ires_id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
            {}
            where not pre.blocked
    	        and not ires.blocked {}
                and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
                {}
            order by dependencia {};
        '''.format( strSelectTipo, strJOINTipo, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, strOrderBy),
        'SFP': '''
            select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, {} ires.direccion_id as direccion_id, ires.observacion as observacion
            from observaciones_sfp as ires
            join auditoria_dependencias     as dep      on ires.auditoria_id        = dep.auditoria_id
            join dependencies               as dep_cat  on dep.dependencia_id       = dep_cat.id
            join auditoria_anios_cuenta_pub as anio     on ires.auditoria_id        = anio.auditoria_id
            {}
            where not ires.blocked {}
                and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
                {}
            order by dependencia {};
        '''.format( strSelectTipo, strJOINTipo, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, strOrderBy),
        'CYTG': '''
            select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, {} pre.direccion_id as direccion_id, ires.clasif_final_cytg as clasif_final_cytg, ires.observacion as observacion
            from observaciones_ires_cytg as ires
            join observaciones_pre_cytg as pre on ires.observacion_pre_id = pre.id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
            {}
            where not pre.blocked
    	        and not ires.blocked {}
                and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
                {}
            order by dependencia {};
        '''.format( strSelectTipo, strJOINTipo, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, strOrderBy),
        'ASENL': '''
            select ires.id as ires_id, dep_cat.title as dependencia, anio.anio_cuenta_pub as ejercicio, {} pre.direccion_id as direccion_id, ires.clasif_final_cytg as clasif_final_cytg, ires.monto_pendiente_solventar as monto_pendiente_solventar, ires.observacion_final as observacion
            from observaciones_ires_asenl as ires
            join observaciones_pre_asenl as pre on ires.observacion_pre_id = pre.id
            join auditoria_dependencias as dep on pre.auditoria_id = dep.auditoria_id
            join dependencies as dep_cat on dep.dependencia_id = dep_cat.id
            join auditoria_anios_cuenta_pub as anio on pre.auditoria_id = anio.auditoria_id
            {}
            where not pre.blocked {}
                and anio.anio_cuenta_pub >= {} and anio.anio_cuenta_pub <= {}
                {}
            order by dependencia {};
        '''.format( strSelectTipo, strJOINTipo, ignored_audit_str, ej_ini, ej_fin, str_filtro_direccion, strOrderBy),
    }
    return sqls[ent]

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
