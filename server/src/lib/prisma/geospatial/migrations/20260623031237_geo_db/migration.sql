-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "geo";

-- CreateTable
CREATE TABLE "geo"."municipalities" (
    "ogc_fid" SERIAL NOT NULL,
    "geom" geometry,
    "gid_2" VARCHAR,
    "gid_0" VARCHAR,
    "country" VARCHAR,
    "gid_1" VARCHAR,
    "name_1" VARCHAR,
    "nl_name_1" VARCHAR,
    "name_2" VARCHAR,
    "varname_2" VARCHAR,
    "nl_name_2" VARCHAR,
    "type_2" VARCHAR,
    "engtype_2" VARCHAR,
    "cc_2" VARCHAR,
    "hasc_2" VARCHAR,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("ogc_fid")
);

-- CreateTable
CREATE TABLE "geo"."provinces" (
    "ogc_fid" SERIAL NOT NULL,
    "gid_1" VARCHAR,
    "gid_0" VARCHAR,
    "country" VARCHAR,
    "name_1" VARCHAR,
    "varname_1" VARCHAR,
    "nl_name_1" VARCHAR,
    "type_1" VARCHAR,
    "engtype_1" VARCHAR,
    "cc_1" VARCHAR,
    "hasc_1" VARCHAR,
    "iso_1" VARCHAR,
    "geom" geometry,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("ogc_fid")
);

-- CreateTable
CREATE TABLE "geo"."regions" (
    "region_id" SERIAL NOT NULL,
    "psgc_code" VARCHAR(20),
    "name" TEXT NOT NULL,
    "geom" geometry,

    CONSTRAINT "regions_pkey" PRIMARY KEY ("region_id")
);

-- CreateTable
CREATE TABLE "geo"."barangays" (
    "ogc_fid" SERIAL NOT NULL,
    "geom" geometry,
    "gid_3" VARCHAR,
    "gid_0" VARCHAR,
    "country" VARCHAR,
    "gid_1" VARCHAR,
    "name_1" VARCHAR,
    "nl_name_1" VARCHAR,
    "gid_2" VARCHAR,
    "name_2" VARCHAR,
    "nl_name_2" VARCHAR,
    "name_3" VARCHAR,
    "varname_3" VARCHAR,
    "nl_name_3" VARCHAR,
    "type_3" VARCHAR,
    "engtype_3" VARCHAR,
    "cc_3" VARCHAR,
    "hasc_3" VARCHAR,

    CONSTRAINT "barangays_pkey" PRIMARY KEY ("ogc_fid")
);

-- CreateTable
CREATE TABLE "geo"."regions_provinces" (
    "id" SERIAL NOT NULL,
    "region_psgc_code" VARCHAR(20) NOT NULL,
    "province_ogc_fid" INTEGER NOT NULL,

    CONSTRAINT "regions_provinces_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_name_unique" ON "geo"."municipalities"("gid_2");

-- CreateIndex
CREATE INDEX "municipalities_geom_geom_idx" ON "geo"."municipalities" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_gid1_unique" ON "geo"."provinces"("gid_1");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_name_unique" ON "geo"."provinces"("name_1");

-- CreateIndex
CREATE INDEX "provinces_geom_geom_idx" ON "geo"."provinces" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "regions_psgc_code_key" ON "geo"."regions"("psgc_code");

-- CreateIndex
CREATE INDEX "barangays_geom_geom_idx" ON "geo"."barangays" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "uq_region_province" ON "geo"."regions_provinces"("region_psgc_code", "province_ogc_fid");

-- AddForeignKey
ALTER TABLE "geo"."municipalities" ADD CONSTRAINT "fk_municipalities_province_name" FOREIGN KEY ("name_1") REFERENCES "geo"."provinces"("name_1") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."barangays" ADD CONSTRAINT "fk_barangays_municipality" FOREIGN KEY ("gid_2") REFERENCES "geo"."municipalities"("gid_2") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."regions_provinces" ADD CONSTRAINT "fk_rp_province" FOREIGN KEY ("province_ogc_fid") REFERENCES "geo"."provinces"("ogc_fid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."regions_provinces" ADD CONSTRAINT "fk_rp_region" FOREIGN KEY ("region_psgc_code") REFERENCES "geo"."regions"("psgc_code") ON DELETE RESTRICT ON UPDATE CASCADE;
