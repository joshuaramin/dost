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
import { TbMinus, TbPlus } from "react-icons/tb";

import styles from "@/styles/lib/ui/home/surveillance.module.scss";
import useFormQuery from "@/lib/hooks/useQuery";
import Text from "@/components/Typography/Text/text";
import Title from "@/components/Typography/Title/title";
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

type TreatmentHubFilter = "all" | "active";

type GeoJSONFeature = {
  type: "Feature";
  properties?: Record<string, any>;
  geometry: any;
};

type FeatureCollection = {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
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

function MyLocationControl() {
  const map = useMap();

  useEffect(() => {
    let locationLayer: L.LayerGroup | null = null;
    let isRequestingLocation = false;

    const control = new L.Control({ position: "topright" });

    const showMessage = (message: string) => {
      window.alert(message);
    };

    const locate = async () => {
      if (!navigator.geolocation) {
        showMessage("Your browser does not support location services.");
        return;
      }

      if (!window.isSecureContext) {
        showMessage(
          "Location requires HTTPS or localhost. Open your application using http://localhost:3000.",
        );
        return;
      }

      if (isRequestingLocation) return;

      isRequestingLocation = true;

      try {
        if (navigator.permissions?.query) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });

          console.info("[MyLocation] Permission state:", permission.state);

          if (permission.state === "denied") {
            showMessage(
              "Location access is blocked.\n\n" +
                "1. Open chrome://settings/content/location\n" +
                "2. Allow sites to ask for your location.\n" +
                "3. Remove localhost from the blocked list, if present.\n" +
                "4. Reload this page and try again.",
            );

            return;
          }
        }
      } catch (error) {
        console.warn("[MyLocation] Could not check permission:", error);
      }

      if (locationLayer) {
        map.removeLayer(locationLayer);
        locationLayer = null;
      }

      console.info("[MyLocation] Requesting device location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          isRequestingLocation = false;

          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          console.info("[MyLocation] Position received:", {
            latitude,
            longitude,
            accuracy,
          });

          const latLng = L.latLng(latitude, longitude);

          locationLayer = L.layerGroup().addTo(map);

          const accuracyCircle = L.circle(latLng, {
            radius: accuracy,
            color: "#2563eb",
            weight: 1.5,
            fillColor: "#3b82f6",
            fillOpacity: 0.12,
            interactive: false,
          });

          const locationIcon = L.divIcon({
            className: "",
            html: `
              <div style="
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #2563eb;
                border: 4px solid #ffffff;
                box-shadow: 0 0 0 2px #2563eb, 0 2px 8px rgba(0,0,0,0.3);
                box-sizing: border-box;
              "></div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          const locationMarker = L.marker(latLng, {
            icon: locationIcon,
            title: "Your current location",
            keyboard: true,
            riseOnHover: true,
            zIndexOffset: 10000,
          });

          const popupContent = `
            <div style="
              min-width: 190px;
              font-family: Arial, sans-serif;
              font-size: 13px;
              line-height: 1.7;
            ">
              <strong style="font-size: 14px;">
                Your Current Location
              </strong>
              <div>
                <strong>Latitude:</strong> ${latitude.toFixed(6)}
              </div>
              <div>
                <strong>Longitude:</strong> ${longitude.toFixed(6)}
              </div>
              <div>
                <strong>Accuracy:</strong> approximately ${Math.round(accuracy)} meters
              </div>
            </div>
          `;

          locationMarker.bindPopup(popupContent);

          locationLayer.addLayer(accuracyCircle);
          locationLayer.addLayer(locationMarker);

          map.flyTo(latLng, Math.max(map.getZoom(), 16), {
            animate: true,
            duration: 1,
          });

          locationMarker.openPopup();
        },
        (error) => {
          isRequestingLocation = false;

          console.error("[MyLocation] Geolocation failed:", {
            code: error.code,
            message: error.message,
          });

          let message: string;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message =
                "Location access was denied. Open Chrome site settings for localhost and set Location to Allow.";
              break;

            case error.POSITION_UNAVAILABLE:
              message =
                "Your device could not determine your location. Enable macOS Location Services and try again.";
              break;

            case error.TIMEOUT:
              message =
                "The location request timed out. Try again with Wi-Fi enabled and check macOS Location Services.";
              break;

            default:
              message =
                "An unknown location error occurred. Check the browser console for details.";
          }

          showMessage(message);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 0,
        },
      );
    };

    control.onAdd = () => {
      const container = L.DomUtil.create("div", "leaflet-bar");

      const button = L.DomUtil.create("button", "", container);

      button.type = "button";
      button.title = "Show my current location";
      button.setAttribute("aria-label", "Show my current location");

      button.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="9" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
        </svg>
      `;

      Object.assign(button.style, {
        width: "40px",
        height: "40px",
        padding: "0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        color: "#35408e",
        border: "none",
        cursor: "pointer",
      });

      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      L.DomEvent.on(button, "click", locate);

      return container;
    };

    control.addTo(map);

    return () => {
      control.remove();

      if (locationLayer) {
        map.removeLayer(locationLayer);
        locationLayer = null;
      }
    };
  }, [map]);

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
    const bounds = L.latLngBounds([]);

    for (const feature of input.features ?? []) {
      const featureBounds = getBoundsFromGeoJSON(feature);

      if (featureBounds?.isValid()) {
        bounds.extend(featureBounds);
      }
    }

    return bounds.isValid() ? bounds : null;
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
    fillOpacity: 0.04,
  };
}

