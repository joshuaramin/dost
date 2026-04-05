import { geodb } from "@/lib/prisma/geospatial/prisma";
import { formatMultiAdminToGeoJSON } from "@/lib/wrapper/formatRegionToGeoJSON";

export const GetAllAdminGeo = async () => {
  const rows = await geodb.$queryRawUnsafe<any[]>(`
    SELECT 
      'region' AS level,
      r.psgc_code AS code,
      r.name,
      ST_AsGeoJSON(r.geom)::json AS geom
    FROM geo.regions r

    UNION ALL

    SELECT 
      'province' AS level,
      p.gid_1 AS code,
      p.name_1 AS name,
      ST_AsGeoJSON(p.geom)::json AS geom
    FROM geo.provinces p

    UNION ALL

    SELECT 
      'municipality' AS level,
      m.gid_2 AS code,
      m.name_2 AS name,
      ST_AsGeoJSON(m.geom)::json AS geom
    FROM geo.municipalities m

    UNION ALL

    SELECT 
      'barangay' AS level,
      b.gid_3 AS code,
      b.name_3 AS name,
      ST_AsGeoJSON(b.geom)::json AS geom
    FROM geo.barangay b;
  `);

  return formatMultiAdminToGeoJSON(rows);
};
