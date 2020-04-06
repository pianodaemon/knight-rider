--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: alter_observation(integer, integer, integer, integer, integer, text); Type: FUNCTION; Schema: public; Owner: knight_rider
--

CREATE FUNCTION public.alter_observation(_observation_id integer, _type_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text) RETURNS record
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

        WHEN _observation_id = 0 THEN

            INSERT INTO observations (
                observation_type_id,
                social_program_id,
                audit_id,
                title,
                fiscal_id,
                touch_latter_time
            ) VALUES (
                _type_id,
                _social_program_id,
                _audit_id,
                _title,
                _fiscal_id,
                current_moment
            ) RETURNING id INTO latter_id;

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
                touch_latter_time = current_moment
            WHERE id = _observation_id;

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


ALTER FUNCTION public.alter_observation(_observation_id integer, _type_id integer, _social_program_id integer, _audit_id integer, _fiscal_id integer, _title text) OWNER TO knight_rider;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: apps; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.apps (
    id integer NOT NULL,
    descripcion character varying NOT NULL,
    nombre_app character varying
);


ALTER TABLE public.apps OWNER TO knight_rider;

--
-- Name: TABLE apps; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.apps IS 'Relacion que alberga las aplicaciones que seran gobernadas por roles';


--
-- Name: audits; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.audits (
    id integer NOT NULL,
    title character varying NOT NULL,
    dependency_id integer
);


ALTER TABLE public.audits OWNER TO knight_rider;

--
-- Name: COLUMN audits.title; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON COLUMN public.audits.title IS 'Este es el alphanumerico que identifica a una auditoria';


--
-- Name: COLUMN audits.dependency_id; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON COLUMN public.audits.dependency_id IS 'Dependencia que ha originado la auditoria';


--
-- Name: dependencies; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.dependencies (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);


ALTER TABLE public.dependencies OWNER TO knight_rider;

--
-- Name: TABLE dependencies; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.dependencies IS 'Relacion que alberga las dependencias de gobierno';