function getMunicipalityStyle(feature?: any): L.PathOptions {
  const weight = Number(feature?.properties?.nlp_weight ?? 0);
  const color = getRiskColor(weight);

  return {
    renderer: canvasRenderer,
    color,
    weight: 0.8,
    opacity: 0.75,
    fillColor: color,
    fillOpacity: 0.025,
  };
}

function getRegionStyle(): L.PathOptions {
  return {
    renderer: canvasRenderer,
    color: "#64748b",
    weight: 1,
    opacity: 0.7,
    fillColor: "#94a3b8",
    fillOpacity: 0.01,
  };
}

function MapController({ mapRef }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;

    const invalidate = () => {
      map.invalidateSize({ pan: false });
    };

    const timeout = window.setTimeout(invalidate, 100);

    return () => {
      window.clearTimeout(timeout);

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

  const setLayerRef = useCallback((layer: L.GeoJSON | null) => {
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
      ref={setLayerRef}
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

function TreatmentHubsLayer({
  hubs,
  visible,
}: {
  hubs: TreatmentHubInterface[];
  visible: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!visible) return;

    const layerGroup = L.layerGroup();

    const hubIcon = L.divIcon({
      className: styles.treatment_hub_marker,
      html: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="#35408e"
      stroke="#ffffff"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" fill="#ffffff" stroke="#ffffff" />
    </svg>
  `,
      iconSize: [36, 36],
      iconAnchor: [18, 35],
      popupAnchor: [0, -35],
    });

    for (const hub of hubs) {
      if (
        hub.latitude == null ||
        hub.longitude == null ||
        String(hub.latitude).trim() === "" ||
        String(hub.longitude).trim() === ""
      ) {
        continue;
      }

      const lat = Number(hub.latitude);
      const lng = Number(hub.longitude);

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

      const serviceNames =
        hub.services
          ?.map((item) => item.services?.name)
          .filter((name): name is string => Boolean(name)) ?? [];

      const servicesHTML = serviceNames.length
        ? serviceNames.map((name) => `<li>${escapeHTML(name)}</li>`).join("")
        : "<li>Not specified</li>";

      const name = escapeHTML(hub.name || "Unnamed Treatment Hub");
      const address = escapeHTML(hub.address || "Not available");
      const municipality = escapeHTML(
        hub.municipalities?.name_2 || "Not available",
      );
      const province = escapeHTML(hub.provinces?.name_1 || "Not available");
      const region = escapeHTML(hub.regions?.name || "Not available");
      const status = escapeHTML(hub.status || "Unknown");
      const contact = escapeHTML(hub.contact_number || "Not available");
      const email = escapeHTML(hub.email || "Not available");
      const hours = escapeHTML(hub.operating_hours || "Not specified");
      const website = getSafeWebsiteUrl(hub.website);
      const isActive = status.toUpperCase() === "ACTIVE";

      const emailHTML = hub.email
        ? `<a href="mailto:${encodeURIComponent(hub.email)}">${email}</a>`
        : email;

      const websiteHTML = website
        ? `
          <div class="treatment-popup-row">
            <strong>Website:</strong>
            <a
              href="${website}"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit website
            </a>
          </div>
        `
        : "";

      const popupContent = `
        <div class="treatment-popup">
          <div class="treatment-popup-title">${name}</div>

          <div class="treatment-popup-row">
            <strong>Status:</strong>
            <span class="${
              isActive ? "treatment-status-active" : "treatment-status-inactive"
            }">
              ${status}
            </span>
          </div>

          <div class="treatment-popup-row">
            <strong>Address:</strong><br />
            ${address}
          </div>

          <div class="treatment-popup-row">
            <strong>Municipality:</strong> ${municipality}
          </div>

          <div class="treatment-popup-row">
            <strong>Province:</strong> ${province}
          </div>

          <div class="treatment-popup-row">
            <strong>Region:</strong> ${region}
          </div>

          <div class="treatment-popup-row">
            <strong>Services:</strong>
            <ul class="treatment-popup-services">
              ${servicesHTML}
            </ul>
          </div>

          <div class="treatment-popup-row">
            <strong>Contact:</strong> ${contact}
          </div>

          <div class="treatment-popup-row">
            <strong>Email:</strong> ${emailHTML}
          </div>

          <div class="treatment-popup-row">
            <strong>Operating hours:</strong> ${hours}
          </div>

          ${websiteHTML}

          <div class="treatment-popup-coordinates">
            Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </div>
        </div>
      `;

      const marker = L.marker([lat, lng], {
        icon: hubIcon,
        title: hub.name || "Treatment Hub",
        keyboard: true,
        riseOnHover: true,
      });

      marker.bindPopup(popupContent, {
        maxWidth: 340,
        minWidth: 250,
        autoPan: true,
      });

      marker.bindTooltip(name, {
        direction: "top",
        offset: [0, -36],
      });

      layerGroup.addLayer(marker);
    }

    layerGroup.addTo(map);

    return () => {
      layerGroup.clearLayers();
      map.removeLayer(layerGroup);
    };
  }, [map, hubs, visible]);

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
    const container = map.getContainer();

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

      const timestamp = properties.created_at
        ? new Date(properties.created_at)
        : null;

      const date =
        timestamp && !Number.isNaN(timestamp.getTime())
          ? escapeHTML(timestamp.toLocaleString())
          : "Unknown";

      const marker = L.circleMarker([lat, lng], {
        renderer: canvasRenderer,
        radius: 6,
        stroke: false,
        fillColor: "#000",
        fillOpacity: 0,
        interactive: true,
      });

      marker.bindPopup(
        `
          <div class="nlp-popup">
            <strong>NLP Surveillance</strong>

            <div>
              <b>Platform:</b> ${escapeHTML(platform)}
            </div>

            <div>
              <b>Keyword:</b> ${escapeHTML(keyword)}
            </div>

            <div>
              <b>Sentiment:</b>
              ${Number.isFinite(sentiment) ? sentiment.toFixed(2) : "N/A"}
            </div>

            <div>
              <b>Engagement:</b>
              ${
                Number.isFinite(engagement)
                  ? engagement.toLocaleString()
                  : "N/A"
              }
            </div>

            <div>
              <b>Risk Weight:</b>
              ${Number.isFinite(weight) ? weight : "N/A"}
            </div>

            <div>
              <b>Date:</b> ${date}
            </div>
          </div>
        `,
        {
          closeButton: false,
          closeOnClick: false,
          offset: L.point(0, -8),
        },
      );

      const openPopup = (event: L.LeafletMouseEvent) => {
        container.style.cursor = "pointer";
        marker.openPopup();
        marker.getPopup()?.setLatLng(event.latlng);
      };

      const movePopup = (event: L.LeafletMouseEvent) => {
        marker.getPopup()?.setLatLng(event.latlng);
      };

      const closePopup = () => {
        container.style.cursor = "";
        marker.closePopup();
      };

      marker.on("mouseover", openPopup);
      marker.on("mousemove", movePopup);
      marker.on("mouseout", closePopup);

      layerGroup.addLayer(marker);
    }

    return () => {
      layerGroup.clearLayers();
      map.removeLayer(layerGroup);
      container.style.cursor = "";
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

        const name = getFeatureName(feature.properties ?? {});

        if (!name) continue;

        layerGroup.addLayer(
          L.marker(latLng, {
            interactive: false,
            icon: L.divIcon({
              className: styles.municipality_label,
              html: `<span>${escapeHTML(name)}</span>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            }),
          }),
        );
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
    const code = feature.properties?.code;

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
  const entries = createPolygonEntries(polygons);

  for (const polygon of entries) {
    weights.set(polygon.code, 0);
  }

  if (!entries.length || !features.length) {
    return weights;
  }

  for (const feature of features) {
    const coordinates = feature.geometry?.coordinates;

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      continue;
    }

    const lng = Number(coordinates[0]);
    const lat = Number(coordinates[1]);
    const weight = Number(feature.properties?.weight ?? 0);

    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat) ||
      !Number.isFinite(weight)
    ) {
      continue;
    }

    const nlpPoint = point([lng, lat]);

    for (const polygon of entries) {
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
        // Ignore malformed polygon features.
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
    const code = feature.properties?.code;

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

  const [isHierarchyExpanded, setIsHierarchyExpanded] = useState(true);

  const [showTreatmentHubs, setShowTreatmentHubs] = useState(true);

  const [treatmentHubFilter, setTreatmentHubFilter] =
    useState<TreatmentHubFilter>("all");

  const [isHubControlsExpanded, setIsHubControlsExpanded] = useState(true);

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
    params: { limit: 1000 },
  });

  const regions = GeomData?.data?.regions;
  const provinces = GeomData?.data?.provinces;
  const municipalities = GeomData?.data?.municipalities;

  const treatmentHubs = useMemo<TreatmentHubInterface[]>(() => {
    const edges = TreatmentHubData?.data?.edges;

    if (!Array.isArray(edges)) return [];

    return edges
      .map((edge) => edge?.node)
      .filter((hub): hub is TreatmentHubInterface =>
        Boolean(hub?.treatment_hub_id && hub?.name),
      );
  }, [TreatmentHubData]);

  const validTreatmentHubs = useMemo(() => {
    return treatmentHubs.filter((hub) => {
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
  }, [treatmentHubs]);

  const filteredTreatmentHubs = useMemo(() => {
    if (treatmentHubFilter === "active") {
      return validTreatmentHubs.filter(
        (hub) => String(hub.status ?? "").toUpperCase() === "ACTIVE",
      );
    }

    return validTreatmentHubs;
  }, [validTreatmentHubs, treatmentHubFilter]);

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
    return Array.isArray(provinces?.features) ? provinces.features : [];
  }, [provinces]);

  const filteredMunicipalities = useMemo<GeoJSONFeature[]>(() => {
    if (!Array.isArray(municipalities?.features)) return [];

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
    if (!Array.isArray(regions?.features)) return null;

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
    if (!coloredMunicipalities.length) return null;

    return {
      type: "FeatureCollection",
      features: coloredMunicipalities,
    };
  }, [coloredMunicipalities]);

  const selectedProvinceGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!selectedProvince) return null;

    const features = coloredProvinces.filter(
      (feature) =>
        String(feature.properties?.code) === String(selectedProvince),
    );

    return features.length ? { type: "FeatureCollection", features } : null;
  }, [coloredProvinces, selectedProvince]);

  const selectedMunicipalityGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!selectedMunicipality) return null;

    const features = coloredMunicipalities.filter(
      (feature) =>
        String(feature.properties?.code) === String(selectedMunicipality),
    );

    return features.length ? { type: "FeatureCollection", features } : null;
  }, [coloredMunicipalities, selectedMunicipality]);

  const zoomToBounds = useCallback(
    (
      inputBounds: any,
      code?: string,
      type: "region" | "province" | "municipality" = "province",
    ) => {
      const map = mapRef.current;

      if (!map || !inputBounds) return;

      const bounds = getBoundsFromGeoJSON(inputBounds);

      if (!bounds?.isValid()) return;

      if (type === "region") {
        setSelectedProvince(null);
        setSelectedMunicipality(null);
      }

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
      `<strong>${escapeHTML(name)}</strong><br />NLP Risk Weight: ${
        Number.isFinite(weight) ? weight.toFixed(2) : "0.00"
      }`,
      { sticky: true, direction: "top" },
    );

    layer.on({
      mouseover: (event) => {
        const target = event.target as L.Path;

        target.setStyle({
          weight: 3,
          color: "#35408e",
          fillOpacity: 0.1,
        });

        target.bringToFront();
      },

      mouseout: (event) => {
        (event.target as L.Path).setStyle(getProvinceStyle(feature));
      },

      click: (event) => {
        const target = event.target as L.Polygon;
        const code = feature?.properties?.code;

        if (code != null) {
          setSelectedProvince(String(code));
          setSelectedMunicipality(null);
        }

        const bounds = target.getBounds();

        if (bounds.isValid()) {
          mapRef.current?.fitBounds(bounds, {
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
        `<strong>${escapeHTML(name)}</strong><br />NLP Risk Weight: ${
          Number.isFinite(weight) ? weight.toFixed(2) : "0.00"
        }`,
        { sticky: true, direction: "top" },
      );

      layer.on({
        mouseover: (event) => {
          const target = event.target as L.Path;

          target.setStyle({
            weight: 2,
            color: "#35408e",
            fillOpacity: 0.1,
          });

          target.bringToFront();
        },

        mouseout: (event) => {
          (event.target as L.Path).setStyle(getMunicipalityStyle(feature));
        },

        click: (event) => {
          const target = event.target as L.Polygon;
          const code = feature?.properties?.code;

          if (code != null) {
            setSelectedMunicipality(String(code));
          }

          const bounds = target.getBounds();

          if (bounds.isValid()) {
            mapRef.current?.fitBounds(bounds, {
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
      <aside
        className={`${styles.col1} ${
          isHierarchyExpanded ? styles.col1_expanded : ""
        }`}
      >
        <div className={styles.header_column}>
          <Title size="sm">Administrative Region</Title>

          <button
            type="button"
            onClick={() => setIsHierarchyExpanded((previous) => !previous)}
            aria-label={
              isHierarchyExpanded
                ? "Collapse administrative hierarchy"
                : "Expand administrative hierarchy"
            }
            aria-expanded={isHierarchyExpanded}
          >
            {isHierarchyExpanded ? <TbMinus size={22} /> : <TbPlus size={22} />}
          </button>
        </div>

        {isHierarchyExpanded && (
          <div className={styles.regions}>
            {RegionLoading ? (
              <p className={styles.loading_text}>Loading regions...</p>
            ) : Array.isArray(RegionData?.data?.data) ? (
              RegionData.data.data.map((region: Region) => (
                <div key={region.region_code}>
                  <button
                    type="button"
                    className={styles.region_item}
                    onClick={() =>
                      zoomToBounds(region.bounds, undefined, "region")
                    }
                  >
                    {region.region_name}
                  </button>

                  {region.provinces?.map((province) => (
                    <button
                      type="button"
                      key={province.code}
                      className={`${styles.province_item} ${
                        selectedProvince === province.code
                          ? styles.province_item_selected
                          : ""
                      }`}
                      onClick={() =>
                        zoomToBounds(province.bounds, province.code, "province")
                      }
                    >
                      {province.name}
                    </button>
                  ))}
                </div>
              ))
            ) : (
              <p className={styles.loading_text}>
                No administrative data available.
              </p>
            )}
          </div>
        )}
      </aside>
      <aside className={styles.treatment_hub_column}>
        <div className={styles.map_controls}>
          <div className={styles.map_controls_header}>
            <div>
              <strong>Treatment Hubs</strong>

              <div className={styles.map_controls_subtitle}>
                {showTreatmentHubs
                  ? `${filteredTreatmentHubs.length} of ${validTreatmentHubs.length} mapped`
                  : "Markers hidden"}
              </div>
            </div>

            <button
              type="button"
              className={styles.map_controls_collapse}
              onClick={() => setIsHubControlsExpanded((previous) => !previous)}
              aria-label={
                isHubControlsExpanded
                  ? "Collapse treatment hub controls"
                  : "Expand treatment hub controls"
              }
              aria-expanded={isHubControlsExpanded}
            >
              {isHubControlsExpanded ? (
                <TbMinus size={20} />
              ) : (
                <TbPlus size={20} />
              )}
            </button>
          </div>

          {isHubControlsExpanded && (
            <div className={styles.map_controls_body}>
              <label className={styles.map_toggle}>
                <input
                  type="checkbox"
                  checked={showTreatmentHubs}
                  onChange={(event) =>
                    setShowTreatmentHubs(event.target.checked)
                  }
                />

                <span>Show treatment hubs</span>
              </label>

              {/* <select
                id="treatment-hub-filter"
                className={styles.map_filter_select}
                value={treatmentHubFilter}
                onChange={(event) =>
                  setTreatmentHubFilter(
                    event.target.value as TreatmentHubFilter,
                  )
                }
                disabled={!showTreatmentHubs}
              >
                <option value="all">All hubs</option>
                <option value="active">Active hubs only</option>
              </select> */}

              <div className={styles.map_controls_footer}>
                <span
                  className={`${styles.hub_status_dot} ${
                    showTreatmentHubs ? styles.hub_status_enabled : ""
                  }`}
                />

                <span>
                  {!showTreatmentHubs
                    ? "Treatment Hub layer is off"
                    : treatmentHubFilter === "active"
                      ? "Showing active locations"
                      : "Showing all locations"}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      <div className={styles.col2}>
        <MapContainer
          center={[12.8797, 121.774]}
          zoom={6}
          minZoom={5}
          maxZoom={18}
          scrollWheelZoom
          zoomControl
          preferCanvas
          maxBoundsViscosity={1}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <MyLocationControl />
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

          <MunicipalityLabels features={municipalityLabelFeatures} />

          <HeatmapLayer features={nlpFeatures} />

          <NLPPointsLayer features={nlpFeatures} />

          <TreatmentHubsLayer
            hubs={filteredTreatmentHubs}
            visible={showTreatmentHubs}
          />

          {selectedProvinceGeoJSON && (
            <GeoJSON
              data={selectedProvinceGeoJSON as any}
              style={{
                renderer: canvasRenderer,
                color: "#35408e",
                weight: 3,
                opacity: 1,
                fillColor: "#35408e",
                fillOpacity: 0.07,
                interactive: false,
              }}
            />
          )}

          {selectedMunicipalityGeoJSON && (
            <GeoJSON
              data={selectedMunicipalityGeoJSON as any}
              style={{
                renderer: canvasRenderer,
                color: "#35408e",
                weight: 3,
                opacity: 1,
                fillColor: "#35408e",
                fillOpacity: 0.07,
                interactive: false,
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className={styles.legends}>
        {legends.map((legend) => (
          <div className={styles.legends_card} key={legend.label}>
            <span className={`${styles.indicator} ${styles[legend.color]}`} />

            <Text style={{ color: "#35408e" }} size="sm">
              {legend.label}
            </Text>
          </div>
        ))}
      </div>

      <div className={styles.treatment_hub_count}>
        <span className={styles.treatment_hub_count_icon}>✚</span>

        <span>
          Treatment Hubs: {showTreatmentHubs ? filteredTreatmentHubs.length : 0}{" "}
          visible / {validTreatmentHubs.length} mapped / {treatmentHubs.length}{" "}
          fetched
        </span>
      </div>
    </div>
  );
}
