--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.17
-- Dumped by pg_dump version 12.3 (Ubuntu 12.3-1.pgdg18.04+1)

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
-- Name: pras_ires_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pras_ires_asf (
    pras_observacion_id integer NOT NULL,
    num_oficio_of_vista_cytg character varying NOT NULL,
    fecha_oficio_of_vista_cytg date NOT NULL,
    num_oficio_cytg_aut_invest character varying NOT NULL,
    fecha_oficio_cytg_aut_invest date NOT NULL,
    num_carpeta_investigacion character varying NOT NULL,
    num_oficio_cytg_org_fiscalizador character varying NOT NULL,
    fecha_oficio_cytg_org_fiscalizador date NOT NULL,
    num_oficio_vai_municipio character varying NOT NULL,
    fecha_oficio_vai_municipio date NOT NULL,
    autoridad_invest_id integer NOT NULL,
    num_oficio_pras_of character varying NOT NULL,
    fecha_oficio_pras_of date NOT NULL,
    num_oficio_pras_cytg_dependencia character varying NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp_dependencia date NOT NULL
);


ALTER TABLE public.pras_ires_asf OWNER TO postgres;

--
-- Name: TABLE pras_ires_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.pras_ires_asf IS 'Campos habilitados cuando columna observaciones_ires_asf.accion = PRAS';


