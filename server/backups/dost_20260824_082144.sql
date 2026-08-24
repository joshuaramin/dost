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
    type public."EducationResourceType" NOT NULL,
    external_link text
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
    organization_id text,
    is_active boolean DEFAULT false NOT NULL
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
cmrsd67mu0000dxy3jf7jam7j	Macintosh	::1	2026-07-20 22:25:10.94	f	f	2026-07-19 22:25:10.95	2026-07-19 22:25:10.95	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmru0wmv80000z6y3xhfhyacr	Macintosh	::1	2026-07-22 02:17:21.079	f	f	2026-07-21 02:17:21.092	2026-07-21 02:17:21.092	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmrvf59zm00008by3fk4wwy39	Macintosh	::1	2026-07-23 01:43:45.096	f	f	2026-07-22 01:43:45.106	2026-07-22 01:43:45.106	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmrx3obew0000wby30j7xzp1i	Macintosh	::1	2026-07-24 05:58:10.367	f	f	2026-07-23 05:58:10.377	2026-07-23 05:58:10.377	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms3x687k0000vfy3o5d0wbse	Macintosh	::1	2026-07-29 00:30:31.941	f	f	2026-07-28 00:30:31.952	2026-07-28 00:30:31.952	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms5ft2fp0000oiy3ca6sgldm	Macintosh	::1	2026-07-30 01:59:56.803	f	f	2026-07-29 01:59:56.821	2026-07-29 01:59:56.821	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms5hpme20001oiy3mtcflnkr	Macintosh	::1	2026-07-30 02:53:15.286	f	f	2026-07-29 02:53:15.29	2026-07-29 02:53:15.29	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms8ai3hy0000qky3l52f8beg	Macintosh	::1	2026-08-01 01:54:45.418	f	f	2026-07-31 01:54:45.431	2026-07-31 01:54:45.431	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms8h3ts90000y2y3faodp3yj	Macintosh	::1	2026-08-01 04:59:36.959	f	f	2026-07-31 04:59:36.969	2026-07-31 04:59:36.969	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms8hdtln0000x2y32omyj68p	Macintosh	::1	2026-08-01 05:07:23.282	f	f	2026-07-31 05:07:23.291	2026-07-31 05:07:23.291	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms8hgli80001x2y3uh493o4f	Macintosh	::1	2026-08-01 05:09:32.764	f	f	2026-07-31 05:09:32.768	2026-07-31 05:09:32.768	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms8hk6670002x2y3yqqnj2b3	Macintosh	::1	2026-08-01 05:12:19.516	f	f	2026-07-31 05:12:19.519	2026-07-31 05:12:19.519	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cms8hqqhw0000uuy3gs8w6k9h	Macintosh	::1	2026-08-01 05:17:25.785	f	f	2026-07-31 05:17:25.796	2026-07-31 05:17:25.796	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36
cmscku2yt0000nay39zp17cph	Macintosh	::1	2026-08-04 01:55:05.46	f	f	2026-08-03 01:55:05.477	2026-08-03 01:55:05.477	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscmjygk0001nay36i2rvvy5	Macintosh	::1	2026-08-04 02:43:12.303	f	f	2026-08-03 02:43:12.308	2026-08-03 02:43:12.308	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscosmuv0000k8y3jm83z5e8	Macintosh	::1	2026-08-04 03:45:56.398	f	f	2026-08-03 03:45:56.407	2026-08-03 03:45:56.407	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscov5dm0003k8y39l3gev6i	Macintosh	::1	2026-08-04 03:47:53.717	f	f	2026-08-03 03:47:53.722	2026-08-03 03:47:53.722	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscoxv9j0004k8y30ycvvm0x	Macintosh	::1	2026-08-04 03:50:00.58	f	f	2026-08-03 03:50:00.583	2026-08-03 03:50:00.583	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscp0v730000pmy32pl3df7h	Unknown	::1	2026-08-04 03:52:20.452	f	f	2026-08-03 03:52:20.463	2026-08-03 03:52:20.463	cmqq5tmyi0042osy3p41hgb36	Unknown	Desktop	Unknown	PostmanRuntime/7.55.1
cmscp2yf90000eey3j8jskcgp	Unknown	::1	2026-08-04 03:53:57.945	f	f	2026-08-03 03:53:57.957	2026-08-03 03:53:57.957	cmqq5tmyi0042osy3p41hgb36	Unknown	Desktop	Unknown	PostmanRuntime/7.55.1
cmscp3yie0000qgy34zw00jbu	Unknown	::1	2026-08-04 03:54:44.715	f	f	2026-08-03 03:54:44.726	2026-08-03 03:54:44.726	cmscot51a0001k8y3urzdecyx	Unknown	Desktop	Unknown	PostmanRuntime/7.55.1
cmscp5ddi0000uay3x2iakhgq	Macintosh	::1	2026-08-04 03:55:50.635	f	f	2026-08-03 03:55:50.646	2026-08-03 03:55:50.646	cmscot51a0001k8y3urzdecyx	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscp9apq0001uay3d5wt0goe	Macintosh	::1	2026-08-04 03:58:53.815	f	f	2026-08-03 03:58:53.822	2026-08-03 03:58:53.822	cmscot51a0001k8y3urzdecyx	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscq8l2a0000ffy3jhzacpxi	Macintosh	::1	2026-08-04 04:26:20.183	f	f	2026-08-03 04:26:20.194	2026-08-03 04:26:20.194	cmscod7oo0007pfy3qxqgtp4u	Safari	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15
cmscqduym002pffy3s5fkbb75	Macintosh	::1	2026-08-04 04:30:26.298	f	f	2026-08-03 04:30:26.302	2026-08-03 04:30:26.302	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmscxas1r00314by3hqkixazr	Macintosh	::1	2026-08-04 07:43:59.865	f	f	2026-08-03 07:43:59.871	2026-08-03 07:43:59.871	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmse2cmh300002my3w8keda93	Macintosh	::1	2026-08-05 02:53:10.203	f	f	2026-08-04 02:53:10.215	2026-08-04 02:53:10.215	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmsievtz6000014y3r7b2tmzo	Macintosh	::1	2026-08-08 03:55:06.481	f	f	2026-08-07 03:55:06.498	2026-08-07 03:55:06.498	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmsiezs9z000114y3zmwl6mmv	Macintosh	::1	2026-08-08 03:58:10.91	f	f	2026-08-07 03:58:10.919	2026-08-07 03:58:10.919	cmscot51a0001k8y3urzdecyx	Safari	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15
cmsnx1jt30000oky3ng7zoyap	Macintosh	::1	2026-08-12 00:22:17.208	f	f	2026-08-11 00:22:17.223	2026-08-11 00:22:17.223	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmspesbl30000xiy3wikjiroy	Macintosh	::1	2026-08-13 01:26:45.914	f	f	2026-08-12 01:26:45.927	2026-08-12 01:26:45.927	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmsppbk7c0000lty3q8yzytim	Macintosh	::1	2026-08-13 06:21:39.7	f	f	2026-08-12 06:21:39.72	2026-08-12 06:21:39.72	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmsqwe8xl0000o1y34e5xnb5w	Macintosh	::1	2026-08-14 02:27:28.559	f	f	2026-08-13 02:27:28.569	2026-08-13 02:27:28.569	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmswljmie0000fky3nzy07eef	Macintosh	::1	2026-08-18 02:10:20.713	f	f	2026-08-17 02:10:20.726	2026-08-17 02:10:20.726	cmscot51a0001k8y3urzdecyx	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmswlmtne0001fky3fv5anuwe	Macintosh	::1	2026-08-18 02:12:49.942	f	f	2026-08-17 02:12:49.947	2026-08-17 02:12:49.947	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmt6hgixc0000fby3dl1hslk7	Macintosh	::1	2026-08-25 00:13:39.397	f	f	2026-08-24 00:13:39.408	2026-08-24 00:13:39.408	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
\.


--
-- Data for Name: EducationAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."EducationAttachment" (education_attachment_id, education_resource_id, type, file_name, file_url, mime_type, file_size, order_index, created_at) FROM stdin;
cms45t49n0001jby31gieb0x1	cms45t48x0000jby3nnzj3mvb	IMAGE	1.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136365-1.jpg	image/jpeg	64046	0	2026-07-28 04:32:16.833
cms45t49n0002jby3htczis4x	cms45t48x0000jby3nnzj3mvb	IMAGE	2.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136365-2.jpg	image/jpeg	55678	1	2026-07-28 04:32:16.833
cms45t49n0003jby3ckb7g2rn	cms45t48x0000jby3nnzj3mvb	IMAGE	3.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136378-3.jpg	image/jpeg	55803	2	2026-07-28 04:32:16.833
cms45t49n0004jby3puvikcr7	cms45t48x0000jby3nnzj3mvb	IMAGE	4.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136380-4.jpg	image/jpeg	55882	3	2026-07-28 04:32:16.833
cms45t49n0005jby3iptuh24o	cms45t48x0000jby3nnzj3mvb	IMAGE	5.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136381-5.jpg	image/jpeg	55753	4	2026-07-28 04:32:16.833
cms45t49n0006jby3cqx32qk7	cms45t48x0000jby3nnzj3mvb	IMAGE	6.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136382-6.jpg	image/jpeg	55997	5	2026-07-28 04:32:16.833
cms45t49n0007jby3d78omnjg	cms45t48x0000jby3nnzj3mvb	IMAGE	7.jpg	https://d2i0afz2m2bklk.cloudfront.net/1785213136383-7.jpg	image/jpeg	68664	6	2026-07-28 04:32:16.833
cmsplgxr50001icy3a3fxxvkp	cmsplgxqh0000icy3fh1qnn0g	IMAGE	1.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231343-1.jpg	image/jpeg	64046	0	2026-08-12 04:33:52.073
cmsplgxr50002icy3palo5ucl	cmsplgxqh0000icy3fh1qnn0g	IMAGE	2.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231345-2.jpg	image/jpeg	55678	1	2026-08-12 04:33:52.073
cmsplgxr50003icy3atj5wd2e	cmsplgxqh0000icy3fh1qnn0g	IMAGE	3.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231355-3.jpg	image/jpeg	55803	2	2026-08-12 04:33:52.073
cmsplgxr50004icy3qrquekic	cmsplgxqh0000icy3fh1qnn0g	IMAGE	4.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231358-4.jpg	image/jpeg	55882	3	2026-08-12 04:33:52.073
cmsplgxr50005icy3zndcjz3i	cmsplgxqh0000icy3fh1qnn0g	IMAGE	5.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231359-5.jpg	image/jpeg	55753	4	2026-08-12 04:33:52.073
cmsplgxr50006icy3oxmjunx9	cmsplgxqh0000icy3fh1qnn0g	IMAGE	6.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231360-6.jpg	image/jpeg	55997	5	2026-08-12 04:33:52.073
cmsplgxr50007icy3zrc1slgk	cmsplgxqh0000icy3fh1qnn0g	IMAGE	7.jpg	https://d2i0afz2m2bklk.cloudfront.net/1786509231361-7.jpg	image/jpeg	68664	6	2026-08-12 04:33:52.073
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

