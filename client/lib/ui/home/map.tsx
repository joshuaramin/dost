/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/lib/ui/home/surveillance.module.scss";
import useFormQuery from "@/lib/hooks/useQuery";
import Title from "../title";
import Text from "@/components/Typography/Text/text";
import headers from "@/lib/utils/headers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

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

const legends = [
  { label: "Low", color: "success" },
  { label: "Medium", color: "warning" },
  { label: "High", color: "danger" },
];

export default function SurveillanceMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const nlpPopupRef = useRef<maplibregl.Popup | null>(null);

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

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

  const getNLPFeatures = (): HeatmapFeature[] => {
    const features = NLPData?.data?.features;

    if (!Array.isArray(features)) {
      return [];
    }

    return features.filter(
      (feature: any) =>
        feature?.geometry?.type === "Point" &&
        Array.isArray(feature.geometry.coordinates) &&
        feature.geometry.coordinates.length === 2 &&
        Number.isFinite(Number(feature.geometry.coordinates[0])) &&
        Number.isFinite(Number(feature.geometry.coordinates[1])),
    );
  };

  const getGeometryCoordinates = (geometry: any): number[][] => {
    if (!geometry?.coordinates) return [];

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
  };

  const getBoundsFromGeometry = (geometry: any) => {
    if (!geometry) return null;

    const coordinates = getGeometryCoordinates(geometry);

    if (!coordinates.length) return null;

    const lngs = coordinates.map((coordinate) => Number(coordinate[0]));
    const lats = coordinates.map((coordinate) => Number(coordinate[1]));

    return [
      [Math.min(...lngs), Math.min(...lats)],
      [Math.max(...lngs), Math.max(...lats)],
    ] as maplibregl.LngLatBoundsLike;
  };

  const getCenterFromGeometry = (geometry: any) => {
    if (!geometry) return null;

    const coordinates = getGeometryCoordinates(geometry);

    if (!coordinates.length) return null;

    const lngs = coordinates.map((coordinate) => Number(coordinate[0]));
    const lats = coordinates.map((coordinate) => Number(coordinate[1]));

    return [
      (Math.min(...lngs) + Math.max(...lngs)) / 2,
      (Math.min(...lats) + Math.max(...lats)) / 2,
    ];
  };

  const aggregateNLPWeights = (polygons: any[], features: HeatmapFeature[]) => {
    const weights = new Map<string, number>();

    polygons.forEach((polygonFeature: any) => {
      const code = polygonFeature?.properties?.code;

      if (code) {
        weights.set(String(code), 0);
      }
    });

    features.forEach((nlpFeature) => {
      const coordinates = nlpFeature.geometry.coordinates;

      if (
        !Array.isArray(coordinates) ||
        coordinates.length !== 2 ||
        !Number.isFinite(Number(coordinates[0])) ||
        !Number.isFinite(Number(coordinates[1]))
      ) {
        return;
      }

      const nlpPoint = point([Number(coordinates[0]), Number(coordinates[1])]);

      const weight = Number(nlpFeature.properties?.weight ?? 0);

      if (!Number.isFinite(weight)) {
        return;
      }

      polygons.forEach((polygonFeature: any) => {
        const code = polygonFeature?.properties?.code;

        if (!code) {
          return;
        }

        try {
          if (booleanPointInPolygon(nlpPoint, polygonFeature as any)) {
            const currentWeight = weights.get(String(code)) ?? 0;

            weights.set(String(code), currentWeight + weight);
          }
        } catch {
          return;
        }
      });
    });

    return weights;
  };

  const addNLPWeightsToPolygons = (
    polygons: any[],
    features: HeatmapFeature[],
  ) => {
    const weights = aggregateNLPWeights(polygons, features);

    return polygons.map((feature: any) => {
      const code = feature?.properties?.code;

      return {
        ...feature,
        properties: {
          ...feature.properties,
          nlp_weight: code ? Number(weights.get(String(code)) ?? 0) : 0,
        },
      };
    });
  };

  const safeSetFilter = (map: maplibregl.Map, layer: string, filter: any) => {
    if (!map.getLayer(layer)) return;

    map.setFilter(layer, filter);
  };

  const zoomToBounds = (bounds: any, code?: string) => {
    const map = mapInstance.current;

    if (!map || !bounds) return;

    const geometry =
      bounds.type === "Feature"
        ? bounds.geometry
        : bounds.type === "FeatureCollection"
          ? null
          : bounds;

    const mapBounds = getBoundsFromGeometry(geometry);

    if (!mapBounds) return;

    map.fitBounds(mapBounds, {
      padding: 40,
      duration: 1000,
      maxZoom: 10,
    });

    if (code) {
      safeSetFilter(map, "province-highlight", ["==", ["get", "code"], code]);

      setSelectedProvince(code);
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return;
    if (typeof window === "undefined") return;
    if (!GeomData?.data) return;

    const regions = GeomData.data.regions;
    const provinces = GeomData.data.provinces;
    const municipalities = GeomData.data.municipalities;

    if (
      !regions?.features ||
      !provinces?.features ||
      !municipalities?.features
    ) {
      return;
    }

    const initialNLPFeatures = getNLPFeatures();

    const coloredProvinces = addNLPWeightsToPolygons(
      provinces.features,
      initialNLPFeatures,
    );

    const coloredMunicipalities = addNLPWeightsToPolygons(
      municipalities.features,
      initialNLPFeatures,
    );

    const municipalityLabelFeatures = municipalities.features
      .map((feature: any) => {
        const center = getCenterFromGeometry(feature.geometry);

        if (!center) return null;

        const properties = feature.properties ?? {};

        return {
          type: "Feature",
          properties: {
            code: properties.code,
            name:
              properties.name ??
              properties.municipality_name ??
              properties.mun_name ??
              properties.NAME_3 ??
              properties.NAME ??
              "",
          },
          geometry: {
            type: "Point",
            coordinates: center,
          },
        };
      })
      .filter((feature: any) => feature && feature.properties.name);

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: `https://maps.geo.${process.env.NEXT_PUBLIC_AWS_MAP_REGION}.amazonaws.com/v2/styles/Standard/descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API}`,
      center: [121.774, 12.9],
      zoom: 5,
      minZoom: 4,
      scrollZoom: true,
    });

    mapInstance.current = map;

    const addLayerSafe = (mapInstance: maplibregl.Map, layer: any) => {
      if (mapInstance.getLayer(layer.id)) {
        return;
      }

      mapInstance.addLayer(layer);
    };

    map.on("load", () => {
      map.addSource("regions", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: regions.features,
        },
      });

      map.addSource("provinces", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: coloredProvinces,
        },
      });

      map.addSource("municipalities", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: coloredMunicipalities,
        },
      });

      map.addSource("municipality-labels", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: municipalityLabelFeatures,
        },
      });

      map.addSource("nlp-heatmap", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: initialNLPFeatures,
        },
      });

      addLayerSafe(map, {
        id: "regions-fill",
        type: "fill",
        source: "regions",
        paint: {
          "fill-color": "#3b82f6",
          "fill-opacity": 0.01,
        },
      });

      addLayerSafe(map, {
        id: "provinces-fill",
        type: "fill",
        source: "provinces",
        paint: {
          "fill-color": "#e5e7eb",
          "fill-opacity": 0.01,
        },
      });

      addLayerSafe(map, {
        id: "municipalities-fill",
        type: "fill",
        source: "municipalities",
        minzoom: 4.5,
        paint: {
          "fill-color": "#000000",
          "fill-opacity": 0,
        },
      });

      addLayerSafe(map, {
        id: "region-line",
        type: "line",
        source: "regions",
        paint: {
          "line-color": "#1e293b",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            0.7,
            7,
            1,
            10,
            1.5,
          ],
          "line-opacity": 0.9,
        },
      });

      addLayerSafe(map, {
        id: "provinces-line",
        type: "line",
        source: "provinces",
        paint: {
          "line-color": [
            "case",
            [">", ["coalesce", ["get", "nlp_weight"], 0], 0],
            [
              "interpolate",
              ["linear"],
              ["get", "nlp_weight"],
              0,
              "#22c55e",
              25,
              "#22c55e",
              50,
              "#facc15",
              75,
              "#f97316",
              100,
              "#ef4444",
            ],
            "#94a3b8",
          ],
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            1,
            7,
            1.5,
            10,
            2.5,
            12,
            3,
          ],
          "line-opacity": 1,
        },
      });

      addLayerSafe(map, {
        id: "municipalities-line",
        type: "line",
        source: "municipalities",
        minzoom: 4.5,
        paint: {
          "line-color": [
            "case",
            [">", ["coalesce", ["get", "nlp_weight"], 0], 0],
            [
              "interpolate",
              ["linear"],
              ["get", "nlp_weight"],
              0,
              "#22c55e",
              25,
              "#22c55e",
              50,
              "#facc15",
              75,
              "#f97316",
              100,
              "#ef4444",
            ],
            "#cbd5e1",
          ],
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0.6,
            5,
            0.8,
            7,
            1,
            10,
            1.4,
            12,
            2,
            14,
            2.5,
          ],
          "line-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            0.55,
            6,
            0.7,
            8,
            0.85,
            10,
            1,
          ],
        },
      });

      addLayerSafe(map, {
        id: "province-highlight",
        type: "line",
        source: "provinces",
        paint: {
          "line-color": "#35408E",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            2,
            6,
            2.5,
            8,
            3,
            10,
            4,
            12,
            5,
          ],
          "line-opacity": 1,
        },
        filter: ["==", ["get", "code"], ""],
      });

      addLayerSafe(map, {
        id: "municipality-highlight",
        type: "line",
        source: "municipalities",
        paint: {
          "line-color": "#35408E",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            5,
            2,
            8,
            3,
            12,
            4,
          ],
          "line-opacity": 1,
        },
        filter: ["==", ["get", "code"], ""],
      });

      addLayerSafe(map, {
        id: "nlp-heatmap",
        type: "heatmap",
        source: "nlp-heatmap",
        maxzoom: 14,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["coalesce", ["to-number", ["get", "weight"]], 0],
            0,
            0,
            10,
            0.15,
            25,
            0.3,
            50,
            0.55,
            75,
            0.8,
            100,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            1.5,
            5,
            2,
            6,
            2.5,
            8,
            3,
            10,
            4,
            12,
            5,
          ],
          "heatmap-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            20,
            5,
            25,
            6,
            32,
            8,
            42,
            10,
            55,
            12,
            65,
          ],
          "heatmap-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            0.95,
            8,
            0.9,
            12,
            0.8,
            13,
            0.7,
            14,
            0,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0,0,0,0)",
            0.1,
            "rgba(59,130,246,0.35)",
            0.25,
            "rgba(34,197,94,0.5)",
            0.45,
            "rgba(250,204,21,0.7)",
            0.65,
            "rgba(249,115,22,0.85)",
            0.8,
            "rgba(239,68,68,0.95)",
            1,
            "rgba(127,29,29,1)",
          ],
        },
      });

      addLayerSafe(map, {
        id: "nlp-hover-points",
        type: "circle",
        source: "nlp-heatmap",
        maxzoom: 14,
        paint: {
          "circle-radius": 12,
          "circle-color": "#000000",
          "circle-opacity": 0,
          "circle-stroke-opacity": 0,
        },
      });

      addLayerSafe(map, {
        id: "municipality-labels",
        type: "symbol",
        source: "municipality-labels",
        minzoom: 4.5,
        layout: {
          "text-field": ["get", "name"],
          "text-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4.5,
            6,
            6,
            7,
            8,
            8,
            10,
            9,
            12,
            10,
            14,
            11,
          ],
          "text-anchor": "center",
          "text-allow-overlap": false,
          "text-ignore-placement": false,
          "text-padding": 2,
          "symbol-placement": "point",
        },
        paint: {
          "text-color": "#1e293b",
          "text-halo-color": "#ffffff",
          "text-halo-width": 2,
          "text-halo-blur": 0.4,
        },
      });

      map.on("click", "provinces-fill", (e) => {
        const feature = e.features?.[0];

        if (!feature) return;

        const code = feature.properties?.code;

        if (!code) return;

        setSelectedProvince(String(code));

        safeSetFilter(map, "province-highlight", [
          "==",
          ["get", "code"],
          String(code),
        ]);

        const mapBounds = getBoundsFromGeometry(feature.geometry);

        if (!mapBounds) return;

        map.fitBounds(mapBounds, {
          padding: 40,
          duration: 800,
          maxZoom: 10,
        });
      });

      map.on("click", "municipalities-fill", (e) => {
        const feature = e.features?.[0];

        if (!feature) return;

        const code = feature.properties?.code;

        if (!code) return;

        safeSetFilter(map, "municipality-highlight", [
          "==",
          ["get", "code"],
          String(code),
        ]);

        const mapBounds = getBoundsFromGeometry(feature.geometry);

        if (!mapBounds) return;

        map.fitBounds(mapBounds, {
          padding: 30,
          duration: 600,
          maxZoom: 12,
        });
      });

      map.on("mouseenter", "provinces-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "provinces-fill", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "municipalities-fill", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "municipalities-fill", () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", "nlp-hover-points", (e) => {
        map.getCanvas().style.cursor = "pointer";

        const feature = e.features?.[0];

        if (!feature) return;

        const properties = feature.properties ?? {};

        const platform = properties.platform ?? "Unknown";
        const keyword = properties.keyword ?? "Unknown";
        const sentiment = Number(properties.sentiment ?? 0);
        const engagement = Number(properties.engagement ?? 0);
        const weight = Number(properties.weight ?? 0);

        const createdAt = properties.created_at
          ? new Date(String(properties.created_at)).toLocaleString()
          : "Unknown";

        if (nlpPopupRef.current) {
          nlpPopupRef.current.remove();
        }

        nlpPopupRef.current = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 12,
        })
          .setLngLat(e.lngLat)
          .setHTML(
            `
              <div style="min-width:240px;">
                <div style="font-weight:700;font-size:14px;margin-bottom:10px;">
                  NLP Surveillance
                </div>

                <div style="margin-bottom:5px;">
                  <strong>Platform:</strong> ${platform}
                </div>

                <div style="margin-bottom:5px;">
                  <strong>Keyword:</strong> ${keyword}
                </div>

                <div style="margin-bottom:5px;">
                  <strong>Sentiment:</strong> ${sentiment.toFixed(2)}
                </div>

                <div style="margin-bottom:5px;">
                  <strong>Engagement:</strong> ${engagement.toLocaleString()}
                </div>

                <div style="margin-bottom:5px;">
                  <strong>Risk Weight:</strong> ${weight}
                </div>

                <div>
                  <strong>Date:</strong> ${createdAt}
                </div>
              </div>
            `,
          )
          .addTo(map);
      });

      map.on("mousemove", "nlp-hover-points", (e) => {
        if (!nlpPopupRef.current) return;

        nlpPopupRef.current.setLngLat(e.lngLat);
      });

      map.on("mouseleave", "nlp-hover-points", () => {
        map.getCanvas().style.cursor = "";

        if (nlpPopupRef.current) {
          nlpPopupRef.current.remove();
          nlpPopupRef.current = null;
        }
      });

      map.addControl(new maplibregl.NavigationControl());
    });

    return () => {
      if (nlpPopupRef.current) {
        nlpPopupRef.current.remove();
        nlpPopupRef.current = null;
      }

      map.remove();
      mapInstance.current = null;
    };
  }, [GeomData?.data]);

  useEffect(() => {
    const map = mapInstance.current;

    if (!map) return;
    if (!GeomData?.data) return;

    const provinces = GeomData.data.provinces;
    const municipalities = GeomData.data.municipalities;

    if (!provinces?.features || !municipalities?.features) {
      return;
    }

    const updateNLPData = () => {
      const nlpSource = map.getSource("nlp-heatmap") as
        | maplibregl.GeoJSONSource
        | undefined;

      const provinceSource = map.getSource("provinces") as
        | maplibregl.GeoJSONSource
        | undefined;

      const municipalitySource = map.getSource("municipalities") as
        | maplibregl.GeoJSONSource
        | undefined;

      const nlpFeatures = getNLPFeatures();

      if (nlpSource) {
        nlpSource.setData({
          type: "FeatureCollection",
          features: nlpFeatures,
        });
      }

      if (provinceSource && municipalitySource) {
        const coloredProvinces = addNLPWeightsToPolygons(
          provinces.features,
          nlpFeatures,
        );

        const coloredMunicipalities = addNLPWeightsToPolygons(
          municipalities.features,
          nlpFeatures,
        );

        provinceSource.setData({
          type: "FeatureCollection",
          features: coloredProvinces,
        });

        municipalitySource.setData({
          type: "FeatureCollection",
          features: coloredMunicipalities,
        });
      }
    };

    if (map.isStyleLoaded()) {
      updateNLPData();
    } else {
      map.once("load", updateNLPData);
    }
  }, [NLPData, GeomData?.data]);

  return (
    <div className={styles.container}>
      <div className={styles.col1}>
        <Title title="Administrative Hierarchy" />

        <div className={styles.regions}>
          {RegionLoading
            ? null
            : RegionData?.data?.data?.map((region: Region) => (
                <div key={region.region_code}>
                  <div
                    style={{
                      fontWeight: "700",
                      padding: 8,
                      cursor: "pointer",
                      backgroundColor: "#35408E",
                      color: "white",
                    }}
                    onClick={() => zoomToBounds(region.bounds)}
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
                        zoomToBounds(province.bounds, province.code)
                      }
                    >
                      {province.name}
                    </div>
                  ))}
                </div>
              ))}
        </div>
      </div>

      <div ref={mapRef} className={styles.col2} />

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
