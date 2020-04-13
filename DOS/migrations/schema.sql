--
-- PostgreSQL database dump
--

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

SET default_tablespace = '';

--
-- Name: amounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.amounts (
    id integer NOT NULL,
    projected double precision NOT NULL,
    solved double precision NOT NULL,
    observation_id integer NOT NULL,
    inception_time timestamp with time zone NOT NULL,
    comments text
);


ALTER TABLE public.amounts OWNER TO postgres;

--
-- Name: amounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.amounts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.amounts_id_seq OWNER TO postgres;

--
-- Name: amounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.amounts_id_seq OWNED BY public.amounts.id;


--
-- Name: apps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.apps (
    id integer NOT NULL,
    descripcion character varying NOT NULL,
    nombre_app character varying
);


ALTER TABLE public.apps OWNER TO postgres;

--
-- Name: TABLE apps; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.apps IS 'Relacion que alberga las aplicaciones que seran gobernadas por roles';


--
-- Name: audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audits (
    id integer NOT NULL,
    title character varying NOT NULL,
    dependency_id integer
);


ALTER TABLE public.audits OWNER TO postgres;

--
-- Name: COLUMN audits.title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audits.title IS 'Este es el alphanumerico que identifica a una auditoria';


--
-- Name: COLUMN audits.dependency_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audits.dependency_id IS 'Dependencia que ha originado la auditoria';


--
-- Name: dependencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dependencies (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);


ALTER TABLE public.dependencies OWNER TO postgres;

--
-- Name: TABLE dependencies; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.dependencies IS 'Relacion que alberga las dependencias de gobierno';