COPY public."EducationResource" (education_resource_id, title, content, is_deleted, created_at, updated_at, user_id, slug, category_id, is_featured, published_at, status, summary, thumbnail, type, external_link) FROM stdin;
cmsct84yh0000i2y31rlxwfjd	Policy Developments in HIV Prevention and Care: Strengthening Collaborative Public Health Action	<p><span style="white-space: pre-wrap;">As HIV continues to be a major public health concern, policy reforms remain essential in creating healthcare systems that are more accessible, inclusive, and responsive to the needs of vulnerable populations. Recent developments have highlighted the importance of integrating HIV services into primary healthcare, expanding community-based testing initiatives, and improving access to life-saving antiretroviral therapy (ART).</span></p><p><span style="white-space: pre-wrap;">Governments and public health organizations are increasingly adopting data-driven approaches to monitor HIV trends and identify communities that may require additional support. Advances in digital health technologies, surveillance systems, and research platforms have enabled faster collection and analysis of health information, allowing policymakers to make informed decisions based on real-time evidence.</span></p><p><span style="white-space: pre-wrap;">Another key policy direction focuses on reducing stigma and discrimination associated with HIV. Strengthening legal protections, promoting public education, and encouraging community engagement help create environments where individuals are more likely to seek testing, treatment, and ongoing care without fear of discrimination.</span></p><p><span style="white-space: pre-wrap;">Collaboration also plays a critical role in achieving national HIV prevention goals. Partnerships between government institutions, healthcare facilities, academic researchers, non-government organizations, and local communities support the development of evidence-based interventions that address both medical and social determinants of health.</span></p><p><span style="white-space: pre-wrap;">Research initiatives continue to explore innovative methods for understanding public awareness, misinformation, and behavioral trends related to HIV. These findings provide valuable insights that can guide future policies, educational campaigns, and resource allocation to areas where they are needed most.</span></p><p><span style="white-space: pre-wrap;">Why This Matters</span></p><p><span style="white-space: pre-wrap;">Policy improvements have a direct impact on the effectiveness of HIV prevention and care. Stronger policies can:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Increase access to HIV testing and treatment services.</span></li><li value="2"><span style="white-space: pre-wrap;">Improve early diagnosis and linkage to care.</span></li><li value="3"><span style="white-space: pre-wrap;">Reduce stigma and discrimination within communities.</span></li><li value="4"><span style="white-space: pre-wrap;">Support evidence-based decision-making through research and surveillance.</span></li><li value="5"><span style="white-space: pre-wrap;">Strengthen collaboration among healthcare providers, researchers, and policymakers.</span></li><li value="6"><span style="white-space: pre-wrap;">Improve long-term public health outcomes.</span></li></ul><p><br></p><p><b><strong style="white-space: pre-wrap;">Call to Action</strong></b></p><p><span style="white-space: pre-wrap;">Everyone has a role in strengthening HIV prevention efforts. Stay informed about current public health policies, support evidence-based initiatives, encourage regular HIV testing, and help combat misinformation by sharing accurate and reliable information. Through collaboration, research, and informed policymaking, communities can contribute to a healthier future and advance the goal of reducing the impact of HIV for everyone.</span></p>	f	2026-08-03 05:49:58.17	2026-08-03 07:16:48.068	cmqq5tmyi0042osy3p41hgb36	policy-developments-in-hiv-prevention-and-care-strengthening-collaborative-public-health-action	cmrob3spz00030ey3y24h0rkd	f	\N	PUBLISHED	Recent policy developments in HIV prevention and care emphasize expanding access to testing and treatment, strengthening public health surveillance, reducing stigma, and promoting evidence-based decision-making. These initiatives encourage collaboration among government agencies, healthcare providers, researchers, and communities to improve health outcomes and support more effective HIV response strategies.	https://d2i0afz2m2bklk.cloudfront.net/1785736197809-1.jpg	ARTICLE	undefined
cms8fuar200000ky3lhpm9fpg	Understanding AIDS: Causes, Prevention, Treatment, and Living with HIV	<p><span style="white-space: pre-wrap;">Understanding AIDS</span></p><p><span style="white-space: pre-wrap;">Acquired Immunodeficiency Syndrome (AIDS) is a condition that develops when Human Immunodeficiency Virus (HIV) severely damages the body's immune system. HIV attacks CD4 cells, also known as T-helper cells, which play an essential role in protecting the body against infections and certain cancers. Without proper treatment, HIV gradually weakens the immune system, making it difficult for the body to fight diseases.</span></p><p><span style="white-space: pre-wrap;">A person is diagnosed with AIDS when their immune system becomes severely compromised, typically when their CD4 cell count falls below 200 cells per cubic millimeter of blood or when they develop one or more opportunistic infections or cancers associated with advanced HIV infection.</span></p><p><span style="white-space: pre-wrap;">How HIV is Transmitted</span></p><p><span style="white-space: pre-wrap;">HIV can be transmitted through:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Unprotected vaginal or anal sexual contact with someone living with HIV who does not have a suppressed viral load.</span></li><li value="2"><span style="white-space: pre-wrap;">Sharing needles or syringes used for injecting drugs.</span></li><li value="3"><span style="white-space: pre-wrap;">Mother-to-child transmission during pregnancy, childbirth, or breastfeeding without appropriate medical intervention.</span></li><li value="4"><span style="white-space: pre-wrap;">Receiving contaminated blood products in places where blood screening is inadequate.</span></li></ul><p><span style="white-space: pre-wrap;">HIV is </span><b><strong style="white-space: pre-wrap;">not</strong></b><span style="white-space: pre-wrap;"> transmitted through:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Hugging or shaking hands.</span></li><li value="2"><span style="white-space: pre-wrap;">Sharing food or drinks.</span></li><li value="3"><span style="white-space: pre-wrap;">Mosquito or insect bites.</span></li><li value="4"><span style="white-space: pre-wrap;">Using public toilets or swimming pools.</span></li><li value="5"><span style="white-space: pre-wrap;">Casual social contact.</span></li></ul><p><span style="white-space: pre-wrap;">Understanding these facts helps reduce fear and stigma surrounding HIV.</span></p><p><span style="white-space: pre-wrap;">Signs and Symptoms</span></p><p><span style="white-space: pre-wrap;">During the early stages of HIV infection, some individuals experience flu-like symptoms such as:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Fever</span></li><li value="2"><span style="white-space: pre-wrap;">Sore throat</span></li><li value="3"><span style="white-space: pre-wrap;">Fatigue</span></li><li value="4"><span style="white-space: pre-wrap;">Swollen lymph nodes</span></li><li value="5"><span style="white-space: pre-wrap;">Skin rash</span></li><li value="6"><span style="white-space: pre-wrap;">Muscle aches</span></li></ul><p><span style="white-space: pre-wrap;">After this initial phase, HIV may remain without noticeable symptoms for many years while continuing to damage the immune system.</span></p><p><span style="white-space: pre-wrap;">When HIV progresses to AIDS, symptoms may include:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Persistent fever</span></li><li value="2"><span style="white-space: pre-wrap;">Rapid weight loss</span></li><li value="3"><span style="white-space: pre-wrap;">Chronic diarrhea</span></li><li value="4"><span style="white-space: pre-wrap;">Night sweats</span></li><li value="5"><span style="white-space: pre-wrap;">Severe fatigue</span></li><li value="6"><span style="white-space: pre-wrap;">Frequent infections</span></li><li value="7"><span style="white-space: pre-wrap;">Persistent cough</span></li><li value="8"><span style="white-space: pre-wrap;">Skin lesions</span></li><li value="9"><span style="white-space: pre-wrap;">Certain cancers such as Kaposi sarcoma</span></li></ul><p><span style="white-space: pre-wrap;">Diagnosis</span></p><p><span style="white-space: pre-wrap;">Healthcare providers diagnose HIV through laboratory testing, including rapid tests and blood tests that detect HIV antibodies, antigens, or viral genetic material.</span></p><p><span style="white-space: pre-wrap;">Regular HIV testing is recommended for individuals who may be at higher risk of exposure. Early diagnosis allows treatment to begin before significant damage occurs to the immune system.</span></p><p><span style="white-space: pre-wrap;">Treatment</span></p><p><span style="white-space: pre-wrap;">Although there is no cure for HIV, it can be effectively managed using </span><b><strong style="white-space: pre-wrap;">Antiretroviral Therapy (ART)</strong></b><span style="white-space: pre-wrap;">.</span></p><p><span style="white-space: pre-wrap;">ART works by reducing the amount of HIV in the body (viral load), allowing the immune system to recover and function normally.</span></p><p><span style="white-space: pre-wrap;">People who take ART consistently can:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Live long and healthy lives.</span></li><li value="2"><span style="white-space: pre-wrap;">Reduce the risk of developing AIDS.</span></li><li value="3"><span style="white-space: pre-wrap;">Greatly reduce the risk of transmitting HIV to others when they achieve and maintain an undetectable viral load ("Undetectable = Untransmittable" or U=U).</span></li></ul><p><span style="white-space: pre-wrap;">Treatment should always be taken exactly as prescribed by a healthcare provider.</span></p><p><span style="white-space: pre-wrap;">Prevention</span></p><p><span style="white-space: pre-wrap;">Several strategies can significantly reduce the risk of HIV infection:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Practice safer sex using condoms correctly and consistently.</span></li><li value="2"><span style="white-space: pre-wrap;">Consider Pre-Exposure Prophylaxis (PrEP) if at substantial risk of HIV exposure.</span></li><li value="3"><span style="white-space: pre-wrap;">Use Post-Exposure Prophylaxis (PEP) within 72 hours after a possible exposure.</span></li><li value="4"><span style="white-space: pre-wrap;">Never share needles or syringes.</span></li><li value="5"><span style="white-space: pre-wrap;">Get tested regularly for HIV and other sexually transmitted infections (STIs).</span></li><li value="6"><span style="white-space: pre-wrap;">Encourage partners to know their HIV status.</span></li><li value="7"><span style="white-space: pre-wrap;">Pregnant individuals living with HIV should receive appropriate medical care to reduce the risk of transmitting HIV to their baby.</span></li></ul><p><span style="white-space: pre-wrap;">Living with HIV</span></p><p><span style="white-space: pre-wrap;">Thanks to advances in medicine, HIV is now considered a manageable chronic condition rather than a fatal disease for people who receive appropriate treatment.</span></p><p><span style="white-space: pre-wrap;">Living well with HIV includes:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Taking medications consistently.</span></li><li value="2"><span style="white-space: pre-wrap;">Attending regular medical check-ups.</span></li><li value="3"><span style="white-space: pre-wrap;">Maintaining a healthy diet.</span></li><li value="4"><span style="white-space: pre-wrap;">Exercising regularly.</span></li><li value="5"><span style="white-space: pre-wrap;">Managing mental health.</span></li><li value="6"><span style="white-space: pre-wrap;">Seeking support from healthcare professionals, family, and community organizations.</span></li></ul><p><span style="white-space: pre-wrap;">People living with HIV deserve respect, dignity, and equal access to healthcare, education, employment, and social opportunities.</span></p><p><span style="white-space: pre-wrap;">Reducing Stigma</span></p><p><span style="white-space: pre-wrap;">Stigma and discrimination remain major barriers to HIV prevention and treatment. Misunderstanding about HIV often discourages people from getting tested or seeking medical care.</span></p><p><span style="white-space: pre-wrap;">Communities can help by:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Promoting accurate HIV education.</span></li><li value="2"><span style="white-space: pre-wrap;">Supporting people living with HIV.</span></li><li value="3"><span style="white-space: pre-wrap;">Encouraging regular testing.</span></li><li value="4"><span style="white-space: pre-wrap;">Challenging myths and discrimination.</span></li><li value="5"><span style="white-space: pre-wrap;">Creating inclusive healthcare and workplace environments.</span></li></ul><p><span style="white-space: pre-wrap;">Ending stigma is an essential part of ending the HIV epidemic.</span></p><p><span style="white-space: pre-wrap;">Key Takeaways</span></p><ul><li value="1"><span style="white-space: pre-wrap;">AIDS is the most advanced stage of HIV infection.</span></li><li value="2"><span style="white-space: pre-wrap;">HIV attacks the immune system but can be effectively managed with treatment.</span></li><li value="3"><span style="white-space: pre-wrap;">Early testing and immediate treatment improve health outcomes.</span></li><li value="4"><span style="white-space: pre-wrap;">HIV is preventable through safer practices, PrEP, PEP, and regular testing.</span></li><li value="5"><span style="white-space: pre-wrap;">People living with HIV can live long, healthy lives with proper medical care.</span></li><li value="6"><span style="white-space: pre-wrap;">Education, compassion, and reducing stigma are essential for improving public health.</span></li></ul>	f	2026-07-31 04:24:12.782	2026-08-03 07:16:53.698	cmqq5tmyi0042osy3p41hgb36	understanding-aids-causes-prevention-treatment-and-living-with-hiv	cmroauuqj0000lhy3a12v1tdm	f	\N	PUBLISHED	Acquired Immunodeficiency Syndrome (AIDS) is the most advanced stage of Human Immunodeficiency Virus (HIV) infection. While there is currently no cure for HIV, modern antiretroviral therapy (ART) enables people living with HIV to lead long, healthy lives and prevents transmission when the virus is durably suppressed. Early testing, consistent treatment, education, and reducing stigma are key to preventing AIDS and improving quality of life.	https://d2i0afz2m2bklk.cloudfront.net/1785471852430-1.jpg	ARTICLE	undefined
cms4bkizo0000spy3udd45im7	Building Healthier Communities Through AI-Powered Public Health Analytics		f	2026-07-28 07:13:33.732	2026-08-03 07:16:59.739	cmqq5tmyi0042osy3p41hgb36	building-healthier-communities-through-ai-powered-public-health-analytics	cmrob3i8r00020ey3t1g8ka0p	f	\N	PUBLISHED	This resource examines how AdvocAid PH leverages Artificial Intelligence, Natural Language Processing, and geospatial analytics to strengthen public health surveillance and health education in the Philippines. By transforming digital health information into actionable insights, the platform empowers researchers, healthcare providers, and policymakers to detect emerging trends, combat misinformation, and develop evidence-based strategies that improve community health outcomes.	https://d2i0afz2m2bklk.cloudfront.net/1785222813276-1.jpg	EXTERNAL_LINK	https://www.youtube.com/
cms454x190000umy3muir3jui	Understanding Digital Public Health: How Geospatial Artificial Intelligence is Transforming Disease Surveillance in the Philippines	<p><span style="white-space: pre-wrap;">Introduction</span></p><p><span style="white-space: pre-wrap;">The rapid advancement of digital technology has fundamentally changed how people communicate, access information, and express their thoughts. Every day, millions of individuals use social media platforms, online communities, news websites, and digital forums to discuss personal experiences, health concerns, public policies, and current events. These digital conversations generate an enormous amount of publicly available information that, when analyzed responsibly and ethically, can provide valuable insights into emerging public health issues.</span></p><p><span style="white-space: pre-wrap;">Traditional disease surveillance has long relied on hospital reports, laboratory testing, physician notifications, and government health records. While these systems remain essential, they often experience delays due to reporting procedures, data validation, and administrative processes. In fast-changing situations, these delays may limit the ability of healthcare organizations to respond quickly to developing health concerns.</span></p><p><span style="white-space: pre-wrap;">Artificial Intelligence (AI), Natural Language Processing (NLP), and Geographic Information Systems (GIS) have emerged as powerful technologies capable of complementing conventional surveillance methods. Together, these technologies enable researchers and public health professionals to analyze large volumes of publicly available textual data, identify health-related discussions, recognize emerging trends, and visualize geographic patterns that support evidence-based decision making.</span></p><p><span style="white-space: pre-wrap;">AdvocAid PH represents this new generation of digital public health platforms. By integrating multilingual natural language processing, geospatial analytics, and interactive visualization, the platform aims to assist researchers, healthcare institutions, government agencies, and policymakers in monitoring public discourse related to health while promoting informed and timely interventions.</span></p><p><span style="white-space: pre-wrap;">What is Digital Public Health?</span></p><p><span style="white-space: pre-wrap;">Digital Public Health refers to the application of modern digital technologies to improve health monitoring, disease prevention, healthcare delivery, and policy development. Unlike traditional approaches that depend solely on clinical records, digital public health leverages diverse sources of information such as:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Social media discussions</span></li><li value="2"><span style="white-space: pre-wrap;">Public news articles</span></li><li value="3"><span style="white-space: pre-wrap;">Online forums</span></li><li value="4"><span style="white-space: pre-wrap;">Government publications</span></li><li value="5"><span style="white-space: pre-wrap;">Health organization reports</span></li><li value="6"><span style="white-space: pre-wrap;">Educational resources</span></li><li value="7"><span style="white-space: pre-wrap;">Community announcements</span></li></ul><p><span style="white-space: pre-wrap;">These digital sources provide valuable context about public awareness, misinformation, health behaviors, community concerns, and emerging disease trends.</span></p><p><span style="white-space: pre-wrap;">Rather than replacing existing healthcare systems, digital public health serves as a complementary approach that enables earlier detection of population-level signals, allowing organizations to respond more effectively.</span></p><p><span style="white-space: pre-wrap;">The Growing Importance of Public Health Surveillance</span></p><p><span style="white-space: pre-wrap;">Public health surveillance is the continuous process of collecting, analyzing, interpreting, and disseminating health-related information to guide public health action.</span></p><p><span style="white-space: pre-wrap;">Effective surveillance enables health authorities to:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Detect disease outbreaks early</span></li><li value="2"><span style="white-space: pre-wrap;">Monitor disease prevalence</span></li><li value="3"><span style="white-space: pre-wrap;">Evaluate intervention effectiveness</span></li><li value="4"><span style="white-space: pre-wrap;">Identify vulnerable populations</span></li><li value="5"><span style="white-space: pre-wrap;">Allocate healthcare resources efficiently</span></li><li value="6"><span style="white-space: pre-wrap;">Improve emergency preparedness</span></li><li value="7"><span style="white-space: pre-wrap;">Support policy development</span></li></ul><p><span style="white-space: pre-wrap;">During recent global health emergencies, digital information proved to be an invaluable supplement to traditional surveillance systems. Individuals often share symptoms, concerns, experiences, and local observations online before official reports become available. When analyzed responsibly, these discussions can provide useful indicators of changing public health conditions.</span></p><p><span style="white-space: pre-wrap;">Artificial Intelligence in Public Health</span></p><p><span style="white-space: pre-wrap;">Artificial Intelligence has become one of the most influential technologies in healthcare. AI systems can process enormous datasets far more efficiently than manual analysis, allowing researchers to identify meaningful patterns hidden within large collections of information.</span></p><p><span style="white-space: pre-wrap;">Within public health, AI supports numerous applications, including:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Disease trend analysis</span></li><li value="2"><span style="white-space: pre-wrap;">Health risk prediction</span></li><li value="3"><span style="white-space: pre-wrap;">Automated document classification</span></li><li value="4"><span style="white-space: pre-wrap;">Medical image interpretation</span></li><li value="5"><span style="white-space: pre-wrap;">Predictive analytics</span></li><li value="6"><span style="white-space: pre-wrap;">Resource planning</span></li><li value="7"><span style="white-space: pre-wrap;">Decision support systems</span></li></ul><p><span style="white-space: pre-wrap;">Machine learning models continuously improve their performance by learning from historical data, enabling more accurate identification of relevant health information over time.</span></p><p><span style="white-space: pre-wrap;">Understanding Natural Language Processing (NLP)</span></p><p><span style="white-space: pre-wrap;">Natural Language Processing is a branch of Artificial Intelligence focused on enabling computers to understand, interpret, and analyze human language.</span></p><p><span style="white-space: pre-wrap;">Unlike structured databases, human language is highly variable. People use different spellings, abbreviations, slang, regional dialects, and emotional expressions when discussing health topics online. NLP techniques help transform these unstructured texts into meaningful information.</span></p><p><span style="white-space: pre-wrap;">Some common NLP tasks include:</span></p><p><span style="white-space: pre-wrap;">Text Classification</span></p><p><span style="white-space: pre-wrap;">Automatically categorizing documents into predefined topics such as:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">HIV Awareness</span></li><li value="2"><span style="white-space: pre-wrap;">Mental Health</span></li><li value="3"><span style="white-space: pre-wrap;">Tuberculosis</span></li><li value="4"><span style="white-space: pre-wrap;">Dengue</span></li><li value="5"><span style="white-space: pre-wrap;">Vaccination</span></li><li value="6"><span style="white-space: pre-wrap;">Nutrition</span></li><li value="7"><span style="white-space: pre-wrap;">Sexual Health</span></li></ul><p><span style="white-space: pre-wrap;">Sentiment Analysis</span></p><p><span style="white-space: pre-wrap;">Determining whether a discussion expresses:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Positive sentiment</span></li><li value="2"><span style="white-space: pre-wrap;">Neutral sentiment</span></li><li value="3"><span style="white-space: pre-wrap;">Negative sentiment</span></li></ul><p><span style="white-space: pre-wrap;">Sentiment analysis helps researchers understand public perception regarding health campaigns, government initiatives, or disease-related concerns.</span></p><p><span style="white-space: pre-wrap;">Keyword Extraction</span></p><p><span style="white-space: pre-wrap;">Identifying frequently occurring health-related terms that may indicate emerging discussions or important topics.</span></p><p><span style="white-space: pre-wrap;">Topic Modeling</span></p><p><span style="white-space: pre-wrap;">Discovering hidden themes within thousands of documents without manually reading each one.</span></p><p><span style="white-space: pre-wrap;">Named Entity Recognition</span></p><p><span style="white-space: pre-wrap;">Automatically identifying names of:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Diseases</span></li><li value="2"><span style="white-space: pre-wrap;">Medicines</span></li><li value="3"><span style="white-space: pre-wrap;">Healthcare facilities</span></li><li value="4"><span style="white-space: pre-wrap;">Government agencies</span></li><li value="5"><span style="white-space: pre-wrap;">Locations</span></li><li value="6"><span style="white-space: pre-wrap;">Organizations</span></li></ul><p><span style="white-space: pre-wrap;">These capabilities significantly reduce the manual effort required to analyze large volumes of digital information.</span></p><p><span style="white-space: pre-wrap;">The Role of Geospatial Analytics</span></p><p><span style="white-space: pre-wrap;">Health data becomes significantly more valuable when combined with geographic information.</span></p><p><span style="white-space: pre-wrap;">Geospatial analytics allows researchers to visualize where discussions, concerns, or trends are occurring geographically.</span></p><p><span style="white-space: pre-wrap;">Instead of simply knowing that a topic is increasing nationwide, analysts can determine:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Which provinces show increased discussions</span></li><li value="2"><span style="white-space: pre-wrap;">Which cities experience rising concerns</span></li><li value="3"><span style="white-space: pre-wrap;">Regional differences in public awareness</span></li><li value="4"><span style="white-space: pre-wrap;">Geographic distribution of misinformation</span></li><li value="5"><span style="white-space: pre-wrap;">Locations requiring targeted educational campaigns</span></li></ul><p><span style="white-space: pre-wrap;">Interactive mapping transforms complex datasets into intuitive visual representations that support faster decision making.</span></p><p><span style="white-space: pre-wrap;">Why Mapping Matters</span></p><p><span style="white-space: pre-wrap;">Maps provide context that traditional tables and charts cannot easily communicate.</span></p><p><span style="white-space: pre-wrap;">For example, a sudden increase in discussions about HIV testing in one region may indicate:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Increased awareness campaigns</span></li><li value="2"><span style="white-space: pre-wrap;">Greater access to healthcare services</span></li><li value="3"><span style="white-space: pre-wrap;">Community outreach activities</span></li><li value="4"><span style="white-space: pre-wrap;">Local public health events</span></li></ul><p><span style="white-space: pre-wrap;">Similarly, increased misinformation within another region may suggest the need for additional educational resources.</span></p><p><span style="white-space: pre-wrap;">These geographic insights enable more strategic deployment of healthcare interventions.</span></p><p><span style="white-space: pre-wrap;">Multilingual Analysis in the Philippines</span></p><p><span style="white-space: pre-wrap;">The Philippines is home to hundreds of languages and dialects.</span></p><p><span style="white-space: pre-wrap;">Many online discussions occur not only in English but also in:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Filipino</span></li><li value="2"><span style="white-space: pre-wrap;">Cebuano</span></li><li value="3"><span style="white-space: pre-wrap;">Ilocano</span></li><li value="4"><span style="white-space: pre-wrap;">Hiligaynon</span></li><li value="5"><span style="white-space: pre-wrap;">Waray</span></li><li value="6"><span style="white-space: pre-wrap;">Bicolano</span></li><li value="7"><span style="white-space: pre-wrap;">Kapampangan</span></li><li value="8"><span style="white-space: pre-wrap;">Pangasinan</span></li></ul><p><span style="white-space: pre-wrap;">Analyzing only English-language content would overlook a substantial portion of public discourse.</span></p><p><span style="white-space: pre-wrap;">AdvocAid PH is designed with multilingual capabilities that support the analysis of multiple Philippine languages, providing a more comprehensive understanding of nationwide health discussions.</span></p><p><span style="white-space: pre-wrap;">This multilingual approach improves inclusivity while reducing language-related bias during data analysis.</span></p><p><span style="white-space: pre-wrap;">Educational Resources as a Public Health Tool</span></p><p><span style="white-space: pre-wrap;">Technology alone cannot improve public health without accurate information.</span></p><p><span style="white-space: pre-wrap;">Educational resources play an essential role in helping communities understand:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Disease prevention</span></li><li value="2"><span style="white-space: pre-wrap;">Available healthcare services</span></li><li value="3"><span style="white-space: pre-wrap;">Testing procedures</span></li><li value="4"><span style="white-space: pre-wrap;">Treatment options</span></li><li value="5"><span style="white-space: pre-wrap;">Risk reduction strategies</span></li><li value="6"><span style="white-space: pre-wrap;">Government health programs</span></li></ul><p><span style="white-space: pre-wrap;">AdvocAid PH incorporates an educational resource repository that allows organizations to publish verified health information in various formats, including:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Articles</span></li><li value="2"><span style="white-space: pre-wrap;">Videos</span></li><li value="3"><span style="white-space: pre-wrap;">Infographics</span></li><li value="4"><span style="white-space: pre-wrap;">Documents</span></li><li value="5"><span style="white-space: pre-wrap;">Webinars</span></li><li value="6"><span style="white-space: pre-wrap;">Podcasts</span></li><li value="7"><span style="white-space: pre-wrap;">External references</span></li></ul><p><span style="white-space: pre-wrap;">Providing accessible educational materials encourages informed decision-making and helps combat misinformation.</span></p><p><span style="white-space: pre-wrap;">Supporting Evidence-Based Decision Making</span></p><p><span style="white-space: pre-wrap;">Modern healthcare increasingly relies on data-driven decisions.</span></p><p><span style="white-space: pre-wrap;">Interactive dashboards allow stakeholders to explore health information through:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Trend graphs</span></li><li value="2"><span style="white-space: pre-wrap;">Heat maps</span></li><li value="3"><span style="white-space: pre-wrap;">Geographic visualizations</span></li><li value="4"><span style="white-space: pre-wrap;">Statistical summaries</span></li><li value="5"><span style="white-space: pre-wrap;">Time-series analysis</span></li><li value="6"><span style="white-space: pre-wrap;">Demographic breakdowns</span></li><li value="7"><span style="white-space: pre-wrap;">Keyword frequency analysis</span></li></ul><p><span style="white-space: pre-wrap;">Instead of reviewing thousands of individual records manually, decision makers can quickly identify significant patterns that support planning and policy development.</span></p><p><span style="white-space: pre-wrap;">Ethical Considerations</span></p><p><span style="white-space: pre-wrap;">Responsible use of Artificial Intelligence is essential in digital public health.</span></p><p><span style="white-space: pre-wrap;">Platforms analyzing publicly available information must prioritize:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Privacy protection</span></li><li value="2"><span style="white-space: pre-wrap;">Data security</span></li><li value="3"><span style="white-space: pre-wrap;">Ethical data collection</span></li><li value="4"><span style="white-space: pre-wrap;">Transparency</span></li><li value="5"><span style="white-space: pre-wrap;">Fairness</span></li><li value="6"><span style="white-space: pre-wrap;">Bias mitigation</span></li><li value="7"><span style="white-space: pre-wrap;">Responsible AI practices</span></li></ul><p><span style="white-space: pre-wrap;">Health-related data should always be handled with appropriate safeguards to ensure that individuals are protected while enabling meaningful public health research.</span></p><p><span style="white-space: pre-wrap;">AdvocAid PH emphasizes responsible analytics by focusing on aggregated trends rather than identifying individual users.</span></p><p><span style="white-space: pre-wrap;">Future Directions</span></p><p><span style="white-space: pre-wrap;">The future of digital public health continues to evolve as AI technologies become more sophisticated.</span></p><p><span style="white-space: pre-wrap;">Potential future capabilities include:</span></p><ul><li value="1"><span style="white-space: pre-wrap;">Real-time disease trend monitoring</span></li><li value="2"><span style="white-space: pre-wrap;">Early outbreak detection</span></li><li value="3"><span style="white-space: pre-wrap;">Predictive health modeling</span></li><li value="4"><span style="white-space: pre-wrap;">AI-assisted public health recommendations</span></li><li value="5"><span style="white-space: pre-wrap;">Improved multilingual language models</span></li><li value="6"><span style="white-space: pre-wrap;">Enhanced geographic visualization</span></li><li value="7"><span style="white-space: pre-wrap;">Cross-platform information integration</span></li></ul><p><span style="white-space: pre-wrap;">As healthcare organizations increasingly adopt digital technologies, integrated platforms such as AdvocAid PH will play an increasingly important role in supporting evidence-based public health initiatives.</span></p><p><span style="white-space: pre-wrap;">Conclusion</span></p><p><span style="white-space: pre-wrap;">The intersection of Artificial Intelligence, Natural Language Processing, and Geospatial Analytics represents a significant advancement in modern public health surveillance. By transforming large volumes of publicly available digital information into meaningful insights, these technologies empower healthcare professionals, researchers, and policymakers to better understand emerging health trends and make informed decisions.</span></p><p><span style="white-space: pre-wrap;">AdvocAid PH demonstrates how innovation can strengthen public health by combining multilingual language processing, interactive geographic visualization, educational resource management, and advanced analytics into a unified platform. Rather than replacing traditional surveillance systems, it complements existing public health efforts by providing timely, data-driven insights that support faster response, improved awareness, and more effective community engagement.</span></p><p><span style="white-space: pre-wrap;">As digital communication continues to shape society, the ability to responsibly analyze public discourse will become increasingly valuable in addressing health challenges across the Philippines. Through ethical AI practices, collaborative research, and accessible health education, platforms like AdvocAid PH contribute to a future where technology enhances public health resilience, empowers decision-makers, and promotes healthier, better-informed communities nationwide.</span></p>	f	2026-07-28 04:13:27.741	2026-08-03 07:17:03.996	\N	understanding-digital-public-health-how-geospatial-artificial-intelligence-is-transforming-disease-surveillance-in-the-philippines	cmrob3i8r00020ey3t1g8ka0p	f	\N	PUBLISHED	AdvocAid PH integrates AI, NLP, and geospatial technologies to analyze public health discussions, identify emerging trends, and provide interactive insights for researchers and policymakers. By combining advanced analytics with accessible educational resources, the platform supports informed decision-making, combats health misinformation, and strengthens digital public health initiatives across the Philippines.	https://d2i0afz2m2bklk.cloudfront.net/1785212007362-1.jpg	ARTICLE	\N
cms45t48x0000jby3nnzj3mvb	Leveraging Artificial Intelligence for Smarter Public Health Monitoring		f	2026-07-28 04:32:16.833	2026-08-03 07:17:08.574	\N	leveraging-artificial-intelligence-for-smarter-public-health-monitoring	cmrob3i8r00020ey3t1g8ka0p	f	\N	PUBLISHED	This article explores how Artificial Intelligence (AI), Natural Language Processing (NLP), and geospatial analytics are revolutionizing public health surveillance. It discusses how digital technologies can analyze publicly available health-related information, identify emerging trends, and support healthcare professionals and policymakers in making informed, data-driven decisions while promoting ethical and responsible use of AI.	https://d2i0afz2m2bklk.cloudfront.net/1785213136383-1.jpg	CATALOGUE	\N
cmspjl8350000kyy32zr0z2vt	Testing	<p><br></p>	f	2026-08-12 03:41:12.881	2026-08-12 03:41:12.881	cmqq5tmyi0042osy3p41hgb36	testing	cmroauuqj0000lhy3a12v1tdm	f	\N	DRAFT	asdasdas	https://d2i0afz2m2bklk.cloudfront.net/1786506072338-1.jpg	ARTICLE	undefined
cmsplgxqh0000icy3fh1qnn0g	aa	undefined	f	2026-08-12 04:33:52.073	2026-08-12 04:33:52.073	cmqq5tmyi0042osy3p41hgb36	aa	cmrob3i8r00020ey3t1g8ka0p	f	\N	PUBLISHED	asdasdasd	https://d2i0afz2m2bklk.cloudfront.net/1786509231362-1.jpg	CATALOGUE	undefined
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
cmscotju9000896y3syxx00sw	joshuaramin146@gmail.com	login	2026-08-03 03:56:39.152	t	1	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:46:39.153	492d16ba5cbec6e378e40ec86422ed91cedc79dee89ec54e52828e2b3b63db17
cmscp53g8000b96y3s5es9nye	joshuaramin146@gmail.com	login	2026-08-03 04:05:37.784	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:55:37.784	e318699bb210fa9e4e7b93f1f9a6188b3b72f6cc70e55e3378eb073f12fbdebf
cmscoqhtj000596y3oaf9cama	t-jrrembulat@national-u.edu.ph	login	2026-08-03 03:54:16.567	t	3	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:44:16.568	3ef44a3b60d5940352104be5dad9aa94b86635c6f662e8cce79b21bca51746c8
cmscqdare000e96y39520jhr7	raminjoshua05@gmail.com	login	2026-08-03 04:40:00.122	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 04:30:00.122	a62a10e212ebbfe9f689af265124acf9ad3c14024e0bb9c7b51d4bcee018a92f
cmswl8hxi0002acy3rj18nhiu	raminjoshua05@gmail.com	login	2026-08-17 02:11:41.573	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-17 02:01:41.574	7d9aab3d8cd10181a53f4a5ce81e39d0673dd14b60ad42b50fe92677ca8d36a9
cmswlkvg50002toy3vcc8b9ff	raminjoshua05@gmail.com	login	2026-08-17 02:21:18.964	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-17 02:11:18.965	68873dad13299e288e5bfcd55ccd5d686c9bc8228f84b1d13d5449f325d1c1d7
cmscosdat000696y3rgmdwq4n	raminjoshua05@gmail.com	login	2026-08-03 03:55:44.02	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:45:44.021	7877fc83c494a68f41d981e3133033b781ada690ec0fbd3d10997c34f0ce71cd
cmscoxh68000996y3nbn0uo19	joshuaramin146@gmail.com	login	2026-08-03 03:59:42.32	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:49:42.32	104c8c608aa503e1ded8846bd338b2f7331b2ae031c90fd29097dbb295b1c405
cmscp8ck5000c96y3irwshii0	joshuaramin146@gmail.com	login	2026-08-03 04:08:09.557	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:58:09.557	4179bec87cd923fa278714e368ee0da96739ff044b05603bc0b3c33f978f7ff1
cmscxaldm0000ghy3lmj139j0	raminjoshua05@gmail.com	login	2026-08-03 07:53:51.223	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 07:43:51.226	c0e798d91b0f151679b4404f9a59c180e725b44de2e448fb2ad5342e96a0c7d1
cmse2cegv000058y3e2bepnuk	raminjoshua05@gmail.com	login	2026-08-04 03:02:59.836	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-04 02:52:59.839	795748bda6ebb1525ff866e2dfaaf6c3a7cad193885162713ffbbdf37a1bf2d2
cmsiev9gl0000dby3e2qmbali	raminjoshua05@gmail.com	login	2026-08-07 04:04:39.904	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-07 03:54:39.909	27a9267205c814d92888687e23d435f9d0bb48f1fe81dd052deeffdf73df2d44
cmsnwzw170000fqy3fyw2qt64	raminjoshua05@gmail.com	login	2026-08-11 00:30:59.749	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-11 00:20:59.755	c7d7b693fdc638c67b498d4a729864a71e8c87cb1275c6d8006c360bbd0130c8
cmsperi6o00006wy3tz070cyo	raminjoshua05@gmail.com	login	2026-08-12 01:36:07.82	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-12 01:26:07.824	a20479b52eedff22068f3e9dfacd676996eaaa0875d8a22478cf4b1de1b98744
cmsqwdqww0000riy3csq4bkzf	raminjoshua05@gmail.com	login	2026-08-13 02:37:05.213	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-13 02:27:05.216	aefa19e18dc4b6da5718993761a0e323bec10f4519bb43830434ed2273419e1e
cmswkmr7s0000acy3zi02r38n	raminjoshua05@gmail.com	login	2026-08-17 01:54:47.173	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-17 01:44:47.176	8b6ac4c0bb566703773682c6dfe56219a217cb610ae40db628d07215fbd71ed8
cmswlf9rn0000toy359iic65w	raminjoshua05@gmail.com	login	2026-08-17 02:16:57.584	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-17 02:06:57.587	a1f1001933586a97d58b4cbff34a29a0614e9ba0f6f2b92e3432f68327d278b6
cmt6hbci1000007y3n2wisy1r	raminjoshua05@gmail.com	login	2026-08-24 00:19:37.798	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-24 00:09:37.801	4bfd81b7375e0c292fa964d099e16127a4039ee66fdb88097d5c427c444c558d
cmscop133000496y3dxxueh5o	t-jrrembulat@national-u.edu.ph	login	2026-08-03 03:53:08.222	t	1	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-03 03:43:08.223	25671c176c9e4eba62070cb5c511051b94d434184f38352e63947264856501ae
cmscot52m000796y3ue949kit	joshuaramin146@gmail.com	login	2026-08-03 03:56:20.013	t	0	5	\N	\N	\N	2026-08-03 03:46:20.014	12e3abedd22e6e3b6f6d253e086c1484ce2cad206c9b4ff9338826a59b13e662
cmscp0dix000a96y3azwo7b4c	joshuaramin146@gmail.com	login	2026-08-03 04:01:57.56	t	0	5	::1	PostmanRuntime/7.55.1	\N	2026-08-03 03:51:57.561	83e8a6270af98a09cd60e81881ef78575bd676c4e069081c8c2e1c7f35003755
cmscq6r37000d96y39gvpuznn	t-jrrembulat@national-u.edu.ph	login	2026-08-03 04:34:54.691	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15	\N	2026-08-03 04:24:54.691	65abd33b54fc3ee7f31112c92b69a881f87ef572e61425a54eae612b4cd69be4
cmsieyy6n0001dby3esmby25i	joshuaramin146@gmail.com	login	2026-08-07 04:07:31.919	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Safari/605.1.15	\N	2026-08-07 03:57:31.919	7d310b2bc5d6293c0850e95995c1f39aff7f5adb7abae3301fcd729fb1919c76
cmsppb3f90000svy3338f9mjs	raminjoshua05@gmail.com	login	2026-08-12 06:31:17.97	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-12 06:21:17.973	455e2d7a870cbf2348c241dbaba6aece7e62062321a087e86bde60a433f90ef7
cmswks8up0001acy3thhggoro	raminjoshua05@gmail.com	login	2026-08-17 01:59:03.312	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-17 01:49:03.313	071aa5d9a3b7a9a145fa814ebecc207920d2647d1156ecbf1f5f1cd0223dc3d3
cmswli0od0001toy3ts7a4sp9	joshuaramin146@gmail.com	login	2026-08-17 02:19:05.773	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-17 02:09:05.773	4b5af92dc23e479e9f994d49afa3afb80f6d2128b6628139edde1c86a1657c69
cmt6hg9n80000w6y3dafh8ddm	raminjoshua05@gmail.com	login	2026-08-24 00:23:27.377	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-24 00:13:27.38	19c6dcd39fc31222317bca7aec6a0218c5d06f8c46154e191dc8f6c32188c70a
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
cmscnj6920001pfy3qzc13nyx	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	cmscnj68m0000pfy3uxfro9dl	treatment-hub:create	create
cmscnj6920002pfy3ldc3ypq8	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	cmscnj68m0000pfy3uxfro9dl	treatment-hub:read	read
cmscnj6920003pfy33a5pqkkd	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	cmscnj68m0000pfy3uxfro9dl	treatment-hub:update	update
cmscnj6920004pfy3ithlhecl	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	cmscnj68m0000pfy3uxfro9dl	treatment-hub:delete	delete
cmscnj6920005pfy38peu6ppi	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	cmscnj68m0000pfy3uxfro9dl	treatment-hub:deny	deny
cmscnj6920006pfy3dm6wkuwt	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	cmscnj68m0000pfy3uxfro9dl	treatment-hub:export	export
cmscx98ab00014by3t09bt3ej	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	cmscx989z00004by3xkz6ny27	community-contributions:create	create
cmscx98ab00024by3bnht0qwk	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	cmscx989z00004by3xkz6ny27	community-contributions:read	read
cmscx98ab00034by394xq96n7	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	cmscx989z00004by3xkz6ny27	community-contributions:update	update
cmscx98ab00044by3pfyqb3tz	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	cmscx989z00004by3xkz6ny27	community-contributions:delete	delete
cmscx98ab00054by357v9c0bj	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	cmscx989z00004by3xkz6ny27	community-contributions:deny	deny
cmscx98ac00064by3sn1sq76c	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	cmscx989z00004by3xkz6ny27	community-contributions:export	export
\.


