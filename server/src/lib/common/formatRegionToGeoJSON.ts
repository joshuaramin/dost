export const formatMultiAdminToGeoJSON = (rows: any[]) => {
  const groupByLevel: Record<string, any[]> = {
    region: [],
    province: [],
    municipality: [],
    barangay: [],
  };

  rows.forEach((row) => {
    const level = row.level?.toLowerCase()?.trim();
    if (!groupByLevel[level]) return;

    groupByLevel[level].push({
      type: "Feature",
      id: row.code,
      geometry: row.geom,
      properties: {
        code: row.code,
        name: row.name,
        level,
        bounds: row.bounds,
      },
    });
  });

  return {
    regions: {
      type: "FeatureCollection",
      features: groupByLevel.region,
    },
    provinces: {
      type: "FeatureCollection",
      features: groupByLevel.province,
    },
    municipalities: {
      type: "FeatureCollection",
      features: groupByLevel.municipality,
    },
  };
};
