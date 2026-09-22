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
-- Name: BadgeRequirementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BadgeRequirementType" AS ENUM (
    'TOTAL_POINTS',
    'APPROVED_CONTRIBUTIONS',
    'APPROVED_MISINFORMATION',
    'APPROVED_MEDIA'
);


ALTER TYPE public."BadgeRequirementType" OWNER TO postgres;

--
-- Name: ClassificationMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ClassificationMethod" AS ENUM (
    'MANUAL',
    'AI',
    'HYBRID'
);


ALTER TYPE public."ClassificationMethod" OWNER TO postgres;

--
-- Name: ContributionClassification; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContributionClassification" AS ENUM (
    'PENDING',
    'MISINFORMATION',
    'FACTUAL'
);


ALTER TYPE public."ContributionClassification" OWNER TO postgres;

--
-- Name: ContributionSentiment; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContributionSentiment" AS ENUM (
    'POSITIVE',
    'NEGATIVE',
    'NEUTRAL'
);


ALTER TYPE public."ContributionSentiment" OWNER TO postgres;

--
-- Name: ContributionStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ContributionStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'DECLINED'
);


ALTER TYPE public."ContributionStatus" OWNER TO postgres;

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
    'PUBLISHED'
);


ALTER TYPE public."EducationStatus" OWNER TO postgres;

--
-- Name: RewardActionType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."RewardActionType" AS ENUM (
    'EXPERIENCE',
    'MISINFORMATION',
    'MEDIA'
);


