import { nlpdb } from "@/lib/prisma/nlp/prisma";

export const GetGroupedHeatMapGeo = async () => {
  const result = await nlpdb.$queryRaw<
    {
      id: string;
      platform: string | null;
      keyword: string | null;
      sentiment: number | null;
      engagement: number | null;
      weight: number | null;
      created_at: Date | null;
      geometry: {
        type: "Point";
        coordinates: [number, number];
      } | null;
    }[]
  >`
    SELECT
      id,
      platform,
      keyword,
      sentiment,
      engagement,
      weight,
      created_at,
      ST_AsGeoJSON(geom)::json AS geometry
    FROM heatmap_points
    WHERE geom IS NOT NULL
  `;

  return {
    type: "FeatureCollection",
    features: result
      .filter(
        (item) =>
          item.geometry?.type === "Point" &&
          Array.isArray(item.geometry.coordinates) &&
          item.geometry.coordinates.length >= 2,
      )
      .map((item) => ({
        type: "Feature",
        properties: {
          id: item.id,
          platform: item.platform,
          keyword: item.keyword,
          sentiment: Number(item.sentiment ?? 0),
          engagement: Number(item.engagement ?? 0),
          weight: Number(item.weight ?? 0),
          created_at: item.created_at,
        },
        geometry: item.geometry,
      })),
  };
};
