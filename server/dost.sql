--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4 (Debian 16.4-1.pgdg110+2)
-- Dumped by pg_dump version 16.4 (Debian 16.4-1.pgdg110+2)

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
-- Name: geo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA geo;


ALTER SCHEMA geo OWNER TO postgres;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: tiger; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger;


ALTER SCHEMA tiger OWNER TO postgres;

--
-- Name: tiger_data; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA tiger_data;


ALTER SCHEMA tiger_data OWNER TO postgres;

--
-- Name: topology; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA topology;


ALTER SCHEMA topology OWNER TO postgres;

--
-- Name: SCHEMA topology; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA topology IS 'PostGIS Topology schema';


--
-- Name: fuzzystrmatch; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch WITH SCHEMA public;


--
-- Name: EXTENSION fuzzystrmatch; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION fuzzystrmatch IS 'determine similarities and distance between strings';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: postgis_tiger_geocoder; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder WITH SCHEMA tiger;


--
-- Name: EXTENSION postgis_tiger_geocoder; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis_tiger_geocoder IS 'PostGIS tiger geocoder and reverse geocoder';


--
-- Name: AttachmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttachmentType" AS ENUM (
    'IMAGE',
    'VIDEO',
    'PDF',
    'DOCUMENT',
    'AUDIO',
    'OTHER'
);


ALTER TYPE public."AttachmentType" OWNER TO postgres;

--
-- Name: EducationResourceType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EducationResourceType" AS ENUM (
    'ARTICLE',
    'VIDEO',
    'DOCUMENT',
    'CATALOGUE',
    'INFOGRAPHIC',
    'WEBINAR',
    'PODCAST',
    'EXTERNAL_LINK'
);


ALTER TYPE public."EducationResourceType" OWNER TO postgres;

--
-- Name: EducationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."EducationStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ARCHIVED'
);


ALTER TYPE public."EducationStatus" OWNER TO postgres;

--
-- Name: SurveyType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SurveyType" AS ENUM (
    'SHORT_TEXT',
    'LONG_TEXT',
    'MULTIPLE_CHOICE',
    'CHECKBOX'
);


ALTER TYPE public."SurveyType" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLog" (
    activity_logs_id text NOT NULL,
    type character varying(50) NOT NULL,
    decription character varying(100),
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text
);


ALTER TABLE public."ActivityLog" OWNER TO postgres;

--
-- Name: DeviceSession; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DeviceSession" (
    device_sessions_id text NOT NULL,
    device_name character varying(100) NOT NULL,
    ip_address character varying(100) NOT NULL,
    expired_at timestamp(3) without time zone NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text,
    browser text NOT NULL,
    device_type text NOT NULL,
    os text NOT NULL,
    user_agent text NOT NULL
);


ALTER TABLE public."DeviceSession" OWNER TO postgres;

--
-- Name: EducationAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EducationAttachment" (
    education_attachment_id text NOT NULL,
    education_resource_id text NOT NULL,
    type public."AttachmentType" NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    mime_type character varying(100),
    file_size integer,
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EducationAttachment" OWNER TO postgres;

--
-- Name: EducationCategory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EducationCategory" (
    education_category_id text NOT NULL,
    name character varying(100) NOT NULL,
    slug text NOT NULL,
    description character varying(300),
    parent_id text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."EducationCategory" OWNER TO postgres;

--
-- Name: EducationResource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EducationResource" (
    education_resource_id text NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text,
    slug text NOT NULL,
    category_id text NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    published_at timestamp(3) without time zone,
    status public."EducationStatus" DEFAULT 'DRAFT'::public."EducationStatus" NOT NULL,
    summary character varying(500),
    thumbnail text,
    type public."EducationResourceType" NOT NULL
);


ALTER TABLE public."EducationResource" OWNER TO postgres;

--
-- Name: EducationResourceTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EducationResourceTag" (
    education_resource_id text NOT NULL,
    education_tag_id text NOT NULL
);


ALTER TABLE public."EducationResourceTag" OWNER TO postgres;

--
-- Name: EducationTag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."EducationTag" (
    education_tag_id text NOT NULL,
    name character varying(50) NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public."EducationTag" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    notification_id text NOT NULL,
    title text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: OTP; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OTP" (
    otp_id text NOT NULL,
    identifier character varying(255) DEFAULT 'email'::character varying NOT NULL,
    type text DEFAULT 'login'::text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    is_used boolean DEFAULT false NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 5 NOT NULL,
    ip_address character varying(100),
    user_agent text,
    user_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    code_hash character varying(255) NOT NULL
);


ALTER TABLE public."OTP" OWNER TO postgres;

--
-- Name: Organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Organization" (
    organization_id text NOT NULL,
    name character varying(100) NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    address text,
    contact text NOT NULL,
    logo text NOT NULL
);


ALTER TABLE public."Organization" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    permission_id text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resource_id text,
    name character varying(100) NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Profile" (
    profile_id text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public."Profile" OWNER TO postgres;

--
-- Name: QuestionOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuestionOption" (
    question_option_id text NOT NULL,
    survey_question_id text NOT NULL,
    label character varying(300) NOT NULL,
    value character varying(300) NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."QuestionOption" OWNER TO postgres;

--
-- Name: Resource; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Resource" (
    resource_id text NOT NULL,
    name character varying(100) NOT NULL,
    slug text NOT NULL,
    parent_id text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public."Resource" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    role_id text NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    role_permission_id text NOT NULL,
    role_id text NOT NULL,
    permission_id text NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: Survey; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Survey" (
    survey_id text NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(300),
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    slug text NOT NULL,
    is_published boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Survey" OWNER TO postgres;

--
-- Name: SurveyAnswer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SurveyAnswer" (
    answer_id text NOT NULL,
    survey_response_id text NOT NULL,
    survey_question_id text NOT NULL,
    answer_text text,
    answer_option_id text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SurveyAnswer" OWNER TO postgres;

--
-- Name: SurveyAnswerOption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SurveyAnswerOption" (
    survey_answer_option_id text NOT NULL,
    survey_answer_id text NOT NULL,
    question_option_id text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SurveyAnswerOption" OWNER TO postgres;

--
-- Name: SurveyQuestion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SurveyQuestion" (
    survey_question_id text NOT NULL,
    survey_id text NOT NULL,
    text character varying(300) NOT NULL,
    type public."SurveyType" NOT NULL,
    is_required boolean DEFAULT false NOT NULL,
    order_index integer DEFAULT 0 NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SurveyQuestion" OWNER TO postgres;

