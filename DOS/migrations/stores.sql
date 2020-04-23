--
-- Name: alter_audit(integer, character varying, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION public.alter_audit(_audit_id integer, _title character varying, _dependency_id integer, _year integer) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    latter_id integer := 0;

    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _audit_id = 0 THEN

            INSERT INTO audits (
                title,
                dependency_id,
                year,
                inception_time,
                touch_latter_time
            ) VALUES (
                _title,
                _dependency_id,
                _year,
                current_moment,
                current_moment		
            ) RETURNING id INTO latter_id;

        WHEN _audit_id > 0 THEN

            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- STARTS - Validates audit id
            --
            -- JUSTIFICATION: Because UPDATE statement does not issue
            -- any exception if nothing was updated.
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            SELECT count(id)
            FROM audits INTO coincidences
            WHERE not blocked AND id = _audit_id;

            IF not coincidences = 1 THEN
                RAISE EXCEPTION 'audit identifier % does not exist', _audit_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validate audit id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE audits
            SET title  = _title, dependency_id = _dependency_id, year = _year,
                touch_latter_time = current_moment
            WHERE id = _audit_id;

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


ALTER FUNCTION public.alter_audit(_audit_id integer, _title character varying, _dependency_id integer, _year integer) OWNER TO postgres;

--
-- Name: alter_observation(integer, integer, integer, integer, integer, integer, integer, text, double precision, double precision, double precision, text, date, date, date, date, date, text, text, text, text, text, integer, text, date, date, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION public.alter_observation(_observation_id integer, _type_id integer, _code_id integer, _bis_code_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text, _amount_observed double precision, _amount_projected double precision, _amount_solved double precision, _amount_comments text, _reception_date date, _expiration_date date, _doc_a_date date, _doc_b_date date, _doc_c_date date, _doc_a text, _doc_b text, _doc_c text, _dep_response text, _dep_resp_comments text, _division_id integer, _hdr_doc text, _hdr_reception_date date, _hdr_expiration1_date date, _hdr_expiration2_date date) RETURNS record
    LANGUAGE plpgsql
    AS $$

DECLARE

    -- latter amount to be compared with the newer one
    latter_amount amounts;

    current_moment timestamp with time zone = now();
    coincidences integer := 0;
    latter_id integer := 0;

    -- dump of errors
    rmsg text;

BEGIN

    CASE

        WHEN _observation_id = 0 THEN

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
                touch_latter_time
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
                current_moment
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


ALTER FUNCTION public.alter_observation(_observation_id integer, _type_id integer, _code_id integer, _bis_code_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text, _amount_observed double precision, _amount_projected double precision, _amount_solved double precision, _amount_comments text, _reception_date date, _expiration_date date, _doc_a_date date, _doc_b_date date, _doc_c_date date, _doc_a text, _doc_b text, _doc_c text, _dep_response text, _dep_resp_comments text, _division_id integer, _hdr_doc text, _hdr_reception_date date, _hdr_expiration1_date date, _hdr_expiration2_date date) OWNER TO postgres;

--
-- Name: alter_user(integer, character varying, character varying, integer, integer, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE OR REPLACE FUNCTION public.alter_user(
    _user_id integer,
    _username character varying,
    _passwd character varying,
    _orgchart_role_id integer,
    _division_id integer,
    _access_vector integer[],
    _disabled boolean)
    RETURNS record
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
AS $BODY$

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
$BODY$;


ALTER FUNCTION public.alter_user(_user_id integer, _username character varying, _passwd character varying, _orgchart_role_id integer, _division_id integer, _access_vector integer[], _disabled boolean) OWNER TO postgres;
