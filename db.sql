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

CREATE TABLE public.fiscals (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
)

COMMENT ON TABLE public.fiscals IS 'Relacion que alberga los organos fiscalizadores';

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_unique_title UNIQUE (title);


CREATE TABLE public.sectors (
    id integer NOT NULL,
    title character varying NOT NULL,
)

COMMENT ON TABLE public.sectors IS 'Relacion que alberga los sectores (utilizados como attributos de agrupacion para las dependencias)';

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_unique_title UNIQUE (title);

CREATE TABLE public.dependencies (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
)

COMMENT ON TABLE public.dependencies IS 'Relacion que alberga las dependencias de gobierno';

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_unique_title UNIQUE (title);

CREATE TABLE public.group_sector_dependency (
    id integer NOT NULL,
    dependency_id integer NOT NULL,
    sector_id integer NOT NULL
)

COMMENT ON TABLE public.group_sector_dependency IS 'Representa la relacion N a N entre sectores y dependencias';

ALTER TABLE ONLY public.group_sector_dependency
    ADD CONSTRAINT group_sector_dependency_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.group_sector_dependency
    ADD CONSTRAINT group_sector_dependency_fk_dependency FOREIGN KEY (dependency_id) REFERENCES public.dependencies(id);

ALTER TABLE ONLY public.group_sector_dependency
    ADD CONSTRAINT group_sector_dependency_fk_sector FOREIGN KEY (sector_id) REFERENCES public.sectors(id);

CREATE TABLE public.observation_types (
    id integer NOT NULL,
    title character varying NOT NULL
)

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_unique_title UNIQUE (title);

CREATE TABLE public.observations (
    id integer NOT NULL,
    observation_type_id NOT NULL
)

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observation_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_fk_type FOREIGN KEY (observation_type_id) REFERENCES public.observations(id);
