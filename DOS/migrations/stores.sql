CREATE FUNCTION public.alter_observation(_observation_id integer, _type_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text, _amount_observed double precision, _amount_projected double precision, _amount_solved double precision, _amount_comments text) RETURNS record
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
                social_program_id,
                audit_id,
                title,
                fiscal_id,
                amount_observed,
                touch_latter_time
            ) VALUES (
                _type_id,
                _social_program_id,
                _audit_id,
                _title,
                _fiscal_id,
                _amount_observed,
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
            WHERE not blocked AND id = _observation_id;

            IF not coincidences = 1 THEN
                RAISE EXCEPTION 'observation identifier % does not exist', _observation_id;
            END IF;
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
            -- ENDS - Validate observation id
            -- :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

            UPDATE observations
            SET title  = _title, observation_type_id = _type_id,
                social_program_id = _social_program_id,
                audit_id = _audit_id, fiscal_id = _fiscal_id,
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

    return ( latter_id::integer, ''::text );

    EXCEPTION
        WHEN OTHERS THEN
            GET STACKED DIAGNOSTICS rmsg = MESSAGE_TEXT;
            return ( -1::integer, rmsg::text );

END;
$$;
