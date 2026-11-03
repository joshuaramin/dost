"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GeoJSON, MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

import styles from "@/styles/lib/ui/dashboard/monitoring/map.module.scss";

import useFormQuery from "@/lib/hooks/useQuery";
import Title from "@/components/Typography/Title/title";
import Text from "@/components/Typography/Text/text";
import headers from "@/lib/utils/headers";

type Province = {
  code: string;
  name: string;
  bounds: unknown;
};

type Region = {
  region_code: string;
  region_name: string;
  bounds: unknown;
  provinces: Province[];
};

type HeatmapFeature = {
  type: "Feature";
  properties: {
    id?: string;
    platform?: string;
    keyword?: string;
    sentiment?: number;
    engagement?: number;
    weight?: number;
    created_at?: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
};

type GeoJSONFeature = {
  type: "Feature";
  properties?: Record<string, any>;
  geometry: any;
};

type FeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
};

type MapControllerProps = {
  mapRef: React.MutableRefObject<L.Map | null>;
};

type HeatmapLayerProps = {
  features: HeatmapFeature[];
};

type NLPPointsLayerProps = {
  features: HeatmapFeature[];
};

type DynamicGeoJSONProps = {
  data: FeatureCollection | null;
  style: (feature?: any) => L.PathOptions;
  onEachFeature?: (feature: any, layer: L.Layer) => void;
  pane?: string;
  interactive?: boolean;
};

const legends = [
  {
    label: "Low",
    color: "success",
  },
  {
    label: "Medium",
    color: "warning",
  },
  {
    label: "High",
    color: "danger",
  },
];

const canvasRenderer = L.canvas({
  padding: 0.5,
});

const PHILIPPINES_BOUNDS: L.LatLngBoundsExpression = [
  [4.2, 116.8],
  [21.3, 126.6],
];

function MapController({ mapRef }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;

    return () => {
      if (mapRef.current === map) {
        mapRef.current = null;
      }
    };
  }, [map, mapRef]);

  return null;
}

function DynamicGeoJSON({
  data,
  style,
  onEachFeature,
  pane,
  interactive = true,
}: DynamicGeoJSONProps) {
  const layerRef = useRef<L.GeoJSON | null>(null);

  const handleRef = useCallback((layer: L.GeoJSON | null) => {
    layerRef.current = layer;
  }, []);

  useEffect(() => {
    const layer = layerRef.current;

    if (!layer || !data) {
      return;
    }

    layer.clearLayers();

    if (data.features.length) {
      layer.addData(data as any);
    }
  }, [data]);

  return (
    <GeoJSON
      ref={handleRef}
      data={
        {
          type: "FeatureCollection",
          features: [],
        } as any
      }
      style={style}
      onEachFeature={onEachFeature}
      pane={pane}
      interactive={interactive}
    />
  );
}

function HeatmapLayer({ features }: HeatmapLayerProps) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!heatLayerRef.current) {
      heatLayerRef.current = (L as any).heatLayer([], {
        radius: 28,
        blur: 18,
        maxZoom: 12,
        minOpacity: 0.2,
        max: 1,
        gradient: {
          0.1: "#3b82f6",
          0.25: "#22c55e",
          0.45: "#facc15",
          0.65: "#f97316",
          0.8: "#ef4444",
          1: "#7f1d1d",
        },
      });

      heatLayerRef.current.addTo(map);
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [map]);

  useEffect(() => {
    if (!heatLayerRef.current) {
      return;
    }

    const heatPoints: [number, number, number][] = [];

    for (const feature of features) {
      const coordinates = feature.geometry?.coordinates;

      if (
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        !Number.isFinite(Number(coordinates[0])) ||
        !Number.isFinite(Number(coordinates[1]))
      ) {
        continue;
      }

      const lng = Number(coordinates[0]);
      const lat = Number(coordinates[1]);

      const weight = Number(feature.properties?.weight ?? 0);

      if (!Number.isFinite(weight)) {
        continue;
      }

      heatPoints.push([lat, lng, Math.min(Math.max(weight, 0), 100)]);
    }

    heatLayerRef.current.setLatLngs(heatPoints);
  }, [features]);

  return null;
}

