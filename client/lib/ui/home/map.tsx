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

import styles from "@/styles/lib/ui/home/surveillance.module.scss";
import useFormQuery from "@/lib/hooks/useQuery";
import Title from "../title";
import Text from "@/components/Typography/Text/text";
import headers from "@/lib/utils/headers";

import {
  TreatmentHubInterface,
  TreatmentHubResult,
} from "@/lib/interface/treatment-hub/treatment-hub.interface";

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
  properties?: {
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

type DynamicGeoJSONProps = {
  data: FeatureCollection | null;
  style: (feature?: any) => L.PathOptions;
  onEachFeature?: (feature: any, layer: L.Layer) => void;
  pane?: string;
  interactive?: boolean;
};

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

const legends = [
  { label: "Low", color: "success" },
  { label: "Medium", color: "warning" },
  { label: "High", color: "danger" },
];

const canvasRenderer = L.canvas({ padding: 0.5 });

function escapeHTML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSafeWebsiteUrl(value?: string | null): string | null {
  if (!value?.trim()) return null;

  try {
    const url = new URL(value.trim());

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return escapeHTML(url.href);
  } catch {
    return null;
  }
}

function getGeometryCoordinates(geometry: any): number[][] {
  if (!geometry?.coordinates) return [];

  const coordinates: any[] =
    geometry.type === "Polygon"
      ? geometry.coordinates.flat(1)
      : geometry.type === "MultiPolygon"
        ? geometry.coordinates.flat(2)
        : [];

  return coordinates.filter(
    (coordinate: any) =>
      Array.isArray(coordinate) &&
      coordinate.length >= 2 &&
      Number.isFinite(Number(coordinate[0])) &&
      Number.isFinite(Number(coordinate[1])),
  );
}

function getBoundsFromGeometry(geometry: any): L.LatLngBounds | null {
  const coordinates = getGeometryCoordinates(geometry);

  if (!coordinates.length) return null;

  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const coordinate of coordinates) {
    const lng = Number(coordinate[0]);
    const lat = Number(coordinate[1]);

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

  return L.latLngBounds([minLat, minLng], [maxLat, maxLng]);
}

function getBoundsFromGeoJSON(input: any): L.LatLngBounds | null {
  if (!input) return null;

  if (input.type === "FeatureCollection") {
    const features = input.features ?? [];
    const combinedBounds = L.latLngBounds([]);

    for (const feature of features) {
      const bounds = getBoundsFromGeoJSON(feature);

      if (bounds?.isValid()) {
        combinedBounds.extend(bounds);
      }
    }

    return combinedBounds.isValid() ? combinedBounds : null;
  }

  if (input.type === "Feature") {
    return getBoundsFromGeometry(input.geometry);
  }

  return getBoundsFromGeometry(input);
}

function getCenterFromGeometry(geometry: any): [number, number] | null {
  const bounds = getBoundsFromGeometry(geometry);

  if (!bounds) return null;

  const center = bounds.getCenter();

  return [center.lng, center.lat];
}

function getFeatureName(properties: Record<string, any> = {}): string {
  return String(
    properties.name ??
      properties.province_name ??
      properties.municipality_name ??
      properties.mun_name ??
      properties.NAME_3 ??
      properties.NAME_1 ??
      properties.NAME ??
      "",
  );
}

function getRiskColor(weight: number): string {
  if (weight > 100) return "#ef4444";
  if (weight > 75) return "#f97316";
  if (weight > 50) return "#facc15";
  if (weight > 25) return "#22c55e";
  if (weight > 0) return "#22c55e";

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

    if (!layer) return;

    layer.clearLayers();

    if (data?.features?.length) {
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

function TreatmentHubsLayer({ hubs }: { hubs: TreatmentHubInterface[] }) {
  const map = useMap();

  const validHubs = useMemo(() => {
    return hubs.filter((hub) => {
      if (
        hub.latitude == null ||
        hub.longitude == null ||
        String(hub.latitude).trim() === "" ||
        String(hub.longitude).trim() === ""
      ) {
        return false;
      }

      const lat = Number(hub.latitude);
      const lng = Number(hub.longitude);

      return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });
  }, [hubs]);

  useEffect(() => {
    const layerGroup = L.layerGroup().addTo(map);

    const treatmentHubIcon = L.divIcon({
      className: styles.treatment_hub_marker,
      html: `
        <div style="
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #35408E;
          border: 2px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
        ">
          <span style="
            display: block;
            transform: rotate(45deg);
            font-size: 18px;
            line-height: 1;
            color: white;
          ">✚</span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32],
    });

    for (const hub of validHubs) {
      const lat = Number(hub.latitude);
      const lng = Number(hub.longitude);

      const serviceNames =
        hub.services
          ?.map((item) => item.services?.name)
          .filter((name): name is string => Boolean(name)) ?? [];

      const servicesHTML = serviceNames.length
        ? serviceNames
            .map(
              (serviceName) =>
                `<li style="margin-bottom:3px;">${escapeHTML(serviceName)}</li>`,
            )
            .join("")
        : "<li>Not specified</li>";

      const name = escapeHTML(hub.name || "Unnamed Treatment Hub");

      const address = escapeHTML(hub.address || "Not available");

      const province = escapeHTML(hub.provinces?.name_1 || "Not available");

      const municipality = escapeHTML(
        hub.municipalities?.name_2 || "Not available",
      );

      const region = escapeHTML(hub.regions?.name || "Not available");

      const status = escapeHTML(hub.status || "Unknown");

      const email = escapeHTML(hub.email || "Not available");

      const contact = escapeHTML(hub.contact_number || "Not available");

      const website = getSafeWebsiteUrl(hub.website);

      const operatingHours = escapeHTML(hub.operating_hours || "Not specified");

      const isActive = status.toUpperCase() === "ACTIVE";

      const popupContent = `
        <div style="
          min-width: 240px;
          max-width: 320px;
          font-family: Arial, sans-serif;
          font-size: 13px;
          line-height: 1.5;
        ">
          <div style="
            font-size: 15px;
            font-weight: 700;
            color: #35408E;
            margin-bottom: 8px;
          ">
            ${name}
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Status:</strong>
            <span style="
              color: ${isActive ? "#16a34a" : "#64748b"};
              font-weight: 600;
            ">
              ${status}
            </span>
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Address:</strong><br />
            ${address}
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Municipality:</strong> ${municipality}
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Province:</strong> ${province}
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Region:</strong> ${region}
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Services:</strong>
            <ul style="margin: 3px 0 0; padding-left: 20px;">
              ${servicesHTML}
            </ul>
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Contact:</strong> ${contact}
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Email:</strong>
            ${
              hub.email
                ? `<a href="mailto:${encodeURIComponent(hub.email)}">${email}</a>`
                : email
            }
          </div>

          <div style="margin-bottom: 6px;">
            <strong>Operating Hours:</strong> ${operatingHours}
          </div>

          ${
            website
              ? `<div style="margin-bottom: 6px;">
                  <strong>Website:</strong>
                  <a
                    href="${website}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Visit website</a>
                </div>`
              : ""
          }

          <div style="
            border-top: 1px solid #e2e8f0;
            padding-top: 6px;
            margin-top: 8px;
            color: #64748b;
            font-size: 11px;
          ">
            Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], {
        icon: treatmentHubIcon,
        title: hub.name,
        keyboard: true,
        riseOnHover: true,
      });

      marker.bindPopup(popupContent, {
        maxWidth: 340,
        minWidth: 250,
        closeButton: true,
        autoPan: true,
      });

      marker.bindTooltip(name, {
        direction: "top",
        offset: [0, -30],
      });

      marker.addTo(layerGroup);
    }

    return () => {
      layerGroup.clearLayers();
      map.removeLayer(layerGroup);
    };
  }, [map, validHubs]);

  return null;
}

function HeatmapLayer({ features }: { features: HeatmapFeature[] }) {
  const map = useMap();
  const heatLayerRef = useRef<any>(null);

  useEffect(() => {
    const heatLayer = (L as any).heatLayer([], {
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

    heatLayerRef.current = heatLayer;
    heatLayer.addTo(map);

    return () => {
      if (map.hasLayer(heatLayer)) {
        map.removeLayer(heatLayer);
      }

      heatLayerRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const heatLayer = heatLayerRef.current;

    if (!heatLayer) return;

    const heatPoints: [number, number, number][] = [];

    for (const feature of features) {
      const coordinates = feature.geometry?.coordinates;

      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        continue;
      }

      const lng = Number(coordinates[0]);
      const lat = Number(coordinates[1]);
      const weight = Number(feature.properties?.weight ?? 0);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        !Number.isFinite(weight) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        continue;
      }

      heatPoints.push([lat, lng, Math.min(Math.max(weight / 100, 0), 1)]);
    }

    heatLayer.setLatLngs(heatPoints);
  }, [features]);

  return null;
}

function NLPPointsLayer({ features }: { features: HeatmapFeature[] }) {
  const map = useMap();

  useEffect(() => {
    const layerGroup = L.layerGroup().addTo(map);

    for (const feature of features) {
      const coordinates = feature.geometry?.coordinates;

      if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        continue;
      }

      const lng = Number(coordinates[0]);
      const lat = Number(coordinates[1]);

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        continue;
      }

      const properties = feature.properties ?? {};

      const platform = String(properties.platform ?? "Unknown");

      const keyword = String(properties.keyword ?? "Unknown");

      const sentiment = Number(properties.sentiment ?? 0);

      const engagement = Number(properties.engagement ?? 0);

      const weight = Number(properties.weight ?? 0);

      const createdAt = properties.created_at
        ? new Date(String(properties.created_at)).toLocaleString()
        : "Unknown";

      const safeDate =
        createdAt !== "Unknown" &&
        !Number.isNaN(new Date(String(properties.created_at)).getTime())
          ? escapeHTML(createdAt)
          : "Unknown";

      const marker = L.circleMarker([lat, lng], {
        renderer: canvasRenderer,
        radius: 6,
        stroke: false,
        fillColor: "#000000",
        fillOpacity: 0,
        interactive: true,
      });

      marker.bindPopup(
        `
          <div style="min-width:220px;">
            <div style="
              font-weight:700;
              font-size:14px;
              margin-bottom:10px;
            ">
              NLP Surveillance
            </div>

            <div style="margin-bottom:5px;">
              <strong>Platform:</strong>
              ${escapeHTML(platform)}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Keyword:</strong>
              ${escapeHTML(keyword)}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Sentiment:</strong>
              ${Number.isFinite(sentiment) ? sentiment.toFixed(2) : "N/A"}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Engagement:</strong>
              ${Number.isFinite(engagement) ? engagement.toLocaleString() : "N/A"}
            </div>

            <div style="margin-bottom:5px;">
              <strong>Risk Weight:</strong>
              ${Number.isFinite(weight) ? weight : "N/A"}
            </div>

            <div>
              <strong>Date:</strong>
              ${safeDate}
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
      map.removeLayer(layerGroup);
      map.getContainer().style.cursor = "";
    };
  }, [map, features]);

  return null;
}

function MunicipalityLabels({ features }: { features: GeoJSONFeature[] }) {
  const map = useMap();

  useEffect(() => {
    const layerGroup = L.layerGroup().addTo(map);

    const updateLabels = () => {
      layerGroup.clearLayers();

      if (map.getZoom() < 8) return;

      const mapBounds = map.getBounds();

      for (const feature of features) {
        const center = getCenterFromGeometry(feature.geometry);

        if (!center) continue;

        const latLng = L.latLng(center[1], center[0]);

        if (!mapBounds.contains(latLng)) continue;

        const properties = feature.properties ?? {};
        const name = getFeatureName(properties);

        if (!name) continue;

        const marker = L.marker(latLng, {
          interactive: false,
          icon: L.divIcon({
            className: styles.municipality_label,
            html: `<span>${escapeHTML(name)}</span>`,
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
      map.removeLayer(layerGroup);
    };
  }, [map, features]);

  return null;
}

function createPolygonEntries(polygons: GeoJSONFeature[]): PolygonEntry[] {
  const entries: PolygonEntry[] = [];

  for (const feature of polygons) {
    const code = feature?.properties?.code;

    if (code == null || code === "") continue;

    const bounds = getBoundsFromGeometry(feature.geometry);

    if (!bounds) continue;

    const southwest = bounds.getSouthWest();
    const northeast = bounds.getNorthEast();

    entries.push({
      feature,
      code: String(code),
      bbox: {
        minLng: southwest.lng,
        maxLng: northeast.lng,
        minLat: southwest.lat,
        maxLat: northeast.lat,
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

  if (polygonEntries.length === 0 || features.length === 0) {
    return weights;
  }

  for (const nlpFeature of features) {
    const coordinates = nlpFeature.geometry?.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      continue;
    }

    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);

    const weight = Number(nlpFeature.properties?.weight ?? 0);

    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat) ||
      !Number.isFinite(weight)
    ) {
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
          weights.set(polygon.code, (weights.get(polygon.code) ?? 0) + weight);

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
        nlp_weight: code != null ? Number(weights.get(String(code)) ?? 0) : 0,
      },
    };
  });
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

  const { data: TreatmentHubData } = useFormQuery<TreatmentHubResult>({
    key: ["TreatmentHub"],
    url: "maintenance/treatment-hub",
    headers,
    params: { limit: 500 },
  });

  const regions = GeomData?.data?.regions;
  const provinces = GeomData?.data?.provinces;
  const municipalities = GeomData?.data?.municipalities;

  const treatmentHubs = useMemo<TreatmentHubInterface[]>(() => {
    const edges = TreatmentHubData?.data?.edges;

    if (!Array.isArray(edges)) return [];

    return edges
      .map((edge) => edge?.node)
      .filter((hub) => Boolean(hub?.treatment_hub_id && hub?.name));
  }, [TreatmentHubData]);

  const validTreatmentHubCount = useMemo(
    () =>
      treatmentHubs.filter((hub) => {
        if (
          hub.latitude == null ||
          hub.longitude == null ||
          String(hub.latitude).trim() === "" ||
          String(hub.longitude).trim() === ""
        ) {
          return false;
        }

        const lat = Number(hub.latitude);
        const lng = Number(hub.longitude);

        return (
          Number.isFinite(lat) &&
          Number.isFinite(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        );
      }).length,
    [treatmentHubs],
  );

  const nlpFeatures = useMemo<HeatmapFeature[]>(() => {
    const features = NLPData?.data?.features;

    if (!Array.isArray(features)) return [];

    return features.filter((feature: any) => {
      const coordinates = feature?.geometry?.coordinates;

      if (
        feature?.geometry?.type !== "Point" ||
        !Array.isArray(coordinates) ||
        coordinates.length !== 2
      ) {
        return false;
      }

      const lng = Number(coordinates[0]);
      const lat = Number(coordinates[1]);

      return (
        Number.isFinite(lng) &&
        Number.isFinite(lat) &&
        lng >= -180 &&
        lng <= 180 &&
        lat >= -90 &&
        lat <= 90
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
        provinceCode != null &&
        String(provinceCode) === String(selectedProvince)
      );
    });
  }, [municipalities, selectedProvince]);

  const coloredProvinces = useMemo(
    () => addNLPWeightsToPolygons(provinceFeatures, nlpFeatures),
    [provinceFeatures, nlpFeatures],
  );

  const coloredMunicipalities = useMemo(
    () => addNLPWeightsToPolygons(filteredMunicipalities, nlpFeatures),
    [filteredMunicipalities, nlpFeatures],
  );

  const municipalityLabelFeatures = useMemo<GeoJSONFeature[]>(() => {
    return filteredMunicipalities
      .map((feature: any) => {
        const properties = feature.properties ?? {};

        const name = getFeatureName(properties);

        if (!name || !getCenterFromGeometry(feature.geometry)) {
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
      .filter((feature): feature is GeoJSONFeature => feature !== null);
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
    if (!coloredProvinces.length) return null;

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
    if (!selectedProvince) return null;

    const features = coloredProvinces.filter(
      (feature) =>
        String(feature?.properties?.code) === String(selectedProvince),
    );

    if (!features.length) return null;

    return {
      type: "FeatureCollection",
      features,
    };
  }, [coloredProvinces, selectedProvince]);

  const selectedMunicipalityGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!selectedMunicipality) return null;

    const features = coloredMunicipalities.filter(
      (feature) =>
        String(feature?.properties?.code) === String(selectedMunicipality),
    );

    if (!features.length) return null;

    return {
      type: "FeatureCollection",
      features,
    };
  }, [coloredMunicipalities, selectedMunicipality]);

  const zoomToBounds = useCallback(
    (
      inputBounds: any,
      code?: string,
      type: "province" | "municipality" = "province",
    ) => {
      const map = mapRef.current;

      if (!map || !inputBounds) return;

      const bounds = getBoundsFromGeoJSON(inputBounds);

      if (!bounds?.isValid()) return;

      if (type === "province") {
        setSelectedProvince(code != null ? String(code) : null);

        setSelectedMunicipality(null);
      }

      if (type === "municipality") {
        setSelectedMunicipality(code != null ? String(code) : null);
      }

      map.fitBounds(bounds, {
        padding: [40, 40],
        duration: 0.8,
        maxZoom: type === "municipality" ? 12 : 10,
      });
    },
    [],
  );

  const provinceOnEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const name = getFeatureName(feature?.properties);

    const weight = Number(feature?.properties?.nlp_weight ?? 0);

    layer.bindTooltip(
      `<div>
          <strong>${escapeHTML(name)}</strong><br />
          NLP Risk Weight: ${weight.toFixed(2)}
        </div>`,
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

        if (!map) return;

        const code = feature?.properties?.code;

        if (code != null) {
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
      const name = getFeatureName(feature?.properties);

      const weight = Number(feature?.properties?.nlp_weight ?? 0);

      layer.bindTooltip(
        `<div>
          <strong>${escapeHTML(name)}</strong><br />
          NLP Risk Weight: ${weight.toFixed(2)}
        </div>`,
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

          if (!map) return;

          const code = feature?.properties?.code;

          if (code != null) {
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
      {/* ADMINISTRATIVE HIERARCHY */}

      <div className={styles.col1}>
        <Title title="Administrative Hierarchy" />

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
          minZoom={5}
          maxZoom={18}
          scrollWheelZoom
          zoomControl
          preferCanvas
          maxBounds={[
            [4.0, 116.0],
            [21.5, 127.0],
          ]}
          maxBoundsViscosity={1.0}
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

          {/* REGIONS */}

          {regionGeoJSON && (
            <DynamicGeoJSON data={regionGeoJSON} style={getRegionStyle} />
          )}

          {/* PROVINCES */}

          {provinceGeoJSON && (
            <DynamicGeoJSON
              data={provinceGeoJSON}
              style={getProvinceStyle}
              onEachFeature={provinceOnEachFeature}
            />
          )}

          {/* MUNICIPALITIES */}

          {municipalityGeoJSON && (
            <DynamicGeoJSON
              data={municipalityGeoJSON}
              style={getMunicipalityStyle}
              onEachFeature={municipalityOnEachFeature}
            />
          )}

          {/* MUNICIPALITY LABELS */}

          <MunicipalityLabels features={municipalityLabelFeatures} />

          {/* NLP HEATMAP */}

          <HeatmapLayer features={nlpFeatures} />

          {/* NLP POINTS */}

          <NLPPointsLayer features={nlpFeatures} />

          {/* TREATMENT HUBS */}

          <TreatmentHubsLayer hubs={treatmentHubs} />

          {/* SELECTED PROVINCE */}

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

          {/* SELECTED MUNICIPALITY */}

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

      {/* RISK LEGEND */}

      <div className={styles.legends}>
        {legends.map((legend) => (
          <div className={styles.legends_card} key={legend.label}>
            <div className={`${styles.indicator} ${styles[legend.color]}`} />

            <Text style={{ color: "#35408E" }} size="sm">
              {legend.label}
            </Text>
          </div>
        ))}
      </div>

      {/* TREATMENT HUB COUNT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          color: "#35408E",
          fontSize: 13,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#35408E",
            color: "#ffffff",
            borderRadius: "50%",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          +
        </span>

        <span>
          Treatment Hubs: {validTreatmentHubCount} mapped
          {" / "}
          {treatmentHubs.length} fetched
        </span>
      </div>
    </div>
  );
}
