"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetBarangays = exports.GetMunicipalities = exports.GetProvinces = exports.GetRegions = exports.GetRegionHierarchy = exports.GetAllAdminGeo = void 0;
const prisma_1 = require("../lib/prisma/geospatial/prisma.js");
const formatRegionToGeoJSON_1 = require("../lib/common/formatRegionToGeoJSON.js");
const test_redis_1 = require("../lib/redis/test-redis.js");
const GEO_TTL_SECONDS = 60 * 60 * 24; // 24 hours
const GetAllAdminGeo = async () => {
    const cacheKey = "advocaid:geo:admin:v1";
    const cached = await test_redis_1.redis.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const rows = await prisma_1.geodb.$queryRawUnsafe(`
    SELECT
      'region' AS level,
      r.psgc_code AS code,
      r.name,
      NULL::text AS province_code,
      ST_AsGeoJSON(
        ST_SnapToGrid(
          ST_SimplifyPreserveTopology(r.geom, 0.002),
          0.001
        ),
        6
      )::json AS geom
    FROM geo.regions r

    UNION ALL

    SELECT
      'province' AS level,
      p.gid_1 AS code,
      p.name_1 AS name,
      NULL::text AS province_code,
      ST_AsGeoJSON(
        ST_SnapToGrid(
          ST_SimplifyPreserveTopology(p.geom, 0.002),
          0.001
        ),
        6
      )::json AS geom
    FROM geo.provinces p

    UNION ALL

    SELECT
      'municipality' AS level,
      m.gid_2 AS code,
      m.name_2 AS name,
      p.gid_1 AS province_code,
      ST_AsGeoJSON(
        ST_SnapToGrid(
          ST_SimplifyPreserveTopology(m.geom, 0.002),
          0.001
        ),
        6
      )::json AS geom
    FROM geo.municipalities m
    LEFT JOIN geo.provinces p
      ON ST_Within(m.geom, p.geom);
  `);
    const result = (0, formatRegionToGeoJSON_1.formatMultiAdminToGeoJSON)(rows);
    await test_redis_1.redis.set(cacheKey, JSON.stringify(result), "EX", GEO_TTL_SECONDS);
    return result;
};
exports.GetAllAdminGeo = GetAllAdminGeo;
const GetRegionHierarchy = async () => {
    const rows = await prisma_1.geodb.$queryRawUnsafe(`
    SELECT 
      r.psgc_code AS region_code,
      r.name AS region_name,
      ST_AsGeoJSON(ST_Envelope(r.geom))::json AS bounds,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'code', p.gid_1,
            'name', p.name_1,
            'bounds', ST_AsGeoJSON(ST_Envelope(p.geom))::json,

            'municipality', (
              SELECT COALESCE(
                json_agg(
                  jsonb_build_object(
                    'code', m.gid_2,
                    'name', m.name_2,
                    'bounds', ST_AsGeoJSON(ST_Envelope(m.geom))::json
                  )
                ),
                '[]'
              )
              FROM geo.municipalities m
              WHERE ST_Within(m.geom, p.geom)
            )

          )
        ) FILTER (WHERE p.ogc_fid IS NOT NULL),
        '[]'
      ) AS provinces

    FROM geo.regions r

    LEFT JOIN geo.regions_provinces rp
      ON rp.region_psgc_code = r.psgc_code

    LEFT JOIN geo.provinces p
      ON p.ogc_fid = rp.province_ogc_fid

    GROUP BY r.psgc_code, r.name, r.geom
    ORDER BY r.psgc_code;
  `);
    return rows;
};
exports.GetRegionHierarchy = GetRegionHierarchy;
const GetRegions = async () => {
    return await prisma_1.geodb.$queryRawUnsafe(`
        SELECT
            r.region_id AS id,
            r.psgc_code AS code,
            r.name,
            ST_AsGeoJSON(
                ST_Envelope(r.geom)
            )::json AS bounds
        FROM geo.regions r
        ORDER BY r.name;
    `);
};
exports.GetRegions = GetRegions;
const GetProvinces = async (regionCode) => {
    return await prisma_1.geodb.$queryRawUnsafe(`
        SELECT
            p.ogc_fid AS id,
            p.gid_1 AS code,
            p.name_1 AS name,
            ST_AsGeoJSON(
                ST_Envelope(p.geom)
            )::json AS bounds
        FROM geo.regions r
        INNER JOIN geo.regions_provinces rp
            ON rp.region_psgc_code = r.psgc_code
        INNER JOIN geo.provinces p
            ON p.ogc_fid = rp.province_ogc_fid
        WHERE r.region_id = $1
        ORDER BY p.name_1;
        `, regionCode);
};
exports.GetProvinces = GetProvinces;
const GetMunicipalities = async (provinceCode) => {
    return await prisma_1.geodb.$queryRawUnsafe(`
       SELECT
            m.ogc_fid AS id,
            m.gid_2 AS code,
            m.name_2 AS name,
            ST_AsGeoJSON(
                ST_Envelope(m.geom)
            )::json AS bounds
        FROM geo.municipalities m
        WHERE m.gid_1 = (
            SELECT p.gid_1
            FROM geo.provinces p
            WHERE p.ogc_fid = $1
        )
        ORDER BY m.name_2;
        `, provinceCode);
};
exports.GetMunicipalities = GetMunicipalities;
const GetBarangays = async (municipalityId) => {
    return await prisma_1.geodb.$queryRawUnsafe(`
        SELECT
            b.ogc_fid AS id,
            b.gid_3 AS code,
            b.name_3 AS name,
            b.gid_2 AS municipality_code,
            ST_AsGeoJSON(
                ST_Envelope(b.geom)
            )::json AS bounds
        FROM geo.barangays b
        INNER JOIN geo.municipalities m
            ON m.gid_2 = b.gid_2
        WHERE m.ogc_fid = $1
        ORDER BY b.name_3;
        `, municipalityId);
};
exports.GetBarangays = GetBarangays;