function NLPPointsLayer({ features }: NLPPointsLayerProps) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!layerRef.current) {
      layerRef.current = L.layerGroup().addTo(map);
    }

    const layerGroup = layerRef.current;

    layerGroup.clearLayers();

    const renderer = canvasRenderer;

    for (const feature of features) {
      const coordinates = feature.geometry?.coordinates;

      if (
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        !Number.isFinite(Number(coordinates[0])) ||
        !Number.isFinite(Number(coordinates[1]))
      ) {
        continue;
      }

      const lng = Number(coordinates[0]);
      const lat = Number(coordinates[1]);

      const properties = feature.properties ?? {};

      const platform = properties.platform ?? "Unknown";
      const keyword = properties.keyword ?? "Unknown";
      const sentiment = Number(properties.sentiment ?? 0);
      const engagement = Number(properties.engagement ?? 0);
      const weight = Number(properties.weight ?? 0);

      const createdAt = properties.created_at
        ? new Date(String(properties.created_at)).toLocaleString()
        : "Unknown";

      const marker = L.circleMarker([lat, lng], {
        renderer,
        radius: 6,
        stroke: false,
        fillColor: "#000000",
        fillOpacity: 0,
        interactive: true,
      });

      marker.bindPopup(
        `
          <div style="min-width:220px;">
            <div style="font-weight:700;font-size:14px;margin-bottom:10px;">
              NLP Surveillance
            </div>

            <div style="margin-bottom:5px;">
              <strong>Platform:</strong>
              ${escapeHTML(String(platform))}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Keyword:</strong>
              ${escapeHTML(String(keyword))}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Sentiment:</strong>
              ${sentiment.toFixed(2)}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Engagement:</strong>
              ${engagement.toLocaleString()}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Risk Weight:</strong>
              ${weight}
            </div>

            <div>
              <strong>Date:</strong>
              ${escapeHTML(createdAt)}
            </div>
          </div>
        `,
        {
          closeButton: false,
          closeOnClick: false,
          offset: L.point(0, -8),
        },
      );

      marker.on("mouseover", () => {
        map.getContainer().style.cursor = "pointer";
        marker.openPopup();
      });

      marker.on("mousemove", (event: L.LeafletMouseEvent) => {
        const popup = marker.getPopup();

        if (popup) {
          popup.setLatLng(event.latlng);
        }
      });

      marker.on("mouseout", () => {
        map.getContainer().style.cursor = "";
        marker.closePopup();
      });

      layerGroup.addLayer(marker);
    }

    return () => {
      layerGroup.clearLayers();
    };
  }, [map, features]);

  return null;
}