--
-- Name: divisions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.divisions (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.divisions OWNER TO postgres;

--
-- Name: TABLE divisions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.divisions IS 'Relacion que alberga las direcciones de la contraloria';


--
-- Name: fiscals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fiscals (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);


ALTER TABLE public.fiscals OWNER TO postgres;

--
-- Name: TABLE fiscals; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.fiscals IS 'Relacion que alberga los organos fiscalizadores';


--
-- Name: geo_countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_countries (
    id integer NOT NULL,
    title character varying,
    abrev character varying
);


ALTER TABLE public.geo_countries OWNER TO postgres;

--
-- Name: geo_municipalities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_municipalities (
    id integer NOT NULL,
    title character varying,
    geo_state_id integer
);


ALTER TABLE public.geo_municipalities OWNER TO postgres;

--
-- Name: TABLE geo_municipalities; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.geo_municipalities IS 'Tabla que alberga los municipios que pueden ser seleccionados en los aplicativos de el sistema , en base al pais y estado que se seleccione sobre el aplicativo en curso';


--
-- Name: geo_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.geo_states (
    id integer NOT NULL,
    title character varying,
    abrev character varying,
    country_id integer NOT NULL
);


ALTER TABLE public.geo_states OWNER TO postgres;

--
-- Name: observation_statuses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observation_statuses (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_statuses OWNER TO postgres;

--
-- Name: TABLE observation_statuses; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observation_statuses IS 'Estado transitivo de una entidad observacion';


--
-- Name: observation_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observation_types (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_types OWNER TO postgres;

--
-- Name: TABLE observation_types; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observation_types IS 'Alberga los tipos de observacion';


--
-- Name: observations_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observations_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observations_seq OWNER TO postgres;

--
-- Name: SEQUENCE observations_seq; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON SEQUENCE public.observations_seq IS 'Sequence object for observations table';


--
-- Name: observations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observations (
    id integer DEFAULT nextval('public.observations_seq'::regclass) NOT NULL,
    observation_type_id integer NOT NULL,
    social_program_id integer NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    audit_id integer NOT NULL,
    title text NOT NULL,
    fiscal_id integer NOT NULL,
    touch_latter_time timestamp with time zone,
    amount_observed double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.observations OWNER TO postgres;

--
-- Name: TABLE observations; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observations IS 'Alberga la entidad observacion';


--
-- Name: COLUMN observations.title; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.observations.title IS 'La descripcion de la auditoria';


--
-- Name: COLUMN observations.fiscal_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.observations.fiscal_id IS 'Representa la entidad fiscalizadora que ejecuta la observacion';


--
-- Name: orgchart_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orgchart_roles (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.orgchart_roles OWNER TO postgres;

--
-- Name: TABLE orgchart_roles; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.orgchart_roles IS 'Roles del diagrama organizacional';


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectors (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.sectors OWNER TO postgres;

--
-- Name: TABLE sectors; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.sectors IS 'Relacion que alberga los sectores (utilizados como attributos de agrupacion para las dependencias)';


--
-- Name: security_app_context; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.security_app_context (
    orgchart_role_id integer NOT NULL,
    app_id integer NOT NULL
);


ALTER TABLE public.security_app_context OWNER TO postgres;

--
-- Name: TABLE security_app_context; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.security_app_context IS 'Join table entre tabla apps y tabla orgchart_roles';


--
-- Name: social_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_programs (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.social_programs OWNER TO postgres;

--
-- Name: TABLE social_programs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.social_programs IS 'Alberga los programas sociales a los que esta vinculada una observacion';


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    orgchart_role_id integer NOT NULL,
    division_id integer NOT NULL,
    disabled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Relacion que alberga usuarios del sistema';


--
-- Name: user_app_access; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.user_app_access AS
 SELECT users.id AS usr_id,
    sappctx.app_id
   FROM (public.users
     JOIN public.security_app_context sappctx ON ((sappctx.orgchart_role_id = users.orgchart_role_id)))
  WHERE (NOT users.disabled)
  ORDER BY users.id;


ALTER TABLE public.user_app_access OWNER TO postgres;

--
-- Name: amounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amounts ALTER COLUMN id SET DEFAULT nextval('public.amounts_id_seq'::regclass);


--
-- Data for Name: amounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.amounts (id, projected, solved, observation_id, inception_time, comments) FROM stdin;
1	1	1	4	2020-04-09 20:03:01.808318-05	\N
2	1	1	218	2020-04-09 20:03:01.808318-05	\N
3	1	1	216	2020-04-09 20:03:01.808318-05	\N
4	1	1	106	2020-04-09 20:03:01.808318-05	\N
5	1	1	108	2020-04-09 20:03:01.808318-05	\N
6	1	1	114	2020-04-09 20:03:01.808318-05	\N
7	1	1	116	2020-04-09 20:03:01.808318-05	\N
8	1	1	180	2020-04-09 20:03:01.808318-05	\N
9	1	1	186	2020-04-09 20:03:01.808318-05	\N
10	1	1	188	2020-04-09 20:03:01.808318-05	\N
11	1	1	122	2020-04-09 20:03:01.808318-05	\N
12	1	1	120	2020-04-09 20:03:01.808318-05	\N
13	1	1	124	2020-04-09 20:03:01.808318-05	\N
14	1	1	228	2020-04-09 20:03:01.808318-05	\N
15	1	1	5	2020-04-09 20:03:01.808318-05	\N
16	1	1	126	2020-04-09 20:03:01.808318-05	\N
17	1	1	232	2020-04-09 20:03:01.808318-05	\N
18	1	1	134	2020-04-09 20:03:01.808318-05	\N
19	1	1	236	2020-04-09 20:03:01.808318-05	\N
20	1	1	148	2020-04-09 20:03:01.808318-05	\N
21	1	1	150	2020-04-09 20:03:01.808318-05	\N
22	1	1	234	2020-04-09 20:03:01.808318-05	\N
23	1	1	158	2020-04-09 20:03:01.808318-05	\N
24	1	1	160	2020-04-09 20:03:01.808318-05	\N
25	1	1	162	2020-04-09 20:03:01.808318-05	\N
26	1	1	166	2020-04-09 20:03:01.808318-05	\N
27	1	1	168	2020-04-09 20:03:01.808318-05	\N
28	1	1	242	2020-04-09 20:03:01.808318-05	\N
29	1	1	224	2020-04-09 20:03:01.808318-05	\N
30	1	1	176	2020-04-09 20:03:01.808318-05	\N
31	1	1	178	2020-04-09 20:03:01.808318-05	\N
32	1	1	182	2020-04-09 20:03:01.808318-05	\N
33	1	1	6	2020-04-09 20:03:01.808318-05	\N
34	1	1	10	2020-04-09 20:03:01.808318-05	\N
35	1	1	11	2020-04-09 20:03:01.808318-05	\N
36	1	1	12	2020-04-09 20:03:01.808318-05	\N
37	1	1	31	2020-04-09 20:03:01.808318-05	\N
38	1	1	32	2020-04-09 20:03:01.808318-05	\N
39	1	1	25	2020-04-09 20:03:01.808318-05	\N
40	1	1	21	2020-04-09 20:03:01.808318-05	\N
41	1	1	23	2020-04-09 20:07:23.360009-05	\N
42	1	1	30	2020-04-09 20:07:23.360009-05	\N
43	1	1	29	2020-04-09 20:07:23.360009-05	\N
44	1	1	49	2020-04-09 20:07:23.360009-05	\N
45	1	1	50	2020-04-09 20:07:23.360009-05	\N
46	1	1	51	2020-04-09 20:07:23.360009-05	\N
47	1	1	52	2020-04-09 20:07:23.360009-05	\N
48	1	1	54	2020-04-09 20:07:23.360009-05	\N
49	1	1	33	2020-04-09 20:07:23.360009-05	\N
50	1	1	34	2020-04-09 20:07:23.360009-05	\N
51	1	1	36	2020-04-09 20:07:23.360009-05	\N
52	1	1	37	2020-04-09 20:07:23.360009-05	\N
53	1	1	39	2020-04-09 20:07:23.360009-05	\N
54	1	1	14	2020-04-09 20:07:23.360009-05	\N
55	1	1	15	2020-04-09 20:07:23.360009-05	\N
56	1	1	16	2020-04-09 20:07:23.360009-05	\N
57	1	1	17	2020-04-09 20:07:23.360009-05	\N
58	1	1	22	2020-04-09 20:07:23.360009-05	\N
59	1	1	18	2020-04-09 20:07:23.360009-05	\N
60	1	1	24	2020-04-09 20:07:23.360009-05	\N
61	1	1	19	2020-04-09 20:07:23.360009-05	\N
62	1	1	20	2020-04-09 20:07:23.360009-05	\N
63	1	1	194	2020-04-09 20:07:23.360009-05	\N
64	1	1	196	2020-04-09 20:07:23.360009-05	\N
65	1	1	200	2020-04-09 20:07:23.360009-05	\N
66	1	1	202	2020-04-09 20:07:23.360009-05	\N
67	1	1	204	2020-04-09 20:07:23.360009-05	\N
68	1	1	206	2020-04-09 20:07:23.360009-05	\N
69	1	1	208	2020-04-09 20:07:23.360009-05	\N
70	1	1	210	2020-04-09 20:07:23.360009-05	\N
71	1	1	72	2020-04-09 20:07:23.360009-05	\N
72	1	1	73	2020-04-09 20:07:23.360009-05	\N
73	1	1	214	2020-04-09 20:07:23.360009-05	\N
74	1	1	2	2020-04-09 20:07:23.360009-05	\N
75	1	1	3	2020-04-09 20:07:23.360009-05	\N
76	1	1	13	2020-04-09 20:07:23.360009-05	\N
77	1	1	74	2020-04-09 20:07:23.360009-05	\N
78	1	1	55	2020-04-09 20:07:23.360009-05	\N
79	1	1	56	2020-04-09 20:07:23.360009-05	\N
80	1	1	45	2020-04-09 20:07:23.360009-05	\N
81	1	1	46	2020-04-09 20:07:23.360009-05	\N
82	1	1	47	2020-04-09 20:07:23.360009-05	\N
83	1	1	48	2020-04-09 20:07:23.360009-05	\N
84	1	1	38	2020-04-09 20:07:23.360009-05	\N
85	1	1	26	2020-04-09 20:07:23.360009-05	\N
86	1	1	40	2020-04-09 20:07:23.360009-05	\N
87	1	1	41	2020-04-09 20:07:23.360009-05	\N
88	1	1	44	2020-04-09 20:07:23.360009-05	\N
89	1	1	53	2020-04-09 20:07:23.360009-05	\N
90	1	1	27	2020-04-09 20:07:23.360009-05	\N
91	1	1	28	2020-04-09 20:07:23.360009-05	\N
92	1	1	57	2020-04-09 20:07:23.360009-05	\N
93	1	1	58	2020-04-09 20:07:23.360009-05	\N
94	1	1	59	2020-04-09 20:07:23.360009-05	\N
95	1	1	60	2020-04-09 20:07:23.360009-05	\N
96	1	1	61	2020-04-09 20:07:23.360009-05	\N
97	1	1	35	2020-04-09 20:07:23.360009-05	\N
98	1	1	62	2020-04-09 20:07:23.360009-05	\N
99	1	1	63	2020-04-09 20:07:23.360009-05	\N
100	1	1	66	2020-04-09 20:07:23.360009-05	\N
101	1	1	68	2020-04-09 20:07:23.360009-05	\N
102	1	1	69	2020-04-09 20:07:23.360009-05	\N
103	1	1	70	2020-04-09 20:07:23.360009-05	\N
104	1	1	71	2020-04-09 20:07:23.360009-05	\N
105	1	1	105	2020-04-09 20:07:23.360009-05	\N
106	1	1	107	2020-04-09 20:07:23.360009-05	\N
107	1	1	42	2020-04-09 20:07:23.360009-05	\N
108	1	1	43	2020-04-09 20:07:23.360009-05	\N
109	1	1	109	2020-04-09 20:07:23.360009-05	\N
110	1	1	219	2020-04-09 20:07:23.360009-05	\N
111	1	1	115	2020-04-09 20:07:23.360009-05	\N
112	1	1	117	2020-04-09 20:07:23.360009-05	\N
113	1	1	121	2020-04-09 20:07:23.360009-05	\N
114	1	1	215	2020-04-09 20:07:23.360009-05	\N
115	1	1	125	2020-04-09 20:07:23.360009-05	\N
116	1	1	129	2020-04-09 20:07:23.360009-05	\N
117	1	1	133	2020-04-09 20:07:23.360009-05	\N
118	1	1	135	2020-04-09 20:07:23.360009-05	\N
119	1	1	139	2020-04-09 20:07:23.360009-05	\N
120	1	1	141	2020-04-09 20:07:23.360009-05	\N
121	1	1	145	2020-04-09 20:07:23.360009-05	\N
122	1	1	153	2020-04-09 20:07:23.360009-05	\N
123	1	1	155	2020-04-09 20:07:23.360009-05	\N
124	1	1	159	2020-04-09 20:07:23.360009-05	\N
125	1	1	165	2020-04-09 20:07:23.360009-05	\N
126	1	1	167	2020-04-09 20:07:23.360009-05	\N
127	1	1	169	2020-04-09 20:07:23.360009-05	\N
128	1	1	173	2020-04-09 20:07:23.360009-05	\N
129	1	1	177	2020-04-09 20:07:23.360009-05	\N
130	1	1	179	2020-04-09 20:07:23.360009-05	\N
131	1	1	213	2020-04-09 20:07:23.360009-05	\N
132	1	1	181	2020-04-09 20:07:23.360009-05	\N
133	1	1	229	2020-04-09 20:07:23.360009-05	\N
134	1	1	187	2020-04-09 20:07:23.360009-05	\N
135	1	1	193	2020-04-09 20:07:23.360009-05	\N
136	1	1	199	2020-04-09 20:07:23.360009-05	\N
137	1	1	201	2020-04-09 20:07:23.360009-05	\N
138	1	1	203	2020-04-09 20:07:23.360009-05	\N
139	1	1	205	2020-04-09 20:07:23.360009-05	\N
140	1	1	207	2020-04-09 20:07:23.360009-05	\N
141	1	1	209	2020-04-09 20:07:23.360009-05	\N
142	1	1	235	2020-04-09 20:07:23.360009-05	\N
143	1	1	237	2020-04-09 20:07:23.360009-05	\N
144	1	1	233	2020-04-09 20:07:23.360009-05	\N
145	1	1	241	2020-04-09 20:07:23.360009-05	\N
146	1	1	243	2020-04-09 20:07:23.360009-05	\N
147	8	3	4	2020-04-10 00:48:08.457834-05	Buen rollito
\.


--
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apps (id, descripcion, nombre_app) FROM stdin;
1	Proceso para generar observaciones	PROC_OBSERVACIONES
2	Altas, bajas y cambios de usuarios	CAT_USUARIOS
3	Altas, bajas y cambios de direcciones	CAT_DIRECCIONES
4	Altas, bajas y cambios de organos fiscalizadores	CAT_FISCAL
\.


--
-- Data for Name: audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audits (id, title, dependency_id) FROM stdin;
1	CTG-OP-15-023	27
\.


--
-- Data for Name: dependencies; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.divisions (id, title) FROM stdin;
1	CENTRAL
2	PARAESTATAL
3	OBRAS
\.


--
-- Data for Name: fiscals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fiscals (id, title, description) FROM stdin;
2	ASF	AUDITORÍA SUPERIOR DE LA FEDERACIÓN
3	SFP	SECRETARÍA DE LA FUNCIÓN PÚBLICA
4	CyTG	CONTRALORÍA Y TRANSPARENCIA GUBERNAMENTAL
1	ASENL	AUDITORÍA SUPERIOR DEL ESTADO DE NUEVO LEÓN
\.


--
-- Data for Name: geo_countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_countries (id, title, abrev) FROM stdin;
1	MEXICO	MX
\.


--
-- Data for Name: geo_municipalities; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: geo_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.geo_states (id, title, abrev, country_id) FROM stdin;
19	Nuevo León	NL	1
\.


--
-- Data for Name: observation_statuses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observation_statuses (id, title) FROM stdin;
\.


--
-- Data for Name: observation_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observation_types (id, title) FROM stdin;
1	FINANCIERA
2	NORMATIVA
3	ECONOMICA
4	TECNICA
\.


--
-- Data for Name: observations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observations (id, observation_type_id, social_program_id, blocked, audit_id, title, fiscal_id, touch_latter_time, amount_observed) FROM stdin;
218	1	1	t	1	12	1	\N	0
216	1	1	t	1	343434ffdfdf	1	\N	0
106	3	1	f	1	otro title	3	\N	0
108	1	1	f	1	test	1	\N	0
114	2	2	f	1	TEST EEEH!	4	\N	0
116	3	1	f	1	asdasddddd	3	\N	0
180	1	1	f	1	..x	2	\N	0
186	4	2	f	1	test! !!!	3	\N	0
188	4	3	f	1	DEFICIENCIAS EN LA EJECUCIÓN Y CONCLUSIÓN DE LOS TRABAJOS	3	\N	0
122	3	1	t	1	Amazing!mmm	2	\N	0
120	3	1	f	1	Updated title	1	\N	0
124	3	1	f	1	Amazing!	2	\N	0
228	2	2	f	1	TEX	1	\N	0
5	1	1	t	1	freebsd2	1	\N	0
126	1	1	f	1	b.	2	\N	0
232	1	1	f	1	TEXX	1	\N	0
134	1	1	t	1	test x!	2	\N	0
236	1	1	t	1	tttttt	1	\N	0
148	3	1	f	1	g.	3	\N	0
150	3	1	f	1	h.	3	\N	0
234	1	2	t	1	te	1	\N	0
158	1	1	f	1	..k	2	\N	0
160	1	1	f	1	..l	2	\N	0
162	1	1	f	1	..n	2	\N	0
166	1	1	f	1	..p	2	\N	0
168	1	1	f	1	..r	2	\N	0
242	1	1	f	1	tttttc	1	\N	0
224	1	1	f	1	Test notification¡	1	\N	0
176	1	1	f	1	..t	2	\N	0
178	1	1	f	1	..v	2	\N	0
182	1	1	f	1	..z	2	\N	0
6	4	1	t	1	heman	1	\N	0
10	1	1	t	1	skeletor	1	\N	0
11	1	1	t	1	este dato debe ser actualizado	1	\N	0
12	3	1	t	1	sting and shaggy	1	\N	0
31	1	1	f	1	www.youtube.com	1	\N	0
32	1	1	f	1	que kilombo	1	\N	0
25	1	1	t	1	Alan parson project	1	\N	0
21	1	1	t	1	Blue monday	1	\N	0
23	1	1	t	1	Esto va evolucionando	1	\N	0
30	1	1	t	1	Esto necesita atencion	1	\N	0
29	1	1	t	1	Rafa ya no esta aqui, pero Omar cubre su rol	1	\N	0
49	2	2	f	1	Yo tenia 3 perritos	1	\N	0
50	3	1	f	1	Uno se callo en la nieve	1	\N	0
51	2	3	f	1	Y ya nada mas me quedan nueva	1	\N	0
52	2	2	f	1	Coca es mejor que pepsi	1	\N	0
54	2	2	t	1	Pero pepsi junta mitades	1	\N	0
33	1	1	t	1	el hector ceron ama javascript	1	\N	0
34	2	2	f	1	el frances es hacker	1	\N	0
36	3	3	f	1	extrano las carne de monterrey	1	\N	0
37	2	3	f	1	vivir en gdl es caro	1	\N	0
39	2	1	f	1	que buen clima	1	\N	0
14	1	1	t	1	12345678	1	\N	0
15	1	1	t	1	ewfvdsfzz	1	\N	0
16	1	1	t	1	lorem ipsum	1	\N	0
17	1	1	t	1	wesdvdv	1	\N	0
22	1	1	t	1	ewerwerwer	1	\N	0
18	1	1	t	1	werwerwer	1	\N	0
24	1	1	t	1	sdfsdfg	1	\N	0
19	1	1	t	1	eryfgfdadf	1	\N	0
20	1	1	t	1	rterdfsdffasd	1	\N	0
194	1	1	f	1	kjjkhj	1	\N	0
196	2	2	f	1	ttt	1	\N	0
4	1	1	f	1	Hola mundo observado	1	2020-04-10 00:48:43.701385-05	0
200	1	2	f	1	sddssdsd	1	\N	0
202	1	1	f	1	1	1	\N	0
204	1	1	f	1	445554	1	\N	0
206	1	2	f	1	444334	3	\N	0
208	1	1	f	1	test 1	1	\N	0
210	1	1	f	1	44	2	\N	0
72	2	2	t	1	y	1	\N	0
73	2	2	f	1	u	1	\N	0
214	1	1	f	1	TE	1	\N	0
2	4	1	t	1	o	1	\N	0
3	3	1	t	1	p	1	\N	0
13	1	1	t	1	sdfshhfghsfheargssrth	1	\N	0
74	2	3	t	1	i	1	\N	0
55	2	3	t	1	Los pepcilintros son de os 90s	1	\N	0
56	3	3	t	1	Los tazos aun tiene seguidores	1	\N	0
45	2	3	f	1	Jaime el nino tiene sed y no hay naranjas	1	\N	0
46	1	3	f	1	Pero el gran sabor de tang le va a encantar	1	\N	0
47	1	3	f	1	La vida es una tombola, ton ton tombola	1	\N	0
48	1	3	f	1	Tigres versus rayados	1	\N	0
38	2	1	t	1	chespirito se ha pelado con villagran	1	\N	0
26	1	1	t	1	La caravina de ambrosio rules	1	\N	0
40	2	3	f	1	carnes selectas san juan marinadas	1	\N	0
41	2	3	f	1	Tortugas ninja quieren pizza	1	\N	0
44	2	3	f	1	Pongale aguacate cabron	1	\N	0
53	2	2	t	1	Busqueda binaria	1	\N	0
27	1	1	t	1	quick sort	1	\N	0
28	1	1	t	1	Las nenas con zapatos de tacon se ven mejor	1	\N	0
57	2	1	f	1	bronco es el gigante de america ?	1	\N	0
58	1	3	f	1	A como extrano ir a los tacos	1	\N	0
59	2	2	f	1	Los hackatones estan chidos pero son extremadamente cansados	1	\N	0
60	1	3	f	1	Esta descripciontiene que editarce	1	\N	0
61	4	3	f	1	Las alfombras siempre estaran de moda	1	\N	0
35	2	2	t	1	El titanic no fue el unico barco gigante	1	\N	0
62	3	2	f	1	es dificil no cargarla con las prisas	1	\N	0
63	4	3	f	1	Que pedo con el corona virus	1	\N	0
66	1	1	f	1	restauran menu menu	1	\N	0
68	1	1	f	1	a	1	\N	0
69	2	3	f	1	b	1	\N	0
70	1	1	f	1	d	1	\N	0
71	1	1	f	1	t	1	\N	0
105	3	1	f	1	esto es un bla blazo	3	\N	0
107	1	1	f	1		1	\N	0
42	2	3	t	1	Tomando una pepsi kick	1	\N	0
43	2	3	t	1	De nino siempre quice unos nunchakos	1	\N	0
109	1	1	f	1	asdf	2	\N	0
219	1	1	t	1	Test notification¡222	1	\N	0
115	1	1	f	1	Title!	1	\N	0
117	1	1	f	1	asdfdd	2	\N	0
121	1	1	f	1	zzz	1	\N	0
215	1	2	t	1	T2	1	\N	0
125	3	1	f	1	Amazing!2	2	\N	0
129	2	2	f	1	test test c	4	\N	0
133	3	2	f	1	Test NEW! 2	1	\N	0
135	1	1	f	1	c.	2	\N	0
139	1	1	f	1	d.	2	\N	0
141	3	1	f	1	e.	3	\N	0
145	3	1	f	1	f.	3	\N	0
153	3	1	f	1	i.	3	\N	0
155	1	1	f	1	..j	2	\N	0
159	1	1	f	1	..kl	2	\N	0
165	1	1	f	1	..o	2	\N	0
167	1	1	f	1	..q	2	\N	0
169	1	1	f	1	..s	2	\N	0
173	1	1	f	1	..sf	2	\N	0
177	1	1	f	1	..u	2	\N	0
179	1	1	f	1	..w	2	\N	0
213	1	1	f	1	333333	1	\N	0
181	4	1	f	1	..y	2	\N	0
229	1	2	f	1	eedede	1	\N	0
187	1	1	f	1	Aqui va la descripcion de la observacion	2	\N	0
193	1	1	f	1	tttesdd	1	\N	0
199	1	1	f	1	tttdsds	1	\N	0
201	1	1	f	1	3333	1	\N	0
203	1	1	f	1	223	3	\N	0
205	2	1	f	1	343434	1	\N	0
207	1	1	f	1	33333	1	\N	0
209	1	1	f	1	53	3	\N	0
235	1	1	t	1	RRFFDF	1	\N	0
237	1	1	t	1	TTTC	1	\N	0
233	1	1	f	1	TED	1	\N	0
241	1	1	f	1	TEDD	1	\N	0
243	1	1	t	1	assa	1	\N	0
\.


--
-- Data for Name: orgchart_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orgchart_roles (id, title) FROM stdin;
1	CONTRALOR
2	COORDINADOR GENERAL
3	DIRECTOR
4	AUDITORES
5	ADMINISTRADOR DE SISTEMA
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sectors (id, title) FROM stdin;
1	CENTRAL
2	PARAESTATAL
3	OBRA PÚBLICA
\.


--
-- Data for Name: security_app_context; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.security_app_context (orgchart_role_id, app_id) FROM stdin;
5	1
5	2
5	3
5	4
\.


--
-- Data for Name: social_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_programs (id, title) FROM stdin;
1	Liconsa
2	Solidaridad
3	Gobierno que paga a tiempo
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, orgchart_role_id, division_id, disabled) FROM stdin;
1	garaujo	123qwe	5	1	f
2	contralor	123qwe	1	1	f
\.


--
-- Name: amounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.amounts_id_seq', 147, true);


--
-- Name: observations_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.observations_seq', 243, true);


--
-- Name: amounts amounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amounts
    ADD CONSTRAINT amounts_pkey PRIMARY KEY (id);


--
-- Name: apps app_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT app_pkey PRIMARY KEY (id);


--
-- Name: apps app_titulo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT app_titulo_key UNIQUE (nombre_app);


--
-- Name: audits audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_pkey PRIMARY KEY (id);


--
-- Name: geo_countries country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_countries
    ADD CONSTRAINT country_pkey PRIMARY KEY (id);


--
-- Name: geo_countries country_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_countries
    ADD CONSTRAINT country_title_key UNIQUE (title);


--
-- Name: dependencies dependency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_pkey PRIMARY KEY (id);


--
-- Name: dependencies dependency_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_unique_title UNIQUE (title);


--
-- Name: divisions division_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);


--
-- Name: divisions division_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_unique_title UNIQUE (title);


--
-- Name: fiscals fiscal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_pkey PRIMARY KEY (id);


--
-- Name: fiscals fiscal_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_unique_title UNIQUE (title);


--
-- Name: geo_municipalities geo_municipality_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_municipalities
    ADD CONSTRAINT geo_municipality_pkey PRIMARY KEY (id);


--
-- Name: observation_statuses observation_status_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_statuses
    ADD CONSTRAINT observation_status_pkey PRIMARY KEY (id);


--
-- Name: observation_statuses observation_status_titulo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_statuses
    ADD CONSTRAINT observation_status_titulo_key UNIQUE (title);


--
-- Name: observations observation_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observation_title_unique UNIQUE (title);


--
-- Name: observation_types observation_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_pkey PRIMARY KEY (id);


--
-- Name: observation_types observation_type_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_unique_title UNIQUE (title);


--
-- Name: observations observations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_pkey PRIMARY KEY (id);


--
-- Name: orgchart_roles orgchart_role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_pkey PRIMARY KEY (id);


--
-- Name: orgchart_roles orgchart_role_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_unique_title UNIQUE (title);


--
-- Name: security_app_context sec_app_ctxt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT sec_app_ctxt_pkey PRIMARY KEY (orgchart_role_id, app_id);


--
-- Name: sectors sector_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);


--
-- Name: sectors sector_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_unique_title UNIQUE (title);


--
-- Name: social_programs social_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_programs
    ADD CONSTRAINT social_programs_pkey PRIMARY KEY (id);


--
-- Name: social_programs social_programs_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_programs
    ADD CONSTRAINT social_programs_unique_title UNIQUE (title);


--
-- Name: geo_states state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_states
    ADD CONSTRAINT state_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_unique_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique_username UNIQUE (username);


--
-- Name: amounts amounts_observations_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amounts
    ADD CONSTRAINT amounts_observations_fkey FOREIGN KEY (observation_id) REFERENCES public.observations(id);


--
-- Name: observations audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT audits_fkey FOREIGN KEY (audit_id) REFERENCES public.audits(id) NOT VALID;


--
-- Name: observations observations_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_observation_types_fkey FOREIGN KEY (observation_type_id) REFERENCES public.observation_types(id);


--
-- Name: observations observations_social_programs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_social_programs_fkey FOREIGN KEY (social_program_id) REFERENCES public.social_programs(id) NOT VALID;


--
-- Name: security_app_context sec_app_ctxt_apps_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT sec_app_ctxt_apps_fkey FOREIGN KEY (app_id) REFERENCES public.apps(id) NOT VALID;


--
-- Name: security_app_context sec_app_ctxt_orgchart_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT sec_app_ctxt_orgchart_roles_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id) NOT VALID;


--
-- Name: geo_states state_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_states
    ADD CONSTRAINT state_country_fkey FOREIGN KEY (country_id) REFERENCES public.geo_countries(id);


--
-- Name: users users_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_divisions_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) NOT VALID;


--
-- Name: users users_orgchart_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_orgchart_roles_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

