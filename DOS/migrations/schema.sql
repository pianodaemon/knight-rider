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

