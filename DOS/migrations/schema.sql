--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.17
-- Dumped by pg_dump version 12.4 (Ubuntu 12.4-1.pgdg18.04+1)

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
-- Name: seguimientos_obs_cytg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimientos_obs_cytg (
    observacion_id integer NOT NULL,
    seguimiento_id integer DEFAULT 0 NOT NULL,
    num_oficio_ires character varying NOT NULL,
    fecha_notif_ires date NOT NULL,
    fecha_vencimiento_ires date NOT NULL,
    prorroga boolean DEFAULT false NOT NULL,
    num_oficio_solic_prorroga character varying,
    fecha_oficio_solic_prorroga date,
    num_oficio_contest_prorroga character varying,
    fecha_oficio_contest date,
    fecha_vencimiento_ires_nueva date,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp_dependencia date NOT NULL,
    resp_dependencia text NOT NULL,
    comentarios text NOT NULL,
    estatus_seguimiento_id integer NOT NULL,
    monto_solventado double precision DEFAULT 0 NOT NULL,
    monto_pendiente_solventar double precision DEFAULT 0 NOT NULL
);


ALTER TABLE public.seguimientos_obs_cytg OWNER TO postgres;





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
-- Name: acciones_asenl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acciones_asenl (
    id integer NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE public.acciones_asenl OWNER TO postgres;

--
-- Name: acciones_obs_asenl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acciones_obs_asenl (
    observacion_id integer NOT NULL,
    accion_id integer NOT NULL
);


ALTER TABLE public.acciones_obs_asenl OWNER TO postgres;

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
    anio_cuenta_pub integer NOT NULL
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
-- Name: auditoria_tipos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_tipos (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.auditoria_tipos OWNER TO postgres;

--
-- Name: auditoria_tipos_cytg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_tipos_cytg (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.auditoria_tipos_cytg OWNER TO postgres;

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
-- Name: clasifs_internas_cytg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clasifs_internas_cytg (
    org_fiscal_id integer NOT NULL,
    direccion_id integer NOT NULL,
    sorting_val integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.clasifs_internas_cytg OWNER TO postgres;

--
-- Name: TABLE clasifs_internas_cytg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.clasifs_internas_cytg IS 'Clasificaciones internas CyTG por órgano (o ente) fiscalizador y dirección de auditoría';


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
    clasif_id integer NOT NULL,
    central boolean DEFAULT false NOT NULL,
    paraestatal boolean DEFAULT false NOT NULL,
    obra_pub boolean DEFAULT false NOT NULL
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
-- Name: estatus_ires_cytg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus_ires_cytg (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.estatus_ires_cytg OWNER TO postgres;

--
-- Name: estatus_pre_asenl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus_pre_asenl (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.estatus_pre_asenl OWNER TO postgres;

--
-- Name: TABLE estatus_pre_asenl; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.estatus_pre_asenl IS 'Catalogo de estatus para una obs preliminar de ASENL';


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
-- Name: observaciones_ires_asenl_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_ires_asenl_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_ires_asenl_seq OWNER TO postgres;

--
-- Name: observaciones_ires_asenl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_ires_asenl (
    id integer DEFAULT nextval('public.observaciones_ires_asenl_seq'::regclass) NOT NULL,
    observacion_pre_id integer DEFAULT 0 NOT NULL,
    num_oficio_of character varying NOT NULL,
    fecha_publicacion date NOT NULL,
    tipo_observacion_id integer NOT NULL,
    num_observacion character varying NOT NULL,
    observacion_final text NOT NULL,
    observacion_reincidente boolean DEFAULT false NOT NULL,
    anios_reincidencia character varying NOT NULL,
    monto_observado double precision DEFAULT 0 NOT NULL,
    compartida_observacion text,
    compartida_tipo_observacion_id integer,
    compartida_monto double precision,
    comentarios text NOT NULL,
    clasif_final_cytg integer NOT NULL,
    monto_solventado double precision DEFAULT 0 NOT NULL,
    monto_pendiente_solventar double precision DEFAULT 0 NOT NULL,
    monto_a_reintegrar double precision DEFAULT 0 NOT NULL,
    recomendaciones text NOT NULL,
    num_oficio_recomendacion character varying NOT NULL,
    fecha_oficio_recomendacion date NOT NULL,
    fecha_vencimiento_enviar_asenl date NOT NULL,
    num_oficio_dependencia character varying NOT NULL,
    fecha_oficio_dependencia date NOT NULL,
    fecha_vencimiento_interna_cytg date NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_acuse_resp_dependencia date NOT NULL,
    resp_dependencia text NOT NULL,
    num_oficio_enviar_resp_asenl character varying NOT NULL,
    fecha_oficio_enviar_resp_asenl date NOT NULL,
    unidad_investigadora character varying NOT NULL,
    num_vai character varying NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL
);


ALTER TABLE public.observaciones_ires_asenl OWNER TO postgres;

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
-- Name: observaciones_pre_asenl_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_pre_asenl_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_pre_asenl_seq OWNER TO postgres;

--
-- Name: observaciones_pre_asenl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_pre_asenl (
    id integer DEFAULT nextval('public.observaciones_pre_asenl_seq'::regclass) NOT NULL,
    direccion_id integer NOT NULL,
    compartida_observacion text,
    compartida_tipo_observacion_id integer,
    compartida_monto double precision,
    fecha_captura date NOT NULL,
    tipo_auditoria_id integer NOT NULL,
    auditoria_id integer NOT NULL,
    num_oficio_notif_obs_prelim character varying NOT NULL,
    fecha_recibido date NOT NULL,
    fecha_vencimiento_of date NOT NULL,
    tipo_observacion_id integer NOT NULL,
    num_observacion character varying NOT NULL,
    observacion text NOT NULL,
    monto_observado double precision NOT NULL,
    num_oficio_cytg_oic character varying NOT NULL,
    fecha_oficio_cytg_oic date NOT NULL,
    fecha_recibido_dependencia date NOT NULL,
    fecha_vencimiento_cytg date NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp date NOT NULL,
    resp_dependencia text NOT NULL,
    comentarios text NOT NULL,
    clasif_final_cytg integer NOT NULL,
    num_oficio_org_fiscalizador character varying NOT NULL,
    fecha_oficio_org_fiscalizador date NOT NULL,
    estatus_proceso_id integer NOT NULL,
    proyeccion_solventacion_id integer NOT NULL,
    resultado_final_pub_id integer NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL,
    observacion_ires_id integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.observaciones_pre_asenl OWNER TO postgres;

--
-- Name: TABLE observaciones_pre_asenl; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.observaciones_pre_asenl IS 'Observaciones preliminares de ASENL';


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
    num_observacion character varying NOT NULL,
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
    hora_creacion timestamp with time zone NOT NULL,
    observacion_ires_id integer DEFAULT 0 NOT NULL
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
-- Name: obs; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.obs AS
( SELECT ad.dependencia_id,
    aa.anio_cuenta_pub,
    'SFP'::text AS ente_fiscalizador,
    count(obs.id) AS cant_observaciones,
    sum(obs.monto_observado) AS total_monto_observado
   FROM ((public.observaciones_sfp obs
     JOIN public.auditoria_dependencias ad ON ((obs.auditoria_id = ad.auditoria_id)))
     JOIN public.auditoria_anios_cuenta_pub aa ON ((obs.auditoria_id = aa.auditoria_id)))
  WHERE (NOT obs.blocked)
  GROUP BY ad.dependencia_id, aa.anio_cuenta_pub
  ORDER BY ad.dependencia_id, aa.anio_cuenta_pub)
UNION
( SELECT ad.dependencia_id,
    aa.anio_cuenta_pub,
    'ASF'::text AS ente_fiscalizador,
    count(obs_asf.id) AS cant_observaciones,
    sum(obs_asf.monto_observado) AS total_monto_observado
   FROM (((public.observaciones_ires_asf obs_asf
     JOIN public.observaciones_pre_asf obs_pre ON ((obs_asf.observacion_pre_id = obs_pre.id)))
     JOIN public.auditoria_dependencias ad ON ((obs_pre.auditoria_id = ad.auditoria_id)))
     JOIN public.auditoria_anios_cuenta_pub aa ON ((obs_pre.auditoria_id = aa.auditoria_id)))
  WHERE (NOT obs_asf.blocked)
  GROUP BY ad.dependencia_id, aa.anio_cuenta_pub
  ORDER BY ad.dependencia_id, aa.anio_cuenta_pub)
UNION
( SELECT ad.dependencia_id,
    aa.anio_cuenta_pub,
    'ASENL'::text AS ente_fiscalizador,
    count(obs_ase.id) AS cant_observaciones,
    sum(obs_ase.monto_observado) AS total_monto_observado
   FROM (((public.observaciones_ires_asenl obs_ase
     JOIN public.observaciones_pre_asenl obs_pre ON ((obs_ase.observacion_pre_id = obs_pre.id)))
     JOIN public.auditoria_dependencias ad ON ((obs_pre.auditoria_id = ad.auditoria_id)))
     JOIN public.auditoria_anios_cuenta_pub aa ON ((obs_pre.auditoria_id = aa.auditoria_id)))
  WHERE (NOT obs_ase.blocked)
  GROUP BY ad.dependencia_id, aa.anio_cuenta_pub
  ORDER BY ad.dependencia_id, aa.anio_cuenta_pub);


ALTER TABLE public.obs OWNER TO postgres;

--
-- Name: obs_1; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.obs_1 AS
 SELECT dependencies.title AS dependencia,
    obs.anio_cuenta_pub,
    obs.ente_fiscalizador,
    obs.cant_observaciones,
    obs.total_monto_observado
   FROM (public.obs
     LEFT JOIN public.dependencies ON ((dependencies.id = obs.dependencia_id)))
  ORDER BY dependencies.title, obs.anio_cuenta_pub, obs.ente_fiscalizador;


ALTER TABLE public.obs_1 OWNER TO postgres;

--
-- Name: observaciones_ires_cytg_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_ires_cytg_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_ires_cytg_seq OWNER TO postgres;

--
-- Name: observaciones_ires_cytg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_ires_cytg (
    id integer DEFAULT nextval('public.observaciones_ires_cytg_seq'::regclass) NOT NULL,
    observacion_pre_id integer NOT NULL,
    num_observacion character varying NOT NULL,
    observacion text NOT NULL,
    tipo_observacion_id integer NOT NULL,
    estatus_info_resultados_id integer NOT NULL,
    acciones_preventivas text NOT NULL,
    acciones_correctivas text NOT NULL,
    clasif_final_cytg integer NOT NULL,
    monto_solventado double precision DEFAULT 0 NOT NULL,
    monto_pendiente_solventar double precision DEFAULT 0 NOT NULL,
    monto_a_reintegrar double precision DEFAULT 0 NOT NULL,
    monto_reintegrado double precision DEFAULT 0 NOT NULL,
    fecha_reintegro date NOT NULL,
    monto_por_reintegrar double precision DEFAULT 0 NOT NULL,
    num_oficio_cytg_aut_invest character varying NOT NULL,
    fecha_oficio_cytg_aut_invest date NOT NULL,
    num_carpeta_investigacion character varying NOT NULL,
    num_oficio_vai_municipio character varying NOT NULL,
    fecha_oficio_vai_municipio date NOT NULL,
    num_oficio_pras_cytg_dependencia character varying NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp_dependencia date NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL
);


ALTER TABLE public.observaciones_ires_cytg OWNER TO postgres;

--
-- Name: observaciones_pre_cytg_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_pre_cytg_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_pre_cytg_seq OWNER TO postgres;

--
-- Name: observaciones_pre_cytg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_pre_cytg (
    id integer DEFAULT nextval('public.observaciones_pre_cytg_seq'::regclass) NOT NULL,
    periodo_revision_de date NOT NULL,
    periodo_revision_a date NOT NULL,
    direccion_id integer NOT NULL,
    fecha_captura date NOT NULL,
    programa_social_id integer NOT NULL,
    auditoria_id integer NOT NULL,
    tipo_auditoria_id integer NOT NULL,
    num_oficio_inicio character varying NOT NULL,
    fecha_notificacion_inicio date NOT NULL,
    fecha_vencimiento_nombra_enlace date NOT NULL,
    num_oficio_requerimiento character varying NOT NULL,
    fecha_notificacion_requerimiento date NOT NULL,
    fecha_vencimiento_requerimiento date NOT NULL,
    fecha_vencimiento_nueva date NOT NULL,
    tipo_observacion_id integer NOT NULL,
    num_observacion character varying NOT NULL,
    observacion text NOT NULL,
    monto_observado double precision NOT NULL,
    num_oficio_cytg_oic_pre character varying NOT NULL,
    fecha_oficio_cytg_pre date NOT NULL,
    fecha_recibido_dependencia date NOT NULL,
    fecha_vencimiento_pre date NOT NULL,
    prorroga boolean DEFAULT false NOT NULL,
    num_oficio_solic_prorroga character varying,
    fecha_oficio_solic_prorroga date,
    num_oficio_contest_prorroga_cytg character varying,
    fecha_oficio_contest_cytg date,
    fecha_vencimiento_pre_nueva date,
    clasif_pre_cytg integer NOT NULL,
    num_oficio_resp_dependencia character varying NOT NULL,
    fecha_oficio_resp date NOT NULL,
    resp_dependencia text NOT NULL,
    comentarios text NOT NULL,
    blocked boolean DEFAULT false NOT NULL,
    hora_ult_cambio timestamp with time zone NOT NULL,
    hora_creacion timestamp with time zone NOT NULL,
    observacion_ires_id integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.observaciones_pre_cytg OWNER TO postgres;

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
-- Name: proyecciones_asenl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proyecciones_asenl (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.proyecciones_asenl OWNER TO postgres;

--
-- Name: TABLE proyecciones_asenl; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.proyecciones_asenl IS 'Catalogo de proyecciones para una obs de ASENL';


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
    title character varying NOT NULL,
    description character varying DEFAULT ''::character varying NOT NULL,
    central boolean DEFAULT false NOT NULL,
    paraestatal boolean DEFAULT false NOT NULL,
    obra_pub boolean DEFAULT false NOT NULL
);


ALTER TABLE public.social_programs OWNER TO postgres;

--
-- Name: TABLE social_programs; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.social_programs IS 'Alberga los programas sociales a los que esta vinculada una observacion';


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uploads (
    org_fisc_id integer NOT NULL,
    obs_stage_id integer NOT NULL,
    obs_id integer NOT NULL,
    upload_id integer NOT NULL,
    filename character varying NOT NULL
);


ALTER TABLE public.uploads OWNER TO postgres;

--
-- Name: user_authority; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_authority (
    user_id integer NOT NULL,
    authority_id integer NOT NULL
);


ALTER TABLE public.user_authority OWNER TO postgres;

--
-- Name: TABLE user_authority; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.user_authority IS 'Relaciona usuarios del sistema con sus permisos';


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
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    touch_latter_time timestamp with time zone NOT NULL,
    inception_time timestamp with time zone NOT NULL,
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
-- Name: acciones_asenl acciones_asenl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones_asenl
    ADD CONSTRAINT acciones_asenl_pkey PRIMARY KEY (id);


--
-- Name: acciones_asenl acciones_asenl_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones_asenl
    ADD CONSTRAINT acciones_asenl_unique_title UNIQUE (title);


--
-- Name: acciones_obs_asenl acciones_obs_asenl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones_obs_asenl
    ADD CONSTRAINT acciones_obs_asenl_pkey PRIMARY KEY (observacion_id, accion_id);


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
-- Name: auditoria_tipos_cytg auditoria_tipos_cytg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_tipos_cytg
    ADD CONSTRAINT auditoria_tipos_cytg_pkey PRIMARY KEY (id);


--
-- Name: auditoria_tipos_cytg auditoria_tipos_cytg_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_tipos_cytg
    ADD CONSTRAINT auditoria_tipos_cytg_title_unique UNIQUE (title);


--
-- Name: auditoria_tipos auditoria_tipos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_tipos
    ADD CONSTRAINT auditoria_tipos_pkey PRIMARY KEY (id);


--
-- Name: auditoria_tipos auditoria_tipos_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_tipos
    ADD CONSTRAINT auditoria_tipos_title_unique UNIQUE (title);


--
-- Name: audits audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_pkey PRIMARY KEY (id);


--
-- Name: audits audits_unique_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audits
    ADD CONSTRAINT audits_unique_title UNIQUE (title);


--
-- Name: authorities authorities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authorities
    ADD CONSTRAINT authorities_pkey PRIMARY KEY (id);


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
-- Name: clasifs_internas_cytg clasifs_internas_cytg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasifs_internas_cytg
    ADD CONSTRAINT clasifs_internas_cytg_pkey PRIMARY KEY (org_fiscal_id, direccion_id, sorting_val);


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
-- Name: estatus_ires_cytg estatus_ires_cytg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_ires_cytg
    ADD CONSTRAINT estatus_ires_cytg_pkey PRIMARY KEY (id);


--
-- Name: estatus_ires_cytg estatus_ires_cytg_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_ires_cytg
    ADD CONSTRAINT estatus_ires_cytg_title_unique UNIQUE (title);


--
-- Name: estatus_pre_asenl estatus_pre_asenl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_pre_asenl
    ADD CONSTRAINT estatus_pre_asenl_pkey PRIMARY KEY (id);


--
-- Name: estatus_pre_asenl estatus_pre_asenl_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_pre_asenl
    ADD CONSTRAINT estatus_pre_asenl_title_unique UNIQUE (title);


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
-- Name: observaciones_ires_asenl observaciones_ires_asenl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_asenl
    ADD CONSTRAINT observaciones_ires_asenl_pkey PRIMARY KEY (id);


--
-- Name: observaciones_ires_asf observaciones_ires_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_asf
    ADD CONSTRAINT observaciones_ires_asf_pkey PRIMARY KEY (id);


--
-- Name: observaciones_ires_cytg observaciones_ires_cytg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_cytg
    ADD CONSTRAINT observaciones_ires_cytg_pkey PRIMARY KEY (id);


--
-- Name: observaciones_sfp observaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_pkey PRIMARY KEY (id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_pkey PRIMARY KEY (id);


--
-- Name: observaciones_pre_asf observaciones_pre_asf_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_pkey PRIMARY KEY (id);


--
-- Name: observaciones_pre_cytg observaciones_pre_cytg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_cytg
    ADD CONSTRAINT observaciones_pre_cytg_pkey PRIMARY KEY (id);


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
-- Name: proyecciones_asenl proyecciones_asenl_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_asenl
    ADD CONSTRAINT proyecciones_asenl_pkey PRIMARY KEY (id);


--
-- Name: proyecciones_asenl proyecciones_asenl_title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proyecciones_asenl
    ADD CONSTRAINT proyecciones_asenl_title_unique UNIQUE (title);


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
-- Name: seguimientos_obs_cytg seguimientos_obs_cytg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_cytg
    ADD CONSTRAINT seguimientos_obs_cytg_pkey PRIMARY KEY (observacion_id, seguimiento_id);


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
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (org_fisc_id, obs_stage_id, obs_id, upload_id);


--
-- Name: uploads uploads_unique_filename; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_unique_filename UNIQUE (filename);


--
-- Name: user_authority user_authority_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_authority
    ADD CONSTRAINT user_authority_pkey PRIMARY KEY (user_id, authority_id);


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
-- Name: acciones_obs_asenl acciones_obs_asenl_acciones_asenl_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones_obs_asenl
    ADD CONSTRAINT acciones_obs_asenl_acciones_asenl_fkey FOREIGN KEY (accion_id) REFERENCES public.acciones_asenl(id);


--
-- Name: acciones_obs_asenl acciones_obs_asenl_observaciones_ires_asenl_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acciones_obs_asenl
    ADD CONSTRAINT acciones_obs_asenl_observaciones_ires_asenl_fkey FOREIGN KEY (observacion_id) REFERENCES public.observaciones_ires_asenl(id);


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
-- Name: clasifs_internas_cytg clasifs_internas_cytg_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasifs_internas_cytg
    ADD CONSTRAINT clasifs_internas_cytg_divisions_fkey FOREIGN KEY (direccion_id) REFERENCES public.divisions(id);


--
-- Name: clasifs_internas_cytg clasifs_internas_cytg_fiscals_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clasifs_internas_cytg
    ADD CONSTRAINT clasifs_internas_cytg_fiscals_fkey FOREIGN KEY (org_fiscal_id) REFERENCES public.fiscals(id);


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
-- Name: observaciones_ires_asenl observaciones_ires_asenl_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_asenl
    ADD CONSTRAINT observaciones_ires_asenl_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_ires_asf observaciones_ires_asf_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_asf
    ADD CONSTRAINT observaciones_ires_asf_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_ires_cytg observaciones_ires_cytg_estatus_ires_cytg_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_cytg
    ADD CONSTRAINT observaciones_ires_cytg_estatus_ires_cytg_fkey FOREIGN KEY (estatus_info_resultados_id) REFERENCES public.estatus_ires_cytg(id);


--
-- Name: observaciones_ires_cytg observaciones_ires_cytg_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_ires_cytg
    ADD CONSTRAINT observaciones_ires_cytg_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_sfp observaciones_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_sfp
    ADD CONSTRAINT observaciones_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_auditoria_tipos_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_auditoria_tipos_fkey FOREIGN KEY (tipo_auditoria_id) REFERENCES public.auditoria_tipos(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_audits_fkey FOREIGN KEY (auditoria_id) REFERENCES public.audits(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_divisions_fkey FOREIGN KEY (direccion_id) REFERENCES public.divisions(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_estatus_pre_asenl_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_estatus_pre_asenl_fkey FOREIGN KEY (estatus_proceso_id) REFERENCES public.estatus_pre_asenl(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_proyecciones_asenl_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_proyecciones_asenl_fkey FOREIGN KEY (proyeccion_solventacion_id) REFERENCES public.proyecciones_asenl(id);


--
-- Name: observaciones_pre_asenl observaciones_pre_asenl_resultado_final_pub_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asenl
    ADD CONSTRAINT observaciones_pre_asenl_resultado_final_pub_fkey FOREIGN KEY (resultado_final_pub_id) REFERENCES public.proyecciones_asenl(id);


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
-- Name: observaciones_pre_asf observaciones_pre_asf_social_programs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_asf
    ADD CONSTRAINT observaciones_pre_asf_social_programs_fkey FOREIGN KEY (programa_social_id) REFERENCES public.social_programs(id);


--
-- Name: observaciones_pre_cytg observaciones_pre_cytg_auditoria_tipos_cytg_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_cytg
    ADD CONSTRAINT observaciones_pre_cytg_auditoria_tipos_cytg_fkey FOREIGN KEY (tipo_auditoria_id) REFERENCES public.auditoria_tipos_cytg(id);


--
-- Name: observaciones_pre_cytg observaciones_pre_cytg_audits_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_cytg
    ADD CONSTRAINT observaciones_pre_cytg_audits_fkey FOREIGN KEY (auditoria_id) REFERENCES public.audits(id);


--
-- Name: observaciones_pre_cytg observaciones_pre_cytg_divisions_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_cytg
    ADD CONSTRAINT observaciones_pre_cytg_divisions_fkey FOREIGN KEY (direccion_id) REFERENCES public.divisions(id);


--
-- Name: observaciones_pre_cytg observaciones_pre_cytg_observation_types_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_cytg
    ADD CONSTRAINT observaciones_pre_cytg_observation_types_fkey FOREIGN KEY (tipo_observacion_id) REFERENCES public.observation_types(id);


--
-- Name: observaciones_pre_cytg observaciones_pre_cytg_social_programs_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_pre_cytg
    ADD CONSTRAINT observaciones_pre_cytg_social_programs_fkey FOREIGN KEY (programa_social_id) REFERENCES public.social_programs(id);


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
-- Name: seguimientos_obs_cytg seguimientos_obs_cytg_estatus_ires_cytg_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_cytg
    ADD CONSTRAINT seguimientos_obs_cytg_estatus_ires_cytg_fkey FOREIGN KEY (estatus_seguimiento_id) REFERENCES public.estatus_ires_cytg(id);


--
-- Name: seguimientos_obs_cytg seguimientos_obs_cytg_observaciones_ires_cytg_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_obs_cytg
    ADD CONSTRAINT seguimientos_obs_cytg_observaciones_ires_cytg_fkey FOREIGN KEY (observacion_id) REFERENCES public.observaciones_ires_cytg(id);


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
-- Name: geo_states state_country_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.geo_states
    ADD CONSTRAINT state_country_fkey FOREIGN KEY (country_id) REFERENCES public.geo_countries(id);


--
-- Name: uploads uploads_fiscals_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_fiscals_fkey FOREIGN KEY (org_fisc_id) REFERENCES public.fiscals(id);


--
-- Name: uploads uploads_observation_stages_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_observation_stages_fkey FOREIGN KEY (obs_stage_id) REFERENCES public.observation_stages(id);


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
-- Name: users users_orgchart_roles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_orgchart_roles_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id);


--
-- PostgreSQL database dump complete
--

