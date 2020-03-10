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
    id serial NOT NULL,
    title character varying NOT NULL,
    description text
)

COMMENT ON TABLE public.fiscals IS 'Relacion que alberga los organos fiscalizadores';

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_unique_title UNIQUE (title);


CREATE TABLE public.sectors (
    id serial NOT NULL,
    title character varying NOT NULL,
    description text
)

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_unique_title UNIQUE (title);