--
-- Name: seguimientos_obs_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimientos_obs_asf (
    observacion_id integer NOT NULL,
    seguimiento_id integer DEFAULT 0 NOT NULL,
    medio_notif_seguimiento_id integer NOT NULL,
    num_oficio_cytg_oic character varying NOT NULL,
    fecha_oficio_cytg_oic date NOT NULL,
    fecha_recibido_dependencia date NOT NULL,
    fecha_vencimiento_cytg date NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_recibido_oficio_resp date NOT NULL,
    resp_dependencia text NOT NULL,
    comentarios text NOT NULL,
    clasif_final_interna_cytg integer NOT NULL,
    num_oficio_org_fiscalizador character varying NOT NULL,
    fecha_oficio_org_fiscalizador date NOT NULL,
    estatus_id integer NOT NULL,
    monto_solventado double precision DEFAULT 0 NOT NULL,
    num_oficio_monto_solventado character varying NOT NULL,
    fecha_oficio_monto_solventado date NOT NULL,
    monto_pendiente_solventar double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.seguimientos_obs_asf OWNER TO postgres;

--
-- Name: TABLE seguimientos_obs_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.seguimientos_obs_asf IS 'Seguimientos para una observacion de ASF';




--
-- Name: seguimientos_obs_sfp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimientos_obs_sfp (
    observacion_id integer NOT NULL,
    seguimiento_id integer DEFAULT 0 NOT NULL,
    num_oficio_cytg_oic character varying NOT NULL,
    fecha_oficio_cytg_oic date NOT NULL,
    fecha_recibido_dependencia date NOT NULL,
    fecha_vencimiento_cytg date NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_recibido_oficio_resp date NOT NULL,
    resp_dependencia text NOT NULL,
    comentarios text NOT NULL,
    clasif_final_interna_cytg integer NOT NULL,
    num_oficio_org_fiscalizador character varying NOT NULL,
    fecha_oficio_org_fiscalizador date NOT NULL,
    estatus_id integer NOT NULL,
    monto_solventado double precision DEFAULT 0 NOT NULL,
    monto_pendiente_solventar double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.seguimientos_obs_sfp OWNER TO postgres;




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
-- Name: auditoria_anios_cuenta_pub; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_anios_cuenta_pub (
    auditoria_id integer NOT NULL,
    anio_cuenta_pub integer DEFAULT 2012 NOT NULL
);


ALTER TABLE public.auditoria_anios_cuenta_pub OWNER TO postgres;

--
-- Name: TABLE auditoria_anios_cuenta_pub; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.auditoria_anios_cuenta_pub IS 'Anios de cuenta publica para una auditoria';


--
-- Name: auditoria_dependencias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_dependencias (
    auditoria_id integer NOT NULL,
    dependencia_id integer NOT NULL
);


ALTER TABLE public.auditoria_dependencias OWNER TO postgres;

--
-- Name: TABLE auditoria_dependencias; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.auditoria_dependencias IS 'Dependencias para una auditoria';


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
-- Name: autoridades_invest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autoridades_invest (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.autoridades_invest OWNER TO postgres;

--
-- Name: dependencia_clasif; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dependencia_clasif (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.dependencia_clasif OWNER TO postgres;

--
-- Name: TABLE dependencia_clasif; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.dependencia_clasif IS 'Clasificacion de dependencias';


--
-- Name: dependencies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dependencies (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text,
    clasif_id integer NOT NULL
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
-- Name: estatus_ires_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus_ires_asf (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.estatus_ires_asf OWNER TO postgres;

--
-- Name: TABLE estatus_ires_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.estatus_ires_asf IS 'Catalogo de estatus para una obs de informe de resultados de ASF';


--
-- Name: estatus_pre_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus_pre_asf (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.estatus_pre_asf OWNER TO postgres;

--
-- Name: TABLE estatus_pre_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.estatus_pre_asf IS 'Grupo de estatus para una obs preliminar de ASF';


--
-- Name: estatus_sfp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus_sfp (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.estatus_sfp OWNER TO postgres;

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
-- Name: medios_notif_seguimiento_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medios_notif_seguimiento_asf (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.medios_notif_seguimiento_asf OWNER TO postgres;

--
-- Name: TABLE medios_notif_seguimiento_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.medios_notif_seguimiento_asf IS 'Catalogo de medios de notificacion de un seguimiento de obs de ASF';


--
-- Name: observaciones_ires_asf_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_ires_asf_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_ires_asf_seq OWNER TO postgres;

--
-- Name: observaciones_ires_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_ires_asf (
    id integer DEFAULT nextval('public.observaciones_ires_asf_seq'::regclass) NOT NULL,
    observacion_pre_id integer DEFAULT 0 NOT NULL,
    num_oficio_of character varying NOT NULL,
    fecha_recibido date NOT NULL,
    fecha_vencimiento date NOT NULL,
    observacion_ir text NOT NULL,
    tipo_observacion_id integer NOT NULL,
    accion character varying NOT NULL,
    clave_accion character varying NOT NULL,
    monto_observado double precision DEFAULT 0 NOT NULL,
    monto_a_reintegrar double precision DEFAULT 0 NOT NULL,
    monto_reintegrado double precision DEFAULT 0 NOT NULL,
    fecha_reintegro date NOT NULL,
    monto_por_reintegrar double precision DEFAULT 0 NOT NULL,
    tiene_pras boolean DEFAULT false NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL
);


ALTER TABLE public.observaciones_ires_asf OWNER TO postgres;

--
-- Name: TABLE observaciones_ires_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observaciones_ires_asf IS 'Observaciones de informe de resultados de ASF';


--
-- Name: observaciones_pre_asf_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_pre_asf_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_pre_asf_seq OWNER TO postgres;

--
-- Name: observaciones_pre_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_pre_asf (
    id integer DEFAULT nextval('public.observaciones_pre_asf_seq'::regclass) NOT NULL,
    direccion_id integer NOT NULL,
    fecha_captura date NOT NULL,
    programa_social_id integer NOT NULL,
    auditoria_id integer NOT NULL,
    num_oficio_of character varying NOT NULL,
    fecha_recibido date NOT NULL,
    fecha_vencimiento_of date NOT NULL,
    num_observacion integer NOT NULL,
    observacion text NOT NULL,
    monto_observado double precision DEFAULT 0 NOT NULL,
    num_oficio_cytg character varying NOT NULL,
    fecha_oficio_cytg date NOT NULL,
    fecha_recibido_dependencia date NOT NULL,
    fecha_vencimiento date NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp_dependencia date NOT NULL,
    resp_dependencia text NOT NULL,
    comentarios text NOT NULL,
    clasif_final_cytg integer NOT NULL,
    num_oficio_org_fiscalizador character varying NOT NULL,
    fecha_oficio_org_fiscalizador date NOT NULL,
    estatus_criterio_int_id integer NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL
);


ALTER TABLE public.observaciones_pre_asf OWNER TO postgres;

--
-- Name: TABLE observaciones_pre_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observaciones_pre_asf IS 'Observaciones preliminares de ASF';


--
-- Name: observaciones_sfp_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_sfp_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_sfp_seq OWNER TO postgres;

--
-- Name: observaciones_sfp; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_sfp (
    id integer DEFAULT nextval('public.observaciones_sfp_seq'::regclass) NOT NULL,
    direccion_id integer NOT NULL,
    fecha_captura date NOT NULL,
    programa_social_id integer NOT NULL,
    auditoria_id integer NOT NULL,
    acta_cierre character varying NOT NULL,
    fecha_firma_acta_cierre date NOT NULL,
    fecha_compromiso date NOT NULL,
    clave_observacion character varying NOT NULL,
    observacion text NOT NULL,
    acciones_correctivas character varying NOT NULL,
    acciones_preventivas character varying NOT NULL,
    tipo_observacion_id integer NOT NULL,
    monto_observado double precision DEFAULT 0 NOT NULL,
    monto_a_reintegrar double precision DEFAULT 0 NOT NULL,
    monto_reintegrado double precision DEFAULT 0 NOT NULL,
    fecha_reintegro date NOT NULL,
    monto_por_reintegrar double precision DEFAULT 0 NOT NULL,
    num_oficio_of_vista_cytg character varying NOT NULL,
    fecha_oficio_of_vista_cytg date NOT NULL,
    num_oficio_cytg_aut_invest character varying NOT NULL,
    fecha_oficio_cytg_aut_invest date NOT NULL,
    num_carpeta_investigacion character varying NOT NULL,
    num_oficio_vai_municipio character varying NOT NULL,
    fecha_oficio_vai_municipio date NOT NULL,
    autoridad_invest_id integer NOT NULL,
    num_oficio_pras_of character varying NOT NULL,
    fecha_oficio_pras_of date NOT NULL,
    num_oficio_pras_cytg_dependencia character varying NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp_dependencia date NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL
);


ALTER TABLE public.observaciones_sfp OWNER TO postgres;

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
-- Name: observation_stages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observation_stages (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_stages OWNER TO postgres;

--
-- Name: TABLE observation_stages; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observation_stages IS 'Estado transitivo de una entidad observacion';


--
-- Name: observation_stages_conf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observation_stages_conf (
    id integer NOT NULL,
    observation_stage_id integer NOT NULL,
    fiscal_id integer NOT NULL
);


ALTER TABLE public.observation_stages_conf OWNER TO postgres;

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
    hdr_expiration2_date date NOT NULL,
    observation_stage_id integer NOT NULL
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
-- Name: proyecciones_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyecciones_asf (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.proyecciones_asf OWNER TO postgres;

--
-- Name: TABLE proyecciones_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.proyecciones_asf IS 'Grupo de proyecciones para una obs de ASF';


--
-- Name: proyecciones_obs_asf; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyecciones_obs_asf (
    observacion_id integer NOT NULL,
    proyeccion_id integer NOT NULL
);


ALTER TABLE public.proyecciones_obs_asf OWNER TO postgres;

--
-- Name: TABLE proyecciones_obs_asf; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.proyecciones_obs_asf IS 'Proyecciones asociadas a una obs de ASF en particular';


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
    START WITH 21
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
-- Name: auditoria_anios_cuenta_pub auditoria_anios_cuenta_pub_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_anios_cuenta_pub
    ADD CONSTRAINT auditoria_anios_cuenta_pub_pkey PRIMARY KEY (auditoria_id, anio_cuenta_pub);


--
-- Name: auditoria_dependencias auditoria_dependencias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_dependencias
    ADD CONSTRAINT auditoria_dependencias_pkey PRIMARY KEY (auditoria_id, dependencia_id);


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
-- Name: autoridades_invest autoridades_invest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autoridades_invest
    ADD CONSTRAINT autoridades_invest_pkey PRIMARY KEY (id);


--
-- Name: autoridades_invest autoridades_invest_titulo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autoridades_invest
    ADD CONSTRAINT autoridades_invest_titulo_unique UNIQUE (title);


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
-- Name: dependencia_clasif dependencia_clasif_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependencia_clasif
    ADD CONSTRAINT dependencia_clasif_pkey PRIMARY KEY (id);


--
-- Name: dependencia_clasif dependencia_clasif_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependencia_clasif
    ADD CONSTRAINT dependencia_clasif_unique_title UNIQUE (title);


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
-- Name: estatus_ires_asf estatus_ires_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_ires_asf
    ADD CONSTRAINT estatus_ires_asf_pkey PRIMARY KEY (id);


--
-- Name: estatus_ires_asf estatus_ires_asf_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_ires_asf
    ADD CONSTRAINT estatus_ires_asf_title_unique UNIQUE (title);


--
-- Name: estatus_pre_asf estatus_pre_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_pre_asf
    ADD CONSTRAINT estatus_pre_asf_pkey PRIMARY KEY (id);


--
-- Name: estatus_pre_asf estatus_pre_asf_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_pre_asf
    ADD CONSTRAINT estatus_pre_asf_title_unique UNIQUE (title);


--
-- Name: estatus_sfp estatus_sfp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_sfp
    ADD CONSTRAINT estatus_sfp_pkey PRIMARY KEY (id);


--
-- Name: estatus_sfp estatus_sfp_titulo_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_sfp
    ADD CONSTRAINT estatus_sfp_titulo_unique UNIQUE (title);


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
-- Name: medios_notif_seguimiento_asf medios_notif_seguimiento_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medios_notif_seguimiento_asf
    ADD CONSTRAINT medios_notif_seguimiento_asf_pkey PRIMARY KEY (id);


--
-- Name: medios_notif_seguimiento_asf medios_notif_seguimiento_asf_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medios_notif_seguimiento_asf
    ADD CONSTRAINT medios_notif_seguimiento_asf_title_unique UNIQUE (title);


--
-- Name: observaciones_ires_asf observaciones_ires_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_asf
    ADD CONSTRAINT observaciones_ires_asf_pkey PRIMARY KEY (id);


--
-- Name: observaciones_sfp observaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_pkey PRIMARY KEY (id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_pkey PRIMARY KEY (id);


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
-- Name: observation_stages_conf observation_stages_conf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_stages_conf
    ADD CONSTRAINT observation_stages_conf_pkey PRIMARY KEY (id);


--
-- Name: observation_stages observation_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_stages
    ADD CONSTRAINT observation_stages_pkey PRIMARY KEY (id);


--
-- Name: observation_stages observation_stages_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observation_stages
    ADD CONSTRAINT observation_stages_title_unique UNIQUE (title);


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
-- Name: pras_ires_asf pras_ires_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pras_ires_asf
    ADD CONSTRAINT pras_ires_asf_pkey PRIMARY KEY (pras_observacion_id);


--
-- Name: proyecciones_asf proyecciones_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_asf
    ADD CONSTRAINT proyecciones_asf_pkey PRIMARY KEY (id);


--
-- Name: proyecciones_asf proyecciones_asf_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_asf
    ADD CONSTRAINT proyecciones_asf_title_unique UNIQUE (title);


--
-- Name: proyecciones_obs_asf proyecciones_obs_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_obs_asf
    ADD CONSTRAINT proyecciones_obs_asf_pkey PRIMARY KEY (observacion_id, proyeccion_id);


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
-- Name: seguimientos_obs_asf seguimientos_obs_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_asf
    ADD CONSTRAINT seguimientos_obs_asf_pkey PRIMARY KEY (observacion_id, seguimiento_id);


--
-- Name: seguimientos_obs_sfp seguimientos_obs_sfp_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_sfp
    ADD CONSTRAINT seguimientos_obs_sfp_pkey PRIMARY KEY (observacion_id, seguimiento_id);


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
-- Name: auditoria_anios_cuenta_pub auditoria_anios_cuenta_pub_audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_anios_cuenta_pub
    ADD CONSTRAINT auditoria_anios_cuenta_pub_audits_fkey FOREIGN KEY (auditoria_id) REFERENCES public.audits(id);


--
-- Name: auditoria_dependencias auditoria_dependencias_audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_dependencias
    ADD CONSTRAINT auditoria_dependencias_audits_fkey FOREIGN KEY (auditoria_id) REFERENCES public.audits(id);


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
-- Name: dependencies dependencies_dependencia_clasif_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependencies_dependencia_clasif_fkey FOREIGN KEY (clasif_id) REFERENCES public.dependencia_clasif(id);


--
-- Name: observaciones_sfp observaciones_audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_audits_fkey FOREIGN KEY (auditoria_id) REFERENCES public.audits(id);


--
-- Name: observaciones_sfp observaciones_autoridades_invest_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_autoridades_invest_fkey FOREIGN KEY (autoridad_invest_id) REFERENCES public.autoridades_invest(id);


--
-- Name: observaciones_sfp observaciones_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_divisions_fkey FOREIGN KEY (direccion_id) REFERENCES public.divisions(id);


--
-- Name: observaciones_ires_asf observaciones_ires_asf_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_asf
    ADD CONSTRAINT observaciones_ires_asf_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_sfp observaciones_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_audits_fkey FOREIGN KEY (auditoria_id) REFERENCES public.audits(id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_divisions_fkey FOREIGN KEY (direccion_id) REFERENCES public.divisions(id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_estatus_pre_asf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_estatus_pre_asf_fkey FOREIGN KEY (estatus_criterio_int_id) REFERENCES public.estatus_pre_asf(id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_observation_codes_bis_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_observation_codes_bis_fkey FOREIGN KEY (num_observacion) REFERENCES public.observation_codes(id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_observation_codes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_observation_codes_fkey FOREIGN KEY (clasif_final_cytg) REFERENCES public.observation_codes(id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_social_programs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_social_programs_fkey FOREIGN KEY (programa_social_id) REFERENCES public.social_programs(id);


--
-- Name: observaciones_sfp observaciones_social_programs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_social_programs_fkey FOREIGN KEY (programa_social_id) REFERENCES public.social_programs(id);


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
-- Name: observations observations_observation_stages_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_observation_stages_fkey FOREIGN KEY (observation_stage_id) REFERENCES public.observation_stages(id) NOT VALID;


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
-- Name: pras_ires_asf pras_ires_asf_autoridades_invest_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pras_ires_asf
    ADD CONSTRAINT pras_ires_asf_autoridades_invest_fkey FOREIGN KEY (autoridad_invest_id) REFERENCES public.autoridades_invest(id);


--
-- Name: proyecciones_obs_asf proyecciones_obs_asf_observaciones_pre_asf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_obs_asf
    ADD CONSTRAINT proyecciones_obs_asf_observaciones_pre_asf_fkey FOREIGN KEY (observacion_id) REFERENCES public.observaciones_pre_asf(id);


--
-- Name: proyecciones_obs_asf proyecciones_obs_asf_proyecciones_asf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_obs_asf
    ADD CONSTRAINT proyecciones_obs_asf_proyecciones_asf_fkey FOREIGN KEY (proyeccion_id) REFERENCES public.proyecciones_asf(id);


--
-- Name: seguimientos_obs_asf seguimientos_obs_asf_estatus_ires_asf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_asf
    ADD CONSTRAINT seguimientos_obs_asf_estatus_ires_asf_fkey FOREIGN KEY (estatus_id) REFERENCES public.estatus_ires_asf(id);


--
-- Name: seguimientos_obs_asf seguimientos_obs_asf_medios_notif_seguimiento_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_asf
    ADD CONSTRAINT seguimientos_obs_asf_medios_notif_seguimiento_fkey FOREIGN KEY (medio_notif_seguimiento_id) REFERENCES public.medios_notif_seguimiento_asf(id);


--
-- Name: seguimientos_obs_asf seguimientos_obs_asf_observaciones_ires_asf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_asf
    ADD CONSTRAINT seguimientos_obs_asf_observaciones_ires_asf_fkey FOREIGN KEY (observacion_id) REFERENCES public.observaciones_ires_asf(id);


--
-- Name: seguimientos_obs_asf seguimientos_obs_asf_observation_codes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_asf
    ADD CONSTRAINT seguimientos_obs_asf_observation_codes_fkey FOREIGN KEY (clasif_final_interna_cytg) REFERENCES public.observation_codes(id);


--
-- Name: seguimientos_obs_sfp seguimientos_obs_sfp_estatus_sfp_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_sfp
    ADD CONSTRAINT seguimientos_obs_sfp_estatus_sfp_fkey FOREIGN KEY (estatus_id) REFERENCES public.estatus_sfp(id);


--
-- Name: seguimientos_obs_sfp seguimientos_obs_sfp_observaciones_sfp_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_sfp
    ADD CONSTRAINT seguimientos_obs_sfp_observaciones_sfp_fkey FOREIGN KEY (observacion_id) REFERENCES public.observaciones_sfp(id);


--
-- Name: seguimientos_obs_sfp seguimientos_obs_sfp_observation_codes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_sfp
    ADD CONSTRAINT seguimientos_obs_sfp_observation_codes_fkey FOREIGN KEY (clasif_final_interna_cytg) REFERENCES public.observation_codes(id);


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

