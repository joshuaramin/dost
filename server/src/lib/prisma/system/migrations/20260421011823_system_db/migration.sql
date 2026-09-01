/*
  Warnings:

  - Added the required column `browser` to the `DeviceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_type` to the `DeviceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `os` to the `DeviceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_agent` to the `DeviceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Resource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeviceSession" ADD COLUMN     "browser" TEXT NOT NULL,
ADD COLUMN     "device_type" TEXT NOT NULL,
ADD COLUMN     "os" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "name" VARCHAR(100) NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organization_id" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "organization_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("organization_id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