function MunicipalityLabels({
  features,
  selectedProvince,
}: {
  features: GeoJSONFeature[];
  selectedProvince: string | null;
}) {
  const map = useMap();

  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!layerRef.current) {
      layerRef.current = L.layerGroup().addTo(map);
    }

    const layerGroup = layerRef.current;

    const updateLabels = () => {
      layerGroup.clearLayers();

      if (!selectedProvince) {
        return;
      }

      const zoom = map.getZoom();

      if (zoom < 8) {
        return;
      }

      const mapBounds = map.getBounds();

      for (const feature of features) {
        const center = getCenterFromGeometry(feature.geometry);

        if (!center) {
          continue;
        }

        const latLng = L.latLng(center[1], center[0]);

        if (!mapBounds.contains(latLng)) {
          continue;
        }

        const properties = feature.properties ?? {};

        const name =
          properties.name ??
          properties.municipality_name ??
          properties.mun_name ??
          properties.NAME_3 ??
          properties.NAME ??
          "";

        if (!name) {
          continue;
        }

        const marker = L.marker(latLng, {
          interactive: false,
          icon: L.divIcon({
            className: styles.municipality_label,
            html: `<span>${escapeHTML(String(name))}</span>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
        });

        layerGroup.addLayer(marker);
      }
    };

    updateLabels();

    map.on("zoomend", updateLabels);
    map.on("moveend", updateLabels);

    return () => {
      map.off("zoomend", updateLabels);
      map.off("moveend", updateLabels);

      layerGroup.clearLayers();
    };
  }, [map, features, selectedProvince]);

  return null;
}

function escapeHTML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getGeometryCoordinates(geometry: any): number[][] {
  if (!geometry?.coordinates) {
    return [];
  }

  if (geometry.type === "Polygon") {
    return geometry.coordinates
      .flat(1)
      .filter(
        (coordinate: any) =>
          Array.isArray(coordinate) &&
          coordinate.length >= 2 &&
          Number.isFinite(Number(coordinate[0])) &&
          Number.isFinite(Number(coordinate[1])),
      );
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flat(2)
      .filter(
        (coordinate: any) =>
          Array.isArray(coordinate) &&
          coordinate.length >= 2 &&
          Number.isFinite(Number(coordinate[0])) &&
          Number.isFinite(Number(coordinate[1])),
      );
  }

  return [];
}

function getBoundsFromGeometry(geometry: any): L.LatLngBoundsExpression | null {
  if (!geometry) {
    return null;
  }

  const coordinates = getGeometryCoordinates(geometry);

  if (!coordinates.length) {
    return null;
  }

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const coordinate of coordinates) {
    const lng = Number(coordinate[0]);
    const lat = Number(coordinate[1]);

    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      continue;
    }

    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  if (
    !Number.isFinite(minLng) ||
    !Number.isFinite(maxLng) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLat)
  ) {
    return null;
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}

function getCenterFromGeometry(geometry: any): [number, number] | null {
  if (!geometry) {
    return null;
  }

  const coordinates = getGeometryCoordinates(geometry);

  if (!coordinates.length) {
    return null;
  }

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const coordinate of coordinates) {
    const lng = Number(coordinate[0]);
    const lat = Number(coordinate[1]);

    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      continue;
    }

    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  if (
    !Number.isFinite(minLng) ||
    !Number.isFinite(maxLng) ||
    !Number.isFinite(minLat) ||
    !Number.isFinite(maxLat)
  ) {
    return null;
  }

  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

type PolygonEntry = {
  feature: GeoJSONFeature;
  code: string;
  bbox: {
    minLng: number;
    maxLng: number;
    minLat: number;
    maxLat: number;
  };
};

function createPolygonEntries(polygons: GeoJSONFeature[]): PolygonEntry[] {
  const entries: PolygonEntry[] = [];

  for (const feature of polygons) {
    const code = feature?.properties?.code;

    if (!code) {
      continue;
    }

    const coordinates = getGeometryCoordinates(feature.geometry);

    if (!coordinates.length) {
      continue;
    }

    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    for (const coordinate of coordinates) {
      const lng = Number(coordinate[0]);
      const lat = Number(coordinate[1]);

      if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
        continue;
      }

      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }

    if (
      !Number.isFinite(minLng) ||
      !Number.isFinite(maxLng) ||
      !Number.isFinite(minLat) ||
      !Number.isFinite(maxLat)
    ) {
      continue;
    }

    entries.push({
      feature,
      code: String(code),
      bbox: {
        minLng,
        maxLng,
        minLat,
        maxLat,
      },
    });
  }

  return entries;
}

function aggregateNLPWeights(
  polygons: GeoJSONFeature[],
  features: HeatmapFeature[],
): Map<string, number> {
  const weights = new Map<string, number>();

  const polygonEntries = createPolygonEntries(polygons);

  for (const polygon of polygonEntries) {
    weights.set(polygon.code, 0);
  }

  if (!polygonEntries.length || !features.length) {
    return weights;
  }

  for (const nlpFeature of features) {
    const coordinates = nlpFeature.geometry?.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      continue;
    }

    const lng = Number(coordinates[0]);

    const lat = Number(coordinates[1]);

    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      continue;
    }

    const weight = Number(nlpFeature.properties?.weight ?? 0);

    if (!Number.isFinite(weight)) {
      continue;
    }

    const nlpPoint = point([lng, lat]);

    for (const polygon of polygonEntries) {
      const { minLng, maxLng, minLat, maxLat } = polygon.bbox;

      if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) {
        continue;
      }

      try {
        if (booleanPointInPolygon(nlpPoint, polygon.feature as any)) {
          const current = weights.get(polygon.code) ?? 0;

          weights.set(polygon.code, current + weight);

          break;
        }
      } catch {
        continue;
      }
    }
  }

  return weights;
}

function addNLPWeightsToPolygons(
  polygons: GeoJSONFeature[],
  features: HeatmapFeature[],
): GeoJSONFeature[] {
  const weights = aggregateNLPWeights(polygons, features);

  return polygons.map((feature) => {
    const code = feature?.properties?.code;

    return {
      ...feature,
      properties: {
        ...(feature.properties ?? {}),
        nlp_weight: code ? Number(weights.get(String(code)) ?? 0) : 0,
      },
    };
  });
}

function getRiskColor(weight: number): string {
  if (weight > 100) {
    return "#ef4444";
  }

  if (weight > 75) {
    return "#f97316";
  }

  if (weight > 50) {
    return "#facc15";
  }

  if (weight > 25) {
    return "#22c55e";
  }

  if (weight > 0) {
    return "#22c55e";
  }

  return "#94a3b8";
}

function getProvinceStyle(feature?: any): L.PathOptions {
  const weight = Number(feature?.properties?.nlp_weight ?? 0);

  const color = getRiskColor(weight);

  return {
    renderer: canvasRenderer,
    color,
    weight: 1.5,
    opacity: 0.9,
    fillColor: color,
    fillOpacity: 0.025,
  };
}

function getMunicipalityStyle(feature?: any): L.PathOptions {
  const weight = Number(feature?.properties?.nlp_weight ?? 0);

  const color = getRiskColor(weight);

  return {
    renderer: canvasRenderer,
    color,
    weight: 0.7,
    opacity: 0.7,
    fillColor: color,
    fillOpacity: 0.01,
  };
}

function getRegionStyle(): L.PathOptions {
  return {
    renderer: canvasRenderer,
    color: "#1e293b",
    weight: 1,
    opacity: 0.7,
    fillColor: "#3b82f6",
    fillOpacity: 0.005,
  };
}

export default function SurveillanceMap() {
  const mapRef = useRef<L.Map | null>(null);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | null
  >(null);

  const { data: GeomData } = useFormQuery<any>({
    key: ["GetAllGeom"],
    url: "maintenance/geospatial/geom",
  });

  const { data: NLPData } = useFormQuery<any>({
    key: ["GetNLPHeatmap"],
    url: "maintenance/nlp",
    headers,
  });

  const { data: RegionData, isLoading: RegionLoading } = useFormQuery<any>({
    key: ["GetAllRegions"],
    url: "maintenance/geospatial/hierarchy",
  });

  useFormQuery({
    key: ["TreatmentHub"],
    url: "maintenance/treatment-hub",
    headers,
  });

  const regions = GeomData?.data?.regions;

  const provinces = GeomData?.data?.provinces;

  const municipalities = GeomData?.data?.municipalities;

  const nlpFeatures = useMemo<HeatmapFeature[]>(() => {
    const features = NLPData?.data?.features;

    if (!Array.isArray(features)) {
      return [];
    }

    return features.filter((feature: any) => {
      const coordinates = feature?.geometry?.coordinates;

      return (
        feature?.geometry?.type === "Point" &&
        Array.isArray(coordinates) &&
        coordinates.length === 2 &&
        Number.isFinite(Number(coordinates[0])) &&
        Number.isFinite(Number(coordinates[1]))
      );
    });
  }, [NLPData]);

  const provinceFeatures = useMemo<GeoJSONFeature[]>(() => {
    if (!Array.isArray(provinces?.features)) {
      return [];
    }

    return provinces.features;
  }, [provinces]);

  const filteredMunicipalities = useMemo<GeoJSONFeature[]>(() => {
    if (!Array.isArray(municipalities?.features)) {
      return [];
    }

    if (!selectedProvince) {
      return municipalities.features;
    }

    return municipalities.features.filter((feature: any) => {
      const properties = feature?.properties ?? {};

      const provinceCode =
        properties.province_code ??
        properties.prov_code ??
        properties.PROV_CODE ??
        properties.provinceCode ??
        properties.parent_code ??
        properties.PARENT_CODE ??
        properties.province ??
        properties.PROVINCE;

      return (
        provinceCode !== undefined &&
        String(provinceCode) === String(selectedProvince)
      );
    });
  }, [municipalities, selectedProvince]);

  const coloredProvinces = useMemo(() => {
    if (!provinceFeatures.length) {
      return [];
    }

    return addNLPWeightsToPolygons(provinceFeatures, nlpFeatures);
  }, [provinceFeatures, nlpFeatures]);

  const coloredMunicipalities = useMemo(() => {
    if (!filteredMunicipalities.length) {
      return [];
    }

    return addNLPWeightsToPolygons(filteredMunicipalities, nlpFeatures);
  }, [filteredMunicipalities, nlpFeatures]);

  const municipalityLabelFeatures = useMemo(() => {
    if (!filteredMunicipalities.length) {
      return [];
    }

    return filteredMunicipalities
      .map((feature: any) => {
        const center = getCenterFromGeometry(feature.geometry);

        if (!center) {
          return null;
        }

        const properties = feature.properties ?? {};

        const name =
          properties.name ??
          properties.municipality_name ??
          properties.mun_name ??
          properties.NAME_3 ??
          properties.NAME ??
          "";

        if (!name) {
          return null;
        }

        return {
          ...feature,
          properties: {
            ...properties,
            name,
          },
        };
      })
      .filter((feature: any) => feature && feature.properties?.name);
  }, [filteredMunicipalities]);

  const regionGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!Array.isArray(regions?.features)) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: regions.features,
    };
  }, [regions]);

  const provinceGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!coloredProvinces.length) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: coloredProvinces,
    };
  }, [coloredProvinces]);

  const municipalityGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!coloredMunicipalities.length) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features: coloredMunicipalities,
    };
  }, [coloredMunicipalities]);

  const selectedProvinceGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!selectedProvince) {
      return null;
    }

    const features = coloredProvinces.filter(
      (feature: any) =>
        String(feature?.properties?.code) === String(selectedProvince),
    );

    if (!features.length) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features,
    };
  }, [coloredProvinces, selectedProvince]);

  const selectedMunicipalityGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!selectedMunicipality) {
      return null;
    }

    const features = coloredMunicipalities.filter(
      (feature: any) =>
        String(feature?.properties?.code) === String(selectedMunicipality),
    );

    if (!features.length) {
      return null;
    }

    return {
      type: "FeatureCollection",
      features,
    };
  }, [coloredMunicipalities, selectedMunicipality]);

  const zoomToBounds = useCallback(
    (
      bounds: any,
      code?: string,
      type: "province" | "municipality" = "province",
    ) => {
      const map = mapRef.current;

      if (!map || !bounds) {
        return;
      }

      const geometry =
        bounds?.type === "Feature"
          ? bounds.geometry
          : bounds?.type === "FeatureCollection"
            ? null
            : bounds;

      const mapBounds = getBoundsFromGeometry(geometry);

      if (!mapBounds) {
        return;
      }

      if (type === "province") {
        setSelectedProvince(code ? String(code) : null);

        setSelectedMunicipality(null);
      }

      if (type === "municipality") {
        setSelectedMunicipality(code ? String(code) : null);
      }

      map.fitBounds(mapBounds, {
        padding: [40, 40],
        duration: 0.8,
        maxZoom: type === "municipality" ? 12 : 10,
      });
    },
    [],
  );

  const provinceOnEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const code = feature?.properties?.code;

    const name =
      feature?.properties?.name ??
      feature?.properties?.province_name ??
      feature?.properties?.NAME_1 ??
      feature?.properties?.NAME ??
      "";

    const weight = Number(feature?.properties?.nlp_weight ?? 0);

    layer.bindTooltip(
      `
            <div>
              <strong>${escapeHTML(String(name))}</strong>
              <br />
              NLP Risk Weight:
              ${weight.toFixed(2)}
            </div>
          `,
      {
        sticky: true,
        direction: "top",
      },
    );

    layer.on({
      mouseover: (event) => {
        const target = event.target as L.Path;

        target.setStyle({
          weight: 3,
          color: "#35408E",
          fillOpacity: 0.08,
        });

        target.bringToFront();
      },

      mouseout: (event) => {
        const target = event.target as L.Path;

        target.setStyle(getProvinceStyle(feature));
      },

      click: (event) => {
        const target = event.target as L.Polygon;

        const map = mapRef.current;

        if (!map) {
          return;
        }

        if (code) {
          setSelectedProvince(String(code));

          setSelectedMunicipality(null);
        }

        const bounds = target.getBounds();

        if (bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [40, 40],
            duration: 0.8,
            maxZoom: 10,
          });
        }
      },
    });
  }, []);

  const municipalityOnEachFeature = useCallback(
    (feature: any, layer: L.Layer) => {
      const code = feature?.properties?.code;

      const name =
        feature?.properties?.name ??
        feature?.properties?.municipality_name ??
        feature?.properties?.mun_name ??
        feature?.properties?.NAME_3 ??
        feature?.properties?.NAME ??
        "";

      const weight = Number(feature?.properties?.nlp_weight ?? 0);

      layer.bindTooltip(
        `
            <div>
              <strong>${escapeHTML(String(name))}</strong>
              <br />
              NLP Risk Weight:
              ${weight.toFixed(2)}
            </div>
          `,
        {
          sticky: true,
          direction: "top",
        },
      );

      layer.on({
        mouseover: (event) => {
          const target = event.target as L.Path;

          target.setStyle({
            weight: 2,
            color: "#35408E",
            fillOpacity: 0.08,
          });

          target.bringToFront();
        },

        mouseout: (event) => {
          const target = event.target as L.Path;

          target.setStyle(getMunicipalityStyle(feature));
        },

        click: (event) => {
          const target = event.target as L.Polygon;

          const map = mapRef.current;

          if (!map) {
            return;
          }

          if (code) {
            setSelectedMunicipality(String(code));
          }

          const bounds = target.getBounds();

          if (bounds.isValid()) {
            map.fitBounds(bounds, {
              padding: [30, 30],
              duration: 0.6,
              maxZoom: 12,
            });
          }
        },
      });
    },
    [],
  );

  return (
    <div className={styles.container}>
      <div className={styles.col1}>
        <Title size="md">Administrative Region</Title>

        <div className={styles.regions}>
          {RegionLoading
            ? null
            : RegionData?.data?.data?.map((region: Region) => (
                <div key={region.region_code}>
                  <div
                    style={{
                      fontWeight: 700,
                      padding: 8,
                      cursor: "pointer",
                      backgroundColor: "#35408E",
                      color: "white",
                    }}
                    onClick={() => {
                      setSelectedProvince(null);

                      setSelectedMunicipality(null);

                      zoomToBounds(region.bounds);
                    }}
                  >
                    {region.region_name}
                  </div>

                  {region.provinces?.map((province: Province) => (
                    <div
                      key={province.code}
                      style={{
                        padding: 10,
                        paddingLeft: 25,
                        cursor: "pointer",
                        borderRadius: 5,
                        color:
                          selectedProvince === province.code
                            ? "black"
                            : "#35408E",
                        background:
                          selectedProvince === province.code
                            ? "rgb(192, 192, 199)"
                            : "transparent",
                        opacity: 0.9,
                      }}
                      onClick={() =>
                        zoomToBounds(province.bounds, province.code, "province")
                      }
                    >
                      {province.name}
                    </div>
                  ))}
                </div>
              ))}
        </div>
      </div>

      <div className={styles.col2}>
        <MapContainer
          center={[12.8797, 121.774]}
          zoom={6}
          minZoom={6}
          maxZoom={18}
          scrollWheelZoom
          zoomControl
          preferCanvas
          maxBounds={PHILIPPINES_BOUNDS}
          maxBoundsViscosity={1}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <MapController mapRef={mapRef} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            updateWhenIdle
            keepBuffer={2}
          />

          {regionGeoJSON && (
            <DynamicGeoJSON data={regionGeoJSON} style={getRegionStyle} />
          )}

          {provinceGeoJSON && (
            <DynamicGeoJSON
              data={provinceGeoJSON}
              style={getProvinceStyle}
              onEachFeature={provinceOnEachFeature}
            />
          )}

          {municipalityGeoJSON && (
            <DynamicGeoJSON
              data={municipalityGeoJSON}
              style={getMunicipalityStyle}
              onEachFeature={municipalityOnEachFeature}
            />
          )}

          <MunicipalityLabels
            features={municipalityLabelFeatures}
            selectedProvince={selectedProvince}
          />

          <HeatmapLayer features={nlpFeatures} />

          <NLPPointsLayer features={nlpFeatures} />

          {selectedProvinceGeoJSON && (
            <GeoJSON
              data={selectedProvinceGeoJSON as any}
              style={{
                renderer: canvasRenderer,
                color: "#35408E",
                weight: 3,
                opacity: 1,
                fillColor: "#35408E",
                fillOpacity: 0.05,
                interactive: false,
              }}
            />
          )}

          {selectedMunicipalityGeoJSON && (
            <GeoJSON
              data={selectedMunicipalityGeoJSON as any}
              style={{
                renderer: canvasRenderer,
                color: "#35408E",
                weight: 3,
                opacity: 1,
                fillColor: "#35408E",
                fillOpacity: 0.05,
                interactive: false,
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className={styles.legends}>
        {legends.map((legend) => (
          <div className={styles.legends_card} key={legend.label}>
            <div className={`${styles.indicator} ${styles[legend.color]}`} />

            <Text
              style={{
                color: "#35408E",
              }}
              size="sm"
            >
              {legend.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
