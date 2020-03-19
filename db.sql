--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.12
-- Dumped by pg_dump version 9.6.12

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;

--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET default_tablespace = '';

SET default_with_oids = false;

CREATE TABLE public.orgchart_roles (
    id integer NOT NULL,
    title character varying NOT NULL
);

COMMENT ON TABLE public.orgchart_roles IS 'Roles de el diagrama organizacional';

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_unique_title UNIQUE (title);

CREATE TABLE public.divisions (
    id integer NOT NULL,
    title character varying NOT NULL
);

COMMENT ON TABLE public.divisions IS 'Relacion que alberga las direcciones de la contraloria';

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_unique_title UNIQUE (title);

CREATE TABLE public.fiscals (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);

COMMENT ON TABLE public.fiscals IS 'Relacion que alberga los organos fiscalizadores';

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_unique_title UNIQUE (title);


CREATE TABLE public.apps
(
    id integer NOT NULL, -- Identificador de la aplicacion, cada aplicacion tiene un identificador unico representador por un entero
    descripcion character varying NOT NULL,
    nombre_app character varying,
    CONSTRAINT app_pkey PRIMARY KEY (id),
    CONSTRAINT app_titulo_key UNIQUE (nombre_app)
);

COMMENT ON TABLE public.apps IS 'Relacion que alberga las aplicaciones que seran gobernadas por roles';

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    orgchart_role_id integer NOT NULL,
    division_id integer NOT NULL,
    enabled  boolean NOT NULL DEFAULT false
);

COMMENT ON TABLE public.users IS 'Relacion que alberga usuarios de el sistema';

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_unique_username UNIQUE (username);

CREATE TABLE public.sectors (
    id integer NOT NULL,
    title character varying NOT NULL
);

COMMENT ON TABLE public.sectors IS 'Relacion que alberga los sectores (utilizados como attributos de agrupacion para las dependencias)';

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_unique_title UNIQUE (title);

CREATE TABLE public.dependencies (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);

COMMENT ON TABLE public.dependencies IS 'Relacion que alberga las dependencias de gobierno';

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_unique_title UNIQUE (title);

CREATE TABLE public.observation_types (
    id integer NOT NULL,
    title character varying NOT NULL
);

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_unique_title UNIQUE (title);

CREATE TABLE public.observations (
    id integer NOT NULL,
    observation_type_id integer NOT NULL
);

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observation_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_fk_type FOREIGN KEY (observation_type_id) REFERENCES public.observation_types(id);

CREATE TABLE public.security_app_context (
    id integer NOT NULL,
    orgchart_role_id integer NOT NULL,
    app_id integer NOT NULL
)
