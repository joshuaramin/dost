/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import styles from "@/styles/lib/ui/home/surveillance.module.scss"
import useFormQuery from "@/lib/hooks/useQuery"
import Title from "../title"
import Text from "@/components/Typography/Text/text"

type Province = {
    code: string
    name: string
    bounds: any
}

type Region = {
    region_code: string
    region_name: string
    bounds: any
    provinces: Province[]
}

const legends = [
    { label: "Low", color: "success" },
    { label: "Medium", color: "warning" },
    { label: "High", color: "danger" },
]

export default function SurveillanceMap() {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<maplibregl.Map | null>(null)

    const [selectedProvince, setSelectedProvince] = useState<string | null>(
        null
    )

    const { data: GeomData } = useFormQuery<any>({
        key: ["GetAllGeom"],
        url: "maintenance/geospatial/geom",
    })

    const {
        data: RegionData,
        isLoading: RegionLoading,
    } = useFormQuery<any>({
        key: ["GetAllRegions"],
        url: "maintenance/geospatial/hierarchy",
    })

    const safeSetFilter = (
        map: maplibregl.Map,
        layer: string,
        filter: any
    ) => {
        if (!map.getLayer(layer)) return

        map.setFilter(layer, filter)
    }

    const getGeometryCoordinates = (geometry: any): number[][] => {
        if (!geometry?.coordinates) return []

        if (geometry.type === "Polygon") {
            return geometry.coordinates
                .flat(1)
                .filter(
                    (coordinate: any) =>
                        Array.isArray(coordinate) &&
                        coordinate.length >= 2 &&
                        Number.isFinite(Number(coordinate[0])) &&
                        Number.isFinite(Number(coordinate[1]))
                )
        }

        if (geometry.type === "MultiPolygon") {
            return geometry.coordinates
                .flat(2)
                .filter(
                    (coordinate: any) =>
                        Array.isArray(coordinate) &&
                        coordinate.length >= 2 &&
                        Number.isFinite(Number(coordinate[0])) &&
                        Number.isFinite(Number(coordinate[1]))
                )
        }

        return []
    }

    const getBoundsFromGeometry = (geometry: any) => {
        if (!geometry) return null

        const coordinates = getGeometryCoordinates(geometry)

        if (!coordinates.length) return null

        const lngs = coordinates.map((coordinate) =>
            Number(coordinate[0])
        )

        const lats = coordinates.map((coordinate) =>
            Number(coordinate[1])
        )

        return [
            [Math.min(...lngs), Math.min(...lats)],
            [Math.max(...lngs), Math.max(...lats)],
        ] as maplibregl.LngLatBoundsLike
    }

    const getCenterFromGeometry = (geometry: any) => {
        if (!geometry) return null

        const coordinates = getGeometryCoordinates(geometry)

        if (!coordinates.length) return null

        const lngs = coordinates.map((coordinate) =>
            Number(coordinate[0])
        )

        const lats = coordinates.map((coordinate) =>
            Number(coordinate[1])
        )

        return [
            (Math.min(...lngs) + Math.max(...lngs)) / 2,
            (Math.min(...lats) + Math.max(...lats)) / 2,
        ]
    }

    const zoomToBounds = (bounds: any, code?: string) => {
        const map = mapInstance.current

        if (!map || !bounds) return

        const geometry =
            bounds.type === "Feature"
                ? bounds.geometry
                : bounds.type === "FeatureCollection"
                  ? null
                  : bounds

        const mapBounds = getBoundsFromGeometry(geometry)

        if (!mapBounds) return

        map.fitBounds(mapBounds, {
            padding: 40,
            duration: 1000,
            maxZoom: 10,
        })

        if (code) {
            safeSetFilter(
                map,
                "province-highlight",
                ["==", ["get", "code"], code]
            )

            setSelectedProvince(code)
        }
    }

    useEffect(() => {
        if (!mapRef.current) return
        if (mapInstance.current) return
        if (typeof window === "undefined") return
        if (!GeomData?.data) return

        const regions = GeomData.data.regions
        const provinces = GeomData.data.provinces
        const municipalities = GeomData.data.municipalities

        console.log("Regions:", regions)
        console.log("Provinces:", provinces)
        console.log("Municipalities:", municipalities)

        if (
            !regions?.features ||
            !provinces?.features ||
            !municipalities?.features
        ) {
            return
        }

        const municipalityLabelFeatures = municipalities.features
            .map((feature: any) => {
                const center = getCenterFromGeometry(feature.geometry)

                if (!center) return null

                const properties = feature.properties ?? {}

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
                }
            })
            .filter(
                (feature: any) =>
                    feature &&
                    feature.properties.name
            )

        console.log(
            "Municipality label features:",
            municipalityLabelFeatures
        )

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: `https://maps.geo.${process.env.NEXT_PUBLIC_AWS_MAP_REGION}.amazonaws.com/v2/styles/Standard/descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API}`,
            center: [121.774, 12.9],
            zoom: 4.9,
            minZoom: 4,
            maxZoom: 14,
            scrollZoom: false,
        })

        mapInstance.current = map

        const addLayerSafe = (
            mapInstance: maplibregl.Map,
            layer: any
        ) => {
            if (mapInstance.getLayer(layer.id)) return

            mapInstance.addLayer(layer)
        }

        map.on("load", () => {
            map.addSource("regions", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: regions.features,
                },
            })

            map.addSource("provinces", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: provinces.features,
                },
            })

            map.addSource("municipalities", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: municipalities.features,
                },
            })

            map.addSource("municipality-labels", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: municipalityLabelFeatures,
                },
            })

            addLayerSafe(map, {
                id: "regions-fill",
                type: "fill",
                source: "regions",
                paint: {
                    "fill-color": "#3b82f6",
                    "fill-opacity": 0.01,
                },
            })

            addLayerSafe(map, {
                id: "provinces-fill",
                type: "fill",
                source: "provinces",
                paint: {
                    "fill-color": "#e5e7eb",
                    "fill-opacity": 0.15,
                },
            })

            addLayerSafe(map, {
                id: "municipalities-glow",
                type: "line",
                source: "municipalities",
                minzoom: 4.5,
                paint: {
                    "line-color": "#64748b",
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        4.5,
                        0.8,
                        5,
                        1,
                        7,
                        1.5,
                        10,
                        2,
                        12,
                        3,
                    ],
                    "line-opacity": 0.25,
                },
            })

            addLayerSafe(map, {
                id: "municipalities-base",
                type: "line",
                source: "municipalities",
                minzoom: 4.5,
                paint: {
                    "line-color": "#475569",
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
                        1.3,
                        12,
                        2,
                    ],
                    "line-opacity": 0.8,
                },
            })

            addLayerSafe(map, {
                id: "municipalities-fill",
                type: "fill",
                source: "municipalities",
                minzoom: 4.5,
                paint: {
                    "fill-color": "#000000",
                    "fill-opacity": 0,
                },
            })

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
            })

            addLayerSafe(map, {
                id: "provinces-line",
                type: "line",
                source: "provinces",
                paint: {
                    "line-color": "#334155",
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        4,
                        0.8,
                        7,
                        1.2,
                        10,
                        1.8,
                    ],
                    "line-opacity": 0.95,
                },
            })

            addLayerSafe(map, {
                id: "province-highlight",
                type: "fill",
                source: "provinces",
                paint: {
                    "fill-color": "#35408E",
                    "fill-opacity": 0.1,
                },
                filter: ["==", ["get", "code"], ""],
            })

            addLayerSafe(map, {
                id: "municipality-highlight",
                type: "line",
                source: "municipalities",
                paint: {
                    "line-color": "#f59e0b",
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
            })

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
                        5,
                        7,
                        6,
                        8,
                        7,
                        9,
                        8,
                        10,
                        10,
                        10,
                        12,
                        11,
                        14,
                        12,
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
            })

            map.on("click", "provinces-fill", (e) => {
                const feature = e.features?.[0]

                if (!feature) return

                const code = feature.properties?.code

                if (!code) return

                setSelectedProvince(code)

                safeSetFilter(
                    map,
                    "province-highlight",
                    ["==", ["get", "code"], code]
                )

                const mapBounds = getBoundsFromGeometry(
                    feature.geometry
                )

                if (!mapBounds) return

                map.fitBounds(mapBounds, {
                    padding: 40,
                    duration: 800,
                    maxZoom: 10,
                })
            })

            map.on("click", "municipalities-fill", (e) => {
                const feature = e.features?.[0]

                if (!feature) return

                const code = feature.properties?.code

                if (!code) return

                safeSetFilter(
                    map,
                    "municipality-highlight",
                    ["==", ["get", "code"], code]
                )

                const mapBounds = getBoundsFromGeometry(
                    feature.geometry
                )

                if (!mapBounds) return

                map.fitBounds(mapBounds, {
                    padding: 30,
                    duration: 600,
                    maxZoom: 12,
                })
            })

            map.on("mouseenter", "provinces-fill", () => {
                map.getCanvas().style.cursor = "pointer"
            })

            map.on("mouseleave", "provinces-fill", () => {
                map.getCanvas().style.cursor = ""
            })

            map.on("mouseenter", "municipalities-fill", () => {
                map.getCanvas().style.cursor = "pointer"
            })

            map.on("mouseleave", "municipalities-fill", () => {
                map.getCanvas().style.cursor = ""
            })

            map.addControl(new maplibregl.NavigationControl())
        })

        return () => {
            map.remove()
            mapInstance.current = null
        }
    }, [GeomData?.data])

    return (
        <div className={styles.container}>
            <div className={styles.col1}>
                <Title title="Administrative Hierarchy" />

                <div className={styles.regions}>
                    {RegionLoading
                        ? null
                        : RegionData?.data?.data?.map(
                              (region: Region) => (
                                  <div key={region.region_code}>
                                      <div
                                          style={{
                                              fontWeight: "700",
                                              padding: 8,
                                              cursor: "pointer",
                                              backgroundColor: "#35408E",
                                              color: "white",
                                          }}
                                          onClick={() =>
                                              zoomToBounds(
                                                  region.bounds
                                              )
                                          }
                                      >
                                          {region.region_name}
                                      </div>

                                      {region.provinces?.map(
                                          (province: Province) => (
                                              <div
                                                  key={province.code}
                                                  style={{
                                                      padding: 10,
                                                      paddingLeft: 25,
                                                      cursor: "pointer",
                                                      borderRadius: 5,
                                                      color:
                                                          selectedProvince ===
                                                          province.code
                                                              ? "black"
                                                              : "#35408E",
                                                      background:
                                                          selectedProvince ===
                                                          province.code
                                                              ? "rgb(192, 192, 199)"
                                                              : "transparent",
                                                      opacity: 0.9,
                                                  }}
                                                  onClick={() =>
                                                      zoomToBounds(
                                                          province.bounds,
                                                          province.code
                                                      )
                                                  }
                                              >
                                                  {province.name}
                                              </div>
                                          )
                                      )}
                                  </div>
                              )
                          )}
                </div>
            </div>

            <div
                ref={mapRef}
                className={styles.col2}
            />

            <div className={styles.legends}>
                {legends.map((legend) => (
                    <div
                        className={styles.legends_card}
                        key={legend.label}
                    >
                        <div
                            className={`${styles.indicator} ${styles[legend.color]}`}
                        />

                        <Text
                            style={{ color: "#35408E" }}
                            size="sm"
                        >
                            {legend.label}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    )
}