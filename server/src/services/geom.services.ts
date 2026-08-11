import { PrismaCRUDManager } from "@/lib/helpers/useCrud";
import { geodb } from "@/lib/prisma/geospatial/prisma";
import { formatMultiAdminToGeoJSON } from "@/lib/common/formatRegionToGeoJSON";
import { regions } from "@/lib/prisma/geospatial/generated/prisma/client";

export const GetAllAdminGeo = async () => {
  const rows = await geodb.$queryRawUnsafe<any[]>(`
    SELECT 
  'region' AS level,
  r.psgc_code AS code,
  r.name,
  NULL::text AS province_code,
  ST_AsGeoJSON(r.geom)::json AS geom
FROM geo.regions r

UNION ALL

SELECT 
  'province' AS level,
  p.gid_1 AS code,
  p.name_1 AS name,
  NULL::text AS province_code,
  ST_AsGeoJSON(p.geom)::json AS geom
FROM geo.provinces p

UNION ALL

SELECT 
  'municipality' AS level,
m.gid_2 AS code,
  m.name_2 AS name,
  p.gid_1 AS province_code,
  ST_AsGeoJSON(m.geom)::json AS geom
FROM geo.municipalities m
LEFT JOIN geo.provinces p
  ON ST_Within(m.geom, p.geom)

UNION ALL

SELECT 
  'barangays' AS level,
  b.gid_3 AS code,
  b.name_3 AS name,
  NULL::text AS province_code,
  ST_AsGeoJSON(b.geom)::json AS geom
FROM geo.barangays b;
  `);

  return formatMultiAdminToGeoJSON(rows);
};

export const GetRegionHierarchy = async () => {
  const rows = await geodb.$queryRawUnsafe<any[]>(`
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

            -- 🔥 ADD MUNICIPALITIES INSIDE PROVINCES
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

export const GetRegions = async () => {
  return await geodb.$queryRawUnsafe(`
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

export const GetProvinces = async (regionCode: number) => {
  return await geodb.$queryRawUnsafe(
    `
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
        `,
    regionCode,
  );
};

export const GetMunicipalities = async (provinceCode: string) => {
  return await geodb.$queryRawUnsafe(
    `
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
        `,
    provinceCode,
  );
};

export const GetBarangays = async (municipalityId: number) => {
  return await geodb.$queryRawUnsafe(
    `
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
        `,
    municipalityId,
  );
};
