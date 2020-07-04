--
-- Name: alter_audit(integer, character varying, integer[], integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_audit(_audit_id integer, _title character varying, _dependency_ids integer[], _years integer[]) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    latter_id integer := 0;
	dependency_ids_arr_len integer := array_length(_dependency_ids, 1);
	years_arr_len integer := array_length(_years, 1);
	idx integer := 0;
	row_counter bigint := 0;
	aux_arr integer[];
	aux_arr2 integer[];

    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _audit_id = 0 THEN

            INSERT INTO audits (
                title,
                inception_time,
                touch_latter_time
            ) VALUES (
                _title,
                current_moment,
                current_moment
            ) RETURNING id INTO latter_id;
			
			for idx in 1 .. dependency_ids_arr_len loop
				aux_arr[idx] = latter_id;
			end loop;
			
			insert into auditoria_dependencias
			select *
			from unnest(aux_arr, _dependency_ids);
			
			for idx in 1 .. years_arr_len loop
				aux_arr2[idx] = latter_id;
			end loop;
			
			insert into auditoria_anios_cuenta_pub
			select *
			from unnest(aux_arr2, _years);


        WHEN _audit_id > 0 THEN

            UPDATE audits
            SET title = _title,
                touch_latter_time = current_moment
            WHERE id = _audit_id;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'Audit identifier % does not exist', _audit_id;
			end if;
			
			delete from auditoria_dependencias where auditoria_id = _audit_id;
			
			for idx in 1 .. dependency_ids_arr_len loop
				aux_arr[idx] = _audit_id;
			end loop;
			
			insert into auditoria_dependencias
			select *
			from unnest(aux_arr, _dependency_ids);

			delete from auditoria_anios_cuenta_pub where auditoria_id = _audit_id;
						
			for idx in 1 .. years_arr_len loop
				aux_arr2[idx] = _audit_id;
			end loop;
			
			insert into auditoria_anios_cuenta_pub
			select *
			from unnest(aux_arr2, _years);

            -- Upon edition we return audit id as latter id
            latter_id = _audit_id;


        ELSE
            RAISE EXCEPTION 'negative audit identifier % is unsupported', _audit_id;

    END CASE;

    return ( latter_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_audit(_audit_id integer, _title character varying, _dependency_ids integer[], _years integer[]) OWNER TO postgres;


--
-- Name: alter_observacion_ires_asf(integer, integer, character varying, date, date, text, integer, character varying, character varying, double precision, double precision, double precision, date, double precision, boolean, public.seguimientos_obs_asf[], public.pras_ires_asf); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_ires_asf(_observacion_id integer, _observacion_pre_id integer, _num_oficio_of character varying, _fecha_recibido date, _fecha_vencimiento date, _observacion_ir text, _tipo_observacion_id integer, _accion character varying, _clave_accion character varying, _monto_observado double precision, _monto_a_reintegrar double precision, _monto_reintegrado double precision, _fecha_reintegro date, _monto_por_reintegrar double precision, _tiene_pras boolean, _seguimientos public.seguimientos_obs_asf[], _pras public.pras_ires_asf) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    ult_obs_id integer := 0;
	seguimientos_arr_len integer := array_length(_seguimientos, 1);
	idx integer := 0;
	row_counter bigint := 0;
	
    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observacion_id = 0 THEN
		
            INSERT INTO observaciones_ires_asf (
				observacion_pre_id,
				num_oficio_of,
				fecha_recibido,
				fecha_vencimiento,
				observacion_ir,
				tipo_observacion_id,
				accion,
				clave_accion,
				monto_observado,
				monto_a_reintegrar,
				monto_reintegrado,
				fecha_reintegro,
				monto_por_reintegrar,
				tiene_pras,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
				_observacion_pre_id,
				_num_oficio_of,
				_fecha_recibido,
				_fecha_vencimiento,
				_observacion_ir,
				_tipo_observacion_id,
				_accion,
				_clave_accion,
				_monto_observado,
				_monto_a_reintegrar,
				_monto_reintegrado,
				_fecha_reintegro,
				_monto_por_reintegrar,
				_tiene_pras,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;
			
            FOR idx IN 1 .. seguimientos_arr_len LOOP

                INSERT INTO seguimientos_obs_asf
				VALUES (
                    ult_obs_id,
					_seguimientos[idx].seguimiento_id,
					_seguimientos[idx].medio_notif_seguimiento_id,
					_seguimientos[idx].num_oficio_cytg_oic,
					_seguimientos[idx].fecha_oficio_cytg_oic,
					_seguimientos[idx].fecha_recibido_dependencia,
					_seguimientos[idx].fecha_vencimiento_cytg,
					_seguimientos[idx].num_oficio_resp_dependencia,
					_seguimientos[idx].fecha_recibido_oficio_resp,
					_seguimientos[idx].resp_dependencia,
					_seguimientos[idx].comentarios,
					_seguimientos[idx].clasif_final_interna_cytg,
					_seguimientos[idx].num_oficio_org_fiscalizador,
					_seguimientos[idx].fecha_oficio_org_fiscalizador,
					_seguimientos[idx].estatus_id,
					_seguimientos[idx].monto_solventado,
					_seguimientos[idx].num_oficio_monto_solventado,
					_seguimientos[idx].fecha_oficio_monto_solventado,
					_seguimientos[idx].monto_pendiente_solventar
                );
            
			END LOOP;
			
			if _tiene_pras then
				
				INSERT INTO pras_ires_asf
				values (
					ult_obs_id,
					_pras.num_oficio_of_vista_cytg,
					_pras.fecha_oficio_of_vista_cytg,
					_pras.num_oficio_cytg_aut_invest,
					_pras.fecha_oficio_cytg_aut_invest,
					_pras.num_carpeta_investigacion,
					_pras.num_oficio_cytg_org_fiscalizador,
					_pras.fecha_oficio_cytg_org_fiscalizador,
					_pras.num_oficio_vai_municipio,
					_pras.fecha_oficio_vai_municipio,
					_pras.autoridad_invest_id,
					_pras.num_oficio_pras_of,
					_pras.fecha_oficio_pras_of,
					_pras.num_oficio_pras_cytg_dependencia,
					_pras.num_oficio_resp_dependencia,
					_pras.fecha_oficio_resp_dependencia
				);
				
			end if;


        WHEN _observacion_id > 0 THEN

			-- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- STARTS - Validates observacion ASF (IRes) id
            --
            -- JUSTIFICATION: Because UPDATE statement does not issue
            -- any exception if nothing was updated.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            SELECT count(id)
            FROM observaciones_ires_asf INTO coincidences
            WHERE NOT blocked AND id = _observacion_id;

            IF NOT coincidences = 1 THEN
                RAISE EXCEPTION 'observation ASF (IRes) identifier % does not exist', _observacion_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validates observacion ASF (IRes) id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE observaciones_ires_asf
            SET observacion_pre_id = _observacion_pre_id,
				num_oficio_of = _num_oficio_of,
				fecha_recibido = _fecha_recibido,
				fecha_vencimiento = _fecha_vencimiento,
				observacion_ir = _observacion_ir,
				tipo_observacion_id = _tipo_observacion_id,
				accion = _accion,
				clave_accion = _clave_accion,
				monto_observado = _monto_observado,
				monto_a_reintegrar = _monto_a_reintegrar,
				monto_reintegrado = _monto_reintegrado,
				fecha_reintegro = _fecha_reintegro,
				monto_por_reintegrar = _monto_por_reintegrar,
				tiene_pras = _tiene_pras,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;

            delete from seguimientos_obs_asf where observacion_id = _observacion_id;
			
			FOR idx IN 1 .. seguimientos_arr_len LOOP

                INSERT INTO seguimientos_obs_asf
				VALUES (
                    _observacion_id,
					_seguimientos[idx].seguimiento_id,
					_seguimientos[idx].medio_notif_seguimiento_id,
					_seguimientos[idx].num_oficio_cytg_oic,
					_seguimientos[idx].fecha_oficio_cytg_oic,
					_seguimientos[idx].fecha_recibido_dependencia,
					_seguimientos[idx].fecha_vencimiento_cytg,
					_seguimientos[idx].num_oficio_resp_dependencia,
					_seguimientos[idx].fecha_recibido_oficio_resp,
					_seguimientos[idx].resp_dependencia,
					_seguimientos[idx].comentarios,
					_seguimientos[idx].clasif_final_interna_cytg,
					_seguimientos[idx].num_oficio_org_fiscalizador,
					_seguimientos[idx].fecha_oficio_org_fiscalizador,
					_seguimientos[idx].estatus_id,
					_seguimientos[idx].monto_solventado,
					_seguimientos[idx].num_oficio_monto_solventado,
					_seguimientos[idx].fecha_oficio_monto_solventado,				
					_seguimientos[idx].monto_pendiente_solventar
                );
            
			END LOOP;
			
			if _tiene_pras then
			
				update pras_ires_asf
				set num_oficio_of_vista_cytg = _pras.num_oficio_of_vista_cytg,
					fecha_oficio_of_vista_cytg = _pras.fecha_oficio_of_vista_cytg,
					num_oficio_cytg_aut_invest = _pras.num_oficio_cytg_aut_invest,
					fecha_oficio_cytg_aut_invest = _pras.fecha_oficio_cytg_aut_invest,
					num_carpeta_investigacion = _pras.num_carpeta_investigacion,
					num_oficio_cytg_org_fiscalizador = _pras.num_oficio_cytg_org_fiscalizador,
					fecha_oficio_cytg_org_fiscalizador = _pras.fecha_oficio_cytg_org_fiscalizador,
					num_oficio_vai_municipio = _pras.num_oficio_vai_municipio,
					fecha_oficio_vai_municipio = _pras.fecha_oficio_vai_municipio,
					autoridad_invest_id = _pras.autoridad_invest_id,
					num_oficio_pras_of = _pras.num_oficio_pras_of,
					fecha_oficio_pras_of = _pras.fecha_oficio_pras_of,
					num_oficio_pras_cytg_dependencia = _pras.num_oficio_pras_cytg_dependencia,
					num_oficio_resp_dependencia = _pras.num_oficio_resp_dependencia,
					fecha_oficio_resp_dependencia = _pras.fecha_oficio_resp_dependencia
				where pras_observacion_id = _observacion_id;
				
				GET DIAGNOSTICS row_counter = ROW_COUNT;
				if row_counter <> 1 then
					
					insert into pras_ires_asf
					values (
						_observacion_id,
						_pras.num_oficio_of_vista_cytg,
						_pras.fecha_oficio_of_vista_cytg,
						_pras.num_oficio_cytg_aut_invest,
						_pras.fecha_oficio_cytg_aut_invest,
						_pras.num_carpeta_investigacion,
						_pras.num_oficio_cytg_org_fiscalizador,
						_pras.fecha_oficio_cytg_org_fiscalizador,
						_pras.num_oficio_vai_municipio,
						_pras.fecha_oficio_vai_municipio,
						_pras.autoridad_invest_id,
						_pras.num_oficio_pras_of,
						_pras.fecha_oficio_pras_of,
						_pras.num_oficio_pras_cytg_dependencia,
						_pras.num_oficio_resp_dependencia,
						_pras.fecha_oficio_resp_dependencia
					);
				
				end if;
				
			else
			
				delete from pras_ires_asf where pras_observacion_id = _observacion_id;
			
			end if;
			
			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'negative observation ASF (IRes) identifier % is unsupported', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_ires_asf(_observacion_id integer, _observacion_pre_id integer, _num_oficio_of character varying, _fecha_recibido date, _fecha_vencimiento date, _observacion_ir text, _tipo_observacion_id integer, _accion character varying, _clave_accion character varying, _monto_observado double precision, _monto_a_reintegrar double precision, _monto_reintegrado double precision, _fecha_reintegro date, _monto_por_reintegrar double precision, _tiene_pras boolean, _seguimientos public.seguimientos_obs_asf[], _pras public.pras_ires_asf) OWNER TO postgres;


--
-- Name: alter_observacion_pre_asenl(integer, integer, text, integer, double precision, date, integer, character varying, integer, character varying, date, date, integer, character varying, text, double precision, character varying, date, date, date, character varying, date, text, text, integer, character varying, date, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_pre_asenl(_observacion_id integer, _direccion_id integer, _compartida_observacion text, _compartida_tipo_observacion_id integer, _compartida_monto double precision, _fecha_captura date, _programa_social_id integer, _tipo_auditoria character varying, _auditoria_id integer, _num_oficio_notif_obs_prelim character varying, _fecha_recibido date, _fecha_vencimiento_of date, _tipo_observacion_id integer, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg_oic character varying, _fecha_oficio_cytg_oic date, _fecha_recibido_dependencia date, _fecha_vencimiento_cytg date, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp date, _resp_dependencia text, _comentarios text, _clasif_final_cytg integer, _num_oficio_org_fiscalizador character varying, _fecha_oficio_org_fiscalizador date, _estatus_proceso_id integer, _proyeccion_solventacion_id integer, _resultado_final_pub_id integer) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    ult_obs_id integer := 0;
	row_counter bigint := 0;
	
    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observacion_id = 0 THEN
		
            INSERT INTO observaciones_pre_asenl (
                direccion_id,
				compartida_observacion,
				compartida_tipo_observacion_id,
				compartida_monto,
				fecha_captura,
				programa_social_id,
				tipo_auditoria,
				auditoria_id,
				num_oficio_notif_obs_prelim,
				fecha_recibido,
				fecha_vencimiento_of,
				tipo_observacion_id,
				num_observacion,
				observacion,
				monto_observado,
				num_oficio_cytg_oic,
				fecha_oficio_cytg_oic,
				fecha_recibido_dependencia,
				fecha_vencimiento_cytg,
				num_oficio_resp_dependencia,
				fecha_oficio_resp,
				resp_dependencia,
				comentarios,
				clasif_final_cytg,
				num_oficio_org_fiscalizador,
				fecha_oficio_org_fiscalizador,
				estatus_proceso_id,
				proyeccion_solventacion_id,
				resultado_final_pub_id,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
				_direccion_id,
				_compartida_observacion,
				_compartida_tipo_observacion_id,
				_compartida_monto,
				_fecha_captura,
				_programa_social_id,
				_tipo_auditoria,
				_auditoria_id,
				_num_oficio_notif_obs_prelim,
				_fecha_recibido,
				_fecha_vencimiento_of,
				_tipo_observacion_id,
				_num_observacion,
				_observacion,
				_monto_observado,
				_num_oficio_cytg_oic,
				_fecha_oficio_cytg_oic,
				_fecha_recibido_dependencia,
				_fecha_vencimiento_cytg,
				_num_oficio_resp_dependencia,
				_fecha_oficio_resp,
				_resp_dependencia,
				_comentarios,
				_clasif_final_cytg,
				_num_oficio_org_fiscalizador,
				_fecha_oficio_org_fiscalizador,
				_estatus_proceso_id,
				_proyeccion_solventacion_id,
				_resultado_final_pub_id,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;

        WHEN _observacion_id > 0 THEN

            UPDATE observaciones_pre_asenl
            SET direccion_id = _direccion_id,
				compartida_observacion = _compartida_observacion,
				compartida_tipo_observacion_id = _compartida_tipo_observacion_id,
				compartida_monto = _compartida_monto,
				fecha_captura = _fecha_captura,
				programa_social_id = _programa_social_id,
				tipo_auditoria = _tipo_auditoria,
				auditoria_id = _auditoria_id,
				num_oficio_notif_obs_prelim = _num_oficio_notif_obs_prelim,
				fecha_recibido = _fecha_recibido,
				fecha_vencimiento_of = _fecha_vencimiento_of,
				tipo_observacion_id = _tipo_observacion_id,
				num_observacion = _num_observacion,
				observacion = _observacion,
				monto_observado = _monto_observado,
				num_oficio_cytg_oic = _num_oficio_cytg_oic,
				fecha_oficio_cytg_oic = _fecha_oficio_cytg_oic,
				fecha_recibido_dependencia = _fecha_recibido_dependencia,
				fecha_vencimiento_cytg = _fecha_vencimiento_cytg,
				num_oficio_resp_dependencia = _num_oficio_resp_dependencia,
				fecha_oficio_resp = _fecha_oficio_resp,
				resp_dependencia = _resp_dependencia,
				comentarios = _comentarios,
				clasif_final_cytg = _clasif_final_cytg,
				num_oficio_org_fiscalizador = _num_oficio_org_fiscalizador,
				fecha_oficio_org_fiscalizador = _fecha_oficio_org_fiscalizador,
				estatus_proceso_id = _estatus_proceso_id,
				proyeccion_solventacion_id = _proyeccion_solventacion_id,
				resultado_final_pub_id = _resultado_final_pub_id,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'Observación preliminar de ASENL con id % no existe', _observacion_id;
			end if;
			
			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'Observación preliminar de ASENL con id % no soportado', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_pre_asenl(_observacion_id integer, _direccion_id integer, _compartida_observacion text, _compartida_tipo_observacion_id integer, _compartida_monto double precision, _fecha_captura date, _programa_social_id integer, _tipo_auditoria character varying, _auditoria_id integer, _num_oficio_notif_obs_prelim character varying, _fecha_recibido date, _fecha_vencimiento_of date, _tipo_observacion_id integer, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg_oic character varying, _fecha_oficio_cytg_oic date, _fecha_recibido_dependencia date, _fecha_vencimiento_cytg date, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp date, _resp_dependencia text, _comentarios text, _clasif_final_cytg integer, _num_oficio_org_fiscalizador character varying, _fecha_oficio_org_fiscalizador date, _estatus_proceso_id integer, _proyeccion_solventacion_id integer, _resultado_final_pub_id integer) OWNER TO postgres;


--
-- Name: alter_observacion_pre_asf(integer, integer, date, integer, integer, character varying, date, date, character varying, text, double precision, character varying, date, date, date, character varying, date, text, text, integer, character varying, date, integer, integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_pre_asf(_observacion_id integer, _direccion_id integer, _fecha_captura date, _programa_social_id integer, _auditoria_id integer, _num_oficio_of character varying, _fecha_recibido date, _fecha_vencimiento_of date, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg character varying, _fecha_oficio_cytg date, _fecha_recibido_dependencia date, _fecha_vencimiento date, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp_dependencia date, _resp_dependencia text, _comentarios text, _clasif_final_cytg integer, _num_oficio_org_fiscalizador character varying, _fecha_oficio_org_fiscalizador date, _estatus_criterio_int_id integer, _proyecciones integer[]) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    ult_obs_id integer := 0;
	proyecciones_arr_len integer := array_length(_proyecciones, 1);
	proyecciones_aux_arr integer[];
	idx integer := 0;
	
    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observacion_id = 0 THEN
		
            INSERT INTO observaciones_pre_asf (
                direccion_id,
				fecha_captura,
				programa_social_id,
				auditoria_id,
				num_oficio_of,
				fecha_recibido,
				fecha_vencimiento_of,
				num_observacion,
				observacion,
				monto_observado,
				num_oficio_cytg,
				fecha_oficio_cytg,
				fecha_recibido_dependencia,
				fecha_vencimiento,
				num_oficio_resp_dependencia,
				fecha_oficio_resp_dependencia,
				resp_dependencia,
				comentarios,
				clasif_final_cytg,
				num_oficio_org_fiscalizador,
				fecha_oficio_org_fiscalizador,
				estatus_criterio_int_id,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
                _direccion_id,
				_fecha_captura,
				_programa_social_id,
				_auditoria_id,
				_num_oficio_of,
				_fecha_recibido,
				_fecha_vencimiento_of,
				_num_observacion,
				_observacion,
				_monto_observado,
				_num_oficio_cytg,
				_fecha_oficio_cytg,
				_fecha_recibido_dependencia,
				_fecha_vencimiento,
				_num_oficio_resp_dependencia,
				_fecha_oficio_resp_dependencia,
				_resp_dependencia,
				_comentarios,
				_clasif_final_cytg,
				_num_oficio_org_fiscalizador,
				_fecha_oficio_org_fiscalizador,
				_estatus_criterio_int_id,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;
			
			for idx in 1 .. proyecciones_arr_len loop
				proyecciones_aux_arr[idx] = ult_obs_id;
			end loop;
			
			INSERT INTO proyecciones_obs_asf
			select *
			from unnest(proyecciones_aux_arr, _proyecciones);
			

        WHEN _observacion_id > 0 THEN

			-- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- STARTS - Validates observacion preliminar ASF id
            --
            -- JUSTIFICATION: Because UPDATE statement does not issue
            -- any exception if nothing was updated.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            SELECT count(id)
            FROM observaciones_pre_asf INTO coincidences
            WHERE NOT blocked AND id = _observacion_id;

            IF NOT coincidences = 1 THEN
                RAISE EXCEPTION 'Observacion preliminar ASF con id % no existe', _observacion_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validates observacion preliminar ASF id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE observaciones_pre_asf
            SET direccion_id = _direccion_id,
				fecha_captura = _fecha_captura,
				programa_social_id = _programa_social_id,
				auditoria_id = _auditoria_id,
				num_oficio_of = _num_oficio_of,
				fecha_recibido = _fecha_recibido,
				fecha_vencimiento_of = _fecha_vencimiento_of,
				num_observacion = _num_observacion,
				observacion = _observacion,
				monto_observado = _monto_observado,
				num_oficio_cytg = _num_oficio_cytg,
				fecha_oficio_cytg = _fecha_oficio_cytg,
				fecha_recibido_dependencia = _fecha_recibido_dependencia,
				fecha_vencimiento = _fecha_vencimiento,
				num_oficio_resp_dependencia = _num_oficio_resp_dependencia,
				fecha_oficio_resp_dependencia = _fecha_oficio_resp_dependencia,
				resp_dependencia = _resp_dependencia,
				comentarios = _comentarios,
				clasif_final_cytg = _clasif_final_cytg,
				num_oficio_org_fiscalizador = _num_oficio_org_fiscalizador,
				fecha_oficio_org_fiscalizador = _fecha_oficio_org_fiscalizador,
				estatus_criterio_int_id = _estatus_criterio_int_id,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;
			
			delete from proyecciones_obs_asf where observacion_id = _observacion_id;
			
			for idx in 1 .. proyecciones_arr_len loop
				proyecciones_aux_arr[idx] = _observacion_id;
			end loop;
			
			INSERT INTO proyecciones_obs_asf
			select *
			from unnest(proyecciones_aux_arr, _proyecciones);

			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'Observacion preliminar ASF con id % no soportado', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_pre_asf(_observacion_id integer, _direccion_id integer, _fecha_captura date, _programa_social_id integer, _auditoria_id integer, _num_oficio_of character varying, _fecha_recibido date, _fecha_vencimiento_of date, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg character varying, _fecha_oficio_cytg date, _fecha_recibido_dependencia date, _fecha_vencimiento date, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp_dependencia date, _resp_dependencia text, _comentarios text, _clasif_final_cytg integer, _num_oficio_org_fiscalizador character varying, _fecha_oficio_org_fiscalizador date, _estatus_criterio_int_id integer, _proyecciones integer[]) OWNER TO postgres;


--
-- Name: alter_observacion_sfp(integer, integer, date, integer, integer, character varying, date, date, character varying, text, character varying, character varying, integer, double precision, public.seguimientos_obs_sfp[], double precision, double precision, date, double precision, character varying, date, character varying, date, character varying, character varying, date, integer, character varying, date, character varying, character varying, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_sfp(_observacion_id integer, _direccion_id integer, _fecha_captura date, _programa_social_id integer, _auditoria_id integer, _acta_cierre character varying, _fecha_firma_acta_cierre date, _fecha_compromiso date, _clave_observacion character varying, _observacion text, _acciones_correctivas character varying, _acciones_preventivas character varying, _tipo_observacion_id integer, _monto_observado double precision, _seguimientos public.seguimientos_obs_sfp[], _monto_a_reintegrar double precision, _monto_reintegrado double precision, _fecha_reintegro date, _monto_por_reintegrar double precision, _num_oficio_of_vista_cytg character varying, _fecha_oficio_of_vista_cytg date, _num_oficio_cytg_aut_invest character varying, _fecha_oficio_cytg_aut_invest date, _num_carpeta_investigacion character varying, _num_oficio_vai_municipio character varying, _fecha_oficio_vai_municipio date, _autoridad_invest_id integer, _num_oficio_pras_of character varying, _fecha_oficio_pras_of date, _num_oficio_pras_cytg_dependencia character varying, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp_dependencia date) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    ult_obs_id integer := 0;
	seguimientos_arr_len integer := array_length(_seguimientos, 1);
	idx integer := 0;
	
    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observacion_id = 0 THEN
		
            INSERT INTO observaciones_sfp (
                direccion_id,
				fecha_captura,
				programa_social_id,
				auditoria_id,
				acta_cierre,
				fecha_firma_acta_cierre,
				fecha_compromiso,
				clave_observacion,
				observacion,
				acciones_correctivas,
				acciones_preventivas,
				tipo_observacion_id,
				monto_observado,
				monto_a_reintegrar,
				monto_reintegrado,
				fecha_reintegro,
				monto_por_reintegrar,
				num_oficio_of_vista_cytg,
				fecha_oficio_of_vista_cytg,
				num_oficio_cytg_aut_invest,
				fecha_oficio_cytg_aut_invest,
				num_carpeta_investigacion,
				num_oficio_vai_municipio,
				fecha_oficio_vai_municipio,
				autoridad_invest_id,
				num_oficio_pras_of,
				fecha_oficio_pras_of,
				num_oficio_pras_cytg_dependencia,
				num_oficio_resp_dependencia,
				fecha_oficio_resp_dependencia,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
                _direccion_id,
				_fecha_captura,
				_programa_social_id,
				_auditoria_id,
				_acta_cierre,
				_fecha_firma_acta_cierre,
				_fecha_compromiso,
				_clave_observacion,
				_observacion,
				_acciones_correctivas,
				_acciones_preventivas,
				_tipo_observacion_id,
				_monto_observado,
				_monto_a_reintegrar,
				_monto_reintegrado,
				_fecha_reintegro,
				_monto_por_reintegrar,
				_num_oficio_of_vista_cytg,
				_fecha_oficio_of_vista_cytg,
				_num_oficio_cytg_aut_invest,
				_fecha_oficio_cytg_aut_invest,
				_num_carpeta_investigacion,
				_num_oficio_vai_municipio,
				_fecha_oficio_vai_municipio,
				_autoridad_invest_id,
				_num_oficio_pras_of,
				_fecha_oficio_pras_of,
				_num_oficio_pras_cytg_dependencia,
				_num_oficio_resp_dependencia,
				_fecha_oficio_resp_dependencia,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;
			
            FOR idx IN 1 .. seguimientos_arr_len LOOP

                INSERT INTO seguimientos_obs_sfp(
                    observacion_id,
					seguimiento_id,
					num_oficio_cytg_oic,
					fecha_oficio_cytg_oic,
					fecha_recibido_dependencia,
					fecha_vencimiento_cytg,
					num_oficio_resp_dependencia,
					fecha_recibido_oficio_resp,
					resp_dependencia,
					comentarios,
					clasif_final_interna_cytg,
					num_oficio_org_fiscalizador,
					fecha_oficio_org_fiscalizador,
					estatus_id,
					monto_solventado,
					monto_pendiente_solventar
                ) VALUES (
                    ult_obs_id,
					_seguimientos[idx].seguimiento_id,
					_seguimientos[idx].num_oficio_cytg_oic,
					_seguimientos[idx].fecha_oficio_cytg_oic,
					_seguimientos[idx].fecha_recibido_dependencia,
					_seguimientos[idx].fecha_vencimiento_cytg,
					_seguimientos[idx].num_oficio_resp_dependencia,
					_seguimientos[idx].fecha_recibido_oficio_resp,
					_seguimientos[idx].resp_dependencia,
					_seguimientos[idx].comentarios,
					_seguimientos[idx].clasif_final_interna_cytg,
					_seguimientos[idx].num_oficio_org_fiscalizador,
					_seguimientos[idx].fecha_oficio_org_fiscalizador,
					_seguimientos[idx].estatus_id,
					_seguimientos[idx].monto_solventado,
					_seguimientos[idx].monto_pendiente_solventar
                );
            
			END LOOP;
			

        WHEN _observacion_id > 0 THEN

			-- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- STARTS - Validates observacion SFP id
            --
            -- JUSTIFICATION: Because UPDATE statement does not issue
            -- any exception if nothing was updated.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            SELECT count(id)
            FROM observaciones_sfp INTO coincidences
            WHERE NOT blocked AND id = _observacion_id;

            IF NOT coincidences = 1 THEN
                RAISE EXCEPTION 'observation SFP identifier % does not exist', _observacion_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validates observacion SFP id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE observaciones_sfp
            SET direccion_id = _direccion_id,
				fecha_captura = _fecha_captura,
				programa_social_id = _programa_social_id,
				auditoria_id = _auditoria_id,
				acta_cierre = _acta_cierre,
				fecha_firma_acta_cierre = _fecha_firma_acta_cierre,
				fecha_compromiso = _fecha_compromiso,
				clave_observacion = _clave_observacion,
				observacion = _observacion,
				acciones_correctivas = _acciones_correctivas,
				acciones_preventivas = _acciones_preventivas,
				tipo_observacion_id = _tipo_observacion_id,
				monto_observado = _monto_observado,
				monto_a_reintegrar = _monto_a_reintegrar,
				monto_reintegrado = _monto_reintegrado,
				fecha_reintegro = _fecha_reintegro,
				monto_por_reintegrar = _monto_por_reintegrar,
				num_oficio_of_vista_cytg = _num_oficio_of_vista_cytg,
				fecha_oficio_of_vista_cytg = _fecha_oficio_of_vista_cytg,
				num_oficio_cytg_aut_invest = _num_oficio_cytg_aut_invest,
				fecha_oficio_cytg_aut_invest = _fecha_oficio_cytg_aut_invest,
				num_carpeta_investigacion = _num_carpeta_investigacion,
				num_oficio_vai_municipio = _num_oficio_vai_municipio,
				fecha_oficio_vai_municipio = _fecha_oficio_vai_municipio,
				autoridad_invest_id = _autoridad_invest_id,
				num_oficio_pras_of = _num_oficio_pras_of,
				fecha_oficio_pras_of = _fecha_oficio_pras_of,
				num_oficio_pras_cytg_dependencia = _num_oficio_pras_cytg_dependencia,
				num_oficio_resp_dependencia = _num_oficio_resp_dependencia,
				fecha_oficio_resp_dependencia = _fecha_oficio_resp_dependencia,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;

            delete from seguimientos_obs_sfp where observacion_id = _observacion_id;
			
			FOR idx IN 1 .. seguimientos_arr_len LOOP

                INSERT INTO seguimientos_obs_sfp(
                    observacion_id,
					seguimiento_id,
					num_oficio_cytg_oic,
					fecha_oficio_cytg_oic,
					fecha_recibido_dependencia,
					fecha_vencimiento_cytg,
					num_oficio_resp_dependencia,
					fecha_recibido_oficio_resp,
					resp_dependencia,
					comentarios,
					clasif_final_interna_cytg,
					num_oficio_org_fiscalizador,
					fecha_oficio_org_fiscalizador,
					estatus_id,
					monto_solventado,
					monto_pendiente_solventar
                ) VALUES (
                    _observacion_id,
					_seguimientos[idx].seguimiento_id,
					_seguimientos[idx].num_oficio_cytg_oic,
					_seguimientos[idx].fecha_oficio_cytg_oic,
					_seguimientos[idx].fecha_recibido_dependencia,
					_seguimientos[idx].fecha_vencimiento_cytg,
					_seguimientos[idx].num_oficio_resp_dependencia,
					_seguimientos[idx].fecha_recibido_oficio_resp,
					_seguimientos[idx].resp_dependencia,
					_seguimientos[idx].comentarios,
					_seguimientos[idx].clasif_final_interna_cytg,
					_seguimientos[idx].num_oficio_org_fiscalizador,
					_seguimientos[idx].fecha_oficio_org_fiscalizador,
					_seguimientos[idx].estatus_id,
					_seguimientos[idx].monto_solventado,
					_seguimientos[idx].monto_pendiente_solventar
                );
            
			END LOOP;
			
			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'negative observation SFP identifier % is unsupported', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_sfp(_observacion_id integer, _direccion_id integer, _fecha_captura date, _programa_social_id integer, _auditoria_id integer, _acta_cierre character varying, _fecha_firma_acta_cierre date, _fecha_compromiso date, _clave_observacion character varying, _observacion text, _acciones_correctivas character varying, _acciones_preventivas character varying, _tipo_observacion_id integer, _monto_observado double precision, _seguimientos public.seguimientos_obs_sfp[], _monto_a_reintegrar double precision, _monto_reintegrado double precision, _fecha_reintegro date, _monto_por_reintegrar double precision, _num_oficio_of_vista_cytg character varying, _fecha_oficio_of_vista_cytg date, _num_oficio_cytg_aut_invest character varying, _fecha_oficio_cytg_aut_invest date, _num_carpeta_investigacion character varying, _num_oficio_vai_municipio character varying, _fecha_oficio_vai_municipio date, _autoridad_invest_id integer, _num_oficio_pras_of character varying, _fecha_oficio_pras_of date, _num_oficio_pras_cytg_dependencia character varying, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp_dependencia date) OWNER TO postgres;


--
-- Name: alter_observation_preliminar(integer, integer, integer, integer, integer, integer, integer, text, double precision, double precision, double precision, text, date, date, date, date, date, text, text, text, text, text, integer, text, date, date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observation_preliminar(_observation_id integer, _type_id integer, _code_id integer, _bis_code_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text, _amount_observed double precision, _amount_projected double precision, _amount_solved double precision, _amount_comments text, _reception_date date, _expiration_date date, _doc_a_date date, _doc_b_date date, _doc_c_date date, _doc_a text, _doc_b text, _doc_c text, _dep_response text, _dep_resp_comments text, _division_id integer, _hdr_doc text, _hdr_reception_date date, _hdr_expiration1_date date, _hdr_expiration2_date date) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    -- latter amount to be compared with the newer one
    latter_amount amounts;

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    latter_id integer := 0;
	
    -- get the default observation stage's id value (new observations only):
    default_obs_stage_id integer := 0;
    default_obs_stage_title text := 'PRELIMINAR';
    prelim_counter integer := 0;

    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observation_id = 0 THEN

            SELECT count(id)
            FROM observation_stages INTO prelim_counter
            WHERE title = default_obs_stage_title;

            IF NOT prelim_counter = 1 THEN
                RAISE EXCEPTION 'Value % does not exist', default_obs_stage_title;
            END IF;

            SELECT id
            FROM observation_stages INTO default_obs_stage_id
            WHERE title = default_obs_stage_title;

            INSERT INTO observations (
                observation_type_id,
                observation_code_id,
                observation_bis_code_id,
                social_program_id,
                audit_id,
                title,
                fiscal_id,
                amount_observed,
                reception_date,
                expiration_date,
                doc_a_date,
                doc_b_date,
                doc_c_date,
                doc_a,
                doc_b,
                doc_c,
                dep_response,
                dep_resp_comments,
                division_id,
                hdr_doc,
                hdr_reception_date,
                hdr_expiration1_date,
                hdr_expiration2_date,
                inception_time,
                touch_latter_time,
                observation_stage_id
            ) VALUES (
                _type_id,
                _code_id,
                _bis_code_id,
                _social_program_id,
                _audit_id,
                _title,
                _fiscal_id,
                _amount_observed,
                _reception_date,
                _expiration_date,
                _doc_a_date,
                _doc_b_date,
                _doc_c_date,
                _doc_a,
                _doc_b,
                _doc_c,
                _dep_response,
                _dep_resp_comments,
                _division_id,
                _hdr_doc,
                _hdr_reception_date,
                _hdr_expiration1_date,
                _hdr_expiration2_date,
                current_moment,
                current_moment,
                default_obs_stage_id
            ) RETURNING id INTO latter_id;

            INSERT INTO amounts (
                comments,
                projected,
                solved,
                observation_id,
                inception_time
            ) VALUES (
                _amount_comments,
                _amount_projected,
                _amount_solved,
                latter_id,
                current_moment
            );

        WHEN _observation_id > 0 THEN

            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- STARTS - Validates observation id
            --
            -- JUSTIFICATION: Because UPDATE statement does not issue
            -- any exception if nothing was updated.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            SELECT count(id)
            FROM observations INTO coincidences
            WHERE NOT blocked AND id = _observation_id;

            IF NOT coincidences = 1 THEN
                RAISE EXCEPTION 'observation identifier % does not exist', _observation_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validate observation id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE observations
            SET title  = _title, observation_type_id = _type_id, observation_code_id = _code_id,
                observation_bis_code_id = _bis_code_id, social_program_id = _social_program_id,
                audit_id = _audit_id, fiscal_id = _fiscal_id, reception_date = _reception_date,
                expiration_date = _expiration_date, doc_a_date = _doc_a_date,
                doc_b_date = _doc_b_date, doc_c_date = _doc_c_date, doc_a = _doc_a, doc_b = _doc_b,
                doc_c = _doc_c, dep_response = _dep_response, dep_resp_comments = _dep_resp_comments,
                division_id = _division_id, hdr_doc = _hdr_doc, hdr_reception_date = _hdr_reception_date,
                hdr_expiration1_date = _hdr_expiration1_date, hdr_expiration2_date = _hdr_expiration2_date,
                amount_observed = _amount_observed, touch_latter_time = current_moment
            WHERE id = _observation_id;

            SELECT * FROM amounts
            WHERE amounts.observation_id = _observation_id
            ORDER BY inception_time DESC LIMIT 1
            INTO latter_amount;

            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- Insertion solely occurs if any of solved or projected fields
            -- contains newer data otherwise nothing regarding amounts
            -- shall be inserted as the latest version of such fields.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            IF latter_amount.solved != _amount_solved OR latter_amount.projected != _amount_projected THEN

                INSERT INTO amounts (
                    comments,
                    projected,
                    solved,
                    observation_id,
                    inception_time
                ) VALUES (
                    _amount_comments,
                    _amount_projected,
                    _amount_solved,
                    _observation_id,
                    current_moment
                );

            END IF;

            -- Upon edition we return observation id as latter id
            latter_id = _observation_id;

        ELSE
            RAISE EXCEPTION 'negative observation identifier % is unsupported', _observation_id;

    END CASE;

    RETURN ( latter_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observation_preliminar(_observation_id integer, _type_id integer, _code_id integer, _bis_code_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text, _amount_observed double precision, _amount_projected double precision, _amount_solved double precision, _amount_comments text, _reception_date date, _expiration_date date, _doc_a_date date, _doc_b_date date, _doc_c_date date, _doc_a text, _doc_b text, _doc_c text, _dep_response text, _dep_resp_comments text, _division_id integer, _hdr_doc text, _hdr_reception_date date, _hdr_expiration1_date date, _hdr_expiration2_date date) OWNER TO postgres;


--
-- Name: alter_user(integer, character varying, character varying, integer, integer, integer[], boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _orgchart_role_id integer, _division_id integer, _access_vector integer[], _disabled boolean) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    latter_id integer := 0;

    row_counter integer := 1;
    av_len integer := array_length(_access_vector, 1);

    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _user_id = 0 THEN

            INSERT INTO users (
                username,
                passwd,
                orgchart_role_id,
                division_id,
                inception_time,
                touch_latter_time
            ) VALUES (
                _username,
                _passwd,
                _orgchart_role_id,
                _division_id,
                current_moment,
                current_moment
            ) RETURNING id INTO latter_id;

            FOR row_counter IN 1 .. av_len LOOP

                INSERT INTO user_authority(
                    user_id,
                    authority_id
                ) VALUES (
                    latter_id,
                    _access_vector[row_counter]
                );

            END LOOP;

        WHEN _user_id > 0 THEN

            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- STARTS - Validates user id
            --
            -- JUSTIFICATION: Because UPDATE statement does not issue
            -- any exception if nothing was updated.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            SELECT count(id)
            FROM users INTO coincidences
            WHERE not blocked AND id = _user_id;

            IF not coincidences = 1 THEN
                RAISE EXCEPTION 'user identifier % does not exist', _user_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validate user id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE users
            SET username  = _username, passwd = _passwd, disabled = _disabled,
                orgchart_role_id = _orgchart_role_id, division_id = _division_id,
                touch_latter_time = current_moment
            WHERE id = _user_id;

            DELETE FROM user_authority where user_id = _user_id;

            FOR row_counter IN 1 .. av_len LOOP

                INSERT INTO user_authority(
                    user_id,
                    authority_id
                ) VALUES (
                    _user_id,
                    _access_vector[row_counter]
                );

            END LOOP;

            -- Upon edition we return user id as latter id
            latter_id = _user_id;

        ELSE
            RAISE EXCEPTION 'negative user identifier % is unsupported', _user_id;

    END CASE;

    return ( latter_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _orgchart_role_id integer, _division_id integer, _access_vector integer[], _disabled boolean) OWNER TO postgres;


