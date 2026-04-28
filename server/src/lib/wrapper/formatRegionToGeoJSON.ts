export const formatMultiAdminToGeoJSON = (rows: any[]) => {
  const groupByLevel: Record<string, any[]> = {
    region: [],
    province: [],
    municipality: [],
    barangay: [],
  };

  rows.forEach((row) => {
    if (!row?.level) return;

    const level = row.level.toLowerCase().trim();

    if (!groupByLevel[level]) {
      console.warn("Invalid level:", row.level); // 🔥 debug
      return;
    }

    groupByLevel[level].push({
      type: "Feature",
      id: row.code,
      geometry: row.geom,
      properties: {
        code: row.code,
        name: row.name,
        level,
      },
    });
  });

  return {
    regions: {
      type: "FeatureCollection",
      features: groupByLevel.region || [],
    },
    provinces: {
      type: "FeatureCollection",
      features: groupByLevel.province || [],
    },
    municipalities: {
      type: "FeatureCollection",
      features: groupByLevel.municipality || [],
    },
    barangays: {
      type: "FeatureCollection",
      features: groupByLevel.barangay || [],
    },
  };
};
