-- CreateEnum
CREATE TYPE "geo"."TreatmentHubStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CLOSED');

-- CreateTable
CREATE TABLE "geo"."treatment_hubs" (
    "treatment_hub_id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "contact_number" TEXT,
    "email" TEXT,
    "website" TEXT,
    "operating_hours" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "geom" geometry,
    "region_id" INTEGER,
    "province_ogc_fid" INTEGER,
    "municipality_ogc_fid" INTEGER,
    "barangay_ogc_fid" INTEGER,
    "status" "geo"."TreatmentHubStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,

    CONSTRAINT "treatment_hubs_pkey" PRIMARY KEY ("treatment_hub_id")
);

-- CreateTable
CREATE TABLE "geo"."services" (
    "service_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "geo"."treatment_hub_services" (
    "service_id" TEXT,
    "treatment_hub_services_id" TEXT NOT NULL,
    "treatment_hubs_id" TEXT,

    CONSTRAINT "treatment_hub_services_pkey" PRIMARY KEY ("treatment_hub_services_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "treatment_hubs_code_key" ON "geo"."treatment_hubs"("code");

-- CreateIndex
CREATE UNIQUE INDEX "treatment_hubs_slug_key" ON "geo"."treatment_hubs"("slug");

-- CreateIndex
CREATE INDEX "treatment_hubs_region_id_idx" ON "geo"."treatment_hubs"("region_id");

-- CreateIndex
CREATE INDEX "treatment_hubs_province_ogc_fid_idx" ON "geo"."treatment_hubs"("province_ogc_fid");

-- CreateIndex
CREATE INDEX "treatment_hubs_municipality_ogc_fid_idx" ON "geo"."treatment_hubs"("municipality_ogc_fid");

-- CreateIndex
CREATE INDEX "treatment_hubs_barangay_ogc_fid_idx" ON "geo"."treatment_hubs"("barangay_ogc_fid");

-- CreateIndex
CREATE INDEX "treatment_hubs_status_idx" ON "geo"."treatment_hubs"("status");

-- CreateIndex
CREATE INDEX "treatment_hubs_is_deleted_idx" ON "geo"."treatment_hubs"("is_deleted");

-- CreateIndex
CREATE INDEX "treatment_hubs_created_at_idx" ON "geo"."treatment_hubs"("created_at");

-- CreateIndex
CREATE INDEX "treatment_hubs_geom_idx" ON "geo"."treatment_hubs" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_key" ON "geo"."services"("name");

-- CreateIndex
CREATE INDEX "treatment_hub_services_service_id_idx" ON "geo"."treatment_hub_services"("service_id");

-- CreateIndex
CREATE INDEX "treatment_hub_services_treatment_hubs_id_idx" ON "geo"."treatment_hub_services"("treatment_hubs_id");

-- CreateIndex
CREATE INDEX "barangays_gid_2_idx" ON "geo"."barangays"("gid_2");

-- CreateIndex
CREATE INDEX "municipalities_name_1_idx" ON "geo"."municipalities"("name_1");

-- CreateIndex
CREATE INDEX "regions_provinces_province_ogc_fid_idx" ON "geo"."regions_provinces"("province_ogc_fid");

-- AddForeignKey
ALTER TABLE "geo"."treatment_hubs" ADD CONSTRAINT "treatment_hubs_barangay_ogc_fid_fkey" FOREIGN KEY ("barangay_ogc_fid") REFERENCES "geo"."barangays"("ogc_fid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."treatment_hubs" ADD CONSTRAINT "treatment_hubs_municipality_ogc_fid_fkey" FOREIGN KEY ("municipality_ogc_fid") REFERENCES "geo"."municipalities"("ogc_fid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."treatment_hubs" ADD CONSTRAINT "treatment_hubs_province_ogc_fid_fkey" FOREIGN KEY ("province_ogc_fid") REFERENCES "geo"."provinces"("ogc_fid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."treatment_hubs" ADD CONSTRAINT "treatment_hubs_region_id_fkey" FOREIGN KEY ("region_id") REFERENCES "geo"."regions"("region_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."treatment_hub_services" ADD CONSTRAINT "treatment_hub_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "geo"."services"("service_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."treatment_hub_services" ADD CONSTRAINT "treatment_hub_services_treatment_hubs_id_fkey" FOREIGN KEY ("treatment_hubs_id") REFERENCES "geo"."treatment_hubs"("treatment_hub_id") ON DELETE SET NULL ON UPDATE CASCADE;
