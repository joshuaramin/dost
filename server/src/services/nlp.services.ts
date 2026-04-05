import { nlpdb } from "@/lib/prisma/nlp/prisma";

export const GetGroupedHeatMapGeo = async () => {
  const result = await nlpdb.$queryRaw`
    WITH grouped AS (
      SELECT 
        p.name_1 AS province,
        p.geom,
        COUNT(h.id)::int AS total_points,
        COALESCE(SUM(h.weight), 0)::int AS total_weight,
        AVG(h.sentiment)::float AS avg_sentiment
      FROM heatmap_points h
      JOIN provinces p
      ON ST_Within(
        ST_Transform(h.geom, 4326),
        ST_Transform(p.geom, 4326)
      )
      GROUP BY p.name_1, p.geom
    )
    SELECT COALESCE(
      jsonb_build_object(
        'type', 'FeatureCollection',
        'features', COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'type', 'Feature',
              'geometry', ST_AsGeoJSON(geom)::jsonb,
              'properties', jsonb_build_object(
                'province', province,
                'total_points', total_points,
                'total_weight', total_weight,
                'avg_sentiment', avg_sentiment
              )
            )
          ),
          '[]'::jsonb
        )
      ),
      '{"type":"FeatureCollection","features":[]}'::jsonb
    ) AS geojson
    FROM grouped;
  `;

  return result[0]?.geojson;
};