--
-- Name: SurveyResponse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SurveyResponse" (
    response_id text NOT NULL,
    survey_id text NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."SurveyResponse" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    user_id text NOT NULL,
    email character varying(255) NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    role_id text,
    organization_id text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (activity_logs_id, type, decription, is_deleted, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: DeviceSession; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."DeviceSession" (device_sessions_id, device_name, ip_address, expired_at, is_deleted, is_revoked, created_at, updated_at, user_id, browser, device_type, os, user_agent) FROM stdin;
cmqq2q7l40000osy3zr9q6rrx	Macintosh	::1	2026-06-24 03:17:33.526	f	f	2026-06-23 03:17:33.544	2026-06-23 03:17:33.544	\N	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqq5l47o003xosy3fjf4mouy	Unknown	::1	2026-06-24 04:37:34.727	f	f	2026-06-23 04:37:34.74	2026-06-23 04:37:34.74	\N	Unknown	Desktop	Unknown	PostmanRuntime/7.54.0
cmqq5noly0040osy3yukuicwf	Macintosh	::1	2026-06-24 04:39:34.479	f	f	2026-06-23 04:39:34.486	2026-06-23 04:39:34.486	\N	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqq5pnkg0041osy3w0d4epph	Macintosh	::1	2026-06-24 04:41:06.446	f	f	2026-06-23 04:41:06.448	2026-06-23 04:41:06.448	\N	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqq5ubi30044osy3t8oetiui	Macintosh	::1	2026-06-24 04:44:44.087	f	f	2026-06-23 04:44:44.091	2026-06-23 04:44:44.091	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqq5y6ok0000edy3c8skrca1	Macintosh	::1	2026-06-24 04:47:44.455	f	f	2026-06-23 04:47:44.468	2026-06-23 04:47:44.468	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqq65aqm002jedy3hgkjbnbg	Macintosh	::1	2026-06-24 04:53:16.315	f	f	2026-06-23 04:53:16.318	2026-06-23 04:53:16.318	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqu7a75e0000eyy3vadgsww0	Macintosh	::1	2026-06-27 00:36:09.253	f	f	2026-06-26 00:36:09.266	2026-06-26 00:36:09.266	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqu7aunr0001eyy36f8qt6et	Unknown	::1	2026-06-27 00:36:39.728	f	f	2026-06-26 00:36:39.735	2026-06-26 00:36:39.735	cmqq5tmyi0042osy3p41hgb36	Unknown	Desktop	Unknown	PostmanRuntime/7.54.0
cmqu7h3lr0002eyy3sxyilisw	Macintosh	::1	2026-06-27 00:41:31.26	f	f	2026-06-26 00:41:31.263	2026-06-26 00:41:31.263	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmqyjfktz0000cpy3tlavtoku	Macintosh	::1	2026-06-30 01:27:20.363	f	f	2026-06-29 01:27:20.375	2026-06-29 01:27:20.375	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmr1lkuvh0000yvy3oqqtsdf5	Macintosh	::1	2026-07-02 04:50:44.416	f	f	2026-07-01 04:50:44.429	2026-07-01 04:50:44.429	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmr2t8sjg0000uxy3gz1olrcp	Macintosh	::1	2026-07-03 01:13:04.618	f	f	2026-07-02 01:13:04.636	2026-07-02 01:13:04.636	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmr4fgwx10000pay3ol5gugtb	Macintosh	::1	2026-07-04 04:23:01.275	f	f	2026-07-03 04:23:01.285	2026-07-03 04:23:01.285	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmr8qsdzi0000m4y39rs7yyv9	Macintosh	::1	2026-07-07 04:50:57.093	f	f	2026-07-06 04:50:57.102	2026-07-06 04:50:57.102	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmr9y4g8x0000nky3otodiddt	Macintosh	::1	2026-07-08 01:04:03.376	f	f	2026-07-07 01:04:03.393	2026-07-07 01:04:03.393	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmrcqjwui0000zpy3njddxmjm	Macintosh	::1	2026-07-09 23:55:26.333	f	f	2026-07-08 23:55:26.346	2026-07-08 23:55:26.346	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36
cmrikhges0000v7y3j7jtes5w	Macintosh	::1	2026-07-14 01:52:11.081	f	f	2026-07-13 01:52:11.092	2026-07-13 01:52:11.092	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmrk119c20000hay3vwtvn9xw	Macintosh	::1	2026-07-15 02:23:15.062	f	f	2026-07-14 02:23:15.074	2026-07-14 02:23:15.074	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmrk7kwyj0001hay3hyl7bqu1	Macintosh	::1	2026-07-15 05:26:29.847	f	f	2026-07-14 05:26:29.851	2026-07-14 05:26:29.851	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmro7atbv0000nny3d8kquat0	Macintosh	::1	2026-07-18 00:29:43.277	f	f	2026-07-17 00:29:43.291	2026-07-17 00:29:43.291	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmroc6vdq0000dhy3hoxfd6nw	Macintosh	::1	2026-07-18 02:46:37.389	f	f	2026-07-17 02:46:37.406	2026-07-17 02:46:37.406	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
\.


--
-- Data for Name: EducationAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EducationAttachment" (education_attachment_id, education_resource_id, type, file_name, file_url, mime_type, file_size, order_index, created_at) FROM stdin;
\.


--
-- Data for Name: EducationCategory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EducationCategory" (education_category_id, name, slug, description, parent_id, is_deleted, created_at, updated_at) FROM stdin;
cmroauuqj0000lhy3a12v1tdm	HIV Prevention	hiv-prevention	\N	\N	f	2026-07-17 02:09:17.083	2026-07-17 02:09:17.083
cmrob313t00000ey3tc8o20yb	HIV Treatment	hiv-treatment	\N	\N	f	2026-07-17 02:15:38.585	2026-07-17 02:15:38.585
cmrob39k100010ey3pf5lrfhp	Treatment Hubs	treatment-hubs	\N	\N	f	2026-07-17 02:15:49.537	2026-07-17 02:15:49.537
cmrob3i8r00020ey3t1g8ka0p	Research	research	\N	\N	f	2026-07-17 02:16:00.795	2026-07-17 02:16:00.795
cmrob3spz00030ey3y24h0rkd	Guidelines	guidelines	\N	\N	f	2026-07-17 02:16:14.375	2026-07-17 02:16:14.375
cmrob4pip0000jky32j4dlrvk	Mental Health	mental-health	\N	\N	f	2026-07-17 02:16:56.881	2026-07-17 02:16:56.881
cmrob7cld00009by3fpmsytjt	Infographics	infographics	\N	\N	f	2026-07-17 02:19:00.097	2026-07-17 02:19:00.097
cmrob7l6000019by3iz0j3wts	Videos	videos	\N	\N	f	2026-07-17 02:19:11.208	2026-07-17 02:19:11.208
\.


--
-- Data for Name: EducationResource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EducationResource" (education_resource_id, title, content, is_deleted, created_at, updated_at, user_id, slug, category_id, is_featured, published_at, status, summary, thumbnail, type) FROM stdin;
\.


--
-- Data for Name: EducationResourceTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EducationResourceTag" (education_resource_id, education_tag_id) FROM stdin;
\.


--
-- Data for Name: EducationTag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EducationTag" (education_tag_id, name, slug) FROM stdin;
cmroeocob00000wy3y6jhtp7n	HIV	hiv
cmroeogv600010wy3bhhsf4e4	STI	sti
cmroeoi9n00020wy3idq1wnlw	ART	art
cmroeom4r00030wy3vae0htx6	PrEP	prep
cmroeonnv00040wy35lrxp7bf	PEP	pep
cmroeoryy00050wy347gy6a08	Treatment	treatment
cmroeovl400060wy3ac8biwpt	Youth	youth
cmroeoxm700070wy34t5lgs5x	Awareness	awareness
cmroep1u900080wy31sar28d6	Counseling	counseling
cmroep42o00090wy398qab1dr	Testing	testing
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (notification_id, title, is_deleted, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: OTP; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OTP" (otp_id, identifier, type, expires_at, is_used, attempts, max_attempts, ip_address, user_agent, user_id, created_at, code_hash) FROM stdin;
cmois1j9200001rutcf3nxfth	raminjoshua05@gmail.com	login	2026-04-28 15:34:38.194	t	0	5	::1	PostmanRuntime/7.53.0	\N	2026-04-28 15:24:38.198	8c380453a0c6828e551baf1e4d88ecdcaa0ace7f65d3cb18b9f339d71427ab2d
cmoitprfs0002qbutrklrybr3	raminjoshua05@gmail.com	login	2026-04-28 16:21:28.168	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-28 16:11:28.168	717ef1fd390322f7fa93d3014bfbccbb98dfa1c409845479773498825edd2c3b
cmoj95wx90000ilutl9drm2xr	raminjoshua05@gmail.com	login	2026-04-28 23:33:56.01	t	0	5	::1	PostmanRuntime/7.53.0	\N	2026-04-28 23:23:56.013	0064477cfaa8f44346407858bc75660d3e59f30db2f72a9a08a2dd37eb2e330c
cmoks9lhn0000vnutnsw9o2ox	raminjoshua05@gmail.com	login	2026-04-30 01:16:26.695	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-30 01:06:26.699	41f09b4d522709cab01f77eaa74b516858eb0633041cc75fe6d436b73d703792
cmorxmc3u0000hyutf6gchkwc	raminjoshua05@gmail.com	login	2026-05-05 01:20:42.373	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-05 01:10:42.378	c567c4b94fbcb20f6013ed3b64df558482611192713f2781784ac70e2e5a91de
cmorzyr7u0002zvut43nx5zld	admin@example.com	login	2026-05-05 02:26:21.065	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-05 02:16:21.066	168ebff3ac1277402a5c30c0f44acb9865d64714c1c437b6b8b1f188ea7eccdc
cmorzyun40003zvutt9c3uybw	admin@example.com	login	2026-05-05 02:26:25.503	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-05 02:16:25.504	8fe75d986e7b7be8a45bb2031a578bf113e6e1945faa1716ec71ed50fafbd6e3
cmorzyybj0004zvutoju2fw5k	admin@example.com	login	2026-05-05 02:26:30.27	f	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-05 02:16:30.271	74b5b8281c12ad87953cac24a8f264ea55446b0ea8fa280c2cedf93683460da1
cmp3kdper0000a8ut825lku2w	raminjoshua05@gmail.com	login	2026-05-13 04:43:18.816	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	\N	2026-05-13 04:33:18.819	4826d362c0fc9000813ab908298a4cde16cf0329d58fca36a36974c7e3d98914
cmoirvcbf0000uputxasyj4ks	raminjoshua05@gmail.com	login	2026-04-28 15:29:49.272	t	0	5	::1	PostmanRuntime/7.53.0	\N	2026-04-28 15:19:49.275	0e02417c6e7f9535102e32e2d4e4f96305cb2256dbd722d76b079f3c154cc83a
cmoite7cz0000qbutenygg49a	raminjoshua05@gmail.com	login	2026-04-28 16:12:28.928	t	1	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-28 16:02:28.931	39d0bb922f209980dbd93b85638cff95aee1c181cd0fbd26978495fb1c9042de
cmoj9u6m40002ilutodogotzf	raminjoshua05@gmail.com	login	2026-04-28 23:52:48.316	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-28 23:42:48.316	90a8f64631a38c87670e15f6ddc3fa402a26abd879d4e5b26f506da53a26303e
cmoryoovd0000zvutihlrlmr5	raminjoshua05@gmail.com	login	2026-05-05 01:50:31.843	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-05 01:40:31.849	dd01ef5a501cd9eb32948488403ce0dfb9708c7965ce0d5fa3c1e82b459de15f
cmorzzctx0005zvut9nvx2r9k	raminjoshua05@gmail.com	login	2026-05-05 02:26:49.076	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-05 02:16:49.077	c3fbe92097f510c9cee0ba3ebccac36f37b7afcf86fa27defbf5b0706edcb119
cmqq2plmm0000kky3o3rrgx61	raminjoshua05@gmail.com	login	2026-06-23 03:27:05.084	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-23 03:17:05.086	e88b8ca64e994cd94e8eeee8bb64b388cc5808fec53e8ed997389fddf33c7b49
cmqq5ko710001kky3r6jse9ka	raminjoshua05@gmail.com	login	2026-06-23 04:47:13.98	t	0	5	::1	PostmanRuntime/7.54.0	\N	2026-06-23 04:37:13.981	791063dbdad0ecb12771d17ff4acc53e19c0f7d41f1085f0be3220bdb9227114
cmqq5neqc0002kky3lzjqwbj4	raminjoshua05@gmail.com	login	2026-06-23 04:49:21.682	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-23 04:39:21.684	d4b38d2e9c765f4de1bc6f0f74a50d225902a001e9341392a9621b39f4e2a1a0
cmqq5penm0003kky3g7pu0bdp	raminjoshua05@gmail.com	login	2026-06-23 04:50:54.897	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-23 04:40:54.898	f18fd00996e52533d92aa056b1366a06b0b05c3384cc56782b5f46f0cf71aecf
cmqq5tn010004kky39rc7uwr8	raminjoshua05@gmail.com	login	2026-06-23 04:54:12.335	t	0	5	\N	\N	\N	2026-06-23 04:44:12.337	7239994f3750e0a2a5c17b2344909cb6117f0895732ffdb063106f9d1d8e56f5
cmqq5u4bm0005kky3ap0brlnw	raminjoshua05@gmail.com	login	2026-06-23 04:54:34.786	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-23 04:44:34.786	9b45a9df54e875dac5f2916bcf1156b053b962d14dc948bf016f0d73a32088b8
cmqq5xx8b0006kky3olh0bbbn	raminjoshua05@gmail.com	login	2026-06-23 04:57:32.218	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-23 04:47:32.219	b70183e8117ea880305a17d13e57f49d02ae34b98d70dd3befbb16d8d3cd906d
cmqq652br0007kky33z9z82wu	raminjoshua05@gmail.com	login	2026-06-23 05:03:05.415	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-23 04:53:05.415	db3e082439b7cdffa4f7de18c3bf811018c0f96453627c62c33f473b8052324a
cmqu78re60000hfy392l6o5gu	raminjoshua05@gmail.com	login	2026-06-26 00:45:02.187	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-26 00:35:02.19	6726c8699b630f38fda463b2d8a0f80a1cd6c94b8e19f2cb03b6530d11a689c3
cmqu7ajwy0001hfy3cwk10c0x	raminjoshua05@gmail.com	login	2026-06-26 00:46:25.81	t	0	5	::1	PostmanRuntime/7.54.0	\N	2026-06-26 00:36:25.81	213bb2615aa0a5db5d3e9b6ec81e580633a7a841a77c23089d9602242589fa1b
cmqu7gsiw0002hfy3ddji43it	raminjoshua05@gmail.com	login	2026-06-26 00:51:16.904	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-26 00:41:16.904	d15052d5f529b769dc95352777996024e54d61861c0f42e28ada576ab43109a3
cmqyjfbes0000vdy3osn2elq9	raminjoshua05@gmail.com	login	2026-06-29 01:37:08.162	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-06-29 01:27:08.164	bcc17f2ae7a8fdd47ee98e84b1b032be15cdc1a81d33560be80bacf1172676e3
cmr1lkko00000loy3n9qn6hpo	raminjoshua05@gmail.com	login	2026-07-01 05:00:31.198	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-01 04:50:31.2	29412d531abb2be98f367959283bd46656bef4409a18584ba7a1987a3c26901e
cmr2t8g6f0000x3y39wbxwwrb	raminjoshua05@gmail.com	login	2026-07-02 01:22:48.612	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-02 01:12:48.615	bb38704ac666ce25da92e31ab21cfb03dc0591531d24fd26929f420bcd8f54a2
cmr4fgmot00004by32yy6fesk	raminjoshua05@gmail.com	login	2026-07-03 04:32:48.026	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-03 04:22:48.029	ecefd6b674705e5a8db1f574938b1a2ac17b2354c317ec03cd48f9f7735f1340
cmr8qrvzn0000psy319ixbui1	raminjoshua05@gmail.com	login	2026-07-06 05:00:33.777	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-06 04:50:33.779	84eb318470b5869fa8e780f6caade8e6a73548ce7609d47b352ba02936cb7875
cmr9y45ha0000t9y3ficzjpcx	raminjoshua05@gmail.com	login	2026-07-07 01:13:49.435	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-07 01:03:49.438	662b55e11689118691103a14c9a08193235e31f03463696ae8af03f13fc40939
cmrcqjbxg00001wy3j2ikk6bi	raminjoshua05@gmail.com	login	2026-07-09 00:04:59.233	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36	\N	2026-07-08 23:54:59.236	09682a0752b34bcbb2366a2620789d1e0ce5010436518eab17daaf0731342096
cmrikdy6h0000g3y327noocoj	raminjoshua05@gmail.com	login	2026-07-13 01:59:27.495	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	\N	2026-07-13 01:49:27.497	461083a8149edfa01f905ce434657607c77fe01c5fc6e2a21ae3d2cce9f72047
cmrk10nz40000mhy3kbse2m5b	raminjoshua05@gmail.com	login	2026-07-14 02:32:47.389	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	\N	2026-07-14 02:22:47.392	730a04a3752f679653099cebf72d7dc8d4f11a8a96dbfe598b678eb0b78c51ff
cmrk7kltg0001mhy35puvzs38	raminjoshua05@gmail.com	login	2026-07-14 05:36:15.411	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	\N	2026-07-14 05:26:15.412	77f58b625255c4bcf633212b632b45c302c34db15c6b52b78eaa52dbc33c9dc2
cmro7ag2m0000q2y3y3jhpr20	raminjoshua05@gmail.com	login	2026-07-17 00:39:26.107	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	\N	2026-07-17 00:29:26.11	7fd5d711009280cc4ed82debaec4a5af22390c0fced8b32214b0f07345e8b9ef
cmroc6kvv000043y36n3hp53t	raminjoshua05@gmail.com	login	2026-07-17 02:56:23.8	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36	\N	2026-07-17 02:46:23.803	ed2d130115feaa3a1dd399ede590a7c119e2e8982ec89daebccfa0ba97fdb6dd
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organization" (organization_id, name, is_deleted, created_at, updated_at, address, contact, logo) FROM stdin;
cmol5fmjt0001d2utc6jge2ug	National University	f	2026-04-30 07:15:03.017	2026-04-30 07:15:03.017	551 M.F. Jhocson Street, Sampaloc, Manila, Philippines, 1008	(+63) 949 9999 999	https://d2i0afz2m2bklk.cloudfront.net/1777533302716-NU_shield.svg
cmol6n0p70002d2uti0z7egl1	Department of Health	f	2026-04-30 07:48:47.563	2026-04-30 07:48:47.563	San Lazaro Compound, Rizal Avenue, Santa Cruz, Manila, Philippines, 1003	(+63) 949 9999 999	https://d2i0afz2m2bklk.cloudfront.net/1777535326879-Department_of_Health_(DOH)_PHL.svg.png
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (permission_id, is_deleted, created_at, updated_at, resource_id, name, slug) FROM stdin;
cmqq2r5tm0002osy39qrze9qv	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5sy0001osy3ppnmbu1b	main:create	create
cmqq2r5tm0003osy3rsdzivyy	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5sy0001osy3ppnmbu1b	main:read	read
cmqq2r5tm0004osy3vv8sbgl7	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5sy0001osy3ppnmbu1b	main:update	update
cmqq2r5tm0005osy38tkev396	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5sy0001osy3ppnmbu1b	main:delete	delete
cmqq2r5tm0006osy36l3tqysh	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5sy0001osy3ppnmbu1b	main:deny	deny
cmqq2r5tm0007osy3q4is8030	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5sy0001osy3ppnmbu1b	main:export	export
cmqq2r5u20009osy3ma28n30s	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5u10008osy3q06g9nre	overview:create	create
cmqq2r5u2000aosy3pz3559vs	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5u10008osy3q06g9nre	overview:read	read
cmqq2r5u2000bosy3qk24zm63	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5u10008osy3q06g9nre	overview:update	update
cmqq2r5u2000cosy3vcfc0157	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5u10008osy3q06g9nre	overview:delete	delete
cmqq2r5u3000dosy3zeevqtp8	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5u10008osy3q06g9nre	overview:deny	deny
cmqq2r5u3000eosy3lq857xum	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	cmqq2r5u10008osy3q06g9nre	overview:export	export
cmqq2r5u6000gosy3eszcltpy	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u6000fosy32fqkyw85	monitoring:create	create
cmqq2r5u6000hosy3glepxnew	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u6000fosy32fqkyw85	monitoring:read	read
cmqq2r5u6000iosy3tkqpbc0d	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u6000fosy32fqkyw85	monitoring:update	update
cmqq2r5u6000josy3p4zf1yr0	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u6000fosy32fqkyw85	monitoring:delete	delete
cmqq2r5u6000kosy35kc7rqpu	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u6000fosy32fqkyw85	monitoring:deny	deny
cmqq2r5u6000losy3hpevnwhy	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u6000fosy32fqkyw85	monitoring:export	export
cmqq2r5u8000nosy340erq7ut	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u7000mosy3jj2277vo	map:create	create
cmqq2r5u8000oosy3xl39h9u3	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u7000mosy3jj2277vo	map:read	read
cmqq2r5u8000posy3ypd933a0	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u7000mosy3jj2277vo	map:update	update
cmqq2r5u8000qosy36n46hoar	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u7000mosy3jj2277vo	map:delete	delete
cmqq2r5u8000rosy320wfm9sb	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u7000mosy3jj2277vo	map:deny	deny
cmqq2r5u8000sosy33rg1isxk	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u7000mosy3jj2277vo	map:export	export
cmqq2r5ua000uosy3odmqijyv	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u9000tosy30cngxzgo	risk-zones:create	create
cmqq2r5ua000vosy3frn7ac7v	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u9000tosy30cngxzgo	risk-zones:read	read
cmqq2r5ua000wosy3cg60cf3l	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u9000tosy30cngxzgo	risk-zones:update	update
cmqq2r5ua000xosy34awfm7m2	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u9000tosy30cngxzgo	risk-zones:delete	delete
cmqq2r5ua000yosy3x4aar7ry	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u9000tosy30cngxzgo	risk-zones:deny	deny
cmqq2r5ua000zosy3ya6kkz5o	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	cmqq2r5u9000tosy30cngxzgo	risk-zones:export	export
cmqq2r5ub0011osy3ryj04n6v	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ub0010osy3binpput4	engagement:create	create
cmqq2r5ub0012osy3gyr7g8dg	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ub0010osy3binpput4	engagement:read	read
cmqq2r5ub0013osy3fit2nk1t	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ub0010osy3binpput4	engagement:update	update
cmqq2r5ub0014osy3fryl1lxl	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ub0010osy3binpput4	engagement:delete	delete
cmqq2r5ub0015osy31z2xxbnr	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ub0010osy3binpput4	engagement:deny	deny
cmqq2r5ub0016osy3ocvnintp	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ub0010osy3binpput4	engagement:export	export
cmqq2r5uc0018osy3xfuslloy	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5uc0017osy3rlva4aaa	educational-resources:create	create
cmqq2r5uc0019osy30dmv0jke	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5uc0017osy3rlva4aaa	educational-resources:read	read
cmqq2r5uc001aosy3fs2w8x19	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5uc0017osy3rlva4aaa	educational-resources:update	update
cmqq2r5uc001bosy37h7g4lcp	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5uc0017osy3rlva4aaa	educational-resources:delete	delete
cmqq2r5uc001cosy39vxqxapi	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5uc0017osy3rlva4aaa	educational-resources:deny	deny
cmqq2r5uc001dosy38ev8tw6o	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5uc0017osy3rlva4aaa	educational-resources:export	export
cmqq2r5ud001fosy37u42cpw4	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ud001eosy3zwgy0x6s	survey:create	create
cmqq2r5ud001gosy3gdmyo5mr	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ud001eosy3zwgy0x6s	survey:read	read
cmqq2r5ud001hosy3artbtmg0	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ud001eosy3zwgy0x6s	survey:update	update
cmqq2r5ud001iosy32ujmhcmm	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ud001eosy3zwgy0x6s	survey:delete	delete
cmqq2r5ud001josy33ufvcmsb	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ud001eosy3zwgy0x6s	survey:deny	deny
cmqq2r5ud001kosy39fk8kb2d	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	cmqq2r5ud001eosy3zwgy0x6s	survey:export	export
cmqq2r5ue001mosy3nwux39yf	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001losy3slwgwum1	insights:create	create
cmqq2r5ue001nosy30juzw6j2	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001losy3slwgwum1	insights:read	read
cmqq2r5ue001oosy376g4ukcb	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001losy3slwgwum1	insights:update	update
cmqq2r5ue001posy3ml522pqm	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001losy3slwgwum1	insights:delete	delete
cmqq2r5ue001qosy384aif7c1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001losy3slwgwum1	insights:deny	deny
cmqq2r5ue001rosy35e1vrflm	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001losy3slwgwum1	insights:export	export
cmqq2r5uf001tosy3nzlk5mgn	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001sosy390ed0pxc	trends-and-topics:create	create
cmqq2r5uf001uosy3zf9jd7i3	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001sosy390ed0pxc	trends-and-topics:read	read
cmqq2r5uf001vosy3fyt0ftgy	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001sosy390ed0pxc	trends-and-topics:update	update
cmqq2r5uf001wosy313w0am9v	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001sosy390ed0pxc	trends-and-topics:delete	delete
cmqq2r5uf001xosy3v172deco	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001sosy390ed0pxc	trends-and-topics:deny	deny
cmqq2r5uf001yosy33d2fuw5i	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ue001sosy390ed0pxc	trends-and-topics:export	export
cmqq2r5ug0020osy3nwmyqu2s	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug001zosy30tacjct4	sentiment-analysis:create	create
cmqq2r5ug0021osy3b5ud1cem	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug001zosy30tacjct4	sentiment-analysis:read	read
cmqq2r5ug0022osy3k0u9htht	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug001zosy30tacjct4	sentiment-analysis:update	update
cmqq2r5ug0023osy3cakgq4dc	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug001zosy30tacjct4	sentiment-analysis:delete	delete
cmqq2r5ug0024osy3z5xxxrd4	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug001zosy30tacjct4	sentiment-analysis:deny	deny
cmqq2r5ug0025osy3zqwa014x	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug001zosy30tacjct4	sentiment-analysis:export	export
cmqq2r5uh0027osy3jqlnewq3	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug0026osy3q82tabtc	predictions:create	create
cmqq2r5uh0028osy3bpjlcra6	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug0026osy3q82tabtc	predictions:read	read
cmqq2r5uh0029osy3b1p05tyc	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug0026osy3q82tabtc	predictions:update	update
cmqq2r5uh002aosy3lwk7wgdk	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug0026osy3q82tabtc	predictions:delete	delete
cmqq2r5uh002bosy3an3m79mq	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug0026osy3q82tabtc	predictions:deny	deny
cmqq2r5uh002cosy3nj7mukdv	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ug0026osy3q82tabtc	predictions:export	export
cmqq2r5ui002eosy3qyx1mb3w	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5uh002dosy3nkd8kmzq	demographics:create	create
cmqq2r5ui002fosy3rtin7h52	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5uh002dosy3nkd8kmzq	demographics:read	read
cmqq2r5ui002gosy312inp9w3	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5uh002dosy3nkd8kmzq	demographics:update	update
cmqq2r5ui002hosy3u9kibgrp	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5uh002dosy3nkd8kmzq	demographics:delete	delete
cmqq2r5ui002iosy3r3b38qie	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5uh002dosy3nkd8kmzq	demographics:deny	deny
cmqq2r5ui002josy3zbxuptpy	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5uh002dosy3nkd8kmzq	demographics:export	export
cmqq2r5ui002losy3s3uqbmiv	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ui002kosy3n82ob25f	generate-reports:create	create
cmqq2r5ui002mosy31hg5hc2b	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ui002kosy3n82ob25f	generate-reports:read	read
cmqq2r5ui002nosy3fki6pyfp	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ui002kosy3n82ob25f	generate-reports:update	update
cmqq2r5ui002oosy3agegbs73	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ui002kosy3n82ob25f	generate-reports:delete	delete
cmqq2r5ui002posy3gkyhrvk5	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ui002kosy3n82ob25f	generate-reports:deny	deny
cmqq2r5ui002qosy35kfr488e	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	cmqq2r5ui002kosy3n82ob25f	generate-reports:export	export
cmqq2r5uj002sosy33oacow19	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uj002rosy3euzvmaq0	system-maintenance:create	create
cmqq2r5uj002tosy3x2fixddr	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uj002rosy3euzvmaq0	system-maintenance:read	read
cmqq2r5uj002uosy3jse72xuo	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uj002rosy3euzvmaq0	system-maintenance:update	update
cmqq2r5uj002vosy3hxuy908i	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uj002rosy3euzvmaq0	system-maintenance:delete	delete
cmqq2r5uj002wosy3ovuz1u53	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uj002rosy3euzvmaq0	system-maintenance:deny	deny
cmqq2r5uj002xosy3t35k1aut	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uj002rosy3euzvmaq0	system-maintenance:export	export
cmqq2r5uk002zosy3fvl1ml7v	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk002yosy35ll2x1z6	user-management:create	create
cmqq2r5uk0030osy3mbuxsp0t	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk002yosy35ll2x1z6	user-management:read	read
cmqq2r5uk0031osy3wv6douux	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk002yosy35ll2x1z6	user-management:update	update
cmqq2r5uk0032osy3c7lboxy9	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk002yosy35ll2x1z6	user-management:delete	delete
cmqq2r5uk0033osy3r6f7iicb	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk002yosy35ll2x1z6	user-management:deny	deny
cmqq2r5uk0034osy3tkjd8kum	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk002yosy35ll2x1z6	user-management:export	export
cmqq2r5ul0036osy3l5izd66t	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk0035osy3z00ljlz6	organization-management:create	create
cmqq2r5ul0037osy3yb5is1cw	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk0035osy3z00ljlz6	organization-management:read	read
cmqq2r5ul0038osy32bi1xkpn	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk0035osy3z00ljlz6	organization-management:update	update
cmqq2r5ul0039osy3pbvdhzvy	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk0035osy3z00ljlz6	organization-management:delete	delete
cmqq2r5ul003aosy3fio22ef1	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk0035osy3z00ljlz6	organization-management:deny	deny
cmqq2r5ul003bosy3foywoljk	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5uk0035osy3z00ljlz6	organization-management:export	export
cmqq2r5ul003dosy352i8msiv	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5ul003cosy36wej347r	resource-management:create	create
cmqq2r5ul003eosy3xdlnq7zi	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5ul003cosy36wej347r	resource-management:read	read
cmqq2r5ul003fosy3de8etrvj	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5ul003cosy36wej347r	resource-management:update	update
cmqq2r5um003gosy3iz76pbdz	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5ul003cosy36wej347r	resource-management:delete	delete
cmqq2r5um003hosy3074teopk	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5ul003cosy36wej347r	resource-management:deny	deny
cmqq2r5um003iosy3a1r40lha	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5ul003cosy36wej347r	resource-management:export	export
cmqq2r5um003kosy38kjluf6p	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5um003josy3fnzgzqy1	survey-management:create	create
cmqq2r5um003losy3g6gqjx6g	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5um003josy3fnzgzqy1	survey-management:read	read
cmqq2r5um003mosy3shtyezyq	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5um003josy3fnzgzqy1	survey-management:update	update
cmqq2r5um003nosy3zvyxb04l	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5um003josy3fnzgzqy1	survey-management:delete	delete
cmqq2r5um003oosy3le9hqeym	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5um003josy3fnzgzqy1	survey-management:deny	deny
cmqq2r5um003posy3ds2l2kgs	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5um003josy3fnzgzqy1	survey-management:export	export
cmqq2r5un003rosy3n1c096dx	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5un003qosy3dny41tub	roles-and-permissions:create	create
cmqq2r5un003sosy3ele385ih	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5un003qosy3dny41tub	roles-and-permissions:read	read
cmqq2r5un003tosy3vvkx6zq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5un003qosy3dny41tub	roles-and-permissions:update	update
cmqq2r5un003uosy3d0ltepdo	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5un003qosy3dny41tub	roles-and-permissions:delete	delete
cmqq2r5un003vosy38ty8c4pj	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5un003qosy3dny41tub	roles-and-permissions:deny	deny
cmqq2r5un003wosy31jiwizos	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	cmqq2r5un003qosy3dny41tub	roles-and-permissions:export	export
\.


--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profile" (profile_id, first_name, last_name, is_deleted, created_at, updated_at, user_id) FROM stdin;
cmqq5tmyv0043osy3cytmcb49	Joshua	Ramin	f	2026-06-23 04:44:12.282	2026-06-23 04:44:12.282	cmqq5tmyi0042osy3p41hgb36
\.


--
-- Data for Name: QuestionOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuestionOption" (question_option_id, survey_question_id, label, value, order_index, is_deleted, created_at, updated_at) FROM stdin;
cmrit9a5g0002owy3uyuperru	cmrit9a510001owy3qye4qsw5	Test	test	1	f	2026-07-13 05:57:46.261	2026-07-13 05:57:46.261
cmrit9a5g0003owy3ml4unxke	cmrit9a510001owy3qye4qsw5	Test 2	test_2	2	f	2026-07-13 05:57:46.261	2026-07-13 05:57:46.261
cmrit9a5g0004owy3dwdoqcm6	cmrit9a510001owy3qye4qsw5	addasdas	addasdas	3	f	2026-07-13 05:57:46.261	2026-07-13 05:57:46.261
cmritf4qo0001z1y3a0wzb07d	cmritf4qb0000z1y3g0ir0muj	Go love ur self	go_love_ur_self	1	f	2026-07-13 06:02:19.187	2026-07-13 06:02:19.187
cmritf4qo0002z1y3ncopgnf4	cmritf4qb0000z1y3g0ir0muj	tseasdsadasd	tseasdsadasd	2	f	2026-07-13 06:02:19.187	2026-07-13 06:02:19.187
\.


--
-- Data for Name: Resource; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Resource" (resource_id, name, slug, parent_id, is_deleted, created_at, updated_at, "order") FROM stdin;
cmqq2r5sy0001osy3ppnmbu1b	Main	main	\N	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	1
cmqq2r5u10008osy3q06g9nre	Overview	overview	cmqq2r5sy0001osy3ppnmbu1b	f	2026-06-23 03:18:17.89	2026-06-23 03:18:17.89	1
cmqq2r5u6000fosy32fqkyw85	Monitoring	monitoring	\N	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	2
cmqq2r5u7000mosy3jj2277vo	Map	map	cmqq2r5u6000fosy32fqkyw85	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	1
cmqq2r5u9000tosy30cngxzgo	Risk Zones	risk-zones	cmqq2r5u6000fosy32fqkyw85	f	2026-06-23 03:18:17.934	2026-06-23 03:18:17.934	2
cmqq2r5ub0010osy3binpput4	Engagement	engagement	\N	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	4
cmqq2r5uc0017osy3rlva4aaa	Educational Resources	educational-resources	cmqq2r5ub0010osy3binpput4	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	1
cmqq2r5ud001eosy3zwgy0x6s	Survey	survey	cmqq2r5ub0010osy3binpput4	f	2026-06-23 03:18:17.939	2026-06-23 03:18:17.939	2
cmqq2r5ue001losy3slwgwum1	Insights	insights	\N	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	3
cmqq2r5ug001zosy30tacjct4	Sentiment Analysis	sentiment-analysis	cmqq2r5ue001losy3slwgwum1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	2
cmqq2r5ug0026osy3q82tabtc	Predictions	predictions	cmqq2r5ue001losy3slwgwum1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	3
cmqq2r5uh002dosy3nkd8kmzq	Demographics	demographics	cmqq2r5ue001losy3slwgwum1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	4
cmqq2r5ui002kosy3n82ob25f	Generate Reports	generate-reports	cmqq2r5ue001losy3slwgwum1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	5
cmqq2r5uj002rosy3euzvmaq0	System Maintenance	system-maintenance	\N	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	5
cmqq2r5uk002yosy35ll2x1z6	User Management	user-management	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	1
cmqq2r5uk0035osy3z00ljlz6	Organization Management	organization-management	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	2
cmqq2r5ul003cosy36wej347r	Resource Management	resource-management	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	3
cmqq2r5um003josy3fnzgzqy1	Survey Management	survey-management	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	4
cmqq2r5un003qosy3dny41tub	Roles and Permissions	roles-and-permissions	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	5
cmqq2r5ue001sosy390ed0pxc	Trends and Analytics	trends-and-analytics	cmqq2r5ue001losy3slwgwum1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	1
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (role_id, name, description, is_deleted, created_at, updated_at, slug) FROM stdin;
cmqq6hvp3002kedy3vxzotiun	Researcher	Analyzes datasets, generates reports, and conducts structured investigations using system tools. Focuses on interpreting surveillance data, risk indicators, and analytical outputs. Produces insights to support decision-making.	f	2026-06-23 05:03:03.351	2026-06-23 05:03:03.351	researcher
cmqq6inap002ledy3dp4fy667	Developer	Responsible for system development, maintenance, integrations, and technical enhancements. Handles APIs, infrastructure, debugging, and performance optimization. Ensures the platform remains scalable, secure, and stable.	f	2026-06-23 05:03:39.121	2026-06-23 05:03:39.121	developer
cmqq6j0h0002medy3azmkz1uj	Institution Agencies	Represents academic institutions, research centers, and healthcare institutions. Accesses approved datasets, analytics, and reports for research and institutional use. Primarily focused on education, scientific studies, and collaborative research.	f	2026-06-23 05:03:56.197	2026-06-23 05:03:56.197	institution-agencies
cmqq6jacc002nedy3nemgrb9w	Government Agencies	Represents national and local government entities such as LGUs, departments, and law enforcement bodies. Accesses jurisdiction-based dashboards, risk reports, and intelligence summaries. Supports governance, policy-making, and public safety operations.	f	2026-06-23 05:04:08.989	2026-06-23 05:04:08.989	government-agencies
cmqq6kc18002oedy34zqwpr8k	NGO Agencies	Represents non-government and civil society organizations involved in humanitarian, development, and community programs. Accesses aggregated reports and approved insights relevant to social impact initiatives. Focused on welfare, outreach, and advocacy work.	f	2026-06-23 05:04:57.836	2026-06-23 05:04:57.836	ngo-agencies
cmqq5lun2003yosy3elss5zqj	Super Administrator	Has unrestricted access to all system modules, configurations, databases, user accounts, and security controls. Responsible for system governance, role management, audit monitoring, and overall platform administration. 	f	2026-06-23 04:38:08.99	2026-06-23 04:38:08.99	super-administrator
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" (role_permission_id, role_id, permission_id) FROM stdin;
cmqq64m990001edy30tucsp3e	cmqq5lun2003yosy3elss5zqj	cmqq2r5u20009osy3ma28n30s
cmqq64m990002edy3pixqecj6	cmqq5lun2003yosy3elss5zqj	cmqq2r5u2000aosy3pz3559vs
cmqq64m990003edy3qm2k57cj	cmqq5lun2003yosy3elss5zqj	cmqq2r5u2000bosy3qk24zm63
cmqq64m990004edy398spchvm	cmqq5lun2003yosy3elss5zqj	cmqq2r5u2000cosy3vcfc0157
cmqq64m990005edy3290q20v2	cmqq5lun2003yosy3elss5zqj	cmqq2r5u3000dosy3zeevqtp8
cmqq64m990006edy3593tllqk	cmqq5lun2003yosy3elss5zqj	cmqq2r5u3000eosy3lq857xum
cmqq64m990007edy3e639idjt	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000nosy340erq7ut
cmqq64m990008edy3eik3xm8s	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000oosy3xl39h9u3
cmqq64m990009edy3vgv6j726	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000posy3ypd933a0
cmqq64m99000aedy387mgg0lh	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000qosy36n46hoar
cmqq64m99000bedy3lh555iqz	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000rosy320wfm9sb
cmqq64m99000cedy37vzz9k8w	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000sosy33rg1isxk
cmqq64m99000dedy3ls8pbaa3	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000uosy3odmqijyv
cmqq64m99000eedy3kqs5p6my	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000vosy3frn7ac7v
cmqq64m99000fedy3ur8cowqb	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000wosy3cg60cf3l
cmqq64m99000gedy3aadpuacg	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000xosy34awfm7m2
cmqq64m99000hedy37tirhytk	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000yosy3x4aar7ry
cmqq64m99000iedy3a1wem2pa	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000zosy3ya6kkz5o
cmqq64m99000jedy32k64jo41	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc0018osy3xfuslloy
cmqq64m99000kedy3yclam9e9	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc0019osy30dmv0jke
cmqq64m99000ledy31t3u8yuh	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001aosy3fs2w8x19
cmqq64m99000medy3cn5ubwkn	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001bosy37h7g4lcp
cmqq64m99000nedy3axo6unq7	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001cosy39vxqxapi
cmqq64m99000oedy35p37zlf3	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001dosy38ev8tw6o
cmqq64m99000pedy34rr3r1jv	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001fosy37u42cpw4
cmqq64m99000qedy33qd23vwi	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001gosy3gdmyo5mr
cmqq64m99000redy3m7fyzfb2	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001hosy3artbtmg0
cmqq64m99000sedy3w8p6bbxa	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001iosy32ujmhcmm
cmqq64m99000tedy3caldmqv6	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001josy33ufvcmsb
cmqq64m99000uedy3sn8ib1hw	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001kosy39fk8kb2d
cmqq64m99000vedy37ct3m1ia	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001tosy3nzlk5mgn
cmqq64m99000wedy317mfj7fm	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001uosy3zf9jd7i3
cmqq64m99000xedy3esqd4nlz	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001vosy3fyt0ftgy
cmqq64m99000yedy3ieuy05sf	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001wosy313w0am9v
cmqq64m99000zedy37lrq7v7l	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001xosy3v172deco
cmqq64m990010edy3wqfqz6z0	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001yosy33d2fuw5i
cmqq64m990011edy36qrfbtf2	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0020osy3nwmyqu2s
cmqq64m990012edy3lw3ed27g	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0021osy3b5ud1cem
cmqq64m990013edy3sewfh75a	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0022osy3k0u9htht
cmqq64m990014edy3qajjx41k	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0023osy3cakgq4dc
cmqq64m990015edy3puiepgxc	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0024osy3z5xxxrd4
cmqq64m990016edy3yndbavb8	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0025osy3zqwa014x
cmqq64m990017edy3gplowxyy	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh0027osy3jqlnewq3
cmqq64m990018edy3t0bn47ru	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh0028osy3bpjlcra6
cmqq64m990019edy3qychcr8l	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh0029osy3b1p05tyc
cmqq64m99001aedy3e2k4jpo9	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh002aosy3lwk7wgdk
cmqq64m99001bedy364aw14vg	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh002bosy3an3m79mq
cmqq64m99001cedy3iofhx0rg	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh002cosy3nj7mukdv
cmqq64m99001dedy3p7hl5uxp	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002eosy3qyx1mb3w
cmqq64m99001eedy3zgjxa4dy	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002fosy3rtin7h52
cmqq64m99001fedy3yg4jqq4c	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002gosy312inp9w3
cmqq64m99001gedy3zrz21iqu	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002hosy3u9kibgrp
cmqq64m99001hedy3q6fztrt5	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002iosy3r3b38qie
cmqq64m99001iedy3wmkdphc4	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002josy3zbxuptpy
cmqq64m99001jedy3bbkh5v53	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002losy3s3uqbmiv
cmqq64m99001kedy3eyj8laad	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002mosy31hg5hc2b
cmqq64m99001ledy3oocluzcd	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002nosy3fki6pyfp
cmqq64m99001medy3w967648v	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002oosy3agegbs73
cmqq64m99001nedy3ruv4u7lq	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002posy3gkyhrvk5
cmqq64m99001oedy3acgavo1q	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002qosy35kfr488e
cmqq64m99001pedy3jigyb2sq	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk002zosy3fvl1ml7v
cmqq64m99001qedy308k1lc7e	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0030osy3mbuxsp0t
cmqq64m99001redy3aev78p46	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0031osy3wv6douux
cmqq64m99001sedy3h4u2j8qr	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0032osy3c7lboxy9
cmqq64m9a001tedy31ho1wye6	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0033osy3r6f7iicb
cmqq64m9a001uedy3ah1i5ewe	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0034osy3tkjd8kum
cmqq64m9a001vedy3pbu38ctr	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0036osy3l5izd66t
cmqq64m9a001wedy3lm6cx4ei	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0037osy3yb5is1cw
cmqq64m9a001xedy3zf29ntd8	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0038osy32bi1xkpn
cmqq64m9a001yedy3ibg8o9ka	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0039osy3pbvdhzvy
cmqq64m9a001zedy3wd2p32lv	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003aosy3fio22ef1
cmqq64m9a0020edy3s0b2z0te	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003bosy3foywoljk
cmqq64m9a0021edy3q3weurs4	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003dosy352i8msiv
cmqq64m9a0022edy3630cy5oi	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003eosy3xdlnq7zi
cmqq64m9a0023edy36qy521d0	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003fosy3de8etrvj
cmqq64m9a0024edy390mx9ruo	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003gosy3iz76pbdz
cmqq64m9a0025edy3heecrv3l	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003hosy3074teopk
cmqq64m9a0026edy39x3qgq7h	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003iosy3a1r40lha
cmqq64m9a0027edy3cvxcim3y	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003kosy38kjluf6p
cmqq64m9a0028edy3557lcure	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003losy3g6gqjx6g
cmqq64m9a0029edy35xev1d1w	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003mosy3shtyezyq
cmqq64m9a002aedy3kvpn3mq9	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003nosy3zvyxb04l
cmqq64m9a002bedy3rx86lnhr	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003oosy3le9hqeym
cmqq64m9a002cedy3gyrs0h9y	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003posy3ds2l2kgs
cmqq64m9a002dedy3vvsx6gmt	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003rosy3n1c096dx
cmqq64m9a002eedy3e5i7go39	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003sosy3ele385ih
cmqq64m9a002fedy31m5l27x0	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003tosy3vvkx6zq0
cmqq64m9a002gedy3c98hgy75	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003uosy3d0ltepdo
cmqq64m9a002hedy30b8hqzd3	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003vosy38ty8c4pj
cmqq64m9a002iedy310mgmxvi	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003wosy31jiwizos
\.


--
-- Data for Name: Survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Survey" (survey_id, title, description, is_deleted, created_at, updated_at, slug, is_published) FROM stdin;
cmripy8eq0000c9y31vpvy7as	Customer Survrey Satisfactory	We value your feedback. Please answer the following questions.	f	2026-07-13 04:25:11.954	2026-07-13 04:25:11.954	customer-survrey-satisfactory	f
cmrisosi80000woy31u1ke310	Event Feedback Survey	We appreciate your feedback regarding today's event.	f	2026-07-13 05:41:50.288	2026-07-13 05:41:50.288	event-feedback-survey	f
\.


--
-- Data for Name: SurveyAnswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SurveyAnswer" (answer_id, survey_response_id, survey_question_id, answer_text, answer_option_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SurveyAnswerOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SurveyAnswerOption" (survey_answer_option_id, survey_answer_id, question_option_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: SurveyQuestion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SurveyQuestion" (survey_question_id, survey_id, text, type, is_required, order_index, is_deleted, created_at, updated_at) FROM stdin;
cmrit9a500000owy39pq85rqd	cmripy8eq0000c9y31vpvy7as	asdadsa	SHORT_TEXT	t	1	f	2026-07-13 05:57:46.26	2026-07-13 05:57:46.26
cmrit9a510001owy3qye4qsw5	cmripy8eq0000c9y31vpvy7as	asdasdasd	MULTIPLE_CHOICE	f	2	f	2026-07-13 05:57:46.261	2026-07-13 05:57:46.261
cmritf4qb0000z1y3g0ir0muj	cmripy8eq0000c9y31vpvy7as	asdasdsadsda	MULTIPLE_CHOICE	t	1	f	2026-07-13 06:02:19.187	2026-07-13 06:02:19.187
\.


--
-- Data for Name: SurveyResponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SurveyResponse" (response_id, survey_id, created_at) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (user_id, email, is_deleted, created_at, updated_at, role_id, organization_id) FROM stdin;
cmqq5tmyi0042osy3p41hgb36	raminjoshua05@gmail.com	f	2026-06-23 04:44:12.282	2026-06-23 04:44:12.282	cmqq5lun2003yosy3elss5zqj	cmol5fmjt0001d2utc6jge2ug
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
35486e10-79cc-4fc9-a9a4-76eeaf75f6a2	ade43cc5bd69ece4af5ac81a6f27abf1639b22ea7fd19ffb219d5930cee2043c	2026-06-23 03:11:52.44846+00	20260225040944_init_db	\N	\N	2026-06-23 03:11:52.40576+00	1
e47088cc-f4fe-4882-a8d0-7adc867cd860	157533d583b41002230cf97ae9a3f80484cce194215f23b080a7d7ab0028a6e1	2026-06-23 03:11:52.471558+00	20260327064048_init_db	\N	\N	2026-06-23 03:11:52.448952+00	1
76bde5f7-b628-4b58-bba0-d29e6156cf00	71faf0b903b99dc429063c818e25c52f86c5f4bc0f7586ec22f3c2dabb23a909	2026-06-23 03:11:52.477825+00	20260421011823_system_db	\N	\N	2026-06-23 03:11:52.471987+00	1
1dfed434-916e-43c8-a7ab-0f49843c7d26	738fbdc44c0a3f927fad6d328c9e263ca720e0fdb1ded837c3630a674f47f962	2026-06-23 03:11:52.485332+00	20260622043404_system_db	\N	\N	2026-06-23 03:11:52.478314+00	1
ef519ac8-17ae-43e9-a501-f002ddee42d5	ade43cc5bd69ece4af5ac81a6f27abf1639b22ea7fd19ffb219d5930cee2043c	2026-04-21 01:18:23.295204+00	20260225040944_init_db	\N	\N	2026-04-21 01:18:23.248708+00	1
e75926ec-9e16-4ed2-8d28-4884f8531a5d	157533d583b41002230cf97ae9a3f80484cce194215f23b080a7d7ab0028a6e1	2026-04-21 01:18:23.321656+00	20260327064048_init_db	\N	\N	2026-04-21 01:18:23.295734+00	1
9dd790fa-4f00-4029-b1d0-2531e11b0021	71faf0b903b99dc429063c818e25c52f86c5f4bc0f7586ec22f3c2dabb23a909	2026-04-21 01:18:23.612618+00	20260421011823_system_db	\N	\N	2026-04-21 01:18:23.604257+00	1
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: geocode_settings; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.geocode_settings (name, setting, unit, category, short_desc) FROM stdin;
\.


--
-- Data for Name: pagc_gaz; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_gaz (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_lex; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_lex (id, seq, word, stdword, token, is_custom) FROM stdin;
\.


--
-- Data for Name: pagc_rules; Type: TABLE DATA; Schema: tiger; Owner: postgres
--

COPY tiger.pagc_rules (id, rule, is_custom) FROM stdin;
\.


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (activity_logs_id);


--
-- Name: DeviceSession DeviceSession_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeviceSession"
    ADD CONSTRAINT "DeviceSession_pkey" PRIMARY KEY (device_sessions_id);


--
-- Name: EducationAttachment EducationAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationAttachment"
    ADD CONSTRAINT "EducationAttachment_pkey" PRIMARY KEY (education_attachment_id);


--
-- Name: EducationCategory EducationCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationCategory"
    ADD CONSTRAINT "EducationCategory_pkey" PRIMARY KEY (education_category_id);


--
-- Name: EducationResourceTag EducationResourceTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationResourceTag"
    ADD CONSTRAINT "EducationResourceTag_pkey" PRIMARY KEY (education_resource_id, education_tag_id);


--
-- Name: EducationResource EducationResource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationResource"
    ADD CONSTRAINT "EducationResource_pkey" PRIMARY KEY (education_resource_id);


--
-- Name: EducationTag EducationTag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationTag"
    ADD CONSTRAINT "EducationTag_pkey" PRIMARY KEY (education_tag_id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (notification_id);


--
-- Name: OTP OTP_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OTP"
    ADD CONSTRAINT "OTP_pkey" PRIMARY KEY (otp_id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (organization_id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (permission_id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (profile_id);


--
-- Name: QuestionOption QuestionOption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionOption"
    ADD CONSTRAINT "QuestionOption_pkey" PRIMARY KEY (question_option_id);


--
-- Name: Resource Resource_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_pkey" PRIMARY KEY (resource_id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY (role_permission_id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (role_id);


--
-- Name: SurveyAnswerOption SurveyAnswerOption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswerOption"
    ADD CONSTRAINT "SurveyAnswerOption_pkey" PRIMARY KEY (survey_answer_option_id);


--
-- Name: SurveyAnswer SurveyAnswer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswer"
    ADD CONSTRAINT "SurveyAnswer_pkey" PRIMARY KEY (answer_id);


--
-- Name: SurveyQuestion SurveyQuestion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyQuestion"
    ADD CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY (survey_question_id);


--
-- Name: SurveyResponse SurveyResponse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyResponse"
    ADD CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY (response_id);


--
-- Name: Survey Survey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Survey"
    ADD CONSTRAINT "Survey_pkey" PRIMARY KEY (survey_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (user_id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: EducationAttachment_education_resource_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationAttachment_education_resource_id_idx" ON public."EducationAttachment" USING btree (education_resource_id);


--
-- Name: EducationCategory_is_deleted_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationCategory_is_deleted_idx" ON public."EducationCategory" USING btree (is_deleted);


--
-- Name: EducationCategory_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EducationCategory_name_key" ON public."EducationCategory" USING btree (name);


--
-- Name: EducationCategory_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationCategory_parent_id_idx" ON public."EducationCategory" USING btree (parent_id);


--
-- Name: EducationCategory_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EducationCategory_slug_key" ON public."EducationCategory" USING btree (slug);


--
-- Name: EducationResource_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_category_id_idx" ON public."EducationResource" USING btree (category_id);


--
-- Name: EducationResource_published_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_published_at_idx" ON public."EducationResource" USING btree (published_at);


--
-- Name: EducationResource_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_slug_idx" ON public."EducationResource" USING btree (slug);


--
-- Name: EducationResource_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EducationResource_slug_key" ON public."EducationResource" USING btree (slug);


--
-- Name: EducationResource_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_status_idx" ON public."EducationResource" USING btree (status);


--
-- Name: EducationResource_title_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_title_idx" ON public."EducationResource" USING btree (title);


--
-- Name: EducationResource_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_type_idx" ON public."EducationResource" USING btree (type);


--
-- Name: EducationResource_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationResource_user_id_idx" ON public."EducationResource" USING btree (user_id);


--
-- Name: EducationTag_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "EducationTag_name_idx" ON public."EducationTag" USING btree (name);


--
-- Name: EducationTag_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EducationTag_name_key" ON public."EducationTag" USING btree (name);


--
-- Name: EducationTag_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "EducationTag_slug_key" ON public."EducationTag" USING btree (slug);


--
-- Name: OTP_expires_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OTP_expires_at_idx" ON public."OTP" USING btree (expires_at);


--
-- Name: OTP_identifier_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "OTP_identifier_type_idx" ON public."OTP" USING btree (identifier, type);


--
-- Name: Permission_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_created_at_idx" ON public."Permission" USING btree (created_at);


--
-- Name: Permission_is_deleted_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_is_deleted_idx" ON public."Permission" USING btree (is_deleted);


--
-- Name: Profile_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Profile_user_id_key" ON public."Profile" USING btree (user_id);


--
-- Name: QuestionOption_survey_question_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuestionOption_survey_question_id_idx" ON public."QuestionOption" USING btree (survey_question_id);


--
-- Name: Resource_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Resource_created_at_idx" ON public."Resource" USING btree (created_at);


--
-- Name: Resource_is_deleted_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Resource_is_deleted_idx" ON public."Resource" USING btree (is_deleted);


--
-- Name: Resource_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Resource_name_key" ON public."Resource" USING btree (name);


--
-- Name: Resource_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Resource_slug_key" ON public."Resource" USING btree (slug);


--
-- Name: RolePermission_permission_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_permission_id_idx" ON public."RolePermission" USING btree (permission_id);


--
-- Name: RolePermission_role_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_role_id_idx" ON public."RolePermission" USING btree (role_id);


--
-- Name: RolePermission_role_id_permission_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RolePermission_role_id_permission_id_key" ON public."RolePermission" USING btree (role_id, permission_id);


--
-- Name: Role_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Role_created_at_idx" ON public."Role" USING btree (created_at);


--
-- Name: Role_is_deleted_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Role_is_deleted_idx" ON public."Role" USING btree (is_deleted);


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Role_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_slug_key" ON public."Role" USING btree (slug);


--
-- Name: SurveyAnswerOption_question_option_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyAnswerOption_question_option_id_idx" ON public."SurveyAnswerOption" USING btree (question_option_id);


--
-- Name: SurveyAnswerOption_survey_answer_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyAnswerOption_survey_answer_id_idx" ON public."SurveyAnswerOption" USING btree (survey_answer_id);


--
-- Name: SurveyAnswerOption_survey_answer_id_question_option_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "SurveyAnswerOption_survey_answer_id_question_option_id_key" ON public."SurveyAnswerOption" USING btree (survey_answer_id, question_option_id);


--
-- Name: SurveyAnswer_answer_option_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyAnswer_answer_option_id_idx" ON public."SurveyAnswer" USING btree (answer_option_id);


--
-- Name: SurveyAnswer_survey_question_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyAnswer_survey_question_id_idx" ON public."SurveyAnswer" USING btree (survey_question_id);


--
-- Name: SurveyAnswer_survey_response_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyAnswer_survey_response_id_idx" ON public."SurveyAnswer" USING btree (survey_response_id);


--
-- Name: SurveyQuestion_survey_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyQuestion_survey_id_idx" ON public."SurveyQuestion" USING btree (survey_id);


--
-- Name: SurveyResponse_survey_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "SurveyResponse_survey_id_idx" ON public."SurveyResponse" USING btree (survey_id);


--
-- Name: Survey_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Survey_slug_key" ON public."Survey" USING btree (slug);


--
-- Name: User_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_created_at_idx" ON public."User" USING btree (created_at);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_is_deleted_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_is_deleted_idx" ON public."User" USING btree (is_deleted);


--
-- Name: User_role_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_role_id_idx" ON public."User" USING btree (role_id);


--
-- Name: ActivityLog ActivityLog_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DeviceSession DeviceSession_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeviceSession"
    ADD CONSTRAINT "DeviceSession_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EducationAttachment EducationAttachment_education_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationAttachment"
    ADD CONSTRAINT "EducationAttachment_education_resource_id_fkey" FOREIGN KEY (education_resource_id) REFERENCES public."EducationResource"(education_resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EducationCategory EducationCategory_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationCategory"
    ADD CONSTRAINT "EducationCategory_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."EducationCategory"(education_category_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: EducationResourceTag EducationResourceTag_education_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationResourceTag"
    ADD CONSTRAINT "EducationResourceTag_education_resource_id_fkey" FOREIGN KEY (education_resource_id) REFERENCES public."EducationResource"(education_resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EducationResourceTag EducationResourceTag_education_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationResourceTag"
    ADD CONSTRAINT "EducationResourceTag_education_tag_id_fkey" FOREIGN KEY (education_tag_id) REFERENCES public."EducationTag"(education_tag_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: EducationResource EducationResource_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationResource"
    ADD CONSTRAINT "EducationResource_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public."EducationCategory"(education_category_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: EducationResource EducationResource_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."EducationResource"
    ADD CONSTRAINT "EducationResource_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: OTP OTP_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OTP"
    ADD CONSTRAINT "OTP_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Permission Permission_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_resource_id_fkey" FOREIGN KEY (resource_id) REFERENCES public."Resource"(resource_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Profile Profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Profile"
    ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: QuestionOption QuestionOption_survey_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuestionOption"
    ADD CONSTRAINT "QuestionOption_survey_question_id_fkey" FOREIGN KEY (survey_question_id) REFERENCES public."SurveyQuestion"(survey_question_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Resource Resource_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Resource"
    ADD CONSTRAINT "Resource_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public."Resource"(resource_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RolePermission RolePermission_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES public."Permission"(permission_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Role"(role_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SurveyAnswerOption SurveyAnswerOption_question_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswerOption"
    ADD CONSTRAINT "SurveyAnswerOption_question_option_id_fkey" FOREIGN KEY (question_option_id) REFERENCES public."QuestionOption"(question_option_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SurveyAnswerOption SurveyAnswerOption_survey_answer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswerOption"
    ADD CONSTRAINT "SurveyAnswerOption_survey_answer_id_fkey" FOREIGN KEY (survey_answer_id) REFERENCES public."SurveyAnswer"(answer_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SurveyAnswer SurveyAnswer_answer_option_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswer"
    ADD CONSTRAINT "SurveyAnswer_answer_option_id_fkey" FOREIGN KEY (answer_option_id) REFERENCES public."QuestionOption"(question_option_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SurveyAnswer SurveyAnswer_survey_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswer"
    ADD CONSTRAINT "SurveyAnswer_survey_question_id_fkey" FOREIGN KEY (survey_question_id) REFERENCES public."SurveyQuestion"(survey_question_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SurveyAnswer SurveyAnswer_survey_response_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyAnswer"
    ADD CONSTRAINT "SurveyAnswer_survey_response_id_fkey" FOREIGN KEY (survey_response_id) REFERENCES public."SurveyResponse"(response_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SurveyQuestion SurveyQuestion_survey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyQuestion"
    ADD CONSTRAINT "SurveyQuestion_survey_id_fkey" FOREIGN KEY (survey_id) REFERENCES public."Survey"(survey_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SurveyResponse SurveyResponse_survey_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SurveyResponse"
    ADD CONSTRAINT "SurveyResponse_survey_id_fkey" FOREIGN KEY (survey_id) REFERENCES public."Survey"(survey_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES public."Organization"(organization_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public."Role"(role_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

