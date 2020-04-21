--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.17
-- Dumped by pg_dump version 12.2 (Ubuntu 12.2-2.pgdg18.04+1)

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
-- Name: audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audits_id_seq
    START WITH 2
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audits_id_seq OWNER TO postgres;

--
-- Name: audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audits (
    id integer DEFAULT nextval('public.audits_id_seq'::regclass) NOT NULL,
    title character varying NOT NULL,
    dependency_id integer,
    year integer DEFAULT 2012 NOT NULL,
    inception_time timestamp with time zone NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    touch_latter_time timestamp with time zone NOT NULL
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
-- Name: COLUMN audits.year; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audits.year IS 'Ano de la cuenta publica';


--
-- Name: authorities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authorities (
    id integer NOT NULL,
    title character varying NOT NULL,
    app_id integer,
    description character varying NOT NULL
);


ALTER TABLE public.authorities OWNER TO postgres;

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
-- Name: user_authority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_authority (
    id integer NOT NULL,
    user_id integer NOT NULL,
    authority_id integer NOT NULL
);


ALTER TABLE public.user_authority OWNER TO postgres;

--
-- Name: gral_user_authority_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gral_user_authority_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gral_user_authority_id_seq OWNER TO postgres;

--
-- Name: gral_user_authority_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gral_user_authority_id_seq OWNED BY public.user_authority.id;


--
-- Name: observation_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observation_codes (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_codes OWNER TO postgres;

--
-- Name: observation_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observation_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observation_codes_id_seq OWNER TO postgres;

--
-- Name: observation_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observation_codes_id_seq OWNED BY public.observation_codes.id;


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
    touch_latter_time timestamp with time zone NOT NULL,
    amount_observed double precision DEFAULT 0 NOT NULL,
    observation_code_id integer NOT NULL,
    observation_bis_code_id integer NOT NULL,
    inception_time timestamp with time zone NOT NULL,
    expiration_date date NOT NULL,
    reception_date date NOT NULL,
    doc_a_date date NOT NULL,
    doc_b_date date NOT NULL,
    doc_c_date date NOT NULL,
    doc_a character varying NOT NULL,
    doc_b character varying NOT NULL,
    doc_c character varying NOT NULL,
    dep_response character varying NOT NULL,
    dep_resp_comments character varying NOT NULL,
    division_id integer NOT NULL,
    hdr_doc character varying NOT NULL,
    hdr_reception_date date NOT NULL,
    hdr_expiration1_date date NOT NULL,
    hdr_expiration2_date date NOT NULL
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
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    username character varying NOT NULL,
    passwd character varying NOT NULL,
    orgchart_role_id integer NOT NULL,
    division_id integer NOT NULL,
    disabled boolean DEFAULT false NOT NULL,
    touch_latter_time timestamp with time zone,
    inception_time timestamp with time zone,
    blocked boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.users IS 'Relacion que alberga usuarios del sistema';


--
-- Name: amounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.amounts ALTER COLUMN id SET DEFAULT nextval('public.amounts_id_seq'::regclass);


--
-- Name: observation_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_codes ALTER COLUMN id SET DEFAULT nextval('public.observation_codes_id_seq'::regclass);


--
-- Name: user_authority id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_authority ALTER COLUMN id SET DEFAULT nextval('public.gral_user_authority_id_seq'::regclass);


--
-- Data for Name: amounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.amounts (id, projected, solved, observation_id, inception_time, comments) FROM stdin;
1	1	1	4	2020-04-10 01:03:01.808318+00	\N
2	1	1	218	2020-04-10 01:03:01.808318+00	\N
3	1	1	216	2020-04-10 01:03:01.808318+00	\N
4	1	1	106	2020-04-10 01:03:01.808318+00	\N
5	1	1	108	2020-04-10 01:03:01.808318+00	\N
6	1	1	114	2020-04-10 01:03:01.808318+00	\N
7	1	1	116	2020-04-10 01:03:01.808318+00	\N
8	1	1	180	2020-04-10 01:03:01.808318+00	\N
9	1	1	186	2020-04-10 01:03:01.808318+00	\N
10	1	1	188	2020-04-10 01:03:01.808318+00	\N
11	1	1	122	2020-04-10 01:03:01.808318+00	\N
12	1	1	120	2020-04-10 01:03:01.808318+00	\N
13	1	1	124	2020-04-10 01:03:01.808318+00	\N
14	1	1	228	2020-04-10 01:03:01.808318+00	\N
15	1	1	5	2020-04-10 01:03:01.808318+00	\N
16	1	1	126	2020-04-10 01:03:01.808318+00	\N
17	1	1	232	2020-04-10 01:03:01.808318+00	\N
18	1	1	134	2020-04-10 01:03:01.808318+00	\N
19	1	1	236	2020-04-10 01:03:01.808318+00	\N
20	1	1	148	2020-04-10 01:03:01.808318+00	\N
21	1	1	150	2020-04-10 01:03:01.808318+00	\N
22	1	1	234	2020-04-10 01:03:01.808318+00	\N
23	1	1	158	2020-04-10 01:03:01.808318+00	\N
24	1	1	160	2020-04-10 01:03:01.808318+00	\N
25	1	1	162	2020-04-10 01:03:01.808318+00	\N
26	1	1	166	2020-04-10 01:03:01.808318+00	\N
27	1	1	168	2020-04-10 01:03:01.808318+00	\N
28	1	1	242	2020-04-10 01:03:01.808318+00	\N
29	1	1	224	2020-04-10 01:03:01.808318+00	\N
30	1	1	176	2020-04-10 01:03:01.808318+00	\N
31	1	1	178	2020-04-10 01:03:01.808318+00	\N
32	1	1	182	2020-04-10 01:03:01.808318+00	\N
33	1	1	6	2020-04-10 01:03:01.808318+00	\N
34	1	1	10	2020-04-10 01:03:01.808318+00	\N
35	1	1	11	2020-04-10 01:03:01.808318+00	\N
36	1	1	12	2020-04-10 01:03:01.808318+00	\N
37	1	1	31	2020-04-10 01:03:01.808318+00	\N
38	1	1	32	2020-04-10 01:03:01.808318+00	\N
39	1	1	25	2020-04-10 01:03:01.808318+00	\N
40	1	1	21	2020-04-10 01:03:01.808318+00	\N
41	1	1	23	2020-04-10 01:07:23.360009+00	\N
42	1	1	30	2020-04-10 01:07:23.360009+00	\N
43	1	1	29	2020-04-10 01:07:23.360009+00	\N
44	1	1	49	2020-04-10 01:07:23.360009+00	\N
45	1	1	50	2020-04-10 01:07:23.360009+00	\N
46	1	1	51	2020-04-10 01:07:23.360009+00	\N
47	1	1	52	2020-04-10 01:07:23.360009+00	\N
48	1	1	54	2020-04-10 01:07:23.360009+00	\N
49	1	1	33	2020-04-10 01:07:23.360009+00	\N
50	1	1	34	2020-04-10 01:07:23.360009+00	\N
51	1	1	36	2020-04-10 01:07:23.360009+00	\N
52	1	1	37	2020-04-10 01:07:23.360009+00	\N
53	1	1	39	2020-04-10 01:07:23.360009+00	\N
54	1	1	14	2020-04-10 01:07:23.360009+00	\N
55	1	1	15	2020-04-10 01:07:23.360009+00	\N
56	1	1	16	2020-04-10 01:07:23.360009+00	\N
57	1	1	17	2020-04-10 01:07:23.360009+00	\N
58	1	1	22	2020-04-10 01:07:23.360009+00	\N
59	1	1	18	2020-04-10 01:07:23.360009+00	\N
60	1	1	24	2020-04-10 01:07:23.360009+00	\N
61	1	1	19	2020-04-10 01:07:23.360009+00	\N
62	1	1	20	2020-04-10 01:07:23.360009+00	\N
63	1	1	194	2020-04-10 01:07:23.360009+00	\N
64	1	1	196	2020-04-10 01:07:23.360009+00	\N
65	1	1	200	2020-04-10 01:07:23.360009+00	\N
66	1	1	202	2020-04-10 01:07:23.360009+00	\N
67	1	1	204	2020-04-10 01:07:23.360009+00	\N
68	1	1	206	2020-04-10 01:07:23.360009+00	\N
69	1	1	208	2020-04-10 01:07:23.360009+00	\N
70	1	1	210	2020-04-10 01:07:23.360009+00	\N
71	1	1	72	2020-04-10 01:07:23.360009+00	\N
72	1	1	73	2020-04-10 01:07:23.360009+00	\N
73	1	1	214	2020-04-10 01:07:23.360009+00	\N
74	1	1	2	2020-04-10 01:07:23.360009+00	\N
75	1	1	3	2020-04-10 01:07:23.360009+00	\N
76	1	1	13	2020-04-10 01:07:23.360009+00	\N
77	1	1	74	2020-04-10 01:07:23.360009+00	\N
78	1	1	55	2020-04-10 01:07:23.360009+00	\N
79	1	1	56	2020-04-10 01:07:23.360009+00	\N
80	1	1	45	2020-04-10 01:07:23.360009+00	\N
81	1	1	46	2020-04-10 01:07:23.360009+00	\N
82	1	1	47	2020-04-10 01:07:23.360009+00	\N
83	1	1	48	2020-04-10 01:07:23.360009+00	\N
84	1	1	38	2020-04-10 01:07:23.360009+00	\N
85	1	1	26	2020-04-10 01:07:23.360009+00	\N
86	1	1	40	2020-04-10 01:07:23.360009+00	\N
87	1	1	41	2020-04-10 01:07:23.360009+00	\N
88	1	1	44	2020-04-10 01:07:23.360009+00	\N
89	1	1	53	2020-04-10 01:07:23.360009+00	\N
90	1	1	27	2020-04-10 01:07:23.360009+00	\N
91	1	1	28	2020-04-10 01:07:23.360009+00	\N
92	1	1	57	2020-04-10 01:07:23.360009+00	\N
93	1	1	58	2020-04-10 01:07:23.360009+00	\N
94	1	1	59	2020-04-10 01:07:23.360009+00	\N
95	1	1	60	2020-04-10 01:07:23.360009+00	\N
96	1	1	61	2020-04-10 01:07:23.360009+00	\N
97	1	1	35	2020-04-10 01:07:23.360009+00	\N
98	1	1	62	2020-04-10 01:07:23.360009+00	\N
99	1	1	63	2020-04-10 01:07:23.360009+00	\N
100	1	1	66	2020-04-10 01:07:23.360009+00	\N
101	1	1	68	2020-04-10 01:07:23.360009+00	\N
102	1	1	69	2020-04-10 01:07:23.360009+00	\N
103	1	1	70	2020-04-10 01:07:23.360009+00	\N
104	1	1	71	2020-04-10 01:07:23.360009+00	\N
105	1	1	105	2020-04-10 01:07:23.360009+00	\N
106	1	1	107	2020-04-10 01:07:23.360009+00	\N
107	1	1	42	2020-04-10 01:07:23.360009+00	\N
108	1	1	43	2020-04-10 01:07:23.360009+00	\N
109	1	1	109	2020-04-10 01:07:23.360009+00	\N
110	1	1	219	2020-04-10 01:07:23.360009+00	\N
111	1	1	115	2020-04-10 01:07:23.360009+00	\N
112	1	1	117	2020-04-10 01:07:23.360009+00	\N
113	1	1	121	2020-04-10 01:07:23.360009+00	\N
114	1	1	215	2020-04-10 01:07:23.360009+00	\N
115	1	1	125	2020-04-10 01:07:23.360009+00	\N
116	1	1	129	2020-04-10 01:07:23.360009+00	\N
117	1	1	133	2020-04-10 01:07:23.360009+00	\N
118	1	1	135	2020-04-10 01:07:23.360009+00	\N
119	1	1	139	2020-04-10 01:07:23.360009+00	\N
120	1	1	141	2020-04-10 01:07:23.360009+00	\N
121	1	1	145	2020-04-10 01:07:23.360009+00	\N
122	1	1	153	2020-04-10 01:07:23.360009+00	\N
123	1	1	155	2020-04-10 01:07:23.360009+00	\N
124	1	1	159	2020-04-10 01:07:23.360009+00	\N
125	1	1	165	2020-04-10 01:07:23.360009+00	\N
126	1	1	167	2020-04-10 01:07:23.360009+00	\N
127	1	1	169	2020-04-10 01:07:23.360009+00	\N
128	1	1	173	2020-04-10 01:07:23.360009+00	\N
129	1	1	177	2020-04-10 01:07:23.360009+00	\N
130	1	1	179	2020-04-10 01:07:23.360009+00	\N
131	1	1	213	2020-04-10 01:07:23.360009+00	\N
132	1	1	181	2020-04-10 01:07:23.360009+00	\N
133	1	1	229	2020-04-10 01:07:23.360009+00	\N
134	1	1	187	2020-04-10 01:07:23.360009+00	\N
135	1	1	193	2020-04-10 01:07:23.360009+00	\N
136	1	1	199	2020-04-10 01:07:23.360009+00	\N
137	1	1	201	2020-04-10 01:07:23.360009+00	\N
138	1	1	203	2020-04-10 01:07:23.360009+00	\N
139	1	1	205	2020-04-10 01:07:23.360009+00	\N
140	1	1	207	2020-04-10 01:07:23.360009+00	\N
141	1	1	209	2020-04-10 01:07:23.360009+00	\N
142	1	1	235	2020-04-10 01:07:23.360009+00	\N
143	1	1	237	2020-04-10 01:07:23.360009+00	\N
144	1	1	233	2020-04-10 01:07:23.360009+00	\N
145	1	1	241	2020-04-10 01:07:23.360009+00	\N
146	1	1	243	2020-04-10 01:07:23.360009+00	\N
147	8	3	4	2020-04-10 05:48:08.457834+00	Buen rollito
148	145	1	178	2020-04-13 15:09:08.444901+00	43gfd
149	145	13	178	2020-04-13 15:09:25.547873+00	34fsdf
150	145	133	178	2020-04-13 15:10:16.233153+00	ddddd
151	13	12	232	2020-04-13 19:25:18.228515+00	Com
152	13	122	232	2020-04-13 19:26:08.842171+00	Com2
153	131	122	232	2020-04-13 19:26:25.829184+00	Com3
154	149000	59000	244	2020-04-14 01:25:56.228098+00	No se terminaron los trabajos, y el resto de billete?
155	400000	59000	245	2020-04-14 01:27:42.108807+00	Y la lana?
156	400000	59000.5	245	2020-04-14 01:30:19.949169+00	y la lana? segunda
157	400000.989999999991	59000.5	245	2020-04-14 01:32:16.888533+00	? tercera llamada
158	149000.799999999988	59000	244	2020-04-14 01:33:50.593074+00	onta el billullo?
159	1800500.01000000001	1600000.01000000001	241	2020-04-14 03:01:24.339349+00	No se concluyeron los trabajos en el periodo de...
160	1880500.01000000001	1660000.97999999998	246	2020-04-14 15:08:05.319521+00	nada...
161	1800500.01000000001	1600000.01000000001	246	2020-04-14 15:13:55.908906+00	No se concluyeron los trabajos en el periodo de...
162	1880500.01000000001	1660000.97999999998	247	2020-04-14 15:21:27.591377+00	nada...
163	12	133	178	2020-04-14 17:44:12.129477+00	Comentario 5
164	12	11	178	2020-04-14 17:44:51.656924+00	Solventado 11
165	1880500.01000000001	1660000.97999999998	248	2020-04-14 21:10:29.827185+00	nada...
166	1880500.01000000001	1660000.98399999994	247	2020-04-14 22:12:52.441867+00	test
167	1880500.01000000001	1660000.97999999998	249	2020-04-15 14:54:55.337625+00	nada...
168	1880500.01000000001	1660000.97999999998	251	2020-04-15 14:59:40.2589+00	nada...
169	1800500.01000000001	1600000.01000000001	251	2020-04-15 15:06:19.411005+00	No se concluyeron los trabajos en el periodo de...
170	31880500.0100000016	1660000.97999999998	249	2020-04-15 19:40:17.219136+00	tttest
171	1880500.01000000001	1660000.97999999998	252	2020-04-15 23:02:00.121722+00	nada...
172	1880500.0120000001	1660000.97999999998	252	2020-04-16 23:16:34.388835+00	test
173	1880500.01239999989	1660000.97999999998	252	2020-04-16 23:19:11.821007+00	Test 2
174	2	3	256	2020-04-16 23:39:51.224509+00	test
175	2	3	257	2020-04-16 23:41:10.126091+00	test
176	2	3	258	2020-04-16 23:52:34.031425+00	TEST
177	2	3	259	2020-04-16 23:59:54.452311+00	test
178	2	3	261	2020-04-17 00:05:41.060121+00	test
179	12	1134	178	2020-04-17 02:33:04.585411+00	Cambio solventad
180	1232	1134	178	2020-04-17 02:33:33.389343+00	Cambio proyec.
181	1234	1134	178	2020-04-17 02:35:18.259719+00	Cambio P
182	2	3	263	2020-04-17 20:36:33.921742+00	test
183	2	3	264	2020-04-17 20:50:16.095002+00	test
184	0	0	269	2020-04-17 23:06:45.419209+00	NA
185	2222	3333	270	2020-04-17 23:50:55.564986+00	COMENTARIOS\nMULTI\nLINEA\nYEAH!
186	0	0	272	2020-04-18 22:03:15.402698+00	Pruebas
187	1880500.01000000001	1660000.97999999998	273	2020-04-20 21:05:23.074568+00	nada...
188	1800500.02000000002	1600000.01000000001	273	2020-04-20 21:06:03.519345+00	No se concluyeron los trabajos en el periodo de...
\.


--
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apps (id, descripcion, nombre_app) FROM stdin;
1	Proceso para generar observaciones	PROC_OBSERVACIONES
2	Catalogo de usuarios	CAT_USUARIOS
3	Catalogo de dependencias	CAT_DEPENDENCIAS
4	Catalogo de órganos fiscalizadores	CAT_FISCAL
\.


--
-- Data for Name: audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audits (id, title, dependency_id, year, inception_time, blocked, touch_latter_time) FROM stdin;
8	Del lunes	2	2021	2020-04-14 15:28:51.478063+00	f	2020-04-14 15:35:09.422808+00
2	ZZZZZZZ	27	2012	2020-04-13 22:37:25.413434+00	f	2020-04-13 22:37:25.413434+00
3	ZZZZZZZ	27	2012	2020-04-13 22:38:43.355493+00	f	2020-04-13 22:38:43.355493+00
4	ZZZZZZZ	27	2012	2020-04-13 22:45:04.238502+00	f	2020-04-13 22:45:04.238502+00
12	teeesto	1	2020	2020-04-14 20:29:04.965178+00	f	2020-04-14 20:39:16.105935+00
11	Del futuroooo	27	2029	2020-04-14 19:11:35.061379+00	f	2020-04-14 19:12:07.011897+00
13	test	7	2020	2020-04-14 20:42:32.392048+00	f	2020-04-14 20:42:32.392048+00
15	tesst5	32	2020	2020-04-14 21:05:30.920056+00	f	2020-04-14 21:05:39.322157+00
6	Del futuroooo	27	2029	2020-04-13 23:05:27.324657+00	f	2020-04-14 19:12:02.599235+00
16	OP	43	2020	2020-04-15 20:11:26.391472+00	f	2020-04-15 20:11:26.391472+00
5	Del futuro	27	2028	2020-04-13 22:48:31.620138+00	f	2020-04-13 22:49:53.311488+00
7	Del lunes	2	2020	2020-04-14 03:03:07.728739+00	f	2020-04-14 03:04:25.45116+00
9	string	0	0	2020-04-14 17:48:46.312145+00	f	2020-04-14 17:48:46.312145+00
10	XXXXX	27	2020	2020-04-14 19:11:25.927623+00	f	2020-04-14 19:11:25.927623+00
14	test2	5	2020	2020-04-14 20:42:56.001124+00	f	2020-04-14 20:43:03.096663+00
1	CTG-OP-15-023	27	2012	2020-04-13 22:38:25.413434+00	f	2020-04-13 22:38:25.413434+00
17	CTG-OP-18-072	27	2017	2020-04-17 22:50:43.940122+00	f	2020-04-17 22:50:43.940122+00
\.


--
-- Data for Name: authorities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.authorities (id, title, app_id, description) FROM stdin;
2	CREATION_OBS	1	Alta de observaciones
3	EDIT_OBS	1	Edicion de observaciones
4	LIST_OBS	1	Listar observaciones
1	BLOCK_OBS	1	Eliminar observacion
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
-- Data for Name: observation_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observation_codes (id, title) FROM stdin;
1	A-FALTA ADMINISTRATIVA
3	D-PAGOS INDEBIDOS/EN EXCESO/IMPROCEDENTES
4	E-CALIDAD
2	B-DOCUMENTOS
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

COPY public.observations (id, observation_type_id, social_program_id, blocked, audit_id, title, fiscal_id, touch_latter_time, amount_observed, observation_code_id, observation_bis_code_id, inception_time, expiration_date, reception_date, doc_a_date, doc_b_date, doc_c_date, doc_a, doc_b, doc_c, dep_response, dep_resp_comments, division_id, hdr_doc, hdr_reception_date, hdr_expiration1_date, hdr_expiration2_date) FROM stdin;
202	1	1	f	1	1	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
210	1	1	f	1	44	2	2020-04-16 02:42:56.773754+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
200	1	2	f	1	sddssdsd	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
204	1	1	f	1	445554	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
206	1	2	f	1	444334	3	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
208	1	1	f	1	test 1	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
229	1	2	f	1	eedede	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
232	1	1	t	1	TEXX	1	2020-04-13 19:26:25.829184+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
245	4	2	t	5	Una mas, la segunda	3	2020-04-14 01:32:16.888533+00	480000	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
244	2	3	t	1	Una a ver si se borra	2	2020-04-14 01:33:50.593074+00	150000	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
203	1	1	f	1	223	3	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
205	2	1	f	1	343434	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
263	1	1	f	1	test23	1	2020-04-17 20:48:16.544974+00	1	1	1	2020-04-17 20:36:33.921742+00	2020-12-06	2020-12-05	2020-12-04	2020-12-07	2020-12-08	xxx	test	test	test	test	1	test	2020-12-02	2020-12-03	2020-12-01
242	1	1	f	1	tttttc	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
224	1	1	f	1	Test notification¡	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
228	2	2	f	1	TEX	1	2020-04-14 01:33:50.593074+00	0	2	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
236	1	1	t	1	tttttt	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
216	1	1	t	1	343434ffdfdf	1	2020-04-14 01:33:50.593074+00	0	2	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
214	1	1	f	1	TE	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
53	2	2	t	1	Busqueda binaria	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
248	4	1	t	1	Nuevo este domingo3	4	2020-04-14 21:10:29.827185+00	1755021.12999999989	1	1	2020-04-14 21:10:29.827185+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
45	2	3	f	1	Jaime el nino tiene sed y no hay naranjas	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
247	4	1	f	1	Nuevo esta semana	4	2020-04-15 15:35:19.963865+00	1755021.12999999989	1	1	2020-04-14 15:21:27.591377+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
272	1	4	f	17	Pruebas de observaciones preliminares para el registrio	2	2020-04-18 22:03:15.402698+00	0	3	3	2020-04-18 22:03:15.402698+00	2020-04-30	2020-04-18	2020-04-07	2020-04-18	2020-04-18	8877665544					1	1234567890	2020-04-07	2020-04-30	2020-04-04
46	1	3	f	1	Pero el gran sabor de tang le va a encantar	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
47	1	3	f	1	La vida es una tombola, ton ton tombola	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
48	1	3	f	1	Tigres versus rayados	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
38	2	1	t	1	chespirito se ha pelado con villagran	1	2020-04-14 01:33:50.593074+00	0	4	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
199	1	1	f	1	tttdsds	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
37	2	3	f	1	vivir en gdl es caro	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
39	2	1	f	1	que buen clima	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
14	1	1	t	1	12345678	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
194	1	1	f	1	kjjkhj	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
63	4	3	f	1	Que pedo con el corona virus	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
26	1	1	t	1	La caravina de ambrosio rules	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
40	2	3	f	1	carnes selectas san juan marinadas	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
56	3	3	t	1	Los tazos aun tiene seguidores	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
150	3	1	f	1	h.	3	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
31	1	1	f	1	www.youtube.com	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
32	1	1	f	1	que kilombo	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
25	1	1	t	1	Alan parson project	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
21	1	1	t	1	Blue monday	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
23	1	1	t	1	Esto va evolucionando	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
30	1	1	t	1	Esto necesita atencion	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
29	1	1	t	1	Rafa ya no esta aqui, pero Omar cubre su rol	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
261	1	1	f	1	teeexstx	1	2020-04-17 00:55:25.017708+00	1	1	1	2020-04-17 00:05:41.060121+00	2020-12-31	2020-12-29	2020-11-30	2020-12-31	2020-12-31	xxx					1		2020-04-11	2020-04-12	2020-04-13
213	1	1	f	1	333333	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
234	1	2	t	1	te	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
219	1	1	t	1	Test notification¡222	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
215	1	2	t	1	T2	1	2020-04-14 01:33:50.593074+00	0	3	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
246	4	1	t	1	bla bla zo....bla	4	2020-04-14 15:13:55.908906+00	1750021	1	1	2020-04-14 15:08:05.319521+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
196	2	2	f	1	ttt	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
252	4	1	f	5	Nuevo este miercoles 23	4	2020-04-16 23:19:11.821007+00	17550282.3200000003	3	4	2020-04-15 23:02:00.121722+00	2020-05-12	2020-04-29	2020-04-30	2020-04-19	2020-04-18	TextoA AC	TextoB B c	TextoC X xx	Respuesta Dependencia 2 3	Comentario C d	1		2020-04-11	2020-04-12	2020-04-13
259	1	1	f	1	teeexst	1	2020-04-16 23:59:54.452311+00	1	1	2	2020-04-16 23:59:54.452311+00	2020-12-29	2020-12-30	2020-12-31	2020-12-23	2020-12-30	xxx					1		2020-04-11	2020-04-12	2020-04-13
207	1	1	f	1	33333	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
209	1	1	f	1	53	3	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
235	1	1	t	1	RRFFDF	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
237	1	1	t	1	TTTC	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
201	1	1	f	1	3333	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
241	4	1	f	1	bla bla zo....241	4	2020-04-14 03:01:24.339349+00	1750021	1	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
218	1	1	t	1	12	1	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
243	1	1	t	1	assa	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
233	1	1	t	1	TED	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
54	2	2	t	1	Pero pepsi junta mitades	1	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
36	3	3	f	1	extrano las carne de monterrey	1	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
28	1	1	t	1	Las nenas con zapatos de tacon se ven mejor	1	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
58	1	3	f	1	A como extrano ir a los tacos	1	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
141	3	1	f	1	e.	3	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
145	3	1	f	1	f.	3	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
153	3	1	f	1	i.	3	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
155	1	1	f	1	..j	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
159	1	1	f	1	..kl	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
165	1	1	f	1	..o	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
167	1	1	f	1	..q	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
169	1	1	f	1	..s	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
173	1	1	f	1	..sf	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
177	1	1	f	1	..u	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
179	1	1	f	1	..w	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
181	4	1	f	1	..y	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
51	2	3	f	1	Y ya nada mas me quedan nueva	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
52	2	2	f	1	Coca es mejor que pepsi	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
33	1	1	t	1	el hector ceron ama javascript	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
34	2	2	f	1	el frances es hacker	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
59	2	2	f	1	Los hackatones estan chidos pero son extremadamente cansados	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
60	1	3	f	1	Esta descripciontiene que editarce	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
50	3	1	f	1	Uno se callo en la nieve	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
158	1	1	f	1	..k	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
256	1	1	f	1	tests	2	2020-04-16 23:39:51.224509+00	1	1	1	2020-04-16 23:39:51.224509+00	2020-12-31	2020-12-31	2000-12-30	2020-12-31	2020-12-21	xxx	xxxx	yyy	xxxxx	xxxxxx	1		2020-04-11	2020-04-12	2020-04-13
19	1	1	t	1	eryfgfdadf	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
20	1	1	t	1	rterdfsdffasd	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
41	2	3	f	1	Tortugas ninja quieren pizza	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
44	2	3	f	1	Pongale aguacate cabron	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
27	1	1	t	1	quick sort	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
188	4	3	f	1	DEFICIENCIAS EN LA EJECUCIÓN Y CONCLUSIÓN DE LOS TRABAJOS	3	2020-04-14 01:33:50.593074+00	0	4	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
126	1	1	f	1	b.	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
187	1	1	f	1	Aqui va la descripcion de la observacion	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
193	1	1	f	1	tttesdd	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
269	4	4	f	17	Deficiencias en la ejecución y conclusión de los trabajos.	1	2020-04-17 23:06:45.419209+00	0	4	4	2020-04-17 23:06:45.419209+00	2018-10-15	2018-10-01	2018-09-24	2018-10-15	2018-10-15	CTG-DCAOP-0448/2018	1.0-0935/2018	NO APLICA	El Municipio informa que adjunta la siguiente documentación:   “Se anexa material fotográfico de obra observada.”	En su respuesta el Municipio presenta un registro fotográfico donde se muestran las reparaciones realizadas a la obra.  Al respecto, se realizó verificación correspondiente, comprobando que algunas de las deficiencias señaladas fueron corregidas, sin embargo, no se atendió el total de las fallas señaladas en la Cédula de Inspección de Campo, lo cual se hizo constar en Registro Auxiliar de Observaciones de fecha 22 de octubre de 2018. Por consiguiente, la observación se determina NO SOLVENTADA.	3	CTG-OP-18-072	2020-03-26	2020-04-28	2020-03-26
257	1	1	f	1	test2	2	2020-04-16 23:41:10.126091+00	1	1	1	2020-04-16 23:41:10.126091+00	2020-12-31	2020-12-31	2000-12-30	2020-12-31	2021-12-31	xxx	xxxx	yyy	xxx	xxx	1		2020-04-11	2020-04-12	2020-04-13
178	1	1	f	1	..v	4	2020-04-17 02:35:18.259719+00	333	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14	f32434					1		2020-04-11	2020-04-12	2020-04-13
122	3	1	t	1	Amazing!mmm	2	2020-04-14 01:33:50.593074+00	0	3	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
6	4	1	t	1	heman	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
160	1	1	f	1	..l	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
162	1	1	f	1	..n	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
49	2	2	f	1	Yo tenia 3 perritos	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
70	1	1	f	1	d	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
71	1	1	f	1	t	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
105	3	1	f	1	esto es un bla blazo	3	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
107	1	1	f	1		1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
42	2	3	t	1	Tomando una pepsi kick	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
43	2	3	t	1	De nino siempre quice unos nunchakos	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
109	1	1	f	1	asdf	2	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
115	1	1	f	1	Title!	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
72	2	2	t	1	y	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
73	2	2	f	1	u	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
166	1	1	f	1	..p	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
168	1	1	f	1	..r	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
176	1	1	f	1	..t	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
182	1	1	f	1	..z	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
10	1	1	t	1	skeletor	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
11	1	1	t	1	este dato debe ser actualizado	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
12	3	1	t	1	sting and shaggy	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
120	3	1	f	1	Updated title	1	2020-04-14 01:33:50.593074+00	0	2	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
124	3	1	f	1	Amazing!	2	2020-04-14 01:33:50.593074+00	0	2	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
5	1	1	t	1	freebsd2	1	2020-04-14 01:33:50.593074+00	0	2	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
134	1	1	t	1	test x!	2	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
148	3	1	f	1	g.	3	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
55	2	3	t	1	Los pepcilintros son de os 90s	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
57	2	1	f	1	bronco es el gigante de america ?	1	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
4	1	1	f	1	Hola mundo observado	1	2020-04-15 02:31:24.131544+00	20	1	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
117	1	1	f	1	asdfdd	2	2020-04-14 01:33:50.593074+00	0	3	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
35	2	2	t	1	El titanic no fue el unico barco gigante	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
62	3	2	f	1	es dificil no cargarla con las prisas	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
68	1	1	f	1	a	1	2020-04-14 01:33:50.593074+00	0	2	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
106	3	1	f	1	otro title	3	2020-04-14 01:33:50.593074+00	0	3	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
108	1	1	f	1	test	1	2020-04-14 01:33:50.593074+00	0	4	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
114	2	2	f	1	TEST EEEH!	4	2020-04-14 01:33:50.593074+00	0	1	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
116	3	1	f	1	asdasddddd	3	2020-04-14 01:33:50.593074+00	0	2	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
180	1	1	f	1	..x	2	2020-04-14 01:33:50.593074+00	0	3	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
186	4	2	f	1	test! !!!	3	2020-04-14 01:33:50.593074+00	0	4	1	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
61	4	3	f	1	Las alfombras siempre estaran de moda	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
15	1	1	t	1	ewfvdsfzz	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
16	1	1	t	1	lorem ipsum	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
17	1	1	t	1	wesdvdv	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
22	1	1	t	1	ewerwerwer	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
18	1	1	t	1	werwerwer	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
24	1	1	t	1	sdfsdfg	1	2020-04-14 01:33:50.593074+00	0	3	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
2	4	1	t	1	o	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
3	3	1	t	1	p	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
13	1	1	t	1	sdfshhfghsfheargssrth	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
74	2	3	t	1	i	1	2020-04-14 01:33:50.593074+00	0	1	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
66	1	1	f	1	restauran menu menu	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
69	2	3	f	1	b	1	2020-04-14 01:33:50.593074+00	0	2	4	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
121	1	1	f	1	zzz	1	2020-04-14 01:33:50.593074+00	0	3	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
125	3	1	f	1	Amazing!2	2	2020-04-14 01:33:50.593074+00	0	3	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
129	2	2	f	1	test test c	4	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
133	3	2	f	1	Test NEW! 2	1	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
139	1	1	f	1	d.	2	2020-04-14 01:33:50.593074+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
251	4	1	t	1	ddddkkkffff	4	2020-04-15 15:06:19.411005+00	1750021	1	1	2020-04-15 14:59:40.2589+00	2020-04-12	2020-04-13	2020-04-11	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
135	1	1	f	1	c.	2	2020-04-15 18:08:04.64897+00	0	4	3	2020-04-13 15:10:16.233153+00	2020-04-13	2020-04-13	2020-04-13	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
249	4	1	f	15	Nuevo hoy	4	2020-04-15 20:10:57.931132+00	1755021.12999999989	1	2	2020-04-15 14:54:55.337625+00	2020-04-13	2020-04-29	2020-04-27	2020-04-14	2020-04-14						1		2020-04-11	2020-04-12	2020-04-13
258	1	1	f	1	TEEEEST	1	2020-04-16 23:52:34.031425+00	1	1	1	2020-04-16 23:52:34.031425+00	2024-12-31	2023-12-31	2021-12-31	2027-12-31	2037-12-25	XXX					1		2020-04-11	2020-04-12	2020-04-13
273	4	1	t	1	cambia el title	4	2020-04-20 21:06:03.519345+00	1750021	1	1	2020-04-20 21:05:23.074568+00	2020-04-12	2020-04-13	2020-04-11	2020-04-12	2020-04-11	TextoA	TextoB	TextoC	TextoResp	TextoDepRespComments	2	header doc22	2020-04-11	2020-04-12	2020-04-13
270	1	1	t	17	Test2	1	2020-04-18 01:11:23.767276+00	1111	1	1	2020-04-17 23:50:55.564986+00	2020-12-11	2020-12-09	2020-12-07	2020-04-18	2020-12-15	OF2	O3	O4	RES\nMULTI\nLINEA	COM\nMULTI\nLINEA	1	O1	2020-12-05	2020-12-06	2020-12-02
264	3	1	t	17	testxxx	1	2020-04-20 18:59:08.419964+00	1	1	1	2020-04-17 20:50:16.095002+00	2020-12-09	2020-12-08	2020-12-07	2020-12-10	2020-12-25	xxx	AAA	DDD	BBB	CCC	1	10052020	2020-02-07	2020-02-21	2020-02-06
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
-- Data for Name: social_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_programs (id, title) FROM stdin;
1	Liconsa
2	Solidaridad
3	Gobierno que paga a tiempo
4	FORTALECE
5	RAMOS 15
\.


--
-- Data for Name: user_authority; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_authority (id, user_id, authority_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	2	1
6	2	2
7	2	3
8	2	4
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, passwd, orgchart_role_id, division_id, disabled, touch_latter_time, inception_time, blocked) FROM stdin;
1	garaujo	123qwe	5	1	f	\N	\N	f
2	contralor	123qwe	1	1	f	\N	\N	f
4	fulanito	pass1234	1	2	f	2020-04-21 05:58:43.674024+00	2020-04-21 05:58:43.674024+00	f
3	petra1222	pass1234	1	2	f	2020-04-21 06:03:33.670118+00	2020-04-21 06:03:33.670118+00	f
5	petr02	pass1234	1	2	f	2020-04-21 06:05:50.69679+00	2020-04-21 06:05:50.69679+00	f
6	petr0299	pass1234	1	2	f	2020-04-21 06:06:46.696562+00	2020-04-21 06:06:46.696562+00	f
7	petro301	pass1234	1	2	f	2020-04-21 16:38:46.955063+00	2020-04-21 16:26:03.177732+00	t
8	petro300	pass1234	1	2	f	2020-04-21 16:41:32.179849+00	2020-04-21 16:41:32.179849+00	t
\.


--
-- Name: amounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.amounts_id_seq', 188, true);


--
-- Name: audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audits_id_seq', 17, true);


--
-- Name: gral_user_authority_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gral_user_authority_id_seq', 1, false);


--
-- Name: observation_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.observation_codes_id_seq', 4, true);


--
-- Name: observations_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.observations_seq', 273, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 10, true);


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
-- Name: authorities authorities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorities
    ADD CONSTRAINT authorities_pkey PRIMARY KEY (id);


--
-- Name: authorities authorities_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorities
    ADD CONSTRAINT authorities_title_key UNIQUE (title);


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
-- Name: observation_codes observation_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_codes
    ADD CONSTRAINT observation_code_pkey PRIMARY KEY (id);


--
-- Name: observation_codes observation_code_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_codes
    ADD CONSTRAINT observation_code_unique_title UNIQUE (title);


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
-- Name: user_authority user_authority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_authority
    ADD CONSTRAINT user_authority_pkey PRIMARY KEY (id);


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
-- Name: fki_fk_; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fki_fk_ ON public.user_authority USING btree (user_id);


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
-- Name: authorities authorities_app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorities
    ADD CONSTRAINT authorities_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(id);


--
-- Name: observations observations_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_divisions_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) NOT VALID;


--
-- Name: observations observations_observation_codes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_observation_codes_fkey FOREIGN KEY (observation_code_id) REFERENCES public.observation_codes(id);


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
-- Name: geo_states state_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_states
    ADD CONSTRAINT state_country_fkey FOREIGN KEY (country_id) REFERENCES public.geo_countries(id);


--
-- Name: user_authority user_authority_authority_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_authority
    ADD CONSTRAINT user_authority_authority_id_fkey FOREIGN KEY (authority_id) REFERENCES public.authorities(id);


--
-- Name: user_authority user_authority_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_authority
    ADD CONSTRAINT user_authority_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


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