--
-- Data for Name: Profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Profile" (profile_id, first_name, last_name, is_deleted, created_at, updated_at, user_id) FROM stdin;
cmqq5tmyv0043osy3cytmcb49	Joshua	Ramin	f	2026-06-23 04:44:12.282	2026-06-23 04:44:12.282	cmqq5tmyi0042osy3p41hgb36
cmscod7p60008pfy3ndxu641q	Joshua	Rembulat	f	2026-08-03 03:33:56.904	2026-08-03 03:33:56.904	cmscod7oo0007pfy3qxqgtp4u
cmscot51o0002k8y31826zj7j	Joshua	Testing	f	2026-08-03 03:46:19.966	2026-08-03 03:46:19.966	cmscot51a0001k8y3urzdecyx
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
cmqq2r5um003josy3fnzgzqy1	Survey Management	survey-management	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	4
cmqq2r5un003qosy3dny41tub	Roles and Permissions	roles-and-permissions	cmqq2r5uj002rosy3euzvmaq0	f	2026-06-23 03:18:17.947	2026-06-23 03:18:17.947	5
cmqq2r5ue001sosy390ed0pxc	Trends and Analytics	trends-and-analytics	cmqq2r5ue001losy3slwgwum1	f	2026-06-23 03:18:17.942	2026-06-23 03:18:17.942	1
cmqq2r5ul003cosy36wej347r	Resource Management	resource-management	cmqq2r5uj002rosy3euzvmaq0	t	2026-06-23 03:18:17.947	2026-08-03 03:00:34.221	3
cmscnj68m0000pfy3uxfro9dl	Treatment Hub Management	treatment-hub-management	cmqq2r5uj002rosy3euzvmaq0	f	2026-08-03 03:10:35.35	2026-08-03 03:10:35.35	3
cmscx989z00004by3xkz6ny27	Community Contributions	community-contributions	cmqq2r5ub0010osy3binpput4	f	2026-08-03 07:42:47.591	2026-08-03 07:42:47.591	3
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
cmscx9xzg001p4by3zsfyqhbn	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002losy3s3uqbmiv
cmscx9xzg001q4by3xr1e53qp	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002mosy31hg5hc2b
cmscx9xzg001r4by3gr9us1y2	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002nosy3fki6pyfp
cmscx9xzg001s4by3gn79tist	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002oosy3agegbs73
cmscx9xzg001t4by3yqy1wqa9	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002posy3gkyhrvk5
cmscx9xzg001u4by3r2vtwp1v	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002qosy35kfr488e
cmscx9xzg001v4by36oh40y4f	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk002zosy3fvl1ml7v
cmscx9xzg001w4by37ypk9xai	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0030osy3mbuxsp0t
cmscx9xzg001x4by30bpz4c5a	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0031osy3wv6douux
cmscx9xzg001y4by3jp6aihdq	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0032osy3c7lboxy9
cmscx9xzg001z4by3dj4e1iho	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0033osy3r6f7iicb
cmscx9xzg00204by3g9qnqnzg	cmqq5lun2003yosy3elss5zqj	cmqq2r5uk0034osy3tkjd8kum
cmscx9xzg00214by3k4slyfgj	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0036osy3l5izd66t
cmscx9xzg00224by3qq31htis	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0037osy3yb5is1cw
cmscx9xzg00234by3llp6b9nw	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0038osy32bi1xkpn
cmscx9xzg00244by30els7k7y	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul0039osy3pbvdhzvy
cmscx9xzg00254by3uh00phfz	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003aosy3fio22ef1
cmscx9xzg00264by3r1w75bbs	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003bosy3foywoljk
cmscx9xzg00274by3fkgmyr9u	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003dosy352i8msiv
cmscx9xzg00284by3ou00hwz1	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003eosy3xdlnq7zi
cmscx9xzg00294by3d0wdxm5p	cmqq5lun2003yosy3elss5zqj	cmqq2r5ul003fosy3de8etrvj
cmscx9xzg002a4by3tyhxml62	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003gosy3iz76pbdz
cmscx9xzg002b4by3kbmx3365	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003hosy3074teopk
cmscx9xzg002c4by3n1x5hn5d	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003iosy3a1r40lha
cmscx9xzg002d4by3rzm1wfes	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003kosy38kjluf6p
cmscx9xzg002e4by3487ff755	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003losy3g6gqjx6g
cmscx9xzg002f4by30rcih4gp	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003mosy3shtyezyq
cmscx9xzg002g4by3rayzkog2	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003nosy3zvyxb04l
cmscx9xzg002h4by3vbzpbslh	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003oosy3le9hqeym
cmscx9xzg002i4by3ey5lix68	cmqq5lun2003yosy3elss5zqj	cmqq2r5um003posy3ds2l2kgs
cmscx9xzg002j4by3c0gwunc2	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003rosy3n1c096dx
cmscx9xzg002k4by38n6ujkhd	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003sosy3ele385ih
cmscx9xzg002l4by3ms86f8fy	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003tosy3vvkx6zq0
cmscx9xzg002m4by313ha4l85	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003uosy3d0ltepdo
cmscx9xzg002n4by3o1dqfghi	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003vosy38ty8c4pj
cmscx9xzg002o4by3j1or0j69	cmqq5lun2003yosy3elss5zqj	cmqq2r5un003wosy31jiwizos
cmscx9xzg00074by3dtbbki57	cmqq5lun2003yosy3elss5zqj	cmqq2r5u20009osy3ma28n30s
cmscx9xzg00084by37ol3h31p	cmqq5lun2003yosy3elss5zqj	cmqq2r5u2000aosy3pz3559vs
cmscx9xzg00094by3t653bjyi	cmqq5lun2003yosy3elss5zqj	cmqq2r5u2000bosy3qk24zm63
cmscx9xzg000a4by3py1ov39n	cmqq5lun2003yosy3elss5zqj	cmqq2r5u2000cosy3vcfc0157
cmscx9xzg000b4by3yu5j657b	cmqq5lun2003yosy3elss5zqj	cmqq2r5u3000dosy3zeevqtp8
cmscx9xzg000c4by3y2hbb241	cmqq5lun2003yosy3elss5zqj	cmqq2r5u3000eosy3lq857xum
cmscx9xzg000d4by3w27szrsr	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000nosy340erq7ut
cmscx9xzg000e4by320gbj96y	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000oosy3xl39h9u3
cmscx9xzg000f4by3dx86rnzi	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000posy3ypd933a0
cmscx9xzg000g4by3mwa569hp	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000qosy36n46hoar
cmscx9xzg000h4by3n600p0x5	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000rosy320wfm9sb
cmscx9xzg000i4by32ulfwxfy	cmqq5lun2003yosy3elss5zqj	cmqq2r5u8000sosy33rg1isxk
cmscx9xzg000j4by3c1nyop42	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000uosy3odmqijyv
cmscx9xzg000k4by3uwh5rqwe	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000vosy3frn7ac7v
cmscx9xzg000l4by3w08lq7tv	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000wosy3cg60cf3l
cmscxeejg00324by352auwy8l	cmqq6hvp3002kedy3vxzotiun	cmqq2r5u2000aosy3pz3559vs
cmscxeejg00334by3azyfmynn	cmqq6hvp3002kedy3vxzotiun	cmqq2r5u3000eosy3lq857xum
cmscxeejg00344by35dya88ds	cmqq6hvp3002kedy3vxzotiun	cmqq2r5u8000oosy3xl39h9u3
cmscxeejg00354by3uvadfjrq	cmqq6hvp3002kedy3vxzotiun	cmqq2r5u8000sosy33rg1isxk
cmscxeejg00364by336jj89ns	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ua000vosy3frn7ac7v
cmscxeejg00374by3hh0nnrdm	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ua000zosy3ya6kkz5o
cmscxeejg00384by3t3pexu9t	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uc0018osy3xfuslloy
cmscxeejg00394by39g79gc15	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uc0019osy30dmv0jke
cmscxeejg003a4by38k6wfgbj	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uc001aosy3fs2w8x19
cmscxeejg003b4by3uz9owlkl	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uc001bosy37h7g4lcp
cmscxeejg003c4by3hzn1hmkn	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uc001cosy39vxqxapi
cmscxeejg003d4by3fb9aajpu	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uc001dosy38ev8tw6o
cmscxeejg003e4by3p6m0lafz	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ud001fosy37u42cpw4
cmscxeejg003f4by3rm6poi6f	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ud001gosy3gdmyo5mr
cmscxeejg003g4by325m0lfmg	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ud001hosy3artbtmg0
cmscxeejg003h4by3jc5o3x61	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ud001iosy32ujmhcmm
cmscxeejg003i4by36n6kul9y	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ud001josy33ufvcmsb
cmscxeejg003j4by34sr4rn5x	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ud001kosy39fk8kb2d
cmscxeejg003k4by35dfzkd6s	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uf001uosy3zf9jd7i3
cmscxeejg003l4by3m7t4z3kv	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uf001yosy33d2fuw5i
cmscxeejg003m4by350rkvras	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ug0021osy3b5ud1cem
cmscxeejg003n4by3sv1mewy3	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ug0025osy3zqwa014x
cmscxeejg003o4by3lvyfnecf	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uh0028osy3bpjlcra6
cmscxeejg003p4by3ozglt559	cmqq6hvp3002kedy3vxzotiun	cmqq2r5uh002cosy3nj7mukdv
cmscxeejg003q4by3gvpr4wzs	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ui002fosy3rtin7h52
cmscxeejg003r4by3j64o57hs	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ui002josy3zbxuptpy
cmscxeejg003s4by3r8mln21r	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ui002mosy31hg5hc2b
cmscxeejg003t4by3cm6l2wc2	cmqq6hvp3002kedy3vxzotiun	cmqq2r5ui002qosy35kfr488e
cmscxeejg003u4by3aumetyau	cmqq6hvp3002kedy3vxzotiun	cmscx98ab00014by3t09bt3ej
cmscxeejg003v4by3h108tt47	cmqq6hvp3002kedy3vxzotiun	cmscx98ab00024by3bnht0qwk
cmscxeejg003w4by3521p2wxy	cmqq6hvp3002kedy3vxzotiun	cmscx98ac00064by3sn1sq76c
cmscxf13p00524by32k5e9710	cmqq6j0h0002medy3azmkz1uj	cmqq2r5u2000aosy3pz3559vs
cmscxf13p00534by3qbamm5mh	cmqq6j0h0002medy3azmkz1uj	cmqq2r5u8000oosy3xl39h9u3
cmscxf13p00544by3mbrpy6xq	cmqq6j0h0002medy3azmkz1uj	cmqq2r5ua000vosy3frn7ac7v
cmscxf13p00554by3u8cx86zw	cmqq6j0h0002medy3azmkz1uj	cmqq2r5uc0019osy30dmv0jke
cmscxf13p00564by3o77j8yh4	cmqq6j0h0002medy3azmkz1uj	cmqq2r5ud001gosy3gdmyo5mr
cmscxf13p00574by366i0wbu1	cmqq6j0h0002medy3azmkz1uj	cmqq2r5uf001uosy3zf9jd7i3
cmscxf13p00584by3vy0m2nqu	cmqq6j0h0002medy3azmkz1uj	cmqq2r5ug0021osy3b5ud1cem
cmscxf13p00594by32efnlk3c	cmqq6j0h0002medy3azmkz1uj	cmqq2r5uh0028osy3bpjlcra6
cmscxf13p005a4by3bdk3cf32	cmqq6j0h0002medy3azmkz1uj	cmqq2r5ui002fosy3rtin7h52
cmscxf13p005b4by3ci97rxyk	cmqq6j0h0002medy3azmkz1uj	cmscx98ab00014by3t09bt3ej
cmscxf13p005c4by3lsp8fk3d	cmqq6j0h0002medy3azmkz1uj	cmscx98ab00024by3bnht0qwk
cmscxgpn1005u4by37hdybn3d	cmqq6jacc002nedy3nemgrb9w	cmqq2r5u2000aosy3pz3559vs
cmscxgpn1005v4by3abfypx8k	cmqq6jacc002nedy3nemgrb9w	cmqq2r5u8000oosy3xl39h9u3
cmscxgpn1005w4by3az9yuqrx	cmqq6jacc002nedy3nemgrb9w	cmqq2r5ua000vosy3frn7ac7v
cmscxgpn1005x4by39qstuhzj	cmqq6jacc002nedy3nemgrb9w	cmqq2r5uc0019osy30dmv0jke
cmscxgpn1005y4by31wloser9	cmqq6jacc002nedy3nemgrb9w	cmqq2r5ud001gosy3gdmyo5mr
cmscxgpn1005z4by365qlne9n	cmqq6jacc002nedy3nemgrb9w	cmqq2r5uf001uosy3zf9jd7i3
cmscxgpn100604by32g400gox	cmqq6jacc002nedy3nemgrb9w	cmqq2r5ug0021osy3b5ud1cem
cmscxgpn100614by34k6vme1p	cmqq6jacc002nedy3nemgrb9w	cmqq2r5uh0028osy3bpjlcra6
cmscxgpn100624by3djrpe3s0	cmqq6jacc002nedy3nemgrb9w	cmqq2r5ui002fosy3rtin7h52
cmscxgpn100634by3s8vqw8xy	cmqq6jacc002nedy3nemgrb9w	cmqq2r5ui002mosy31hg5hc2b
cmscxgpn100644by3jo4tf1mx	cmqq6jacc002nedy3nemgrb9w	cmscx98ab00014by3t09bt3ej
cmscxgpn100654by3dpy0mp1u	cmqq6jacc002nedy3nemgrb9w	cmscx98ab00024by3bnht0qwk
cmscxen6t003x4by3aw3gp0k9	cmqq6inap002ledy3dp4fy667	cmqq2r5u2000aosy3pz3559vs
cmscxen6t003y4by3wur6tvst	cmqq6inap002ledy3dp4fy667	cmqq2r5u8000oosy3xl39h9u3
cmscxen6t003z4by3njcbld3x	cmqq6inap002ledy3dp4fy667	cmqq2r5ua000vosy3frn7ac7v
cmscxen6t00404by3wp8h7doj	cmqq6inap002ledy3dp4fy667	cmqq2r5uc0018osy3xfuslloy
cmscxen6t00414by36zgdz0o7	cmqq6inap002ledy3dp4fy667	cmqq2r5uc0019osy30dmv0jke
cmscxen6t00424by3g7ifgff4	cmqq6inap002ledy3dp4fy667	cmqq2r5uc001aosy3fs2w8x19
cmscxen6t00434by3ym4f0yqu	cmqq6inap002ledy3dp4fy667	cmqq2r5uc001bosy37h7g4lcp
cmscxen6t00444by30xidgqja	cmqq6inap002ledy3dp4fy667	cmqq2r5uc001dosy38ev8tw6o
cmscxen6t00454by3slj9ets7	cmqq6inap002ledy3dp4fy667	cmqq2r5ud001fosy37u42cpw4
cmscxen6t00464by3garp82tf	cmqq6inap002ledy3dp4fy667	cmqq2r5ud001gosy3gdmyo5mr
cmscxen6t00474by379koggp2	cmqq6inap002ledy3dp4fy667	cmqq2r5ud001hosy3artbtmg0
cmscxen6t00484by39z0zzedn	cmqq6inap002ledy3dp4fy667	cmqq2r5ud001iosy32ujmhcmm
cmscxen6t00494by34xh1qlz9	cmqq6inap002ledy3dp4fy667	cmqq2r5ud001kosy39fk8kb2d
cmscxen6t004a4by3q8r8anr8	cmqq6inap002ledy3dp4fy667	cmqq2r5uf001uosy3zf9jd7i3
cmscxen6t004b4by3alb36rbc	cmqq6inap002ledy3dp4fy667	cmqq2r5uf001yosy33d2fuw5i
cmscxen6t004c4by3eib8jvd6	cmqq6inap002ledy3dp4fy667	cmqq2r5ug0021osy3b5ud1cem
cmscxen6t004d4by3sg8xbyae	cmqq6inap002ledy3dp4fy667	cmqq2r5ug0025osy3zqwa014x
cmscxen6t004e4by3695lwl4s	cmqq6inap002ledy3dp4fy667	cmqq2r5uh0028osy3bpjlcra6
cmscxen6t004f4by336v8wmsx	cmqq6inap002ledy3dp4fy667	cmqq2r5uh002cosy3nj7mukdv
cmscxen6t004g4by3nzj0o31o	cmqq6inap002ledy3dp4fy667	cmqq2r5ui002fosy3rtin7h52
cmscxen6t004h4by3gjapmko1	cmqq6inap002ledy3dp4fy667	cmqq2r5ui002josy3zbxuptpy
cmscxen6t004i4by3l6g1fi0r	cmqq6inap002ledy3dp4fy667	cmqq2r5ui002mosy31hg5hc2b
cmscxen6t004j4by32kzntj3u	cmqq6inap002ledy3dp4fy667	cmqq2r5ui002qosy35kfr488e
cmscxen6t004k4by3gu8tfxch	cmqq6inap002ledy3dp4fy667	cmqq2r5ul0036osy3l5izd66t
cmscxen6t004l4by3tznds101	cmqq6inap002ledy3dp4fy667	cmqq2r5ul0037osy3yb5is1cw
cmscxen6t004m4by3wky2azwr	cmqq6inap002ledy3dp4fy667	cmqq2r5ul0038osy32bi1xkpn
cmscxen6t004n4by35ugs6e8k	cmqq6inap002ledy3dp4fy667	cmqq2r5ul0039osy3pbvdhzvy
cmscxen6t004o4by3qpf9nkqa	cmqq6inap002ledy3dp4fy667	cmqq2r5ul003bosy3foywoljk
cmscxen6t004p4by3ikjsebku	cmqq6inap002ledy3dp4fy667	cmqq2r5um003kosy38kjluf6p
cmscxen6t004q4by3neistwso	cmqq6inap002ledy3dp4fy667	cmqq2r5um003losy3g6gqjx6g
cmscxen6t004r4by3kc650d19	cmqq6inap002ledy3dp4fy667	cmqq2r5um003mosy3shtyezyq
cmscxen6t004s4by3ovvtcy37	cmqq6inap002ledy3dp4fy667	cmqq2r5um003nosy3zvyxb04l
cmscxen6t004t4by3yocos8ug	cmqq6inap002ledy3dp4fy667	cmqq2r5um003posy3ds2l2kgs
cmscxen6t004u4by3pg9wnuck	cmqq6inap002ledy3dp4fy667	cmscnj6920001pfy3qzc13nyx
cmscxen6t004v4by3pol5ytnt	cmqq6inap002ledy3dp4fy667	cmscnj6920002pfy3ldc3ypq8
cmscxen6t004w4by3vb7d8gd3	cmqq6inap002ledy3dp4fy667	cmscnj6920003pfy33a5pqkkd
cmscx9xzg000m4by35n5d24jc	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000xosy34awfm7m2
cmscx9xzg000n4by3q9o20qkq	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000yosy3x4aar7ry
cmscx9xzg000o4by30yb3wo0d	cmqq5lun2003yosy3elss5zqj	cmqq2r5ua000zosy3ya6kkz5o
cmscx9xzg000p4by3rocq1vnv	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc0018osy3xfuslloy
cmscx9xzg000q4by3gs83glqo	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc0019osy30dmv0jke
cmscx9xzg000r4by3jltvvpy6	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001aosy3fs2w8x19
cmscx9xzg000s4by31nwgjxfe	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001bosy37h7g4lcp
cmscx9xzg000t4by37yi9vywp	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001cosy39vxqxapi
cmscx9xzg000u4by35vcm80oa	cmqq5lun2003yosy3elss5zqj	cmqq2r5uc001dosy38ev8tw6o
cmscx9xzg000v4by37oghuvld	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001fosy37u42cpw4
cmscx9xzg000w4by3g8uvacfr	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001gosy3gdmyo5mr
cmscx9xzg000x4by3wuyjyrn3	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001hosy3artbtmg0
cmscx9xzg000y4by3ufjvet0u	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001iosy32ujmhcmm
cmscx9xzg000z4by3x0hexbe1	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001josy33ufvcmsb
cmscx9xzg00104by31310wy4c	cmqq5lun2003yosy3elss5zqj	cmqq2r5ud001kosy39fk8kb2d
cmscx9xzg00114by34jz20urd	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001tosy3nzlk5mgn
cmscx9xzg00124by3bgjr8wf5	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001uosy3zf9jd7i3
cmscx9xzg00134by30uefnosk	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001vosy3fyt0ftgy
cmscx9xzg00144by341s9kgdh	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001wosy313w0am9v
cmscx9xzg00154by3pposj4xf	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001xosy3v172deco
cmscx9xzg00164by3k213lpwi	cmqq5lun2003yosy3elss5zqj	cmqq2r5uf001yosy33d2fuw5i
cmscx9xzg00174by3eg9z3kbl	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0020osy3nwmyqu2s
cmscx9xzg00184by3fjg7bzc7	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0021osy3b5ud1cem
cmscx9xzg00194by3ffpm404d	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0022osy3k0u9htht
cmscx9xzg001a4by3h8dpqj9b	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0023osy3cakgq4dc
cmscx9xzg001b4by3wwir7k3p	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0024osy3z5xxxrd4
cmscx9xzg001c4by3fu4f78dw	cmqq5lun2003yosy3elss5zqj	cmqq2r5ug0025osy3zqwa014x
cmscx9xzg001d4by3m723m1lh	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh0027osy3jqlnewq3
cmscx9xzg001e4by3gmvcwti1	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh0028osy3bpjlcra6
cmscx9xzg001f4by3iigqzsfa	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh0029osy3b1p05tyc
cmscx9xzg001g4by32v9davfg	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh002aosy3lwk7wgdk
cmscx9xzg001h4by39b07ckkx	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh002bosy3an3m79mq
cmscx9xzg001i4by3ak2uecru	cmqq5lun2003yosy3elss5zqj	cmqq2r5uh002cosy3nj7mukdv
cmscx9xzg001j4by31aicqcle	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002eosy3qyx1mb3w
cmscx9xzg001k4by34k0016th	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002fosy3rtin7h52
cmscx9xzg001l4by3co7girgo	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002gosy312inp9w3
cmscx9xzg001m4by314myfh9j	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002hosy3u9kibgrp
cmscx9xzg001n4by39l2u8c28	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002iosy3r3b38qie
cmscx9xzg001o4by3tytlgtwc	cmqq5lun2003yosy3elss5zqj	cmqq2r5ui002josy3zbxuptpy
cmscx9xzg002p4by3yonyu4zz	cmqq5lun2003yosy3elss5zqj	cmscnj6920001pfy3qzc13nyx
cmscx9xzg002q4by3ipvpz85t	cmqq5lun2003yosy3elss5zqj	cmscnj6920002pfy3ldc3ypq8
cmscx9xzg002r4by3k9hwghwg	cmqq5lun2003yosy3elss5zqj	cmscnj6920003pfy33a5pqkkd
cmscx9xzg002s4by37jsirgsk	cmqq5lun2003yosy3elss5zqj	cmscnj6920004pfy3ithlhecl
cmscx9xzg002t4by3lfspyrcp	cmqq5lun2003yosy3elss5zqj	cmscnj6920005pfy38peu6ppi
cmscx9xzg002u4by3atzmkr2t	cmqq5lun2003yosy3elss5zqj	cmscnj6920006pfy3dm6wkuwt
cmscx9xzg002v4by3ecdcrpoa	cmqq5lun2003yosy3elss5zqj	cmscx98ab00014by3t09bt3ej
cmscx9xzg002w4by3odwn963g	cmqq5lun2003yosy3elss5zqj	cmscx98ab00024by3bnht0qwk
cmscx9xzg002x4by3ok4k9pky	cmqq5lun2003yosy3elss5zqj	cmscx98ab00034by394xq96n7
cmscx9xzg002y4by33964i0ox	cmqq5lun2003yosy3elss5zqj	cmscx98ab00044by3pfyqb3tz
cmscx9xzg002z4by36ao8r7kz	cmqq5lun2003yosy3elss5zqj	cmscx98ab00054by357v9c0bj
cmscx9xzg00304by3gqle8gmo	cmqq5lun2003yosy3elss5zqj	cmscx98ac00064by3sn1sq76c
cmscxen6t004x4by3ctfvaxit	cmqq6inap002ledy3dp4fy667	cmscnj6920004pfy3ithlhecl
cmscxen6t004y4by3nev4rn1n	cmqq6inap002ledy3dp4fy667	cmscnj6920006pfy3dm6wkuwt
cmscxen6t004z4by3e4tdfl84	cmqq6inap002ledy3dp4fy667	cmscx98ab00014by3t09bt3ej
cmscxen6t00504by3jcq1b7c1	cmqq6inap002ledy3dp4fy667	cmscx98ab00024by3bnht0qwk
cmscxen6t00514by33mr4qtu3	cmqq6inap002ledy3dp4fy667	cmscx98ac00064by3sn1sq76c
cmscxfqtk005d4by3gd7u3hvm	cmqq6kc18002oedy34zqwpr8k	cmqq2r5u2000aosy3pz3559vs
cmscxfqtk005e4by39h9q6ubk	cmqq6kc18002oedy34zqwpr8k	cmqq2r5u8000oosy3xl39h9u3
cmscxfqtk005f4by3713ues7g	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ua000vosy3frn7ac7v
cmscxfqtk005g4by35e1itgun	cmqq6kc18002oedy34zqwpr8k	cmqq2r5uc0019osy30dmv0jke
cmscxfqtk005h4by3pca14ocf	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ud001gosy3gdmyo5mr
cmscxfqtk005i4by3wndhz1qs	cmqq6kc18002oedy34zqwpr8k	cmqq2r5uf001uosy3zf9jd7i3
cmscxfqtk005j4by3q4ak6df7	cmqq6kc18002oedy34zqwpr8k	cmqq2r5uf001yosy33d2fuw5i
cmscxfqtk005k4by377y2mppf	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ug0021osy3b5ud1cem
cmscxfqtk005l4by392rexx1i	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ug0025osy3zqwa014x
cmscxfqtk005m4by3607q5lhv	cmqq6kc18002oedy34zqwpr8k	cmqq2r5uh0028osy3bpjlcra6
cmscxfqtk005n4by32gvgngf3	cmqq6kc18002oedy34zqwpr8k	cmqq2r5uh002cosy3nj7mukdv
cmscxfqtk005o4by3rvs8t2oi	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ui002fosy3rtin7h52
cmscxfqtk005p4by34iufus31	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ui002josy3zbxuptpy
cmscxfqtk005q4by3virahpaf	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ui002mosy31hg5hc2b
cmscxfqtk005r4by3jgj8c8sh	cmqq6kc18002oedy34zqwpr8k	cmqq2r5ui002qosy35kfr488e
cmscxfqtk005s4by3zaifhqek	cmqq6kc18002oedy34zqwpr8k	cmscx98ab00014by3t09bt3ej
cmscxfqtk005t4by3ahs6n6ys	cmqq6kc18002oedy34zqwpr8k	cmscx98ab00024by3bnht0qwk
\.


