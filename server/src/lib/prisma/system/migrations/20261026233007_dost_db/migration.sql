/*
  Warnings:

  - You are about to drop the column `decription` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `EducationResource` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `EducationResource` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `EducationResource` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `EducationResource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `EducationResource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `EducationResource` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RewardActionType" AS ENUM ('EXPERIENCE', 'MISINFORMATION', 'MEDIA');

-- CreateEnum
CREATE TYPE "BadgeRequirementType" AS ENUM ('TOTAL_POINTS', 'APPROVED_CONTRIBUTIONS', 'APPROVED_MISINFORMATION', 'APPROVED_MEDIA');

-- CreateEnum
CREATE TYPE "ContributionClassification" AS ENUM ('PENDING', 'MISINFORMATION', 'FACTUAL');

-- CreateEnum
CREATE TYPE "ClassificationMethod" AS ENUM ('MANUAL', 'AI', 'HYBRID');

-- CreateEnum
CREATE TYPE "ContributionSentiment" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED');

-- CreateEnum
CREATE TYPE "EducationResourceType" AS ENUM ('ARTICLE', 'VIDEO', 'DOCUMENT', 'CATALOGUE', 'INFOGRAPHIC', 'WEBINAR', 'PODCAST', 'EXTERNAL_LINK');

-- CreateEnum
CREATE TYPE "EducationStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'PDF', 'DOCUMENT', 'AUDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "SurveyType" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX');

-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_resource_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permission_id_fkey";

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "decription",
ADD COLUMN     "description" VARCHAR(100);

-- AlterTable
ALTER TABLE "EducationResource" DROP COLUMN "category",
DROP COLUMN "excerpt",
ADD COLUMN     "category_id" TEXT NOT NULL,
ADD COLUMN     "external_link" TEXT,
ADD COLUMN     "is_featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" "EducationStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "summary" VARCHAR(500),
ADD COLUMN     "type" "EducationResourceType" NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "user_preferences" (
    "preference_id" TEXT NOT NULL,
    "default_language" TEXT NOT NULL DEFAULT 'ENGLISH',
    "email_notifications" BOOLEAN NOT NULL DEFAULT true,
    "email_security_alerts" BOOLEAN NOT NULL DEFAULT true,
    "email_system_notifications" BOOLEAN NOT NULL DEFAULT true,
    "email_activity_notifications" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("preference_id")
);

-- CreateTable
CREATE TABLE "Form" (
    "form_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("form_id")
);

-- CreateTable
CREATE TABLE "reward_point_rules" (
    "reward_point_rule_id" TEXT NOT NULL,
    "action_type" "RewardActionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_point_rules_pkey" PRIMARY KEY ("reward_point_rule_id")
);

-- CreateTable
CREATE TABLE "reward_transactions" (
    "reward_transaction_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reward_point_rule_id" TEXT,
    "contribution_id" TEXT NOT NULL,
    "action_type" "RewardActionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_transactions_pkey" PRIMARY KEY ("reward_transaction_id")
);

-- CreateTable
CREATE TABLE "user_rewards" (
    "user_reward_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "current_level_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "user_rewards_pkey" PRIMARY KEY ("user_reward_id")
);

-- CreateTable
CREATE TABLE "reward_levels" (
    "reward_level_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "min_points" INTEGER NOT NULL,
    "order_index" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reward_levels_pkey" PRIMARY KEY ("reward_level_id")
);

-- CreateTable
CREATE TABLE "badges" (
    "badge_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon_url" TEXT,
    "requirement_type" "BadgeRequirementType" NOT NULL,
    "requirement_value" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("badge_id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "user_badge_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "earned_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("user_badge_id")
);

-- CreateTable
CREATE TABLE "EducationAttachment" (
    "education_attachment_id" TEXT NOT NULL,
    "education_resource_id" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_url" TEXT NOT NULL,
    "mime_type" VARCHAR(100),
    "file_size" INTEGER,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EducationAttachment_pkey" PRIMARY KEY ("education_attachment_id")
);

-- CreateTable
CREATE TABLE "EducationTag" (
    "education_tag_id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "EducationTag_pkey" PRIMARY KEY ("education_tag_id")
);

-- CreateTable
CREATE TABLE "EducationResourceTag" (
    "education_resource_id" TEXT NOT NULL,
    "education_tag_id" TEXT NOT NULL,

    CONSTRAINT "EducationResourceTag_pkey" PRIMARY KEY ("education_resource_id","education_tag_id")
);

-- CreateTable
CREATE TABLE "EducationCategory" (
    "education_category_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" VARCHAR(300),
    "parent_id" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EducationCategory_pkey" PRIMARY KEY ("education_category_id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "survey_id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300),
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("survey_id")
);

-- CreateTable
CREATE TABLE "SurveyQuestion" (
    "survey_question_id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "text" VARCHAR(300) NOT NULL,
    "type" "SurveyType" NOT NULL,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyQuestion_pkey" PRIMARY KEY ("survey_question_id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "question_option_id" TEXT NOT NULL,
    "survey_question_id" TEXT NOT NULL,
    "label" VARCHAR(300) NOT NULL,
    "value" VARCHAR(300) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("question_option_id")
);

-- CreateTable
CREATE TABLE "SurveyResponse" (
    "response_id" TEXT NOT NULL,
    "survey_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyResponse_pkey" PRIMARY KEY ("response_id")
);

-- CreateTable
CREATE TABLE "SurveyAnswer" (
    "answer_id" TEXT NOT NULL,
    "survey_response_id" TEXT NOT NULL,
    "survey_question_id" TEXT NOT NULL,
    "answer_text" TEXT,
    "answer_option_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyAnswer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "SurveyAnswerOption" (
    "survey_answer_option_id" TEXT NOT NULL,
    "survey_answer_id" TEXT NOT NULL,
    "question_option_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SurveyAnswerOption_pkey" PRIMARY KEY ("survey_answer_option_id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "contribution_id" TEXT NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "image_url" TEXT,
    "source_url" TEXT,
    "sentiment" "ContributionSentiment",
    "classification" "ContributionClassification" DEFAULT 'PENDING',
    "classification_method" "ClassificationMethod",
    "language" TEXT,
    "confidence_score" DECIMAL(5,4),
    "status" "ContributionStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_reason" TEXT,
    "region" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "barangay" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("contribution_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reward_point_rules_action_type_key" ON "reward_point_rules"("action_type");

-- CreateIndex
CREATE INDEX "reward_point_rules_action_type_idx" ON "reward_point_rules"("action_type");

-- CreateIndex
CREATE INDEX "reward_point_rules_is_active_idx" ON "reward_point_rules"("is_active");

-- CreateIndex
CREATE INDEX "reward_transactions_user_id_idx" ON "reward_transactions"("user_id");

-- CreateIndex
CREATE INDEX "reward_transactions_reward_point_rule_id_idx" ON "reward_transactions"("reward_point_rule_id");

-- CreateIndex
CREATE INDEX "reward_transactions_contribution_id_idx" ON "reward_transactions"("contribution_id");

-- CreateIndex
CREATE INDEX "reward_transactions_action_type_idx" ON "reward_transactions"("action_type");

-- CreateIndex
CREATE INDEX "reward_transactions_created_at_idx" ON "reward_transactions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "reward_transactions_contribution_id_action_type_key" ON "reward_transactions"("contribution_id", "action_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_rewards_user_id_key" ON "user_rewards"("user_id");

-- CreateIndex
CREATE INDEX "user_rewards_total_points_idx" ON "user_rewards"("total_points");

-- CreateIndex
CREATE INDEX "user_rewards_current_level_id_idx" ON "user_rewards"("current_level_id");

-- CreateIndex
CREATE UNIQUE INDEX "reward_levels_name_key" ON "reward_levels"("name");

-- CreateIndex
CREATE INDEX "reward_levels_min_points_idx" ON "reward_levels"("min_points");

-- CreateIndex
CREATE INDEX "reward_levels_order_index_idx" ON "reward_levels"("order_index");

-- CreateIndex
CREATE INDEX "reward_levels_is_active_idx" ON "reward_levels"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "badges_slug_key" ON "badges"("slug");

-- CreateIndex
CREATE INDEX "badges_requirement_type_idx" ON "badges"("requirement_type");

-- CreateIndex
CREATE INDEX "badges_requirement_value_idx" ON "badges"("requirement_value");

-- CreateIndex
CREATE INDEX "badges_is_active_idx" ON "badges"("is_active");

-- CreateIndex
CREATE INDEX "user_badges_user_id_idx" ON "user_badges"("user_id");

-- CreateIndex
CREATE INDEX "user_badges_badge_id_idx" ON "user_badges"("badge_id");

-- CreateIndex
CREATE INDEX "user_badges_earned_at_idx" ON "user_badges"("earned_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_user_id_badge_id_key" ON "user_badges"("user_id", "badge_id");

-- CreateIndex
CREATE INDEX "EducationAttachment_education_resource_id_idx" ON "EducationAttachment"("education_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "EducationTag_name_key" ON "EducationTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationTag_slug_key" ON "EducationTag"("slug");

-- CreateIndex
CREATE INDEX "EducationTag_name_idx" ON "EducationTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationCategory_name_key" ON "EducationCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EducationCategory_slug_key" ON "EducationCategory"("slug");

-- CreateIndex
CREATE INDEX "EducationCategory_parent_id_idx" ON "EducationCategory"("parent_id");

-- CreateIndex
CREATE INDEX "EducationCategory_is_deleted_idx" ON "EducationCategory"("is_deleted");

-- CreateIndex
CREATE UNIQUE INDEX "Survey_slug_key" ON "Survey"("slug");

-- CreateIndex
CREATE INDEX "SurveyQuestion_survey_id_idx" ON "SurveyQuestion"("survey_id");

-- CreateIndex
CREATE INDEX "QuestionOption_survey_question_id_idx" ON "QuestionOption"("survey_question_id");

-- CreateIndex
CREATE INDEX "SurveyResponse_survey_id_idx" ON "SurveyResponse"("survey_id");

-- CreateIndex
CREATE INDEX "SurveyAnswer_survey_response_id_idx" ON "SurveyAnswer"("survey_response_id");

-- CreateIndex
CREATE INDEX "SurveyAnswer_survey_question_id_idx" ON "SurveyAnswer"("survey_question_id");

-- CreateIndex
CREATE INDEX "SurveyAnswer_answer_option_id_idx" ON "SurveyAnswer"("answer_option_id");

-- CreateIndex
CREATE INDEX "SurveyAnswerOption_survey_answer_id_idx" ON "SurveyAnswerOption"("survey_answer_id");

-- CreateIndex
CREATE INDEX "SurveyAnswerOption_question_option_id_idx" ON "SurveyAnswerOption"("question_option_id");

-- CreateIndex
CREATE UNIQUE INDEX "SurveyAnswerOption_survey_answer_id_question_option_id_key" ON "SurveyAnswerOption"("survey_answer_id", "question_option_id");

-- CreateIndex
CREATE INDEX "contributions_user_id_idx" ON "contributions"("user_id");

-- CreateIndex
CREATE INDEX "contributions_reviewed_by_idx" ON "contributions"("reviewed_by");

-- CreateIndex
CREATE INDEX "contributions_classification_idx" ON "contributions"("classification");

-- CreateIndex
CREATE INDEX "contributions_status_idx" ON "contributions"("status");

-- CreateIndex
CREATE INDEX "contributions_created_at_idx" ON "contributions"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "EducationResource_slug_key" ON "EducationResource"("slug");

-- CreateIndex
CREATE INDEX "EducationResource_title_idx" ON "EducationResource"("title");

-- CreateIndex
CREATE INDEX "EducationResource_slug_idx" ON "EducationResource"("slug");

-- CreateIndex
CREATE INDEX "EducationResource_category_id_idx" ON "EducationResource"("category_id");

-- CreateIndex
CREATE INDEX "EducationResource_user_id_idx" ON "EducationResource"("user_id");

-- CreateIndex
CREATE INDEX "EducationResource_type_idx" ON "EducationResource"("type");

-- CreateIndex
CREATE INDEX "EducationResource_status_idx" ON "EducationResource"("status");

-- CreateIndex
CREATE INDEX "EducationResource_published_at_idx" ON "EducationResource"("published_at");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_reward_point_rule_id_fkey" FOREIGN KEY ("reward_point_rule_id") REFERENCES "reward_point_rules"("reward_point_rule_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_transactions" ADD CONSTRAINT "reward_transactions_contribution_id_fkey" FOREIGN KEY ("contribution_id") REFERENCES "contributions"("contribution_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_rewards" ADD CONSTRAINT "user_rewards_current_level_id_fkey" FOREIGN KEY ("current_level_id") REFERENCES "reward_levels"("reward_level_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badges"("badge_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_resource_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "Resource"("resource_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationAttachment" ADD CONSTRAINT "EducationAttachment_education_resource_id_fkey" FOREIGN KEY ("education_resource_id") REFERENCES "EducationResource"("education_resource_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationResourceTag" ADD CONSTRAINT "EducationResourceTag_education_resource_id_fkey" FOREIGN KEY ("education_resource_id") REFERENCES "EducationResource"("education_resource_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationResourceTag" ADD CONSTRAINT "EducationResourceTag_education_tag_id_fkey" FOREIGN KEY ("education_tag_id") REFERENCES "EducationTag"("education_tag_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationCategory" ADD CONSTRAINT "EducationCategory_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "EducationCategory"("education_category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationResource" ADD CONSTRAINT "EducationResource_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "EducationCategory"("education_category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyQuestion" ADD CONSTRAINT "SurveyQuestion_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("survey_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_survey_question_id_fkey" FOREIGN KEY ("survey_question_id") REFERENCES "SurveyQuestion"("survey_question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyResponse" ADD CONSTRAINT "SurveyResponse_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "Survey"("survey_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_answer_option_id_fkey" FOREIGN KEY ("answer_option_id") REFERENCES "QuestionOption"("question_option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_survey_question_id_fkey" FOREIGN KEY ("survey_question_id") REFERENCES "SurveyQuestion"("survey_question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_survey_response_id_fkey" FOREIGN KEY ("survey_response_id") REFERENCES "SurveyResponse"("response_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswerOption" ADD CONSTRAINT "SurveyAnswerOption_question_option_id_fkey" FOREIGN KEY ("question_option_id") REFERENCES "QuestionOption"("question_option_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SurveyAnswerOption" ADD CONSTRAINT "SurveyAnswerOption_survey_answer_id_fkey" FOREIGN KEY ("survey_answer_id") REFERENCES "SurveyAnswer"("answer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
