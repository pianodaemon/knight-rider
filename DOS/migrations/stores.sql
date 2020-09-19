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
-- Name: alter_observacion_ires_asenl(integer, integer, character varying, date, integer, character varying, text, boolean, character varying, double precision, text, integer, double precision, text, integer, double precision, double precision, double precision, integer[], text, character varying, date, date, character varying, date, date, character varying, date, text, character varying, date, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_ires_asenl(_observacion_id integer, _observacion_pre_id integer, _num_oficio_of character varying, _fecha_publicacion date, _tipo_observacion_id integer, _num_observacion character varying, _observacion_final text, _observacion_reincidente boolean, _anios_reincidencia character varying, _monto_observado double precision, _compartida_observacion text, _compartida_tipo_observacion_id integer, _compartida_monto double precision, _comentarios text, _clasif_final_cytg integer, _monto_solventado double precision, _monto_pendiente_solventar double precision, _monto_a_reintegrar double precision, _acciones integer[], _recomendaciones text, _num_oficio_recomendacion character varying, _fecha_oficio_recomendacion date, _fecha_vencimiento_enviar_asenl date, _num_oficio_dependencia character varying, _fecha_oficio_dependencia date, _fecha_vencimiento_interna_cytg date, _num_oficio_resp_dependencia character varying, _fecha_acuse_resp_dependencia date, _resp_dependencia text, _num_oficio_enviar_resp_asenl character varying, _fecha_oficio_enviar_resp_asenl date, _unidad_investigadora character varying, _num_vai character varying) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    ult_obs_id integer := 0;
	acciones_arr_len integer := array_length(_acciones, 1);
	idx integer := 0;
	row_counter bigint := 0;
	
    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observacion_id = 0 THEN
		
            INSERT INTO observaciones_ires_asenl (
				observacion_pre_id,
				num_oficio_of,
				fecha_publicacion,
				tipo_observacion_id,
				num_observacion,
				observacion_final,
				observacion_reincidente,
				anios_reincidencia,
				monto_observado,
				compartida_observacion,
				compartida_tipo_observacion_id,
				compartida_monto,
				comentarios,
				clasif_final_cytg,
				monto_solventado,
				monto_pendiente_solventar,
				monto_a_reintegrar,
				recomendaciones,
				num_oficio_recomendacion,
				fecha_oficio_recomendacion,
				fecha_vencimiento_enviar_asenl,
				num_oficio_dependencia,
				fecha_oficio_dependencia,
				fecha_vencimiento_interna_cytg,
				num_oficio_resp_dependencia,
				fecha_acuse_resp_dependencia,
				resp_dependencia,
				num_oficio_enviar_resp_asenl,
				fecha_oficio_enviar_resp_asenl,
				unidad_investigadora,
				num_vai,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
				_observacion_pre_id,
				_num_oficio_of,
				_fecha_publicacion,
				_tipo_observacion_id,
				_num_observacion,
				_observacion_final,
				_observacion_reincidente,
				_anios_reincidencia,
				_monto_observado,
				_compartida_observacion,
				_compartida_tipo_observacion_id,
				_compartida_monto,
				_comentarios,
				_clasif_final_cytg,
				_monto_solventado,
				_monto_pendiente_solventar,
				_monto_a_reintegrar,
				_recomendaciones,
				_num_oficio_recomendacion,
				_fecha_oficio_recomendacion,
				_fecha_vencimiento_enviar_asenl,
				_num_oficio_dependencia,
				_fecha_oficio_dependencia,
				_fecha_vencimiento_interna_cytg,
				_num_oficio_resp_dependencia,
				_fecha_acuse_resp_dependencia,
				_resp_dependencia,
				_num_oficio_enviar_resp_asenl,
				_fecha_oficio_enviar_resp_asenl,
				_unidad_investigadora,
				_num_vai,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;
			
            FOR idx IN 1 .. acciones_arr_len LOOP

                INSERT INTO acciones_obs_asenl
				VALUES (
                    ult_obs_id,
					_acciones[idx]
                );
            
			END LOOP;
			
			-- Actualizar links preliminar -> resultados y viceversa
			update observaciones_ires_asenl
			set	observacion_pre_id = 0
			where not blocked and observacion_pre_id = _observacion_pre_id;
			
			update observaciones_ires_asenl
			set observacion_pre_id = _observacion_pre_id
			where id = ult_obs_id;
			
			update observaciones_pre_asenl
			set observacion_ires_id = 0
			where not blocked and observacion_ires_id = ult_obs_id;
			
			update observaciones_pre_asenl
			set observacion_ires_id = ult_obs_id
			where id = _observacion_pre_id;


        WHEN _observacion_id > 0 THEN

            UPDATE observaciones_ires_asenl
            SET observacion_pre_id = _observacion_pre_id,
				num_oficio_of = _num_oficio_of,
				fecha_publicacion = _fecha_publicacion,
				tipo_observacion_id = _tipo_observacion_id,
				num_observacion = _num_observacion,
				observacion_final = _observacion_final,
				observacion_reincidente = _observacion_reincidente,
				anios_reincidencia = _anios_reincidencia,
				monto_observado = _monto_observado,
				compartida_observacion = _compartida_observacion,
				compartida_tipo_observacion_id = _compartida_tipo_observacion_id,
				compartida_monto = _compartida_monto,
				comentarios = _comentarios,
				clasif_final_cytg = _clasif_final_cytg,
				monto_solventado = _monto_solventado,
				monto_pendiente_solventar = _monto_pendiente_solventar,
				monto_a_reintegrar = _monto_a_reintegrar,
				recomendaciones = _recomendaciones,
				num_oficio_recomendacion = _num_oficio_recomendacion,
				fecha_oficio_recomendacion = _fecha_oficio_recomendacion,
				fecha_vencimiento_enviar_asenl = _fecha_vencimiento_enviar_asenl,
				num_oficio_dependencia = _num_oficio_dependencia,
				fecha_oficio_dependencia = _fecha_oficio_dependencia,
				fecha_vencimiento_interna_cytg = _fecha_vencimiento_interna_cytg,
				num_oficio_resp_dependencia = _num_oficio_resp_dependencia,
				fecha_acuse_resp_dependencia = _fecha_acuse_resp_dependencia,
				resp_dependencia = _resp_dependencia,
				num_oficio_enviar_resp_asenl = _num_oficio_enviar_resp_asenl,
				fecha_oficio_enviar_resp_asenl = _fecha_oficio_enviar_resp_asenl,
				unidad_investigadora = _unidad_investigadora,
				num_vai = _num_vai,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'Observación ASENL (IRes) con id % no existe', _observacion_id;
			end if;

            delete from acciones_obs_asenl where observacion_id = _observacion_id;
			
			FOR idx IN 1 .. acciones_arr_len LOOP

                INSERT INTO acciones_obs_asenl
				VALUES (
                    _observacion_id,
					_acciones[idx]
                );
            
			END LOOP;
			
			-- Actualizar links preliminar -> resultados y viceversa
			update observaciones_ires_asenl
			set	observacion_pre_id = 0
			where not blocked and observacion_pre_id = _observacion_pre_id;
			
			update observaciones_ires_asenl
			set observacion_pre_id = _observacion_pre_id
			where id = _observacion_id;
			
			update observaciones_pre_asenl
			set observacion_ires_id = 0
			where not blocked and observacion_ires_id = _observacion_id;
			
			update observaciones_pre_asenl
			set observacion_ires_id = _observacion_id
			where id = _observacion_pre_id;
			
			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'Negative observation ASENL (IRes) identifier % is unsupported', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_ires_asenl(_observacion_id integer, _observacion_pre_id integer, _num_oficio_of character varying, _fecha_publicacion date, _tipo_observacion_id integer, _num_observacion character varying, _observacion_final text, _observacion_reincidente boolean, _anios_reincidencia character varying, _monto_observado double precision, _compartida_observacion text, _compartida_tipo_observacion_id integer, _compartida_monto double precision, _comentarios text, _clasif_final_cytg integer, _monto_solventado double precision, _monto_pendiente_solventar double precision, _monto_a_reintegrar double precision, _acciones integer[], _recomendaciones text, _num_oficio_recomendacion character varying, _fecha_oficio_recomendacion date, _fecha_vencimiento_enviar_asenl date, _num_oficio_dependencia character varying, _fecha_oficio_dependencia date, _fecha_vencimiento_interna_cytg date, _num_oficio_resp_dependencia character varying, _fecha_acuse_resp_dependencia date, _resp_dependencia text, _num_oficio_enviar_resp_asenl character varying, _fecha_oficio_enviar_resp_asenl date, _unidad_investigadora character varying, _num_vai character varying) OWNER TO postgres;


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
			
			-- Actualizar links preliminar -> resultados y viceversa
			update observaciones_ires_asf
			set	observacion_pre_id = 0
			where not blocked and observacion_pre_id = _observacion_pre_id;
			
			update observaciones_ires_asf
			set observacion_pre_id = _observacion_pre_id
			where id = ult_obs_id;
			
			update observaciones_pre_asf
			set observacion_ires_id = 0
			where not blocked and observacion_ires_id = ult_obs_id;
			
			update observaciones_pre_asf
			set observacion_ires_id = ult_obs_id
			where id = _observacion_pre_id;

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
			
			-- Actualizar links preliminar -> resultados y viceversa
			update observaciones_ires_asf
			set	observacion_pre_id = 0
			where not blocked and observacion_pre_id = _observacion_pre_id;
			
			update observaciones_ires_asf
			set observacion_pre_id = _observacion_pre_id
			where id = _observacion_id;
			
			update observaciones_pre_asf
			set observacion_ires_id = 0
			where not blocked and observacion_ires_id = _observacion_id;
			
			update observaciones_pre_asf
			set observacion_ires_id = _observacion_id
			where id = _observacion_pre_id;
			
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
-- Name: alter_observacion_ires_cytg(integer, integer, character varying, text, integer, integer, text, text, integer, double precision, double precision, double precision, double precision, date, double precision, character varying, date, character varying, character varying, date, character varying, character varying, date, public.seguimientos_obs_cytg[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_ires_cytg(_observacion_id integer, _observacion_pre_id integer, _num_observacion character varying, _observacion text, _tipo_observacion_id integer, _estatus_info_resultados_id integer, _acciones_preventivas text, _acciones_correctivas text, _clasif_final_cytg integer, _monto_solventado double precision, _monto_pendiente_solventar double precision, _monto_a_reintegrar double precision, _monto_reintegrado double precision, _fecha_reintegro date, _monto_por_reintegrar double precision, _num_oficio_cytg_aut_invest character varying, _fecha_oficio_cytg_aut_invest date, _num_carpeta_investigacion character varying, _num_oficio_vai_municipio character varying, _fecha_oficio_vai_municipio date, _num_oficio_pras_cytg_dependencia character varying, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp_dependencia date, _seguimientos public.seguimientos_obs_cytg[]) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    ult_obs_id integer := 0;
	seguimientos_arr_len integer := array_length(_seguimientos, 1);
	idx integer := 0;
	row_counter bigint := 0;
	
    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observacion_id = 0 THEN
		
            INSERT INTO observaciones_ires_cytg (
				observacion_pre_id,
				num_observacion,
				observacion,
				tipo_observacion_id,
				estatus_info_resultados_id,
				acciones_preventivas,
				acciones_correctivas,
				clasif_final_cytg,
				monto_solventado,
				monto_pendiente_solventar,
				monto_a_reintegrar,
				monto_reintegrado,
				fecha_reintegro,
				monto_por_reintegrar,
				num_oficio_cytg_aut_invest,
				fecha_oficio_cytg_aut_invest,
				num_carpeta_investigacion,
				num_oficio_vai_municipio,
				fecha_oficio_vai_municipio,
				num_oficio_pras_cytg_dependencia,
				num_oficio_resp_dependencia,
				fecha_oficio_resp_dependencia,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
				_observacion_pre_id,
				_num_observacion,
				_observacion,
				_tipo_observacion_id,
				_estatus_info_resultados_id,
				_acciones_preventivas,
				_acciones_correctivas,
				_clasif_final_cytg,
				_monto_solventado,
				_monto_pendiente_solventar,
				_monto_a_reintegrar,
				_monto_reintegrado,
				_fecha_reintegro,
				_monto_por_reintegrar,
				_num_oficio_cytg_aut_invest,
				_fecha_oficio_cytg_aut_invest,
				_num_carpeta_investigacion,
				_num_oficio_vai_municipio,
				_fecha_oficio_vai_municipio,
				_num_oficio_pras_cytg_dependencia,
				_num_oficio_resp_dependencia,
				_fecha_oficio_resp_dependencia,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;
			
            FOR idx IN 1 .. seguimientos_arr_len LOOP
                _seguimientos[idx] = (
					ult_obs_id,
					_seguimientos[idx].seguimiento_id,
					_seguimientos[idx].num_oficio_ires,
					_seguimientos[idx].fecha_notif_ires,
					_seguimientos[idx].fecha_vencimiento_ires,
					_seguimientos[idx].prorroga,
					_seguimientos[idx].num_oficio_solic_prorroga,
					_seguimientos[idx].fecha_oficio_solic_prorroga,
					_seguimientos[idx].num_oficio_contest_prorroga,
					_seguimientos[idx].fecha_oficio_contest,
					_seguimientos[idx].fecha_vencimiento_ires_nueva,
					_seguimientos[idx].num_oficio_resp_dependencia,
					_seguimientos[idx].fecha_oficio_resp_dependencia,
					_seguimientos[idx].resp_dependencia,
					_seguimientos[idx].comentarios,
					_seguimientos[idx].estatus_seguimiento_id,
					_seguimientos[idx].monto_solventado,
					_seguimientos[idx].monto_pendiente_solventar
				);
			END LOOP;
			
			INSERT INTO seguimientos_obs_cytg
			select *
			from unnest(_seguimientos);
			
			-- Actualizar links preliminar -> resultados y viceversa
			update observaciones_ires_cytg
			set	observacion_pre_id = 0
			where not blocked and observacion_pre_id = _observacion_pre_id;
			
			update observaciones_ires_cytg
			set observacion_pre_id = _observacion_pre_id
			where id = ult_obs_id;
			
			update observaciones_pre_cytg
			set observacion_ires_id = 0
			where not blocked and observacion_ires_id = ult_obs_id;
			
			update observaciones_pre_cytg
			set observacion_ires_id = ult_obs_id
			where id = _observacion_pre_id;


        WHEN _observacion_id > 0 THEN

            UPDATE observaciones_ires_cytg
            SET observacion_pre_id = _observacion_pre_id,
				num_observacion = _num_observacion,
				observacion = _observacion,
				tipo_observacion_id = _tipo_observacion_id,
				estatus_info_resultados_id = _estatus_info_resultados_id,
				acciones_preventivas = _acciones_preventivas,
				acciones_correctivas = _acciones_correctivas,
				clasif_final_cytg = _clasif_final_cytg,
				monto_solventado = _monto_solventado,
				monto_pendiente_solventar = _monto_pendiente_solventar,
				monto_a_reintegrar = _monto_a_reintegrar,
				monto_reintegrado = _monto_reintegrado,
				fecha_reintegro = _fecha_reintegro,
				monto_por_reintegrar = _monto_por_reintegrar,
				num_oficio_cytg_aut_invest = _num_oficio_cytg_aut_invest,
				fecha_oficio_cytg_aut_invest = _fecha_oficio_cytg_aut_invest,
				num_carpeta_investigacion = _num_carpeta_investigacion,
				num_oficio_vai_municipio = _num_oficio_vai_municipio,
				fecha_oficio_vai_municipio = _fecha_oficio_vai_municipio,
				num_oficio_pras_cytg_dependencia = _num_oficio_pras_cytg_dependencia,
				num_oficio_resp_dependencia = _num_oficio_resp_dependencia,
				fecha_oficio_resp_dependencia = _fecha_oficio_resp_dependencia,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'Observación de resultados de CyTG con id % no existe', _observacion_id;
			end if;

            delete from seguimientos_obs_cytg where observacion_id = _observacion_id;
			
			FOR idx IN 1 .. seguimientos_arr_len LOOP
                _seguimientos[idx] = (
					_observacion_id,
					_seguimientos[idx].seguimiento_id,
					_seguimientos[idx].num_oficio_ires,
					_seguimientos[idx].fecha_notif_ires,
					_seguimientos[idx].fecha_vencimiento_ires,
					_seguimientos[idx].prorroga,
					_seguimientos[idx].num_oficio_solic_prorroga,
					_seguimientos[idx].fecha_oficio_solic_prorroga,
					_seguimientos[idx].num_oficio_contest_prorroga,
					_seguimientos[idx].fecha_oficio_contest,
					_seguimientos[idx].fecha_vencimiento_ires_nueva,
					_seguimientos[idx].num_oficio_resp_dependencia,
					_seguimientos[idx].fecha_oficio_resp_dependencia,
					_seguimientos[idx].resp_dependencia,
					_seguimientos[idx].comentarios,
					_seguimientos[idx].estatus_seguimiento_id,
					_seguimientos[idx].monto_solventado,
					_seguimientos[idx].monto_pendiente_solventar
				);
			END LOOP;
			
			INSERT INTO seguimientos_obs_cytg
			select *
			from unnest(_seguimientos);
			
			-- Actualizar links preliminar -> resultados y viceversa
			update observaciones_ires_cytg
			set	observacion_pre_id = 0
			where not blocked and observacion_pre_id = _observacion_pre_id;
			
			update observaciones_ires_cytg
			set observacion_pre_id = _observacion_pre_id
			where id = _observacion_id;
			
			update observaciones_pre_cytg
			set observacion_ires_id = 0
			where not blocked and observacion_ires_id = _observacion_id;
			
			update observaciones_pre_cytg
			set observacion_ires_id = _observacion_id
			where id = _observacion_pre_id;
			
			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'Identificador negativo de observacion CyTG (IRes) % no esta soportado', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_ires_cytg(_observacion_id integer, _observacion_pre_id integer, _num_observacion character varying, _observacion text, _tipo_observacion_id integer, _estatus_info_resultados_id integer, _acciones_preventivas text, _acciones_correctivas text, _clasif_final_cytg integer, _monto_solventado double precision, _monto_pendiente_solventar double precision, _monto_a_reintegrar double precision, _monto_reintegrado double precision, _fecha_reintegro date, _monto_por_reintegrar double precision, _num_oficio_cytg_aut_invest character varying, _fecha_oficio_cytg_aut_invest date, _num_carpeta_investigacion character varying, _num_oficio_vai_municipio character varying, _fecha_oficio_vai_municipio date, _num_oficio_pras_cytg_dependencia character varying, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp_dependencia date, _seguimientos public.seguimientos_obs_cytg[]) OWNER TO postgres;


--
-- Name: alter_observacion_pre_asenl(integer, integer, text, integer, double precision, date, integer, integer, character varying, date, date, integer, character varying, text, double precision, character varying, date, date, date, character varying, date, text, text, integer, character varying, date, integer, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_pre_asenl(_observacion_id integer, _direccion_id integer, _compartida_observacion text, _compartida_tipo_observacion_id integer, _compartida_monto double precision, _fecha_captura date, _tipo_auditoria_id integer, _auditoria_id integer, _num_oficio_notif_obs_prelim character varying, _fecha_recibido date, _fecha_vencimiento_of date, _tipo_observacion_id integer, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg_oic character varying, _fecha_oficio_cytg_oic date, _fecha_recibido_dependencia date, _fecha_vencimiento_cytg date, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp date, _resp_dependencia text, _comentarios text, _clasif_final_cytg integer, _num_oficio_org_fiscalizador character varying, _fecha_oficio_org_fiscalizador date, _estatus_proceso_id integer, _proyeccion_solventacion_id integer, _resultado_final_pub_id integer) RETURNS record
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
				tipo_auditoria_id,
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
				_tipo_auditoria_id,
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
				tipo_auditoria_id = _tipo_auditoria_id,
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


ALTER FUNCTION public.alter_observacion_pre_asenl(_observacion_id integer, _direccion_id integer, _compartida_observacion text, _compartida_tipo_observacion_id integer, _compartida_monto double precision, _fecha_captura date, _tipo_auditoria_id integer, _auditoria_id integer, _num_oficio_notif_obs_prelim character varying, _fecha_recibido date, _fecha_vencimiento_of date, _tipo_observacion_id integer, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg_oic character varying, _fecha_oficio_cytg_oic date, _fecha_recibido_dependencia date, _fecha_vencimiento_cytg date, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp date, _resp_dependencia text, _comentarios text, _clasif_final_cytg integer, _num_oficio_org_fiscalizador character varying, _fecha_oficio_org_fiscalizador date, _estatus_proceso_id integer, _proyeccion_solventacion_id integer, _resultado_final_pub_id integer) OWNER TO postgres;


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
-- Name: alter_observacion_pre_cytg(integer, date, date, integer, date, integer, integer, integer, character varying, date, date, character varying, date, date, date, integer, character varying, text, double precision, character varying, date, date, date, boolean, character varying, date, character varying, date, date, integer, character varying, date, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_observacion_pre_cytg(_observacion_id integer, _periodo_revision_de date, _periodo_revision_a date, _direccion_id integer, _fecha_captura date, _programa_social_id integer, _auditoria_id integer, _tipo_auditoria_id integer, _num_oficio_inicio character varying, _fecha_notificacion_inicio date, _fecha_vencimiento_nombra_enlace date, _num_oficio_requerimiento character varying, _fecha_notificacion_requerimiento date, _fecha_vencimiento_requerimiento date, _fecha_vencimiento_nueva date, _tipo_observacion_id integer, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg_oic_pre character varying, _fecha_oficio_cytg_pre date, _fecha_recibido_dependencia date, _fecha_vencimiento_pre date, _prorroga boolean, _num_oficio_solic_prorroga character varying, _fecha_oficio_solic_prorroga date, _num_oficio_contest_prorroga_cytg character varying, _fecha_oficio_contest_cytg date, _fecha_vencimiento_pre_nueva date, _clasif_pre_cytg integer, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp date, _resp_dependencia text, _comentarios text) RETURNS record
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
		
            INSERT INTO observaciones_pre_cytg (
                periodo_revision_de,
				periodo_revision_a,
				direccion_id,
				fecha_captura,
				programa_social_id,
				auditoria_id,
				tipo_auditoria_id,
				num_oficio_inicio,
				fecha_notificacion_inicio,
				fecha_vencimiento_nombra_enlace,
				num_oficio_requerimiento,
				fecha_notificacion_requerimiento,
				fecha_vencimiento_requerimiento,
				fecha_vencimiento_nueva,
				tipo_observacion_id,
				num_observacion,
				observacion,
				monto_observado,
				num_oficio_cytg_oic_pre,
				fecha_oficio_cytg_pre,
				fecha_recibido_dependencia,
				fecha_vencimiento_pre,
				prorroga,
				num_oficio_solic_prorroga,
				fecha_oficio_solic_prorroga,
				num_oficio_contest_prorroga_cytg,
				fecha_oficio_contest_cytg,
				fecha_vencimiento_pre_nueva,
				clasif_pre_cytg,
				num_oficio_resp_dependencia,
				fecha_oficio_resp,
				resp_dependencia,
				comentarios,
				hora_ult_cambio,
				hora_creacion
            ) VALUES (
				_periodo_revision_de,
				_periodo_revision_a,
				_direccion_id,
				_fecha_captura,
				_programa_social_id,
				_auditoria_id,
				_tipo_auditoria_id,
				_num_oficio_inicio,
				_fecha_notificacion_inicio,
				_fecha_vencimiento_nombra_enlace,
				_num_oficio_requerimiento,
				_fecha_notificacion_requerimiento,
				_fecha_vencimiento_requerimiento,
				_fecha_vencimiento_nueva,
				_tipo_observacion_id,
				_num_observacion,
				_observacion,
				_monto_observado,
				_num_oficio_cytg_oic_pre,
				_fecha_oficio_cytg_pre,
				_fecha_recibido_dependencia,
				_fecha_vencimiento_pre,
				_prorroga,
				_num_oficio_solic_prorroga,
				_fecha_oficio_solic_prorroga,
				_num_oficio_contest_prorroga_cytg,
				_fecha_oficio_contest_cytg,
				_fecha_vencimiento_pre_nueva,
				_clasif_pre_cytg,
				_num_oficio_resp_dependencia,
				_fecha_oficio_resp,
				_resp_dependencia,
				_comentarios,
				current_moment,
				current_moment
            ) RETURNING id INTO ult_obs_id;

        WHEN _observacion_id > 0 THEN

            UPDATE observaciones_pre_cytg
            SET periodo_revision_de = _periodo_revision_de,
				periodo_revision_a = _periodo_revision_a,
				direccion_id = _direccion_id,
				fecha_captura = _fecha_captura,
				programa_social_id = _programa_social_id,
				auditoria_id = _auditoria_id,
				tipo_auditoria_id = _tipo_auditoria_id,
				num_oficio_inicio = _num_oficio_inicio,
				fecha_notificacion_inicio = _fecha_notificacion_inicio,
				fecha_vencimiento_nombra_enlace = _fecha_vencimiento_nombra_enlace,
				num_oficio_requerimiento = _num_oficio_requerimiento,
				fecha_notificacion_requerimiento = _fecha_notificacion_requerimiento,
				fecha_vencimiento_requerimiento = _fecha_vencimiento_requerimiento,
				fecha_vencimiento_nueva = _fecha_vencimiento_nueva,
				tipo_observacion_id = _tipo_observacion_id,
				num_observacion = _num_observacion,
				observacion = _observacion,
				monto_observado = _monto_observado,
				num_oficio_cytg_oic_pre = _num_oficio_cytg_oic_pre,
				fecha_oficio_cytg_pre = _fecha_oficio_cytg_pre,
				fecha_recibido_dependencia = _fecha_recibido_dependencia,
				fecha_vencimiento_pre = _fecha_vencimiento_pre,
				prorroga = _prorroga,
				num_oficio_solic_prorroga = _num_oficio_solic_prorroga,
				fecha_oficio_solic_prorroga = _fecha_oficio_solic_prorroga,
				num_oficio_contest_prorroga_cytg = _num_oficio_contest_prorroga_cytg,
				fecha_oficio_contest_cytg = _fecha_oficio_contest_cytg,
				fecha_vencimiento_pre_nueva = _fecha_vencimiento_pre_nueva,
				clasif_pre_cytg = _clasif_pre_cytg,
				num_oficio_resp_dependencia = _num_oficio_resp_dependencia,
				fecha_oficio_resp = _fecha_oficio_resp,
				resp_dependencia = _resp_dependencia,
				comentarios = _comentarios,
				hora_ult_cambio = current_moment
            WHERE id = _observacion_id;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'Observación preliminar de CyTG con id % no existe', _observacion_id;
			end if;
			
			ult_obs_id = _observacion_id;
			
        ELSE
            RAISE EXCEPTION 'Observación preliminar de CyTG con id % no soportado', _observacion_id;

    END CASE;

    RETURN ( ult_obs_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;


ALTER FUNCTION public.alter_observacion_pre_cytg(_observacion_id integer, _periodo_revision_de date, _periodo_revision_a date, _direccion_id integer, _fecha_captura date, _programa_social_id integer, _auditoria_id integer, _tipo_auditoria_id integer, _num_oficio_inicio character varying, _fecha_notificacion_inicio date, _fecha_vencimiento_nombra_enlace date, _num_oficio_requerimiento character varying, _fecha_notificacion_requerimiento date, _fecha_vencimiento_requerimiento date, _fecha_vencimiento_nueva date, _tipo_observacion_id integer, _num_observacion character varying, _observacion text, _monto_observado double precision, _num_oficio_cytg_oic_pre character varying, _fecha_oficio_cytg_pre date, _fecha_recibido_dependencia date, _fecha_vencimiento_pre date, _prorroga boolean, _num_oficio_solic_prorroga character varying, _fecha_oficio_solic_prorroga date, _num_oficio_contest_prorroga_cytg character varying, _fecha_oficio_contest_cytg date, _fecha_vencimiento_pre_nueva date, _clasif_pre_cytg integer, _num_oficio_resp_dependencia character varying, _fecha_oficio_resp date, _resp_dependencia text, _comentarios text) OWNER TO postgres;


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
-- Name: alter_user(integer, character varying, character varying, integer, integer, boolean, character varying, character varying, integer[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _orgchart_role_id integer, _division_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _access_vector integer[]) RETURNS record
    LANGUAGE plpgsql
    AS $$
DECLARE

    current_moment timestamp with time zone = now();
    latter_id integer := 0;

    idx integer := 0;
    av_len integer := array_length(_access_vector, 1);
	row_counter integer := 0;

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
				disabled,
				first_name,
				last_name,
				touch_latter_time,
                inception_time
            ) VALUES (
                _username,
                _passwd,
                _orgchart_role_id,
                _division_id,
				_disabled,
				_first_name,
				_last_name,
                current_moment,
                current_moment
            ) RETURNING id INTO latter_id;

            FOR idx IN 1 .. av_len LOOP

                INSERT INTO user_authority(
                    user_id,
                    authority_id
                ) VALUES (
                    latter_id,
                    _access_vector[idx]
                );

            END LOOP;

        WHEN _user_id > 0 THEN

			if _passwd = '' then
				
				UPDATE users
				SET username = _username,
					orgchart_role_id = _orgchart_role_id,
					division_id = _division_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					touch_latter_time = current_moment
				WHERE id = _user_id;
			
			else
				
				UPDATE users
				SET username = _username,
					passwd = _passwd,
					orgchart_role_id = _orgchart_role_id,
					division_id = _division_id,
					disabled = _disabled,
					first_name = _first_name,
					last_name = _last_name,
					touch_latter_time = current_moment
				WHERE id = _user_id;
			
			end if;
			
			GET DIAGNOSTICS row_counter = ROW_COUNT;
			if row_counter <> 1 then
				RAISE EXCEPTION 'user identifier % does not exist', _user_id;
			end if;

            DELETE FROM user_authority where user_id = _user_id;

            FOR idx IN 1 .. av_len LOOP

                INSERT INTO user_authority(
                    user_id,
                    authority_id
                ) VALUES (
                    _user_id,
                    _access_vector[idx]
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


ALTER FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _orgchart_role_id integer, _division_id integer, _disabled boolean, _first_name character varying, _last_name character varying, _access_vector integer[]) OWNER TO postgres;


