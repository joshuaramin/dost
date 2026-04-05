export const formatMultiAdminToGeoJSON = (rows: any[]) => {
  const groupByLevel: Record<string, any[]> = {
    region: [],
    province: [],
    municipality: [],
    barangay: [],
  };

  rows.forEach((row) => {
    groupByLevel[row.level].push({
      type: "Feature",
      id: row.code,
      geometry: row.geom,
      properties: {
        code: row.code,
        name: row.name,
        level: row.level,
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
    barangays: {
      type: "FeatureCollection",
      features: groupByLevel.barangay,
    },
  };
};
