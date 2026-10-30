
CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateTable
CREATE TABLE "heatmap_points" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "platform" TEXT,
    "keyword" TEXT,
    "sentiment" DECIMAL,
    "engagement" INTEGER,
    "weight" INTEGER,
    "geom" geometry NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heatmap_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_heatmap_geom" ON "heatmap_points" USING GIST ("geom");
