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
-- Name: alter_observation(integer, integer); Type: FUNCTION; Schema: public; Owner: knight_rider
--

CREATE FUNCTION public.alter_observation(_id integer, _type_id integer) RETURNS record
    LANGUAGE plpgsql
    AS $$
declare
	last_id integer := 0;
	rmsg text := '';
	updates_count integer := 0;
	
begin
	case
		when _id = 0 then
		
			insert into observations (observation_type_id)
			values (_type_id)
			returning id into last_id;
			
		when _id > 0 then
		
			with rows as (
				update observations
				set observation_type_id = _type_id
				where id = _id
				returning 1
			)
			select count(*) from rows into updates_count;
			
			if updates_count = 0 then
				raise exception 'Observation object with id % was not updated', _id
					using hint = 'Does it exist?';
			end if;
			
			last_id = _id;
			
		else
			raise exception 'Observation id % is not supported', _id;
	end case;
	
	return (last_id::integer, ''::text);
	
	exception
		when others then
			get stacked diagnostics rmsg = message_text;
			return (-1::integer, rmsg::text);
end;
$$;


ALTER FUNCTION public.alter_observation(_id integer, _type_id integer) OWNER TO knight_rider;

--
-- Name: FUNCTION alter_observation(_id integer, _type_id integer); Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON FUNCTION public.alter_observation(_id integer, _type_id integer) IS 'Function intended to update or insert an observation';


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
    blocked boolean DEFAULT false NOT NULL
);


ALTER TABLE public.observations OWNER TO knight_rider;

--
-- Name: TABLE observations; Type: COMMENT; Schema: public; Owner: knight_rider
--

COMMENT ON TABLE public.observations IS 'Alberga la entidad observacion';


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

COPY public.observations (id, observation_type_id, social_program_id, blocked) FROM stdin;
3	3	1	f
4	2	1	f
5	1	1	f
2	4	1	f
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
1	XXX
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

SELECT pg_catalog.setval('public.observations_seq', 5, true);


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

