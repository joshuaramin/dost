/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contact` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logo` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "address" TEXT,
ADD COLUMN     "contact" TEXT NOT NULL,
ADD COLUMN     "logo" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OTP" (
    "otp_id" TEXT NOT NULL,
    "identifier" VARCHAR(255) NOT NULL DEFAULT 'email',
    "type" TEXT NOT NULL DEFAULT 'login',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 5,
    "ip_address" VARCHAR(100),
    "user_agent" TEXT,
    "user_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "code_hash" VARCHAR(255) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("otp_id")
);

-- CreateTable
CREATE TABLE "EducationResource" (
    "education_resource_id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "excerpt" VARCHAR(300) NOT NULL,
    "content" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "EducationResource_pkey" PRIMARY KEY ("education_resource_id")
);

-- CreateIndex
CREATE INDEX "OTP_identifier_type_idx" ON "OTP"("identifier", "type");

-- CreateIndex
CREATE INDEX "OTP_expires_at_idx" ON "OTP"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "Role_slug_key" ON "Role"("slug");

-- AddForeignKey
ALTER TABLE "OTP" ADD CONSTRAINT "OTP_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationResource" ADD CONSTRAINT "EducationResource_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
