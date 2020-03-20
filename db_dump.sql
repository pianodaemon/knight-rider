--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Ubuntu 12.2-2.pgdg18.04+1)
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

SET default_table_access_method = heap;

--
-- Name: apps; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.apps (
    id integer NOT NULL,
    descripcion character varying NOT NULL,
    nombre_app character varying
);


ALTER TABLE public.apps OWNER TO devon_miles;

--
-- Name: TABLE apps; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.apps IS 'Relacion que alberga las aplicaciones que seran gobernadas por roles';


--
-- Name: dependencies; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.dependencies (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);


ALTER TABLE public.dependencies OWNER TO devon_miles;

--
-- Name: TABLE dependencies; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.dependencies IS 'Relacion que alberga las dependencias de gobierno';


--
-- Name: divisions; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.divisions (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.divisions OWNER TO devon_miles;

--
-- Name: TABLE divisions; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.divisions IS 'Relacion que alberga las direcciones de la contraloria';


--
-- Name: fiscals; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.fiscals (
    id integer NOT NULL,
    title character varying NOT NULL,
    description text
);


ALTER TABLE public.fiscals OWNER TO devon_miles;

--
-- Name: TABLE fiscals; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.fiscals IS 'Relacion que alberga los organos fiscalizadores';


--
-- Name: observation_statuses; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.observation_statuses (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_statuses OWNER TO devon_miles;

--
-- Name: TABLE observation_statuses; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.observation_statuses IS 'Estado transitivo de una entidad observacion';


--
-- Name: observation_types; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.observation_types (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.observation_types OWNER TO devon_miles;

--
-- Name: observations; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.observations (
    id integer NOT NULL,
    observation_type_id integer NOT NULL
);


ALTER TABLE public.observations OWNER TO devon_miles;

--
-- Name: orgchart_roles; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.orgchart_roles (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.orgchart_roles OWNER TO devon_miles;

--
-- Name: TABLE orgchart_roles; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.orgchart_roles IS 'Roles de el diagrama organizacional';


--
-- Name: sectors; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.sectors (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.sectors OWNER TO devon_miles;

--
-- Name: TABLE sectors; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.sectors IS 'Relacion que alberga los sectores (utilizados como attributos de agrupacion para las dependencias)';


--
-- Name: security_app_context; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.security_app_context (
    id integer NOT NULL,
    orgchart_role_id integer NOT NULL,
    app_id integer NOT NULL
);


ALTER TABLE public.security_app_context OWNER TO devon_miles;

--
-- Name: social_programs; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.social_programs (
    id integer NOT NULL,
    title character varying NOT NULL
);


ALTER TABLE public.social_programs OWNER TO devon_miles;

--
-- Name: users; Type: TABLE; Schema: public; Owner: devon_miles
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    orgchart_role_id integer NOT NULL,
    division_id integer NOT NULL,
    enabled boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO devon_miles;

--
-- Name: TABLE users; Type: COMMENT; Schema: public; Owner: devon_miles
--

COMMENT ON TABLE public.users IS 'Relacion que alberga usuarios de el sistema';


--
-- Data for Name: apps; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.apps (id, descripcion, nombre_app) FROM stdin;
\.


--
-- Data for Name: dependencies; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.dependencies (id, title, description) FROM stdin;
\.


--
-- Data for Name: divisions; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.divisions (id, title) FROM stdin;
\.


--
-- Data for Name: fiscals; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.fiscals (id, title, description) FROM stdin;
\.


--
-- Data for Name: observation_statuses; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.observation_statuses (id, title) FROM stdin;
\.


--
-- Data for Name: observation_types; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.observation_types (id, title) FROM stdin;
1	Type1
2	Tipo2
3	T3
4	Tip4
\.


--
-- Data for Name: observations; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.observations (id, observation_type_id) FROM stdin;
1	3
2	1
3	4
4	2
5	2
6	3
7	4
8	4
9	4
10	4
11	4
12	4
13	4
14	1
15	2
16	3
17	3
18	3
19	1
20	1
21	1
22	2
\.


--
-- Data for Name: orgchart_roles; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.orgchart_roles (id, title) FROM stdin;
\.


--
-- Data for Name: sectors; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.sectors (id, title) FROM stdin;
\.


--
-- Data for Name: security_app_context; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.security_app_context (id, orgchart_role_id, app_id) FROM stdin;
\.


--
-- Data for Name: social_programs; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.social_programs (id, title) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: devon_miles
--

COPY public.users (id, username, password, orgchart_role_id, division_id, enabled) FROM stdin;
\.


--
-- Name: apps app_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT app_pkey PRIMARY KEY (id);


--
-- Name: apps app_titulo_key; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.apps
    ADD CONSTRAINT app_titulo_key UNIQUE (nombre_app);


--
-- Name: dependencies dependency_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_pkey PRIMARY KEY (id);


--
-- Name: dependencies dependency_unique_title; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.dependencies
    ADD CONSTRAINT dependency_unique_title UNIQUE (title);


--
-- Name: divisions division_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_pkey PRIMARY KEY (id);


--
-- Name: divisions division_unique_title; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.divisions
    ADD CONSTRAINT division_unique_title UNIQUE (title);


--
-- Name: fiscals fiscal_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_pkey PRIMARY KEY (id);


--
-- Name: fiscals fiscal_unique_title; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.fiscals
    ADD CONSTRAINT fiscal_unique_title UNIQUE (title);


--
-- Name: observations observation_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observation_pkey PRIMARY KEY (id);


--
-- Name: observation_statuses observation_status_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.observation_statuses
    ADD CONSTRAINT observation_status_pkey PRIMARY KEY (id);


--
-- Name: observation_statuses observation_status_titulo_key; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.observation_statuses
    ADD CONSTRAINT observation_status_titulo_key UNIQUE (title);


--
-- Name: observation_types observation_type_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_pkey PRIMARY KEY (id);


--
-- Name: observation_types observation_type_unique_title; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.observation_types
    ADD CONSTRAINT observation_type_unique_title UNIQUE (title);


--
-- Name: orgchart_roles orgchart_role_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_pkey PRIMARY KEY (id);


--
-- Name: orgchart_roles orgchart_role_unique_title; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.orgchart_roles
    ADD CONSTRAINT orgchart_role_unique_title UNIQUE (title);


--
-- Name: sectors sector_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_pkey PRIMARY KEY (id);


--
-- Name: sectors sector_unique_title; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sector_unique_title UNIQUE (title);


--
-- Name: security_app_context security_app_context_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT security_app_context_pkey PRIMARY KEY (id);


--
-- Name: social_programs social_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.social_programs
    ADD CONSTRAINT social_programs_pkey PRIMARY KEY (id);


--
-- Name: social_programs social_programs_titulo_key; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.social_programs
    ADD CONSTRAINT social_programs_titulo_key UNIQUE (title);


--
-- Name: users user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- Name: users user_role_unique_username; Type: CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_unique_username UNIQUE (username);


--
-- Name: security_app_context app_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT app_id_fkey FOREIGN KEY (app_id) REFERENCES public.apps(id) NOT VALID;


--
-- Name: observations observations_fk_type; Type: FK CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_fk_type FOREIGN KEY (observation_type_id) REFERENCES public.observation_types(id);


--
-- Name: security_app_context orgchart_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.security_app_context
    ADD CONSTRAINT orgchart_role_id_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id) NOT VALID;


--
-- Name: users user_role_division_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_division_fkey FOREIGN KEY (division_id) REFERENCES public.divisions(id) NOT VALID;


--
-- Name: users user_role_orgchart_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: devon_miles
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_role_orgchart_role_fkey FOREIGN KEY (orgchart_role_id) REFERENCES public.orgchart_roles(id) NOT VALID;


--
-- PostgreSQL database dump complete
--