--
-- Name: divisions; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.divisions (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.divisions OWNER TO knight_rider;

--
-- Name: TABLE divisions; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.divisions IS 'Relacion que alberga las direcciones de la contraloria';


--
-- Name: fiscals; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.fiscals (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);


ALTER TABLE public.fiscals OWNER TO knight_rider;

--
-- Name: TABLE fiscals; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.fiscals IS 'Relacion que alberga los organos fiscalizadores';


--
-- Name: geo_countries; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.geo_countries (
    id integer NOT NULL,
    title character varying,
    abrev character varying
);


ALTER TABLE public.geo_countries OWNER TO knight_rider;

--
-- Name: geo_municipalities; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.geo_municipalities (
    id integer NOT NULL,
    title character varying,
    geo_state_id integer
);


ALTER TABLE public.geo_municipalities OWNER TO knight_rider;

--
-- Name: TABLE geo_municipalities; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.geo_municipalities IS 'Tabla que alberga los municipios que pueden ser seleccionados en los aplicativos de el sistema , en base al pais y estado que se seleccione sobre el aplicativo en curso';


--
-- Name: geo_states; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.geo_states (
    id integer NOT NULL,
    title character varying,
    abrev character varying,
    country_id integer NOT NULL
);


ALTER TABLE public.geo_states OWNER TO knight_rider;

--
-- Name: observation_statuses; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.observation_statuses (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_statuses OWNER TO knight_rider;

--
-- Name: TABLE observation_statuses; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.observation_statuses IS 'Estado transitivo de una entidad observacion';


--
-- Name: observation_types; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.observation_types (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_types OWNER TO knight_rider;

--
-- Name: TABLE observation_types; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.observation_types IS 'Alberga los tipos de observacion';


--
-- Name: observations_seq; Type: SEQUENCE; Schema: public; Owner: knight_rider
--

CREATE SEQUENCE public.observations_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observations_seq OWNER TO knight_rider;

--
-- Name: SEQUENCE observations_seq; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON SEQUENCE public.observations_seq IS 'Sequence object for observations table';


--
-- Name: observations; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.observations (
    id integer DEFAULT nextval('public.observations_seq'::regclass) NOT NULL,
    observation_type_id integer NOT NULL,
    social_program_id integer NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    audit_id integer NOT NULL,
    title text NOT NULL,
    fiscal_id integer NOT NULL,
    touch_latter_time timestamp with time zone
);


ALTER TABLE public.observations OWNER TO knight_rider;

--
-- Name: TABLE observations; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.observations IS 'Alberga la entidad observacion';


--
-- Name: COLUMN observations.title; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON COLUMN public.observations.title IS 'La descripcion de la auditoria';


--
-- Name: COLUMN observations.fiscal_id; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON COLUMN public.observations.fiscal_id IS 'Representa la entidad fiscalizadora que ejecuta la observacion';


--
-- Name: orgchart_roles; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.orgchart_roles (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.orgchart_roles OWNER TO knight_rider;

--
-- Name: TABLE orgchart_roles; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.orgchart_roles IS 'Roles del diagrama organizacional';


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.sectors (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.sectors OWNER TO knight_rider;

--
-- Name: TABLE sectors; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.sectors IS 'Relacion que alberga los sectores (utilizados como attributos de agrupacion para las dependencias)';


--
-- Name: security_app_context; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.security_app_context (
    orgchart_role_id integer NOT NULL,
    app_id integer NOT NULL
);


ALTER TABLE public.security_app_context OWNER TO knight_rider;

--
-- Name: TABLE security_app_context; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.security_app_context IS 'Join table entre tabla apps y tabla orgchart_roles';


--
-- Name: social_programs; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.social_programs (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.social_programs OWNER TO knight_rider;

--
-- Name: TABLE social_programs; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.social_programs IS 'Alberga los programas sociales a los que esta vinculada una observacion';


--
-- Name: users; Type: TABLE; Schema: public; Owner: knight_rider
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    orgchart_role_id integer NOT NULL,
    division_id integer NOT NULL,
    disabled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO knight_rider;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.users IS 'Relacion que alberga usuarios del sistema';


--
-- Name: user_app_access; Type: VIEW; Schema: public; Owner: knight_rider
--

CREATE VIEW public.user_app_access AS
 SELECT users.id AS usr_id,
    sappctx.app_id
   FROM (public.users
     JOIN public.security_app_context sappctx ON ((sappctx.orgchart_role_id = users.orgchart_role_id)))
  WHERE (NOT users.disabled)
  ORDER BY users.id;


ALTER TABLE public.user_app_access OWNER TO knight_rider;

--
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.apps (id, descripcion, nombre_app) FROM stdin;
1	Proceso para generar observaciones	PROC_OBSERVACIONES
2	Altas, bajas y cambios de usuarios	CAT_USUARIOS
3	Altas, bajas y cambios de direcciones	CAT_DIRECCIONES
4	Altas, bajas y cambios de organos fiscalizadores	CAT_FISCAL
\.


--
-- Data for Name: audits; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.audits (id, title, dependency_id) FROM stdin;
1	CTG-OP-15-023	27
\.


--
-- Data for Name: dependencies; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.dependencies (id, title, description) FROM stdin;
1	SGG	SECRETARÍA GENERAL DE GOBIERNO
2	SSP	SECRETARÍA DE SEGURIDAD PÚBLICA
3	SSNL	SECRETARÍA DE SALUD / SERVICIOS DE SALUD
4	SINFRA	SECRETARÍA DE INFRAESTRUCTURA
5	SEDAGRO	SECRETARÍA DE DESARROLLO AGROPECUARIO / CDA / FOFAE /FONAGRO
6	CYTG	CONTRALORÍA Y TRANSPARENCIA GUBERNAMENTAL
7	SFYTGE	SECRETARÍA DE FINANZAS Y TESORERÍA GENERAL DEL ESTADO
8	CEAPE	COORDINACIÓN EJECUTIVA
9	SE	SECRETARÍA DE EDUCACIÓN / UNIDAD DE INTEGRACIÓN EDUCATIVA
10	SET	SECRETARÍA DE ECONOMÍA Y TRABAJO
11	SDSOC	SECRETARÍA DE DESARROLLO SOCIAL
12	SDSUS	SECRETARÍA DE DESARROLLO SUSTENTABLE
13	SA	SECRETARÍA DE ADMINISTRACIÓN
14	AET	AGENCIA PARA LA RACIONALIZACIÓN Y MODERNIZACIÓN DEL SISTEMA DEL TRANSPORTE PÚBLICO (AET)
15	CODEFRONT	CORPORACIÓN PARA EL DESARROLLO DE LA ZONA FRONTERIZA DE NUEVO LEÓN (CODEFRONT) / FIDEICOMISO PUENTE INTERNACIONAL SOLIDARIDAD
16	CODETUR	CORPORACIÓN PARA EL DESARROLLO TURÍSTICO DE NL (CODETUR)
17	I2T2	INSTITUTO DE INNOVACIÓN Y TRANSFERENCIA DE TECNOLOGÍA DE N.L. (I2T2)
18	IVNL	INSTITUTO DE LA VIVIENDA DE NUEVO LEÓN (IVNL)
19	INDE	INSTITUTO ESTATAL DE CULTURA FÍSICA Y DEPORTE (INDE)
20	IEJ	INSTITUTO ESTATAL DE LA JUVENTUD (IEJ)
21	IEM	INSTITUTO ESTATAL DE LAS MUJERES (IEM)
22	PVS	PARQUES Y VIDA SILVESTRE
23	CONALEP	COLEGIO DE EDUCACIÓN PROFESIONAL TÉCNICA DE NUEVO LEÓN (CONALEP)
24	CECYTENL	COLEGIO DE ESTUDIOS CIENTÍFICOS Y TECNOLÓGICOS DEL ESTADO DE NUEVO LEÓN (CECYTENL)
25	CETyV	CONSEJO ESTATAL DE TRANSPORTE Y VIALIDAD (CETYV)
26	CONARTE	CONSEJO PARA LA CULTURA Y LAS ARTES DE NUEVO LEÓN (CONARTE)
27	ICIFED	INSTITUTO CONSTRUCTOR DE INFRAESTRUCTURA FÍSICA EDUCATIVA Y DEPORTIVA DE NUEVO LEÓN (ICIFED)
28	ICET	INSTITUTO DE CAPACITACIÓN Y EDUCACIÓN PARA EL TRABAJO, A.C. (ICET)
29	ICV	INSTITUTO DE CONTROL VEHICULAR
30	IDPNL	INSTITUTO DE DEFENSORÍA PÚBLICA DE NUEVO LEÓN (IDPNL)
31	IESP	INSTITUTO ESTATAL DE SEGURIDAD PÚBLICA
32	ISSSTELEON	INSTITUTO DE SEGURIDAD Y SERVICIOS SOCIALES DE LOS TRABAJADORES DEL ESTADO DE N.L. (ISSSTELEON)
33	IAENL	INSTITUTO DEL AGUA DEL ESTADO DE NUEVO LEÓN
34	IRCNL	INSTITUTO REGISTRAL Y CATASTRAL DE NUEVO LEÓN (IRCNL)
35	MHM	MUSEO DE HISTORIA MEXICANA
36	OSETUR	OPERADORA DE SERVICIOS TURÍSTICOS DE NUEVO LEÓN (OSETUR)
37	OPD	PARQUE FUNDIDORA, O.P.D.
38	PRODERLEON	PROMOTORA DE DESARROLLO RURAL DE NUEVO LEÓN (PRODERLEON)
39	REA	RED ESTATAL DE AUTOPISTAS DE N.L. (REA)
40	SADM	SERVICIOS DE AGUA Y DRENAJE DE MONTERREY, I.P.D. (SADM)
41	SCNL	SISTEMA DE CAMINOS DE NUEVO LEÓN
42	METRORREY	SISTEMA DE TRANSPORTE COLECTIVO (METRORREY)
43	SIMEPRODE	SISTEMA INTEGRAL PARA EL MANEJO ECOLÓGICO Y PROCESAMIENTO DE DESECHOS (SIMEPRODE)
44	DIF	SISTEMA PARA EL DESARROLLO INTEGRAL DE LA FAMILIA (DIF)
45	UCS	UNIVERSIDAD DE CIENCIAS DE LA SEGURIDAD
46	UPA	UNIVERSIDAD POLITÉCNICA DE APODACA
47	UTC	UNIVERSIDAD TECNOLÓGICA CADEREYTA
48	UTE	UNIVERSIDAD TECNOLÓGICA GRAL. MARIANO ESCOBEDO
49	UTL	UNIVERSIDAD TECNOLÓGICA LINARES
50	UTSC	UNIVERSIDAD TECNOLÓGICA SANTA CATARINA
51	SINTRAM	FIDEICOMISO PARA EL SISTEMA INTEGRAL DE TRÁNSITO METROPOLITANO (SINTRAM)
52	FFISL	FIDEICOMISO FESTIVAL INTERNACIONAL DE SANTA LUCÍA (FFISL)
53	FOMERREY	FIDEICOMISO DEL FOMENTO METROPOLITANO DE MONTERREY (FOMERREY)
54	FACyCEPENL	FIDEICOMISO FONDO DE APOYO PARA LA CREACIÓN Y CONSOLIDACIÓN DEL EMPLEO PRODUCTIVO EN EL ESTADO DE NUEVO LEÓN (FOCRECE)
55	FENL	FIDEICOMISO FONDO EDITORIAL DE NUEVO LEÓN
56	CEB	CENTRO ESTATAL DE BECAS
57	FECTEC	FIDEICOMISO FONDO PARA LA EDUCACIÓN, LA CIENCIA Y TECNOLOGÍA APLICADAS AL CAMPO DE NUEVO LEÓN (FECTEC)
58	FVTESNL	FIDEICOMISO FONDO PARA LA VIVIENDA DE LOS TRABAJADORES DEL ESTADO (FOVILEON-BUROCRATAS)
59	FVTEDNL	FIDEICOMISO FONDO PARA LA VIVIENDA DE LOS TRABAJADORES DE LA EDUCACIÓN (FOVILEON-EDUCACIÓN)
60	FIDECITRUS	FIDEICOMISO PARA EL DESARROLLO DE LA ZONA CITRÍCOLA DEL ESTADO DE NUEVO LEÓN (FIDECITRUS)
61	FIDESUR	FIDEICOMISO PARA EL DESARROLLO DEL SUR DEL ESTADO (FIDESUR)
62	FITUR	FIDEICOMISO TURISMO NUEVO LEÓN (FITUR)
63	FIRECOM	FIDEICOMISO PARA LA REORDENACIÓN COMERCIAL (FIRECOM)
64	FOFAE	FIDEICOMISO FONDO DE FOMENTO AGROPECUARIO DEL ESTADO DE NUEVO LEÓN (FOFAE)
65	IIIEPE	INSTITUTO DE INVESTIGACIÓN, INNOVACIÓN Y ESTUDIOS DE POSTGRADO PARA LA EDUCACIÓN DEL ESTADO (IIIEPE)
66	FONAGRO	FIDEICOMISO FONDO ESTATAL PARA EL FOMENTO Y DESARROLLO DE ACTIVIDADES AGROPECUARIAS, FORESTALES, DE LA FAUNA Y PESCA (FONAGRO)
67	FIDEPROES	FIDEICOMISO PROMOTOR DE PROYECTOS ESTRATÉGICOS URBANOS
68	PSS	RÉGIMEN DE PROTECCIÓN SOCIAL EN SALUD (SEGURO POPULAR)
69	UPG	UNIVERSIDAD POLITÉCNICA DE GARCÍA
70	RTVNL	SISTEMA DE RADIO Y TELEVISIÓN DE NUEVO LEÓN
71	IEPAM	INSTITUTO ESTATAL DE LAS PERSONAS ADULTAS MAYORES
72	CBME	COLEGIO DE BACHILLERES MILITARIZADO GRAL. MARIANO ESCOBEDO
73	RGECM	REPRESENTACIÓN DEL GOBIERNO DEL ESTADO EN LA CIUDAD DE MÉXICO
74	CDANL	CORPORACIÓN PARA EL DESARROLLO AGROPECUARIO DE NL (CDANL)
75	UTBFM	UNIVERSIDAD TECNOLOGÍCA BILINGÜE FRANCO-MEXICANA
76	PJENL	SECRETARÍA EJECUTIVA DEL SISTEMA ESTATAL ANTICORRUPCIÓN DEL ESTADO DE NUEVO LEÓN
\.


--
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.divisions (id, title) FROM stdin;
1	CENTRAL
2	PARAESTATAL
3	OBRAS
\.


--
-- Data for Name: fiscals; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.fiscals (id, title, description) FROM stdin;
2	ASF	AUDITORÍA SUPERIOR DE LA FEDERACIÓN
3	SFP	SECRETARÍA DE LA FUNCIÓN PÚBLICA
4	CyTG	CONTRALORÍA Y TRANSPARENCIA GUBERNAMENTAL
1	ASENL	AUDITORÍA SUPERIOR DEL ESTADO DE NUEVO LEÓN
\.


--
-- Data for Name: geo_countries; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.geo_countries (id, title, abrev) FROM stdin;
1	MEXICO	MX
\.


--
-- Data for Name: geo_municipalities; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.geo_municipalities (id, title, geo_state_id) FROM stdin;
1	ABASOLO	19
2	AGUALEGUAS	19
3	LOS ALDAMAS	19
4	ALLENDE	19
5	ANÁHUAC	19
6	APODACA	19
7	ARAMBERRI	19
8	BUSTAMANTE	19
9	CADEREYTA JIMÉNEZ	19
10	CARMEN	19
11	CERRALVO	19
12	CIÉNEGA DE FLORES	19
13	CHINA	19
14	DR. ARROYO	19
15	DR. COSS	19
16	DR. GONZÁLEZ	19
17	GALEANA	19
18	GARCÍA	19
19	SAN PEDRO GARZA GARCÍA	19
20	GRAL. BRAVO	19
21	GRAL. ESCOBEDO	19
22	GRAL. TERÁN	19
23	GRAL. TREVIÑO	19
24	GRAL. ZARAGOZA	19
25	GRAL. ZUAZUA	19
26	GUADALUPE	19
27	LOS HERRERAS	19
28	HIGUERAS	19
29	HUALAHUISES	19
30	ITURBIDE	19
31	JUÁREZ	19
32	LAMPAZOS DE NARANJO	19
33	LINARES	19
34	MARÍN	19
35	MELCHOR OCAMPO	19
36	MIER Y NORIEGA	19
37	MINA	19
38	MONTEMORELOS	19
39	MONTERREY	19
40	PARÁS	19
41	PESQUERÍA	19
42	LOS RAMONES	19
43	RAYONES	19
44	SABINAS HIDALGO	19
45	SALINAS VICTORIA	19
46	SAN NICOLÁS DE LOS GARZA	19
47	HIDALGO	19
48	SANTA CATARINA	19
49	SANTIAGO	19
50	VALLECILLO	19
51	VILLALDAMA	19
\.


--
-- Data for Name: geo_states; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.geo_states (id, title, abrev, country_id) FROM stdin;
19	Nuevo León	NL	1
\.


--
-- Data for Name: observation_statuses; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.observation_statuses (id, title) FROM stdin;
\.


--
-- Data for Name: observation_types; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.observation_types (id, title) FROM stdin;
1	FINANCIERA
2	NORMATIVA
3	ECONOMICA
4	TECNICA
\.


--
-- Data for Name: observations; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.observations (id, observation_type_id, social_program_id, blocked, audit_id, title, fiscal_id, touch_latter_time) FROM stdin;
4	2	1	f	1	123qwe	1	\N
5	1	1	t	1	freebsd2	1	\N
6	4	1	t	1	heman	1	\N
10	1	1	t	1	skeletor	1	\N
11	1	1	t	1	este dato debe ser actualizado	1	\N
12	3	1	t	1	sting and shaggy	1	\N
31	1	1	f	1	www.youtube.com	1	\N
32	1	1	f	1	que kilombo	1	\N
25	1	1	t	1	Alan parson project	1	\N
21	1	1	t	1	Blue monday	1	\N
23	1	1	t	1	Esto va evolucionando	1	\N
30	1	1	t	1	Esto necesita atencion	1	\N
29	1	1	t	1	Rafa ya no esta aqui, pero Omar cubre su rol	1	\N
49	2	2	f	1	Yo tenia 3 perritos	1	\N
50	3	1	f	1	Uno se callo en la nieve	1	\N
51	2	3	f	1	Y ya nada mas me quedan nueva	1	\N
52	2	2	f	1	Coca es mejor que pepsi	1	\N
54	2	2	t	1	Pero pepsi junta mitades	1	\N
33	1	1	t	1	el hector ceron ama javascript	1	\N
34	2	2	f	1	el frances es hacker	1	\N
36	3	3	f	1	extrano las carne de monterrey	1	\N
37	2	3	f	1	vivir en gdl es caro	1	\N
39	2	1	f	1	que buen clima	1	\N
14	1	1	t	1	12345678	1	\N
15	1	1	t	1	ewfvdsfzz	1	\N
16	1	1	t	1	lorem ipsum	1	\N
17	1	1	t	1	wesdvdv	1	\N
22	1	1	t	1	ewerwerwer	1	\N
18	1	1	t	1	werwerwer	1	\N
24	1	1	t	1	sdfsdfg	1	\N
19	1	1	t	1	eryfgfdadf	1	\N
20	1	1	t	1	rterdfsdffasd	1	\N
72	2	2	t	1	y	1	\N
73	2	2	f	1	u	1	\N
2	4	1	t	1	o	1	\N
3	3	1	t	1	p	1	\N
13	1	1	t	1	sdfshhfghsfheargssrth	1	\N
74	2	3	t	1	i	1	\N
55	2	3	t	1	Los pepcilintros son de os 90s	1	\N
56	3	3	t	1	Los tazos aun tiene seguidores	1	\N
45	2	3	f	1	Jaime el nino tiene sed y no hay naranjas	1	\N
46	1	3	f	1	Pero el gran sabor de tang le va a encantar	1	\N
47	1	3	f	1	La vida es una tombola, ton ton tombola	1	\N
48	1	3	f	1	Tigres versus rayados	1	\N
38	2	1	t	1	chespirito se ha pelado con villagran	1	\N
26	1	1	t	1	La caravina de ambrosio rules	1	\N
40	2	3	f	1	carnes selectas san juan marinadas	1	\N
41	2	3	f	1	Tortugas ninja quieren pizza	1	\N
42	2	3	f	1	Tomando una pepsi kick	1	\N
43	2	3	f	1	De nino siempre quice unos nunchakos	1	\N
44	2	3	f	1	Pongale aguacate cabron	1	\N
53	2	2	t	1	Busqueda binaria	1	\N
27	1	1	t	1	quick sort	1	\N
28	1	1	t	1	Las nenas con zapatos de tacon se ven mejor	1	\N
57	2	1	f	1	bronco es el gigante de america ?	1	\N
58	1	3	f	1	A como extrano ir a los tacos	1	\N
59	2	2	f	1	Los hackatones estan chidos pero son extremadamente cansados	1	\N
60	1	3	f	1	Esta descripciontiene que editarce	1	\N
61	4	3	f	1	Las alfombras siempre estaran de moda	1	\N
35	2	2	t	1	El titanic no fue el unico barco gigante	1	\N
62	3	2	f	1	es dificil no cargarla con las prisas	1	\N
63	4	3	f	1	Que pedo con el corona virus	1	\N
66	1	1	f	1	restauran menu menu	1	\N
68	1	1	f	1	a	1	\N
69	2	3	f	1	b	1	\N
70	1	1	f	1	d	1	\N
71	1	1	f	1	t	1	\N
\.


--
-- Data for Name: orgchart_roles; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.orgchart_roles (id, title) FROM stdin;
1	CONTRALOR
2	COORDINADOR GENERAL
3	DIRECTOR
4	AUDITORES
5	ADMINISTRADOR DE SISTEMA
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.sectors (id, title) FROM stdin;
1	CENTRAL
2	PARAESTATAL
3	OBRA PÚBLICA
\.


--
-- Data for Name: security_app_context; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.security_app_context (orgchart_role_id, app_id) FROM stdin;
5	1
5	2
5	3
5	4
\.


--
-- Data for Name: social_programs; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.social_programs (id, title) FROM stdin;
1	Liconsa
2	Solidaridad
3	Gobierno que paga a tiempo
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: knight_rider
--

COPY public.users (id, username, password, orgchart_role_id, division_id, disabled) FROM stdin;
1	garaujo	123qwe	5	1	f
2	contralor	123qwe	1	1	f
\.


--
-- Name: observations_seq; Type: SEQUENCE SET; Schema: public; Owner: knight_rider
--

SELECT pg_catalog.setval('public.observations_seq', 101, true);


--
-- Name: apps app_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT app_pkey PRIMARY KEY (id);


--
-- Name: apps app_titulo_key; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT app_titulo_key UNIQUE (nombre_app);


--
-- Name: audits audits_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_pkey PRIMARY KEY (id);


--
-- Name: geo_countries country_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.geo_countries
    ADD CONSTRAINT country_pkey PRIMARY KEY (id);


--
-- Name: geo_countries country_title_key; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.geo_countries
    ADD CONSTRAINT country_title_key UNIQUE (title);


--
-- Name: dependencies dependency_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_pkey PRIMARY KEY (id);


--
-- Name: dependencies dependency_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_unique_title UNIQUE (title);


--
-- Name: divisions division_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);


--
-- Name: divisions division_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_unique_title UNIQUE (title);


--
-- Name: fiscals fiscal_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_pkey PRIMARY KEY (id);


--
-- Name: fiscals fiscal_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_unique_title UNIQUE (title);


--
-- Name: geo_municipalities geo_municipality_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.geo_municipalities
    ADD CONSTRAINT geo_municipality_pkey PRIMARY KEY (id);


--
-- Name: observation_statuses observation_status_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observation_statuses
    ADD CONSTRAINT observation_status_pkey PRIMARY KEY (id);


--
-- Name: observation_statuses observation_status_titulo_key; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observation_statuses
    ADD CONSTRAINT observation_status_titulo_key UNIQUE (title);


--
-- Name: observations observation_title_unique; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observation_title_unique UNIQUE (title);


--
-- Name: observation_types observation_type_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_pkey PRIMARY KEY (id);


--
-- Name: observation_types observation_type_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_unique_title UNIQUE (title);


--
-- Name: observations observations_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_pkey PRIMARY KEY (id);


--
-- Name: orgchart_roles orgchart_role_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_pkey PRIMARY KEY (id);


--
-- Name: orgchart_roles orgchart_role_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_unique_title UNIQUE (title);


--
-- Name: security_app_context sec_app_ctxt_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT sec_app_ctxt_pkey PRIMARY KEY (orgchart_role_id, app_id);


--
-- Name: sectors sector_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);


--
-- Name: sectors sector_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_unique_title UNIQUE (title);


--
-- Name: social_programs social_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.social_programs
    ADD CONSTRAINT social_programs_pkey PRIMARY KEY (id);


--
-- Name: social_programs social_programs_unique_title; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.social_programs
    ADD CONSTRAINT social_programs_unique_title UNIQUE (title);


--
-- Name: geo_states state_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.geo_states
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_unique_username; Type: CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique_username UNIQUE (username);


--
-- Name: observations audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT audits_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id) NOT VALID;


--
-- Name: observations observations_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_observation_types_fkey FOREIGN KEY (observation_type_id) REFERENCES public.observation_types(id);


--
-- Name: observations observations_social_programs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_social_programs_fkey FOREIGN KEY (social_program_id) REFERENCES public.social_programs(id) NOT VALID;


--
-- Name: security_app_context sec_app_ctxt_apps_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT sec_app_ctxt_apps_fkey FOREIGN KEY (app_id) REFERENCES public.apps(id) NOT VALID;


--
-- Name: security_app_context sec_app_ctxt_orgchart_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT sec_app_ctxt_orgchart_roles_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id) NOT VALID;


--
-- Name: geo_states state_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.geo_states
    ADD CONSTRAINT state_country_fkey FOREIGN KEY (country_id) REFERENCES public.geo_countries(id);


--
-- Name: users users_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_divisions_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) NOT VALID;


--
-- Name: users users_orgchart_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: knight_rider
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_orgchart_roles_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