--
-- Data for Name: Survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Survey" (survey_id, title, description, is_deleted, created_at, updated_at, slug, is_published) FROM stdin;
cmripy8eq0000c9y31vpvy7as	Customer Survrey Satisfactory	We value your feedback. Please answer the following questions.	f	2026-07-13 04:25:11.954	2026-07-13 04:25:11.954	customer-survrey-satisfactory	f
cmrisosi80000woy31u1ke310	Event Feedback Survey	We appreciate your feedback regarding today's event.	f	2026-07-13 05:41:50.288	2026-07-13 05:41:50.288	event-feedback-survey	f
cms8jhx1m0000yuy37pzo60ez	test	test	f	2026-07-31 06:06:33.61	2026-07-31 06:06:33.61	test	f
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

COPY public."User" (user_id, email, is_deleted, created_at, updated_at, role_id, organization_id, is_active) FROM stdin;
cmqq5tmyi0042osy3p41hgb36	raminjoshua05@gmail.com	f	2026-06-23 04:44:12.282	2026-06-23 04:44:12.282	cmqq5lun2003yosy3elss5zqj	cmol5fmjt0001d2utc6jge2ug	t
cmscod7oo0007pfy3qxqgtp4u	t-jrrembulat@national-u.edu.ph	f	2026-08-03 03:33:56.904	2026-08-03 03:33:56.904	cmqq6inap002ledy3dp4fy667	cmol5fmjt0001d2utc6jge2ug	f
cmscot51a0001k8y3urzdecyx	joshuaramin146@gmail.com	f	2026-08-03 03:46:19.966	2026-08-03 03:46:19.966	cmqq6hvp3002kedy3vxzotiun	cmol6n0p70002d2uti0z7egl1	f
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
    ADD CONSTRAINT "Permission_resource_id_fkey" FOREIGN KEY (resource_id) REFERENCES public."Resource"(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


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
    ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES public."Permission"(permission_id) ON UPDATE CASCADE ON DELETE CASCADE;


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