ALTER TYPE public."RewardActionType" OWNER TO postgres;

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
    user_id text NOT NULL,
    location text
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
-- Name: badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.badges (
    badge_id text NOT NULL,
    name character varying(100) NOT NULL,
    slug text NOT NULL,
    description text,
    icon_url text,
    requirement_type public."BadgeRequirementType" NOT NULL,
    requirement_value integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.badges OWNER TO postgres;

--
-- Name: contributions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contributions (
    contribution_id text NOT NULL,
    type character varying(50) NOT NULL,
    content text NOT NULL,
    image_url text,
    source_url text,
    classification public."ContributionClassification" DEFAULT 'PENDING'::public."ContributionClassification",
    classification_method public."ClassificationMethod",
    confidence_score numeric(5,4),
    status public."ContributionStatus" DEFAULT 'PENDING'::public."ContributionStatus" NOT NULL,
    reviewed_by text,
    reviewed_at timestamp(3) without time zone,
    review_reason text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id text NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    slug text NOT NULL,
    barangay text NOT NULL,
    province text NOT NULL,
    region text NOT NULL,
    municipality text NOT NULL,
    sentiment public."ContributionSentiment",
    language text
);


ALTER TABLE public.contributions OWNER TO postgres;

--
-- Name: reward_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reward_levels (
    reward_level_id text NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    min_points integer NOT NULL,
    order_index integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reward_levels OWNER TO postgres;

--
-- Name: reward_point_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reward_point_rules (
    reward_point_rule_id text NOT NULL,
    action_type public."RewardActionType" NOT NULL,
    points integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reward_point_rules OWNER TO postgres;

--
-- Name: reward_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reward_transactions (
    reward_transaction_id text NOT NULL,
    user_id text NOT NULL,
    reward_point_rule_id text,
    contribution_id text NOT NULL,
    action_type public."RewardActionType" NOT NULL,
    points integer NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reward_transactions OWNER TO postgres;

--
-- Name: user_badges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_badges (
    user_badge_id text NOT NULL,
    user_id text NOT NULL,
    badge_id text NOT NULL,
    earned_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_badges OWNER TO postgres;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    preference_id text NOT NULL,
    default_language text DEFAULT 'ENGLISH'::text NOT NULL,
    email_notifications boolean DEFAULT true NOT NULL,
    email_security_alerts boolean DEFAULT true NOT NULL,
    email_system_notifications boolean DEFAULT true NOT NULL,
    email_activity_notifications boolean DEFAULT true NOT NULL,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL,
    user_id text NOT NULL
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- Name: user_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_rewards (
    user_reward_id text NOT NULL,
    user_id text NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    current_level_id text,
    created_at timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.user_rewards OWNER TO postgres;

--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (activity_logs_id, type, decription, is_deleted, created_at, updated_at, user_id) FROM stdin;
cmtsaq7on00001wy3uxgeoc0u	LOGIN	User successfully logged into the system.	f	2026-09-08 06:36:09.959	2026-09-08 06:36:09.959	cmqq5tmyi0042osy3p41hgb36
cmtsayzvj00004vy3axnqp4yn	LOGIN	User successfully logged into the system.	f	2026-09-08 06:42:59.743	2026-09-08 06:42:59.743	cmqq5tmyi0042osy3p41hgb36
cmtsbbqd400024vy35snynqam	LOGIN	User successfully logged into the system.	f	2026-09-08 06:52:53.944	2026-09-08 06:52:53.944	cmqq5tmyi0042osy3p41hgb36
cmtwfhkuz0001nty3efk68r6c	LOGIN	User successfully logged into the system.	f	2026-09-11 04:00:29.915	2026-09-11 04:00:29.915	cmqq5tmyi0042osy3p41hgb36
cmu0gpi0p00014hy3sguxb8ob	LOGIN	User successfully logged into the system.	f	2026-09-13 23:45:43.801	2026-09-13 23:45:43.801	cmqq5tmyi0042osy3p41hgb36
cmu1wmsz100017ry3v3jp1x1m	LOGIN	User successfully logged into the system.	f	2026-09-14 23:59:18.061	2026-09-14 23:59:18.061	cmqq5tmyi0042osy3p41hgb36
cmu3cntp20001d9y39ynne2dj	LOGIN	User successfully logged into the system.	f	2026-09-16 00:15:45.686	2026-09-16 00:15:45.686	cmqq5tmyi0042osy3p41hgb36
cmu3cyc9n0002d9y3wq819kvl	Logged Out	User logged out of the system.	f	2026-09-16 00:23:56.315	2026-09-16 00:23:56.315	cmqq5tmyi0042osy3p41hgb36
cmu3cyu0s0004d9y3c14hxsml	LOGIN	User successfully logged into the system.	f	2026-09-16 00:24:19.324	2026-09-16 00:24:19.324	cmqq5tmyi0042osy3p41hgb36
cmu4qt1b30000d3y3ocqxql0h	Logged Out	User logged out of the system.	f	2026-09-16 23:39:29.631	2026-09-16 23:39:29.631	cmqq5tmyi0042osy3p41hgb36
cmu4rc6wv0001yby3jk6uxmkf	LOGIN	User successfully logged into the system.	f	2026-09-16 23:54:23.359	2026-09-16 23:54:23.359	cmqq5tmyi0042osy3p41hgb36
cmu4tujik0000j6y3d7lk7pzn	UPDATE	User updated the educational resource testing	f	2026-09-17 01:04:38.732	2026-09-17 01:04:38.732	cmqq5tmyi0042osy3p41hgb36
cmu4tuo360001j6y3liqh2752	UPDATE	User updated the educational resource testing	f	2026-09-17 01:04:44.658	2026-09-17 01:04:44.658	cmqq5tmyi0042osy3p41hgb36
cmu4tupgd0002j6y3q8xh3g85	UPDATE	User updated the educational resource testing	f	2026-09-17 01:04:46.429	2026-09-17 01:04:46.429	cmqq5tmyi0042osy3p41hgb36
cmu4tvhfs0003j6y3knq9ip80	UPDATE	User updated the educational resource asdasdddd	f	2026-09-17 01:05:22.696	2026-09-17 01:05:22.696	cmqq5tmyi0042osy3p41hgb36
cmu4tw9tk0004j6y3caswihbe	UPDATE	User updated the educational resource asdasdddd	f	2026-09-17 01:05:59.481	2026-09-17 01:05:59.481	cmqq5tmyi0042osy3p41hgb36
cmu4u24of0000pry3co0z5odk	DELETE	User deleted the educational resource "testing".	f	2026-09-17 01:10:32.751	2026-09-17 01:10:32.751	cmqq5tmyi0042osy3p41hgb36
cmu4u54bd00002fy3to5zoalv	DELETE	User deleted the educational resource "testing".	f	2026-09-17 01:12:52.249	2026-09-17 01:12:52.249	cmqq5tmyi0042osy3p41hgb36
cmu50awmc00003zy3u54ew6a7	UPDATE	User updated the status of contribution ID: cmu4xged00000xmy3800311ql.	f	2026-09-17 04:05:19.908	2026-09-17 04:05:19.908	cmqq5tmyi0042osy3p41hgb36
cmu58gr7o0000oyy3ha8fbloi	DELETE	User deleted the educational resource "asdasdddd".	f	2026-09-17 07:53:49.764	2026-09-17 07:53:49.764	cmqq5tmyi0042osy3p41hgb36
cmu66vjv00001goy3xvmwtyza	LOGIN	User successfully logged into the system.	f	2026-09-17 23:57:07.02	2026-09-17 23:57:07.02	cmqq5tmyi0042osy3p41hgb36
cmu6hlbbj0000tey37yblykug	Logged Out	User logged out of the system.	f	2026-09-18 04:57:05.167	2026-09-18 04:57:05.167	cmqq5tmyi0042osy3p41hgb36
cmu6hs70v0002tey335i9vq62	LOGIN	User successfully logged into the system.	f	2026-09-18 05:02:26.191	2026-09-18 05:02:26.191	cmqq5tmyi0042osy3p41hgb36
cmuby6erx0001tjy3sb52bwle	LOGIN	User successfully logged into the system.	f	2026-09-22 00:40:14.157	2026-09-22 00:40:14.157	cmqq5tmyi0042osy3p41hgb36
cmuc3r6dt0000ycy3imrsfau8	DELETE	User deleted the account of Joshua Testing.	f	2026-09-22 03:16:21.137	2026-09-22 03:16:21.137	cmqq5tmyi0042osy3p41hgb36
cmuc3sq820000x2y3ki6mhlyp	DELETE	User deleted the account of Joshua Testing.	f	2026-09-22 03:17:33.506	2026-09-22 03:17:33.506	cmqq5tmyi0042osy3p41hgb36
cmuc3wt140001x2y374dok6wq	DELETE	User deleted the account of Joshua Testing.	f	2026-09-22 03:20:43.768	2026-09-22 03:20:43.768	cmqq5tmyi0042osy3p41hgb36
cmuc3wukp0002x2y3mtr4r2dg	DELETE	User deleted the account of Joshua Rembulat.	f	2026-09-22 03:20:45.769	2026-09-22 03:20:45.769	cmqq5tmyi0042osy3p41hgb36
cmuc4wznz00015my33tlso7tp	DELETE	User deleted the survey "HIV Knowledge and Awareness Survey".	f	2026-09-22 03:48:51.983	2026-09-22 03:48:51.983	cmqq5tmyi0042osy3p41hgb36
cmuc4wzw900025my3lcg6c55z	DELETE	User deleted the survey "HIV Knowledge and Awareness Survey".	f	2026-09-22 03:48:52.281	2026-09-22 03:48:52.281	cmqq5tmyi0042osy3p41hgb36
cmuc51fbx00045my3lgly9k0p	DELETE	User deleted the survey "HIV Perspectives and Community Awareness".	f	2026-09-22 03:52:18.909	2026-09-22 03:52:18.909	cmqq5tmyi0042osy3p41hgb36
cmuc59dmr00055my3zkjn9g5w	DELETE	User deleted the survey "HIV Knowledge and Awareness Survey".	f	2026-09-22 03:58:29.955	2026-09-22 03:58:29.955	cmqq5tmyi0042osy3p41hgb36
cmuc6luo200085my37hv0hif7	CREATE	User created a new survey: HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey.	f	2026-09-22 04:36:11.522	2026-09-22 04:36:11.522	cmqq5tmyi0042osy3p41hgb36
cmuc73fxx0000f2y3uw8xn6g7	DELETE	User deleted the survey "HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey".	f	2026-09-22 04:49:52.245	2026-09-22 04:49:52.245	cmqq5tmyi0042osy3p41hgb36
cmuc7lj5f0001rgy3tnsqql7f	CREATE	User created a new role: Testing.	f	2026-09-22 05:03:56.211	2026-09-22 05:03:56.211	cmqq5tmyi0042osy3p41hgb36
cmuc7ta7k000099y3kicmfygj	DELETE	User delete a roel and permission: Testing	f	2026-09-22 05:09:57.872	2026-09-22 05:09:57.872	cmqq5tmyi0042osy3p41hgb36
cmuc805th000199y33zo1ajkr	DELETE	User deleted the survey "HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey".	f	2026-09-22 05:15:18.773	2026-09-22 05:15:18.773	cmqq5tmyi0042osy3p41hgb36
cmuc8dpm90000a0y3du4ehq5q	UPDATE	User published the survey "HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey".	f	2026-09-22 05:25:50.961	2026-09-22 05:25:50.961	cmqq5tmyi0042osy3p41hgb36
cmuc8jd530001a0y307nt6scn	UPDATE	User published the survey "HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey".	f	2026-09-22 05:30:14.727	2026-09-22 05:30:14.727	cmqq5tmyi0042osy3p41hgb36
cmuc8k9oc0000qpy3j6i944hv	UPDATE	User published the survey "HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey".	f	2026-09-22 05:30:56.892	2026-09-22 05:30:56.892	cmqq5tmyi0042osy3p41hgb36
cmuc8muth0001qpy3iz2ppawc	UPDATE	User published the survey "HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey".	f	2026-09-22 05:32:57.605	2026-09-22 05:32:57.605	cmqq5tmyi0042osy3p41hgb36
cmuc8xmah0002qpy36ljibl0t	Logged Out	User logged out of the system.	f	2026-09-22 05:41:19.769	2026-09-22 05:41:19.769	cmqq5tmyi0042osy3p41hgb36
cmuc9dp300004qpy3tzgshi5s	LOGIN	User successfully logged into the system.	f	2026-09-22 05:53:49.884	2026-09-22 05:53:49.884	cmqq5tmyi0042osy3p41hgb36
cmuc9kqc60007qpy33xlcqzuo	CREATE	User created a new survey: Misinformation and Digital Discourse.	f	2026-09-22 05:59:18.102	2026-09-22 05:59:18.102	cmqq5tmyi0042osy3p41hgb36
cmuc9sdag0003xky3t72tvbqr	UPDATE	User published the survey "Misinformation and Digital Discourse".	f	2026-09-22 06:05:14.44	2026-09-22 06:05:14.44	cmqq5tmyi0042osy3p41hgb36
cmuc9tlay0006xky351lnl2ha	CREATE	User created a new survey: Stigma, Discrimination, and Community Attitudes.	f	2026-09-22 06:06:11.482	2026-09-22 06:06:11.482	cmqq5tmyi0042osy3p41hgb36
cmucafya900023by37px8ei3n	CREATE	User created a new survey: Solutions and Community Engagement.	f	2026-09-22 06:23:34.737	2026-09-22 06:23:34.737	cmqq5tmyi0042osy3p41hgb36
cmucahv0n00093by3rb3r3s2t	UPDATE	User published the survey "Stigma, Discrimination, and Community Attitudes".	f	2026-09-22 06:25:03.815	2026-09-22 06:25:03.815	cmqq5tmyi0042osy3p41hgb36
cmucahzzl000a3by32a4cona7	UPDATE	User published the survey "Solutions and Community Engagement".	f	2026-09-22 06:25:10.257	2026-09-22 06:25:10.257	cmqq5tmyi0042osy3p41hgb36
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
cmtfdgja9000a74utb7p23px7	Macintosh	::1	2026-08-31 05:31:36.989	f	f	2026-08-30 05:31:36.993	2026-08-30 05:31:36.993	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36
cmtji3l6g0000nny3c9efae0o	Unknown	::1	2026-09-03 02:52:35.693	f	f	2026-09-02 02:52:35.704	2026-09-02 02:52:35.704	cmqq5tmyi0042osy3p41hgb36	Unknown	Desktop	iOS	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0
cmtjm4q6o00006iy3mv9o9k3m	Macintosh	::1	2026-09-03 04:45:27.302	f	f	2026-09-02 04:45:27.312	2026-09-02 04:45:27.312	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtjmn42f0000rsy3yqdyxz6c	Unknown	::1	2026-09-03 04:59:45.102	f	f	2026-09-02 04:59:45.112	2026-09-02 04:59:45.112	cmqq5tmyi0042osy3p41hgb36	Unknown	Desktop	iOS	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0
cmtkqai740000c2y3xj8dt6h6	Macintosh	::1	2026-09-03 23:29:41.526	f	f	2026-09-02 23:29:41.536	2026-09-02 23:29:41.536	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtl3afpt0000shy3gosx0elp	Unknown	::1	2026-09-04 05:33:33.319	f	f	2026-09-03 05:33:33.329	2026-09-03 05:33:33.329	cmqq5tmyi0042osy3p41hgb36	Unknown	Desktop	iOS	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0
cmtmadrz900000ry30qnqqtzp	Macintosh	::1	2026-09-05 01:39:52.663	f	f	2026-09-04 01:39:52.677	2026-09-04 01:39:52.677	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtqm8xsr00008xy3uw2kwl7i	Macintosh	::1	2026-09-08 02:23:07.024	f	f	2026-09-07 02:23:07.035	2026-09-07 02:23:07.035	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtqve1be00005fy3n40rgndj	Macintosh	::1	2026-09-08 06:39:01.407	f	f	2026-09-07 06:39:01.418	2026-09-07 06:39:01.418	cmscod7oo0007pfy3qxqgtp4u	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtqvmtgg0000o0y38cxgtypf	Macintosh	::1	2026-09-08 06:45:51.127	f	f	2026-09-07 06:45:51.136	2026-09-07 06:45:51.136	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtry5dvk0000jgy383bw2by0	Macintosh	::1	2026-09-09 00:44:02.803	f	f	2026-09-08 00:44:02.816	2026-09-08 00:44:02.816	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtsalfl5000031y30qwp3jyv	Macintosh	::1	2026-09-09 06:32:26.911	f	f	2026-09-08 06:32:26.921	2026-09-08 06:32:26.921	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtsax2z500011wy3ebh3vxzu	Macintosh	::1	2026-09-09 06:41:30.445	f	f	2026-09-08 06:41:30.449	2026-09-08 06:41:30.449	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtsbbqci00014vy3ca2m5zy8	Macintosh	::1	2026-09-09 06:52:53.919	f	f	2026-09-08 06:52:53.922	2026-09-08 06:52:53.922	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmtwfhku80000nty3d7swqbx5	Macintosh	::1	2026-09-12 04:00:29.877	f	f	2026-09-11 04:00:29.888	2026-09-11 04:00:29.888	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu0gpi0100004hy33l0irj64	Macintosh	::1	2026-09-14 23:45:43.759	f	f	2026-09-13 23:45:43.777	2026-09-13 23:45:43.777	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu1wmsyd00007ry3a30uy6vf	Macintosh	::1	2026-09-15 23:59:18.027	f	f	2026-09-14 23:59:18.037	2026-09-14 23:59:18.037	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu3cntob0000d9y3tw7b8g88	Macintosh	::1	2026-09-17 00:15:45.65	f	f	2026-09-16 00:15:45.66	2026-09-16 00:15:45.66	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu3cyu000003d9y32kvl4rbn	Macintosh	::1	2026-09-17 00:24:19.293	f	f	2026-09-16 00:24:19.296	2026-09-16 00:24:19.296	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu4rc6w40000yby3mq5s0qtd	Macintosh	::1	2026-09-17 23:54:23.313	f	f	2026-09-16 23:54:23.332	2026-09-16 23:54:23.332	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu66vju80000goy3ibbmwptm	Macintosh	::1	2026-09-18 23:57:06.971	f	f	2026-09-17 23:57:06.992	2026-09-17 23:57:06.992	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmu6hs7020001tey3n0io0uhe	Macintosh	::1	2026-09-19 05:02:26.158	f	f	2026-09-18 05:02:26.162	2026-09-18 05:02:26.162	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36
cmuby6era0000tjy3epvgqkgk	Macintosh	::1	2026-09-23 00:40:14.125	f	f	2026-09-22 00:40:14.134	2026-09-22 00:40:14.134	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36
cmuc9dp280003qpy3cp6rbnit	Macintosh	::1	2026-09-23 05:53:49.85	f	f	2026-09-22 05:53:49.856	2026-09-22 05:53:49.856	cmqq5tmyi0042osy3p41hgb36	Chrome	Desktop	macOS	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36
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

COPY public."EducationResource" (education_resource_id, title, content, is_deleted, created_at, updated_at, user_id, slug, category_id, is_featured, published_at, status, summary, type, external_link) FROM stdin;
cmu3jt2sv0000epy3l8m7fbx4	testing	<p><span style="white-space: pre-wrap;">do be shy, just become a man I need</span></p>	t	2026-09-16 03:35:48.079	2026-09-17 01:12:52.186	cmqq5tmyi0042osy3p41hgb36	testing	cmroauuqj0000lhy3a12v1tdm	f	\N	PUBLISHED	testing	ARTICLE	
cmu3k5nxq00015xy3uhthuazq	asdasdddd	<p><span style="white-space: pre-wrap;">aasasddd</span></p>	t	2026-09-16 03:45:35.342	2026-09-17 07:53:49.705	cmqq5tmyi0042osy3p41hgb36	asdasdddd	cmroauuqj0000lhy3a12v1tdm	f	\N	PUBLISHED	asdsadasdassadddddasda	ARTICLE	
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
cmtfde9lz00016dutilhvh0yu	raminjoshua05@gmail.com	login	2026-08-30 05:39:51.143	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36	\N	2026-08-30 05:29:51.143	9da35436b716bfd9124134c6b2f7f4456a9967ee19b884700d1f74abbcfd2395
cmtia14g00000jhy3c1w47xdw	raminjoshua05@gmail.com	login	2026-09-01 06:28:57.596	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-01 06:18:57.6	5a46ebaad5c8ec5629cd5d79c8d51e80b589a01240fb3da709c781868cdf237b
cmtjhpzad0000ahy3m19tqv03	raminjoshua05@gmail.com	login	2026-09-02 02:52:00.803	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-02 02:42:00.805	eb2e62e74f6bb5b6c94e4523e3ee72e823f166ee7968feaa67ab748b643b0ed2
cmtjhus4y0001ahy33900qsgo	raminjoshua05@gmail.com	login	2026-09-02 02:55:44.817	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-02 02:45:44.818	481f587a73cfa9e8b9a96c4eec57020c2f7d80c901a98e3881dff6a141b71049
cmtjhw0t70002ahy3ab06gybp	raminjoshua05@gmail.com	login	2026-09-02 02:56:42.714	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-02 02:46:42.715	285e4dd244c3bd843743609a73f414c01cc37c64d1e286af82ff0320fc1ab443
cmtjhwycx0003ahy3ywrydpse	raminjoshua05@gmail.com	login	2026-09-02 02:57:26.193	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-02 02:47:26.193	2fa9bddd12d06805c38e54f05a72aa5b8d57debfefb1ab4c813aaad3b7dd0799
cmtjhztlz0004ahy31g8sawzi	raminjoshua05@gmail.com	login	2026-09-02 02:59:40.007	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-02 02:49:40.007	b30265512cbe36f258119bcd357a011ba3d4bf61c394cd4373a7ecabc636de11
cmtjm4d790005ahy3vlfcl75m	raminjoshua05@gmail.com	login	2026-09-02 04:55:10.484	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-02 04:45:10.485	8a141ae8f386544526745d7372b9210e15eeb02dd44f9af2501e9e5880152be4
cmtjmmtws0006ahy3tzfqzcgq	raminjoshua05@gmail.com	login	2026-09-02 05:09:31.947	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-02 04:59:31.948	46fb9ba5393326d5a2bece5d2bd6d6489e3bc3d37c79cd46753e195497f63fa5
cmtkqa68d0000b1y3pcr0zso9	raminjoshua05@gmail.com	login	2026-09-02 23:39:26.026	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-02 23:29:26.029	c46ee4a58611852155ad5a2e4065cb25ce477292fabe28b85e06f093f213625b
cmtl39wk20000rey305ewxtrm	raminjoshua05@gmail.com	login	2026-09-03 05:43:08.495	t	0	5	::1	advocaid/1 CFNetwork/3860.600.12 Darwin/25.5.0	\N	2026-09-03 05:33:08.498	a1a85b99cb548d4b88b6365e059f2e8d1a1fa184e2a6db12342812c84b1b6413
cmtmadbso0000zpy3p7pqq03u	raminjoshua05@gmail.com	login	2026-09-04 01:49:31.701	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-04 01:39:31.704	bd44a3adda2312987fb34f1a53381791066bb0e57b8df8a0302c4038d95721cc
cmtqm8fob00007ty36irvvvqq	raminjoshua05@gmail.com	login	2026-09-07 02:32:43.544	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-07 02:22:43.547	85b4dc38f847a96491d7b5bfec68488be9ae468ff72857f2dd47fec57c2891f9
cmtqvctv70000zly3o46h1awx	t-jrrembulat@national-u.edu.ph	login	2026-09-07 06:48:05.104	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-07 06:38:05.107	d204cb4930475e264df43cc8f46d38400842e3c91bf38a8a567e6fd80ce75b92
cmtqvexju0001zly3ibmdj655	raminjoshua05@gmail.com	login	2026-09-07 06:49:43.194	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-07 06:39:43.194	5d2fdac9cf1ca72b04aa75380bfa834c804e57fd1f1edbb9e9125f0337d3b90f
cmtry51110000icy3dgcptb97	raminjoshua05@gmail.com	login	2026-09-08 00:53:46.162	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-08 00:43:46.165	490cd917a7bc0c065ca0685314a0d75516b2e4d7fe857aa1c71f1b66e7cdbf89
cmtsal0ay0000r8y3rerqxac8	raminjoshua05@gmail.com	login	2026-09-08 06:42:07.11	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-08 06:32:07.114	d370b8d5802e538636ce2b063b036c10fdf20ffbcf2435b36c039e33d88669dd
cmtsawun90001r8y3sf7ipice	raminjoshua05@gmail.com	login	2026-09-08 06:51:19.652	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-08 06:41:19.653	00cbca3b76e2876afe3fcdceb9702751d4d5d47bdb8352946884da66eb0439a3
cmtsbbidh0002r8y3bje3ydwn	raminjoshua05@gmail.com	login	2026-09-08 07:02:43.589	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-08 06:52:43.589	065e01eba79c2e34ea8ed44ab32e6305def626e8504b72e22c2bfe7591053af0
cmtwfh9w80000mry3ufyfwj66	raminjoshua05@gmail.com	login	2026-09-11 04:10:15.701	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-11 04:00:15.704	22ed6eb08f2d01d030e8fb8b2f8c4ffec15d9998f7d9cbcd0e6f7d6fcb271ec4
cmu0gp8n800003gy3vo3aap1e	raminjoshua05@gmail.com	login	2026-09-13 23:55:31.649	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-13 23:45:31.652	511ef8f27ca1a5f0d34b56f60b8918babc584640483131a1a7fa915e6795a13b
cmu1wmgdj00016ly3pmswesy4	raminjoshua05@gmail.com	login	2026-09-15 00:09:01.734	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-14 23:59:01.735	7bc08c0b2aeb9cc7ce4ed65864eb95f00f8e4ebfb517ff888ba5ced567838c8c
cmu1wkkc300006ly3hv3lg9cv	raminjoshua05@gmail.com	login	2026-09-15 00:07:33.552	t	3	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-14 23:57:33.555	a30453f4727e24b12ce5eca9551a4652b34e0808da111e24c0becc63e69778cc
cmu3c3b4f0000c5y36bvx2lpr	raminjoshua05@gmail.com	login	2026-09-16 00:09:48.492	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-15 23:59:48.495	708551a52a984269828ae8515ba8adeaf5887840e2560769314081a8ef94e239
cmu3cnfyh0001c5y30sx0qow9	raminjoshua05@gmail.com	login	2026-09-16 00:25:27.88	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-16 00:15:27.881	6b576dda66667390e6bd3e5a09e7d4aeb2595ccd3294854e546af0d657cc75ed
cmu3cyltt0002c5y3q1i4hdoh	raminjoshua05@gmail.com	login	2026-09-16 00:34:08.704	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-16 00:24:08.707	c717976ff496a6c10991f7d1d4ab0c42b9984667196aa2d2b0663cbebf197c5c
cmu4rbtbb0000bzy3eftyyenh	raminjoshua05@gmail.com	login	2026-09-17 00:04:05.732	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-16 23:54:05.735	5b10efb96cd4398b27c6cfc08ae0922ad5ae4909bfa05424bf88ec1eb61cdf2f
cmu66uyxy0000fmy3t6ag1ldf	raminjoshua05@gmail.com	login	2026-09-18 00:06:39.907	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-17 23:56:39.91	359ff6a61f1424122dc406b20bc5496d5061cc745ae003a4c0f3b886bb45e293
cmu6h6evc00006yy3gkq6b00b	joshuaramin146@gmail.com	login	2026-09-18 04:55:29.925	t	0	5	::1	PostmanRuntime/2.6.0	\N	2026-09-18 04:45:29.928	3ff4ee4f668255f07199a72cc7ac00f56624f6b01260d3ee5db74fef93d197c0
cmu6h7oku00016yy3gogobw1m	joshuaramin146@gmail.com	login	2026-09-18 04:56:29.165	f	0	5	::1	PostmanRuntime/2.6.0	\N	2026-09-18 04:46:29.166	ed34fabebcc376a30ed40e1745d453516fc30cd428af6271a938541727561609
cmu6hb4g900026yy33t3rxh3v	raminjoshua05@gmail.com	login	2026-09-18 04:59:09.704	t	0	5	::1	PostmanRuntime/2.6.0	\N	2026-09-18 04:49:09.705	eab9ef60e0aa6cc9e9596e5566ead322aac6a747855103b36140f0a7088ea2fb
cmu6hlhy200036yy3zm6dv83d	raminjoshua05@gmail.com	login	2026-09-18 05:07:13.753	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-18 04:57:13.754	3fe125def727961135076137180b79beb0f21e82815a5679eb5a48e201a90d94
cmu6hrafg00046yy34sl1d0xn	raminjoshua05@gmail.com	login	2026-09-18 05:11:43.947	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	\N	2026-09-18 05:01:43.948	16df92eb222c2fb3b3cd72d675f80576d7d3ad503c367ae4c7499c7dd186b92d
cmuby5zzi0000sey3vecwvmd7	raminjoshua05@gmail.com	login	2026-09-22 00:49:54.987	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	\N	2026-09-22 00:39:54.991	0adbf920e1c3615e1409b42998569b8e9c64630789f3cfd9365a7e9ce6483bc4
cmuc9deuw0000dzy389sai9zk	raminjoshua05@gmail.com	login	2026-09-22 06:03:36.63	t	0	5	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	\N	2026-09-22 05:53:36.632	d57e1ed801af7ba989dc4aa805ff3c5d76a0da545209f718842060de17550190
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Organization" (organization_id, name, is_deleted, created_at, updated_at, address, contact, logo) FROM stdin;
cmol5fmjt0001d2utc6jge2ug	National University	f	2026-04-30 07:15:03.017	2026-04-30 07:15:03.017	551 M.F. Jhocson Street, Sampaloc, Manila, Philippines, 1008	(+63) 949 9999 999	https://d2i0afz2m2bklk.cloudfront.net/1777533302716-NU_shield.svg
cmol6n0p70002d2uti0z7egl1	Department of Health	t	2026-04-30 07:48:47.563	2026-09-22 03:25:39.66	San Lazaro Compound, Rizal Avenue, Santa Cruz, Manila, Philippines, 1003	(+63) 949 9999 999	https://d2i0afz2m2bklk.cloudfront.net/1777535326879-Department_of_Health_(DOH)_PHL.svg.png
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

COPY public."Profile" (profile_id, first_name, last_name, is_deleted, created_at, updated_at, user_id, location) FROM stdin;
cmqq5tmyv0043osy3cytmcb49	Joshua	Ramin	f	2026-06-23 04:44:12.282	2026-06-23 04:44:12.282	cmqq5tmyi0042osy3p41hgb36	\N
cmscod7p60008pfy3ndxu641q	Joshua	Rembulat	f	2026-08-03 03:33:56.904	2026-08-03 03:33:56.904	cmscod7oo0007pfy3qxqgtp4u	\N
cmscot51o0002k8y31826zj7j	Joshua	Testing	f	2026-08-03 03:46:19.966	2026-08-03 03:46:19.966	cmscot51a0001k8y3urzdecyx	\N
\.


--
-- Data for Name: QuestionOption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuestionOption" (question_option_id, survey_question_id, label, value, order_index, is_deleted, created_at, updated_at) FROM stdin;
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
cmts0k9d5000cjgy3sxg1uiaa	General Public	Intended for individuals who access Advocaid PH to explore publicly available HIV/AIDS-related information, trends, and educational resources. Users can view relevant content and insights designed to promote awareness and understanding of HIV/AIDS without accessing restricted administrative, research, or analytical functions.	f	2026-09-08 01:51:36.041	2026-09-08 01:51:36.041	general-public
cmuc7lj2a0000rgy3oywpkcao	Testing	asdadsadas	t	2026-09-22 05:03:56.098	2026-09-22 05:09:57.741	testing
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
cmts0o5yr000djgy31bf14vnh	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5u2000aosy3pz3559vs
cmts0o5yr000ejgy3o67gq92l	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5u8000oosy3xl39h9u3
cmts0o5yr000fjgy38e0n31m3	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5ua000vosy3frn7ac7v
cmts0o5yr000gjgy36ahrbhd2	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5uc0019osy30dmv0jke
cmts0o5yr000hjgy3xhwd9d8b	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5ud001gosy3gdmyo5mr
cmts0o5yr000ijgy3036xu693	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5uf001uosy3zf9jd7i3
cmts0o5yr000jjgy3c351pzgo	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5ug0021osy3b5ud1cem
cmts0o5yr000kjgy3n2oj5pk7	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5uh0028osy3bpjlcra6
cmts0o5yr000ljgy37smfk4q2	cmts0k9d5000cjgy3sxg1uiaa	cmqq2r5ui002fosy3rtin7h52
cmts0o5yr000mjgy3rca7u47y	cmts0k9d5000cjgy3sxg1uiaa	cmscx98ab00014by3t09bt3ej
cmts0o5yr000njgy3q74ei72o	cmts0k9d5000cjgy3sxg1uiaa	cmscx98ab00024by3bnht0qwk
\.


--
-- Data for Name: Survey; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Survey" (survey_id, title, description, is_deleted, created_at, updated_at, slug, is_published) FROM stdin;
cmuc6lums00065my3ad9sq9ek	HIV Knowledge, Misinformation, Stigma, and Community Engagement Survey	This survey aims to understand community knowledge and perceptions of HIV, sources of HIV-related information, experiences with misinformation, attitudes toward people living with HIV, and ideas for improving HIV awareness and community support.	f	2026-09-22 04:36:11.476	2026-09-22 05:32:57.572	hiv-knowledge-misinformation-stigma-and-community-engagement-survey	t
cmuc9kqba0005qpy3t5824znl	Misinformation and Digital Discourse	This section focuses on HIV-related information encountered online and through social media. Your responses will help identify common myths, misconceptions, misleading claims, and how people determine whether HIV information is accurate.	f	2026-09-22 05:59:18.071	2026-09-22 06:05:14.402	misinformation-and-digital-discourse	t
cmtrzjxic0001jgy32dv4hjug	Advocaid PH: AI-Powered Monitoring of HIV/AIDS Awareness, Misinformation, and Public Sentiment	This survey aims to gather insights on HIV/AIDS awareness, misinformation, and public sentiment, and to explore how AI and Natural Language Processing (NLP) can support monitoring and understanding HIV/AIDS-related discussions in the Philippines.	t	2026-09-08 01:23:21.06	2026-09-22 03:49:20.991	advocaid-ph-ai-powered-monitoring-of-hivaids-awareness-misinformation-and-public-sentiment	t
cmtmcf7cv000c0ry3znramslu	HIV Perspectives and Community Awareness	This survey explores participants’ perspectives, understanding, and awareness of HIV. Please provide detailed responses based on your knowledge, opinions, or observations.	t	2026-09-04 02:36:58.495	2026-09-22 03:52:18.88	hiv-perspectives-and-community-awareness	t
cmtmc4k8b00010ry3uu6uzch8	HIV Knowledge and Awareness Survey	This survey aims to assess participants’ basic knowledge and understanding of HIV, including its transmission, prevention, testing, treatment, and common misconceptions. Your responses will help identify areas where HIV education and awareness can be improved.	t	2026-09-04 02:28:41.963	2026-09-22 03:58:29.929	hiv-knowledge-and-awareness-survey	t
cmuc9tla20004xky3k9lvi8m2	Stigma, Discrimination, and Community Attitudes	This section explores how HIV and people living with HIV are perceived within the community. It also asks about experiences or observations of stigma, discrimination, fear, and barriers that may affect HIV testing and access to support.	f	2026-09-22 06:06:11.45	2026-09-22 06:25:03.801	stigma-discrimination-and-community-attitudes	t
cmucafy9900003by3jjiidtdm	Solutions and Community Engagement	This section asks for your ideas on improving HIV awareness, reducing stigma, strengthening community support, and developing programs, communication strategies, or digital tools that could better serve the community.	f	2026-09-22 06:23:34.701	2026-09-22 06:25:10.232	solutions-and-community-engagement	t
\.


--
-- Data for Name: SurveyAnswer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SurveyAnswer" (answer_id, survey_response_id, survey_question_id, answer_text, answer_option_id, created_at, updated_at) FROM stdin;
cmtqtesr2000cqry31rrz4m8e	cmtqtesqq000bqry34gw6b512	cmtmc4k8w00020ry3as0tiusl	asdasd	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000dqry34emabclh	cmtqtesqq000bqry34gw6b512	cmtmc4nq500030ry3kw8uzlo9	asdasd	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000eqry3jeb0mdtk	cmtqtesqq000bqry34gw6b512	cmtmc4pa200040ry3dguqzq10	asdad	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000fqry3g4d9z26f	cmtqtesqq000bqry34gw6b512	cmtmc4q7u00050ry3wlnjuzg7	asdasdasd	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000gqry3ve1suro8	cmtqtesqq000bqry34gw6b512	cmtmc4qrq00060ry3e32j6fj7	adasdas	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000hqry3o4jkuc5d	cmtqtesqq000bqry34gw6b512	cmtmc4rai00070ry31f1sga3v	asdad	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000iqry3e55p9hxs	cmtqtesqq000bqry34gw6b512	cmtmc4rqx00080ry3snopir3z	asdasd	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000jqry3o7bg54nx	cmtqtesqq000bqry34gw6b512	cmtmc4s7400090ry3cnxx1zbp	asdasd	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000kqry3ynlvp9x6	cmtqtesqq000bqry34gw6b512	cmtmc4smx000a0ry3x8jvl22w	asdad	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmtqtesr2000lqry3sra3s41g	cmtqtesqq000bqry34gw6b512	cmtmc4t1p000b0ry3r9bircyy	asdad	\N	2026-09-07 05:43:37.73	2026-09-07 05:43:37.73
cmu26jeki0001rcy3se6d2zey	cmu26jek30000rcy3b6dzx326	cmtmc4k8w00020ry3as0tiusl	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0002rcy3vxz3m3hi	cmu26jek30000rcy3b6dzx326	cmtmc4nq500030ry3kw8uzlo9	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0003rcy3qaxwt5w9	cmu26jek30000rcy3b6dzx326	cmtmc4pa200040ry3dguqzq10	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0004rcy3slub9d9j	cmu26jek30000rcy3b6dzx326	cmtmc4q7u00050ry3wlnjuzg7	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0005rcy304pt6b2t	cmu26jek30000rcy3b6dzx326	cmtmc4qrq00060ry3e32j6fj7	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0006rcy3ugrkmoyx	cmu26jek30000rcy3b6dzx326	cmtmc4rai00070ry31f1sga3v	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0007rcy33lnwr2e9	cmu26jek30000rcy3b6dzx326	cmtmc4rqx00080ry3snopir3z	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0008rcy3ytadgux4	cmu26jek30000rcy3b6dzx326	cmtmc4s7400090ry3cnxx1zbp	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki0009rcy3m70akq0s	cmu26jek30000rcy3b6dzx326	cmtmc4smx000a0ry3x8jvl22w	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu26jeki000arcy3nu81ey1b	cmu26jek30000rcy3b6dzx326	cmtmc4t1p000b0ry3r9bircyy	a	\N	2026-09-15 04:36:35.571	2026-09-15 04:36:35.571
cmu27m13d0001fwy30im4x7ah	cmu27m12t0000fwy3c2q6dc1c	cmtmc4k8w00020ry3as0tiusl	sd	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0002fwy3j80tv5h0	cmu27m12t0000fwy3c2q6dc1c	cmtmc4nq500030ry3kw8uzlo9	d	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0003fwy3zqhsejov	cmu27m12t0000fwy3c2q6dc1c	cmtmc4pa200040ry3dguqzq10	d	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0004fwy3i0uiogbl	cmu27m12t0000fwy3c2q6dc1c	cmtmc4q7u00050ry3wlnjuzg7	d	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0005fwy3mevpmw5u	cmu27m12t0000fwy3c2q6dc1c	cmtmc4qrq00060ry3e32j6fj7	dasds	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0006fwy3wixkhgdw	cmu27m12t0000fwy3c2q6dc1c	cmtmc4rai00070ry31f1sga3v	asdas	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0007fwy3fesdy14h	cmu27m12t0000fwy3c2q6dc1c	cmtmc4rqx00080ry3snopir3z	asdasd	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0008fwy30icc35lc	cmu27m12t0000fwy3c2q6dc1c	cmtmc4s7400090ry3cnxx1zbp	asdasd	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d0009fwy3pdaymdjd	cmu27m12t0000fwy3c2q6dc1c	cmtmc4smx000a0ry3x8jvl22w	asda	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu27m13d000afwy3gs96perp	cmu27m12t0000fwy3c2q6dc1c	cmtmc4t1p000b0ry3r9bircyy	asda	\N	2026-09-15 05:06:37.685	2026-09-15 05:06:37.685
cmu2av9700001imitf4f4zjmv	cmu2av96l0000imit5hu17lfe	cmtmc4k8w00020ry3as0tiusl	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700002imit6tmd4aj4	cmu2av96l0000imit5hu17lfe	cmtmc4nq500030ry3kw8uzlo9	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700003imitx62l00ta	cmu2av96l0000imit5hu17lfe	cmtmc4pa200040ry3dguqzq10	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700004imitwfsnfjgc	cmu2av96l0000imit5hu17lfe	cmtmc4q7u00050ry3wlnjuzg7	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700005imit84wj802o	cmu2av96l0000imit5hu17lfe	cmtmc4qrq00060ry3e32j6fj7	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700006imityu453l0f	cmu2av96l0000imit5hu17lfe	cmtmc4rai00070ry31f1sga3v	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700007imit9m7671o2	cmu2av96l0000imit5hu17lfe	cmtmc4rqx00080ry3snopir3z	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700008imit5nvkr1b2	cmu2av96l0000imit5hu17lfe	cmtmc4s7400090ry3cnxx1zbp	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av9700009imitr8c9ikzk	cmu2av96l0000imit5hu17lfe	cmtmc4smx000a0ry3x8jvl22w	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu2av970000aimit7xjpnqhy	cmu2av96l0000imit5hu17lfe	cmtmc4t1p000b0ry3r9bircyy	a	\N	2026-09-15 06:37:46.941	2026-09-15 06:37:46.941
cmu4wxyhy0001ppy3twlnyl7h	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4k8w00020ry3as0tiusl	asdas	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0002ppy3jdr22w1s	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4nq500030ry3kw8uzlo9	asdas	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0003ppy3dworow29	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4pa200040ry3dguqzq10	asdasd	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0004ppy3dr921ggb	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4q7u00050ry3wlnjuzg7	asdas	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0005ppy3og6zxp3t	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4qrq00060ry3e32j6fj7	asd	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0006ppy37931zwmi	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4rai00070ry31f1sga3v	asdasd	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0007ppy387nfno11	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4rqx00080ry3snopir3z	sadasd	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0008ppy30861ewqf	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4s7400090ry3cnxx1zbp	asdas	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy0009ppy3c38stidu	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4smx000a0ry3x8jvl22w	asdsd	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu4wxyhy000appy3lyjsocx7	cmu4wxyhk0000ppy36n0cnqfs	cmtmc4t1p000b0ry3r9bircyy	asd	\N	2026-09-17 02:31:16.952	2026-09-17 02:31:16.952
cmu6male80004tey30unkrm6w	cmu6maldv0003tey3jqctt3ld	cmtmc4k8w00020ry3as0tiusl	WEWE	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male90005tey3ck1jtndv	cmu6maldv0003tey3jqctt3ld	cmtmc4nq500030ry3kw8uzlo9	WEWEW	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male90006tey3zo3da6a9	cmu6maldv0003tey3jqctt3ld	cmtmc4pa200040ry3dguqzq10	WEWE	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male90007tey3iphomgko	cmu6maldv0003tey3jqctt3ld	cmtmc4q7u00050ry3wlnjuzg7	WEWE	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male90008tey3xq7dlqbd	cmu6maldv0003tey3jqctt3ld	cmtmc4qrq00060ry3e32j6fj7	WEW	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male90009tey3za5t3xbx	cmu6maldv0003tey3jqctt3ld	cmtmc4rai00070ry31f1sga3v	EWE	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male9000atey3lfelql05	cmu6maldv0003tey3jqctt3ld	cmtmc4rqx00080ry3snopir3z	WEW	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male9000btey3rmk1svq6	cmu6maldv0003tey3jqctt3ld	cmtmc4s7400090ry3cnxx1zbp	EWE	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male9000ctey3m2t9qoyb	cmu6maldv0003tey3jqctt3ld	cmtmc4smx000a0ry3x8jvl22w	WEWEW	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmu6male9000dtey3ob3oq376	cmu6maldv0003tey3jqctt3ld	cmtmc4t1p000b0ry3r9bircyy	WEWEW	\N	2026-09-18 07:08:43.075	2026-09-18 07:08:43.075
cmuc2ddzb00014zy3o0vrv5d4	cmuc2ddyz00004zy33lotegv0	cmtmc4k8w00020ry3as0tiusl	sdfsd	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzb00024zy3q5tc7qzv	cmuc2ddyz00004zy33lotegv0	cmtmc4nq500030ry3kw8uzlo9	sdfsdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00034zy37f8lqfno	cmuc2ddyz00004zy33lotegv0	cmtmc4pa200040ry3dguqzq10	sdfsd	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00044zy3k1fgk66a	cmuc2ddyz00004zy33lotegv0	cmtmc4q7u00050ry3wlnjuzg7	dfsdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00054zy34p88o1re	cmuc2ddyz00004zy33lotegv0	cmtmc4qrq00060ry3e32j6fj7	sdfsdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00064zy3gexa5ayc	cmuc2ddyz00004zy33lotegv0	cmtmc4rai00070ry31f1sga3v	sdfsdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00074zy3mf0hc67d	cmuc2ddyz00004zy33lotegv0	cmtmc4rqx00080ry3snopir3z	sdfsdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00084zy3pgoqio7a	cmuc2ddyz00004zy33lotegv0	cmtmc4s7400090ry3cnxx1zbp	sfdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc00094zy37mlugby5	cmuc2ddyz00004zy33lotegv0	cmtmc4smx000a0ry3x8jvl22w	sdf	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc2ddzc000a4zy3am2szi4r	cmuc2ddyz00004zy33lotegv0	cmtmc4t1p000b0ry3r9bircyy	sdfs	\N	2026-09-22 02:37:38.171	2026-09-22 02:37:38.171
cmuc6pq8l000f5my33g345klg	cmuc6pq89000e5my3j2j3xzfw	cmuc6lun900075my3qeuiw3qg	Sakit sa katawan	\N	2026-09-22 04:39:12.393	2026-09-22 04:39:12.393
cmuc6pq8l000g5my3dn4azqdl	cmuc6pq89000e5my3j2j3xzfw	cmuc6m8bt00095my3z240ytmo	sa kantutan at sa sugat sa labi	\N	2026-09-22 04:39:12.393	2026-09-22 04:39:12.393
cmuc6pq8l000h5my3u72uuwq9	cmuc6pq89000e5my3j2j3xzfw	cmuc6mipg000a5my3uxmj09st	Wala akong alam	\N	2026-09-22 04:39:12.393	2026-09-22 04:39:12.393
cmuc6pq8l000i5my3l526rhf2	cmuc6pq89000e5my3j2j3xzfw	cmuc6mp0b000b5my3gc72as8r	sa clinic, at sa mga seminar ng mga DOH	\N	2026-09-22 04:39:12.393	2026-09-22 04:39:12.393
cmuc6pq8l000j5my3r1z16bjk	cmuc6pq89000e5my3j2j3xzfw	cmuc6mrgx000c5my3ftmspkhc	Wala, halos lahat kasi sa social media nag popost ng misinformation	\N	2026-09-22 04:39:12.393	2026-09-22 04:39:12.393
cmuc6pq8l000k5my3ueakgrat	cmuc6pq89000e5my3j2j3xzfw	cmuc6msy6000d5my3pf8tq8zr	di ko alam	\N	2026-09-22 04:39:12.393	2026-09-22 04:39:12.393
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
cmtrzksa50006jgy3qwaip7xa	cmtrzjxic0001jgy32dv4hjug	What keywords or topics do you commonly associate with HIV/AIDS discussions online?	SHORT_TEXT	t	5	f	2026-09-08 01:24:00.941	2026-09-08 01:24:14.621
cmtmc4nq500030ry3kw8uzlo9	cmtmc4k8b00010ry3uu6uzch8	How is HIV transmitted?	SHORT_TEXT	t	2	f	2026-09-04 02:28:46.493	2026-09-04 02:29:16.726
cmtmc4k8w00020ry3as0tiusl	cmtmc4k8b00010ry3uu6uzch8	What do you know about HIV?	SHORT_TEXT	t	1	f	2026-09-04 02:28:41.963	2026-09-04 02:29:18.36
cmtmc4pa200040ry3dguqzq10	cmtmc4k8b00010ry3uu6uzch8	What is HIV?	SHORT_TEXT	t	3	f	2026-09-04 02:28:48.506	2026-09-04 02:29:36.264
cmtmc4q7u00050ry3wlnjuzg7	cmtmc4k8b00010ry3uu6uzch8	What is AIDS?	SHORT_TEXT	t	4	f	2026-09-04 02:28:49.722	2026-09-04 02:29:45.815
cmtmc4qrq00060ry3e32j6fj7	cmtmc4k8b00010ry3uu6uzch8	How can HIV be prevented?	SHORT_TEXT	t	5	f	2026-09-04 02:28:50.438	2026-09-04 02:29:54.157
cmtmc4rai00070ry31f1sga3v	cmtmc4k8b00010ry3uu6uzch8	Where can someone get an HIV test?	SHORT_TEXT	t	6	f	2026-09-04 02:28:51.114	2026-09-04 02:30:02.258
cmtmc4rqx00080ry3snopir3z	cmtmc4k8b00010ry3uu6uzch8	Why is HIV testing important?	SHORT_TEXT	t	7	f	2026-09-04 02:28:51.705	2026-09-04 02:30:09.245
cmtmc4s7400090ry3cnxx1zbp	cmtmc4k8b00010ry3uu6uzch8	What are common misconceptions about HIV?	SHORT_TEXT	t	8	f	2026-09-04 02:28:52.288	2026-09-04 02:30:16.763
cmtmc4smx000a0ry3x8jvl22w	cmtmc4k8b00010ry3uu6uzch8	How can people living with HIV stay healthy?	SHORT_TEXT	t	9	f	2026-09-04 02:28:52.857	2026-09-04 02:30:24.124
cmtmc4t1p000b0ry3r9bircyy	cmtmc4k8b00010ry3uu6uzch8	How can we reduce HIV stigma?	SHORT_TEXT	t	10	f	2026-09-04 02:28:53.389	2026-09-04 02:30:30.339
cmtmcfetu000h0ry3v9badzbp	cmtmcf7cv000c0ry3znramslu	What misconceptions about HIV have you heard from other people?	LONG_TEXT	t	5	f	2026-09-04 02:37:08.178	2026-09-04 02:38:39.259
cmtmcff9d000i0ry3ajhknfm3	cmtmcf7cv000c0ry3znramslu	How do you think HIV stigma affects people living with HIV?	LONG_TEXT	t	6	f	2026-09-04 02:37:08.737	2026-09-04 02:38:49.521
cmtmcffq8000j0ry3m8awg71p	cmtmcf7cv000c0ry3znramslu	What can communities do to reduce HIV-related discrimination?	LONG_TEXT	t	7	f	2026-09-04 02:37:09.344	2026-09-04 02:38:57.586
cmtmcfe07000f0ry3sjn98p2f	cmtmcf7cv000c0ry3znramslu	What are some ways a person can protect themselves from HIV?	LONG_TEXT	t	3	f	2026-09-04 02:37:07.111	2026-09-04 02:37:47.369
cmtmcfg77000k0ry3ugrs27vp	cmtmcf7cv000c0ry3znramslu	What information about HIV do you think people need to learn more about?	LONG_TEXT	t	8	f	2026-09-04 02:37:09.955	2026-09-04 02:39:05.044
cmtmcfgr8000l0ry3nrxjyxpa	cmtmcf7cv000c0ry3znramslu	How can schools and communities improve HIV education and awareness?	LONG_TEXT	t	9	f	2026-09-04 02:37:10.676	2026-09-04 02:39:13.603
cmtmcfefw000g0ry3iyxs1wnu	cmtmcf7cv000c0ry3znramslu	Why do you think HIV testing is important?	LONG_TEXT	t	4	f	2026-09-04 02:37:07.676	2026-09-04 02:38:07.606
cmtmcfh41000m0ry3w32ytrus	cmtmcf7cv000c0ry3znramslu	What would you tell someone who is afraid to get tested for HIV?	LONG_TEXT	t	10	f	2026-09-04 02:37:11.137	2026-09-04 02:39:21.828
cmtrzl8a30007jgy3vqm5fm3b	cmtrzjxic0001jgy32dv4hjug	How do you think misinformation about HIV/AIDS on social media affects people's knowledge, attitudes, or decisions regarding HIV prevention and treatment?	LONG_TEXT	t	6	f	2026-09-08 01:24:21.675	2026-09-08 01:24:32.922
cmtmcf7d9000d0ry3dr1qd4b4	cmtmcf7cv000c0ry3znramslu	What do you understand about HIV and how it affects the human body?	LONG_TEXT	t	1	f	2026-09-04 02:36:58.495	2026-09-04 02:49:11.094
cmtrzl8mj0008jgy3524rduug	cmtrzjxic0001jgy32dv4hjug	In your opinion, how can artificial intelligence and Natural Language Processing (NLP) be used to identify HIV/AIDS-related misinformation and harmful discussions on social media?	LONG_TEXT	t	7	f	2026-09-08 01:24:22.123	2026-09-08 01:24:44.001
cmtrzl9150009jgy3fi7oxnbp	cmtrzjxic0001jgy32dv4hjug	How could a system like Advocaid PH help health organizations, researchers, or local government units better understand HIV/AIDS-related discussions and concerns in their communities?	LONG_TEXT	t	8	f	2026-09-08 01:24:22.649	2026-09-08 01:24:56.292
cmtrzl9gk000ajgy3w5l0a7n9	cmtrzjxic0001jgy32dv4hjug	What challenges or concerns would you have about using an AI-powered system to analyze public social media discussions related to HIV/AIDS?	LONG_TEXT	t	9	f	2026-09-08 01:24:23.204	2026-09-08 01:25:04.822
cmtrzl9sa000bjgy3dhfqvr8r	cmtrzjxic0001jgy32dv4hjug	How important is it for an HIV/AIDS monitoring system to understand discussions in multiple Philippine languages, such as Filipino, Cebuano, Ilocano, and Hiligaynon? Explain your answer.	LONG_TEXT	t	10	f	2026-09-08 01:24:23.626	2026-09-08 01:25:19.827
cmtmcfdl6000e0ry37bvuy1vr	cmtmcf7cv000c0ry3znramslu	What do you know about the different ways HIV can be transmitted?	LONG_TEXT	t	2	f	2026-09-04 02:37:06.57	2026-09-04 02:51:25.214
cmtrzjxin0002jgy3lbdjqv8f	cmtrzjxic0001jgy32dv4hjug	What is your current level of awareness about HIV/AIDS?	SHORT_TEXT	t	1	f	2026-09-08 01:23:21.06	2026-09-08 01:23:32.716
cmtrzk8170003jgy3o0569y5w	cmtrzjxic0001jgy32dv4hjug	What are your primary sources of information about HIV/AIDS?	SHORT_TEXT	t	2	f	2026-09-08 01:23:34.699	2026-09-08 01:23:42.076
cmtrzkloq0004jgy3i0e3vuc1	cmtrzjxic0001jgy32dv4hjug	Have you encountered HIV/AIDS-related misinformation online? If yes, what type?	SHORT_TEXT	t	3	f	2026-09-08 01:23:52.394	2026-09-08 01:23:56.429
cmtrzkr2b0005jgy3uu0i4hj7	cmtrzjxic0001jgy32dv4hjug	Which social media platform do you most frequently encounter HIV/AIDS-related discussions on?	SHORT_TEXT	t	4	f	2026-09-08 01:23:59.363	2026-09-08 01:24:08.005
cmuc6lun900075my3qeuiw3qg	cmuc6lums00065my3ad9sq9ek	What comes to mind when you hear the term HIV/AIDS?	LONG_TEXT	t	1	f	2026-09-22 04:36:11.476	2026-09-22 04:36:28.343
cmuc6m8bt00095my3z240ytmo	cmuc6lums00065my3ad9sq9ek	What do you know about how HIV is transmitted?	LONG_TEXT	t	2	f	2026-09-22 04:36:29.225	2026-09-22 04:36:40.562
cmuc6mipg000a5my3uxmj09st	cmuc6lums00065my3ad9sq9ek	What do you know about ways HIV can be prevented?	LONG_TEXT	t	3	f	2026-09-22 04:36:42.676	2026-09-22 04:37:19.203
cmuc6mp0b000b5my3gc72as8r	cmuc6lums00065my3ad9sq9ek	Where do you usually get information about HIV?	LONG_TEXT	t	4	f	2026-09-22 04:36:50.843	2026-09-22 04:37:28.674
cmuc6mrgx000c5my3ftmspkhc	cmuc6lums00065my3ad9sq9ek	Which source of HIV information do you trust the most, and why?	LONG_TEXT	t	5	f	2026-09-22 04:36:54.033	2026-09-22 04:37:36.467
cmuc6msy6000d5my3pf8tq8zr	cmuc6lums00065my3ad9sq9ek	What HIV-related information do you still need or want to understand better?	LONG_TEXT	t	6	f	2026-09-22 04:36:55.951	2026-09-22 04:37:47.527
cmuc9kqbn0006qpy33a0qnqx8	cmuc9kqba0005qpy3t5824znl	What HIV-related stories or information do you commonly see online?	LONG_TEXT	t	1	f	2026-09-22 05:59:18.071	2026-09-22 06:04:16.446
cmuc9prdy0000lsy37vrbt4nh	cmuc9kqba0005qpy3t5824znl	What HIV-related information or claims do people often question or disagree about?	LONG_TEXT	t	2	f	2026-09-22 06:03:12.742	2026-09-22 06:04:23.277
cmuc9pshy0001lsy3mxf1cx8j	cmuc9kqba0005qpy3t5824znl	What HIV myths or misconceptions are common in your community?	LONG_TEXT	t	3	f	2026-09-22 06:03:14.182	2026-09-22 06:04:37.454
cmuc9rmao0000xky3gyyutsim	cmuc9kqba0005qpy3t5824znl	Have you ever encountered HIV-related information on social media that influenced your beliefs or understanding? If yes, what was it?	LONG_TEXT	t	4	f	2026-09-22 06:04:39.456	2026-09-22 06:04:53.715
cmuc9ro3y0001xky3wqdnlckt	cmuc9kqba0005qpy3t5824znl	Which social media platform do you encounter HIV-related information most often?	LONG_TEXT	t	5	f	2026-09-22 06:04:41.806	2026-09-22 06:05:01.505
cmuc9roob0002xky3h6uy6r7e	cmuc9kqba0005qpy3t5824znl	How do you usually check or verify whether HIV information you see online is accurate?	LONG_TEXT	t	6	f	2026-09-22 06:04:42.539	2026-09-22 06:05:10.504
cmuc9tlab0005xky3o3iqofvn	cmuc9tla20004xky3k9lvi8m2	How are people living with HIV generally viewed in your community?	LONG_TEXT	t	1	f	2026-09-22 06:06:11.45	2026-09-22 06:06:32.223
cmuc9tmhp0007xky38nhe4n9e	cmuc9tla20004xky3k9lvi8m2	Why do you think some people avoid HIV testing?	LONG_TEXT	t	2	f	2026-09-22 06:06:13.021	2026-09-22 06:06:40.084
cmuc9tn360008xky3x117nkfw	cmuc9tla20004xky3k9lvi8m2	What fears or concerns do people in your community have regarding HIV?	LONG_TEXT	t	3	f	2026-09-22 06:06:13.794	2026-09-22 06:06:46.989
cmuc9tnga0009xky3zu9698bn	cmuc9tla20004xky3k9lvi8m2	What words or expressions have you heard people use when discussing HIV or people living with HIV?	LONG_TEXT	t	4	f	2026-09-22 06:06:14.266	2026-09-22 06:06:54.451
cmuc9tnu7000axky31mvg468i	cmuc9tla20004xky3k9lvi8m2	What forms of HIV-related discrimination have you observed or heard about?	LONG_TEXT	t	5	f	2026-09-22 06:06:14.767	2026-09-22 06:07:01.35
cmuc9to7b000bxky3hkbmo59t	cmuc9tla20004xky3k9lvi8m2	What do you think can be done to reduce HIV-related stigma in your community?	LONG_TEXT	t	6	f	2026-09-22 06:06:15.239	2026-09-22 06:07:08.419
cmuc9tow1000cxky3tyw4nsml	cmuc9tla20004xky3k9lvi8m2		SHORT_TEXT	f	7	t	2026-09-22 06:06:16.129	2026-09-22 06:18:03.17
cmuca5ev7000dxky335opw44q	cmuc9tla20004xky3k9lvi8m2		SHORT_TEXT	f	8	t	2026-09-22 06:15:23.011	2026-09-22 06:18:06.733
cmucafz3300033by3hyopnddt	cmucafy9900003by3jjiidtdm	Who should be responsible for delivering HIV information in your community?	SHORT_TEXT	t	2	f	2026-09-22 06:23:35.775	2026-09-22 06:24:07.858
cmucafy9m00013by3oszzp52q	cmucafy9900003by3jjiidtdm	What HIV-related programs or activities do you think would work best in your community?	SHORT_TEXT	t	1	f	2026-09-22 06:23:34.701	2026-09-22 06:24:10.778
cmucafzmh00043by3vs5whauo	cmucafy9900003by3jjiidtdm	What language or languages should HIV information materials use?	SHORT_TEXT	t	3	f	2026-09-22 06:23:36.473	2026-09-22 06:24:15.184
cmucag00100053by3ahwiqndk	cmucafy9900003by3jjiidtdm	What features would you want in an HIV information app or online platform?	LONG_TEXT	t	4	f	2026-09-22 06:23:36.961	2026-09-22 06:24:26.98
cmucah67i00063by3bn11vq4x	cmucafy9900003by3jjiidtdm	How can social media be used positively to improve HIV awareness?	LONG_TEXT	t	5	f	2026-09-22 06:24:31.662	2026-09-22 06:24:37.867
cmucahej400073by3avg9lhys	cmucafy9900003by3jjiidtdm	What kind of HIV-related support do young people in your community need?	LONG_TEXT	t	6	f	2026-09-22 06:24:42.449	2026-09-22 06:24:47.731
cmucahmqh00083by3zgxw0pcz	cmucafy9900003by3jjiidtdm	If you could recommend one change to improve HIV awareness and support in your community, what would it be?	LONG_TEXT	t	7	f	2026-09-22 06:24:53.081	2026-09-22 06:24:58.045
\.


--
-- Data for Name: SurveyResponse; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SurveyResponse" (response_id, survey_id, created_at) FROM stdin;
cmtqtesqq000bqry34gw6b512	cmtmc4k8b00010ry3uu6uzch8	2026-09-07 05:43:37.73
cmu26jek30000rcy3b6dzx326	cmtmc4k8b00010ry3uu6uzch8	2026-09-15 04:36:35.571
cmu27m12t0000fwy3c2q6dc1c	cmtmc4k8b00010ry3uu6uzch8	2026-09-15 05:06:37.685
cmu2av96l0000imit5hu17lfe	cmtmc4k8b00010ry3uu6uzch8	2026-09-15 06:37:46.941
cmu4wxyhk0000ppy36n0cnqfs	cmtmc4k8b00010ry3uu6uzch8	2026-09-17 02:31:16.952
cmu6maldv0003tey3jqctt3ld	cmtmc4k8b00010ry3uu6uzch8	2026-09-18 07:08:43.075
cmuc2ddyz00004zy33lotegv0	cmtmc4k8b00010ry3uu6uzch8	2026-09-22 02:37:38.171
cmuc6pq89000e5my3j2j3xzfw	cmuc6lums00065my3ad9sq9ek	2026-09-22 04:39:12.393
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (user_id, email, is_deleted, created_at, updated_at, role_id, organization_id, is_active) FROM stdin;
cmqq5tmyi0042osy3p41hgb36	raminjoshua05@gmail.com	f	2026-06-23 04:44:12.282	2026-06-23 04:44:12.282	cmqq5lun2003yosy3elss5zqj	cmol5fmjt0001d2utc6jge2ug	t
cmscot51a0001k8y3urzdecyx	joshuaramin146@gmail.com	t	2026-08-03 03:46:19.966	2026-09-22 03:20:43.764	cmqq6hvp3002kedy3vxzotiun	cmol6n0p70002d2uti0z7egl1	f
cmscod7oo0007pfy3qxqgtp4u	t-jrrembulat@national-u.edu.ph	t	2026-08-03 03:33:56.904	2026-09-22 03:20:45.763	cmqq6inap002ledy3dp4fy667	cmol5fmjt0001d2utc6jge2ug	f
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
-- Data for Name: badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.badges (badge_id, name, slug, description, icon_url, requirement_type, requirement_value, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: contributions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contributions (contribution_id, type, content, image_url, source_url, classification, classification_method, confidence_score, status, reviewed_by, reviewed_at, review_reason, created_at, updated_at, user_id, is_deleted, slug, barangay, province, region, municipality, sentiment, language) FROM stdin;
cmu4xged00000xmy3800311ql	Coumminity Event	asdasdasd	\N	\N	PENDING	MANUAL	\N	APPROVED	cmqq5tmyi0042osy3p41hgb36	\N		2026-09-17 02:45:37.332	2026-09-17 04:05:19.908	cmqq5tmyi0042osy3p41hgb36	f	coumminity-event					NEUTRAL	english
\.


--
-- Data for Name: reward_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reward_levels (reward_level_id, name, description, min_points, order_index, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reward_point_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reward_point_rules (reward_point_rule_id, action_type, points, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reward_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reward_transactions (reward_transaction_id, user_id, reward_point_rule_id, contribution_id, action_type, points, created_at) FROM stdin;
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: user_badges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_badges (user_badge_id, user_id, badge_id, earned_at) FROM stdin;
\.


--
-- Data for Name: user_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_preferences (preference_id, default_language, email_notifications, email_security_alerts, email_system_notifications, email_activity_notifications, created_at, updated_at, user_id) FROM stdin;
\.


--
-- Data for Name: user_rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_rewards (user_reward_id, user_id, total_points, current_level_id, created_at, updated_at) FROM stdin;
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
-- Name: badges badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.badges
    ADD CONSTRAINT badges_pkey PRIMARY KEY (badge_id);


--
-- Name: contributions contributions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_pkey PRIMARY KEY (contribution_id);


--
-- Name: reward_levels reward_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_levels
    ADD CONSTRAINT reward_levels_pkey PRIMARY KEY (reward_level_id);


--
-- Name: reward_point_rules reward_point_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_point_rules
    ADD CONSTRAINT reward_point_rules_pkey PRIMARY KEY (reward_point_rule_id);


--
-- Name: reward_transactions reward_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_transactions
    ADD CONSTRAINT reward_transactions_pkey PRIMARY KEY (reward_transaction_id);


--
-- Name: user_badges user_badges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_pkey PRIMARY KEY (user_badge_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (preference_id);


--
-- Name: user_rewards user_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rewards
    ADD CONSTRAINT user_rewards_pkey PRIMARY KEY (user_reward_id);


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
-- Name: badges_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX badges_is_active_idx ON public.badges USING btree (is_active);


--
-- Name: badges_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX badges_name_key ON public.badges USING btree (name);


--
-- Name: badges_requirement_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX badges_requirement_type_idx ON public.badges USING btree (requirement_type);


--
-- Name: badges_requirement_value_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX badges_requirement_value_idx ON public.badges USING btree (requirement_value);


--
-- Name: badges_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX badges_slug_key ON public.badges USING btree (slug);


--
-- Name: contributions_classification_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contributions_classification_idx ON public.contributions USING btree (classification);


--
-- Name: contributions_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contributions_created_at_idx ON public.contributions USING btree (created_at);


--
-- Name: contributions_reviewed_by_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contributions_reviewed_by_idx ON public.contributions USING btree (reviewed_by);


--
-- Name: contributions_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contributions_status_idx ON public.contributions USING btree (status);


--
-- Name: contributions_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX contributions_user_id_idx ON public.contributions USING btree (user_id);


--
-- Name: reward_levels_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_levels_is_active_idx ON public.reward_levels USING btree (is_active);


--
-- Name: reward_levels_min_points_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_levels_min_points_idx ON public.reward_levels USING btree (min_points);


--
-- Name: reward_levels_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reward_levels_name_key ON public.reward_levels USING btree (name);


--
-- Name: reward_levels_order_index_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_levels_order_index_idx ON public.reward_levels USING btree (order_index);


--
-- Name: reward_point_rules_action_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_point_rules_action_type_idx ON public.reward_point_rules USING btree (action_type);


--
-- Name: reward_point_rules_action_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reward_point_rules_action_type_key ON public.reward_point_rules USING btree (action_type);


--
-- Name: reward_point_rules_is_active_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_point_rules_is_active_idx ON public.reward_point_rules USING btree (is_active);


--
-- Name: reward_transactions_action_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_transactions_action_type_idx ON public.reward_transactions USING btree (action_type);


--
-- Name: reward_transactions_contribution_id_action_type_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX reward_transactions_contribution_id_action_type_key ON public.reward_transactions USING btree (contribution_id, action_type);


--
-- Name: reward_transactions_contribution_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_transactions_contribution_id_idx ON public.reward_transactions USING btree (contribution_id);


--
-- Name: reward_transactions_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_transactions_created_at_idx ON public.reward_transactions USING btree (created_at);


--
-- Name: reward_transactions_reward_point_rule_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_transactions_reward_point_rule_id_idx ON public.reward_transactions USING btree (reward_point_rule_id);


--
-- Name: reward_transactions_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reward_transactions_user_id_idx ON public.reward_transactions USING btree (user_id);


--
-- Name: user_badges_badge_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_badges_badge_id_idx ON public.user_badges USING btree (badge_id);


--
-- Name: user_badges_earned_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_badges_earned_at_idx ON public.user_badges USING btree (earned_at);


--
-- Name: user_badges_user_id_badge_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_badges_user_id_badge_id_key ON public.user_badges USING btree (user_id, badge_id);


--
-- Name: user_badges_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_badges_user_id_idx ON public.user_badges USING btree (user_id);


--
-- Name: user_preferences_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_preferences_user_id_key ON public.user_preferences USING btree (user_id);


--
-- Name: user_rewards_current_level_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_rewards_current_level_id_idx ON public.user_rewards USING btree (current_level_id);


--
-- Name: user_rewards_total_points_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_rewards_total_points_idx ON public.user_rewards USING btree (total_points);


--
-- Name: user_rewards_user_id_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_rewards_user_id_key ON public.user_rewards USING btree (user_id);


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
-- Name: contributions contributions_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: contributions contributions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contributions
    ADD CONSTRAINT contributions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reward_transactions reward_transactions_contribution_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_transactions
    ADD CONSTRAINT reward_transactions_contribution_id_fkey FOREIGN KEY (contribution_id) REFERENCES public.contributions(contribution_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reward_transactions reward_transactions_reward_point_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_transactions
    ADD CONSTRAINT reward_transactions_reward_point_rule_id_fkey FOREIGN KEY (reward_point_rule_id) REFERENCES public.reward_point_rules(reward_point_rule_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reward_transactions reward_transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reward_transactions
    ADD CONSTRAINT reward_transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_badges user_badges_badge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_badge_id_fkey FOREIGN KEY (badge_id) REFERENCES public.badges(badge_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_badges user_badges_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_badges
    ADD CONSTRAINT user_badges_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_rewards user_rewards_current_level_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rewards
    ADD CONSTRAINT user_rewards_current_level_id_fkey FOREIGN KEY (current_level_id) REFERENCES public.reward_levels(reward_level_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_rewards user_rewards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_rewards
    ADD CONSTRAINT user_rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."User"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

