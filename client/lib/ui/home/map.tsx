/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useEffect, useRef, useState } from "react"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import styles from "@/styles/lib/ui/home/surveillance.module.scss"
import useFormQuery from "@/lib/hooks/useQuery";
import Title from "../title";
import Text from "@/components/Typography/Text/text";

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
];


export default function SurveillanceMap() {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<maplibregl.Map | null>(null)

    const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

    const { data: GeomData, isLoading } = useFormQuery<any>({
        key: ["GetAllGeom"],
        url: "maintenance/geospatial/geom"
    })


    const { data: RegionData, isLoading: RegionLoading } = useFormQuery<any>({
        key: ["GetAllRegions"],
        url: "maintenance/geospatial/hierarchy"
    })


    console.log("GeoData: ", GeomData)

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return
        if (typeof window === "undefined") return

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: `https://maps.geo.${process.env.NEXT_PUBLIC_AWS_MAP_REGION}.amazonaws.com/v2/styles/Standard/descriptor?key=${process.env.NEXT_PUBLIC_AWS_MAP_API}`,
            center: [121.774, 12.9],
            zoom: 4.9,
            scrollZoom: false,
        })

        mapInstance.current = map

        const safeSetFilter = (map: maplibregl.Map, layer: string, filter: any) => {
            if (!map.getLayer(layer)) return
            map.setFilter(layer, filter)
        }

        const addLayerSafe = (map: maplibregl.Map, layer: any) => {
            if (map.getLayer(layer.id)) return
            map.addLayer(layer)
        }
        
        map.on("load", async () => {

            const { regions, provinces, municipalities } = GeomData?.data

            map.addSource("regions", {
                type: "geojson",
                data: { type: "FeatureCollection", features: regions.features },
            })

            map.addSource("provinces", {
                type: "geojson",
                data: { type: "FeatureCollection", features: provinces.features },
            })

            map.addSource("municipalities", {
                type: "geojson",
                data: { type: "FeatureCollection", features: municipalities.features },
            })

            addLayerSafe(map, {
                id: "regions-fill",
                type: "fill",
                source: "regions",
                paint: {
                    "fill-color": "#3b82f6",
                    "fill-opacity": 0.1,
                },
            })

            addLayerSafe(map, {
                id: "region-line",
                type: "line",
                source: "regions",
                paint: {
                    "line-color": "#1e293b",
                    "line-width": 0.5,
                },
            })

            addLayerSafe(map, {
                id: "provinces-fill",
                type: "fill",
                source: "provinces",
                paint: {
                    "fill-color": "#e5e7eb",
                    "fill-opacity": 0.4,
                },
            })

            addLayerSafe(map, {
                id: "province-highlight",
                type: "fill",
                source: "provinces",
                paint: {
                    "fill-color": "#35408E",
                    "fill-opacity": 0.4,
                },
                filter: ["==", ["get", "code"], ""],
            })

            addLayerSafe(map, {
                id: "provinces-line",
                type: "line",
                source: "provinces",
                paint: {
                    "line-color": "#334155",
                    "line-width": 0.8,
                },
            })

            addLayerSafe(map, {
                id: "municipalities-base",
                type: "line",
                source: "municipalities",
                paint: {
                    "line-color": "#000000",
                    "line-width": [
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        5, 0.5,
                        8, 1,
                        12, 2,
                    ],
                    "line-opacity": 0.8,
                },
            })

            addLayerSafe(map, {
                id: "municipalities-glow",
                type: "line",
                source: "municipalities",
                paint: {
                    "line-color": "#94a3b8",
                    "line-width": 2,
                    "line-opacity": 0.3,
                },
            })

            addLayerSafe(map, {
                id: "municipality-highlight",
                type: "line",
                source: "municipalities",
                paint: {
                    "line-color": "#f59e0b",
                    "line-width": 3,
                },
                filter: ["==", ["get", "code"], ""],
            })

            addLayerSafe(map, {
                id: "municipality-labels",
                type: "symbol",
                source: "municipalities",
                layout: {
                    "text-field": ["get", "name"],
                    "text-size": 13,
                    "text-anchor": "center",
                },
                paint: {
                    "text-color": "#000",
                    "text-halo-color": "#fff",
                    "text-halo-width": 1,
                },
            })

            map.on("click", "provinces-fill", (e) => {
                const f = e.features?.[0]
                if (!f) return

                const code = f.properties?.code
                const bounds = f.properties?.bounds
                if (!code || !bounds) return

                setSelectedProvince(code)

                map.setFilter("municipalities-base", ["==", ["get", "province_code"], code])
                map.setFilter("municipalities-glow", ["==", ["get", "province_code"], code])
                map.setFilter("municipality-labels", ["==", ["get", "province_code"], code])

                safeSetFilter(map, "province-highlight", ["==", ["get", "code"], code])

                const coords = bounds.coordinates[0]
                const lngs = coords.map((c: any) => c[0])
                const lats = coords.map((c: any) => c[1])

                map.fitBounds(
                    [
                        [Math.min(...lngs), Math.min(...lats)],
                        [Math.max(...lngs), Math.max(...lats)],
                    ],
                    { padding: 40, duration: 800 }
                )
            })

            map.on("click", "municipalities-base", (e) => {
                const f = e.features?.[0]
                if (!f) return

                const code = f.properties?.code
                const bounds = f.properties?.bounds
                if (!code || !bounds) return

                map.setFilter("municipality-highlight", ["==", ["get", "code"], code])

                const coords = bounds.coordinates[0]
                const lngs = coords.map((c: any) => c[0])
                const lats = coords.map((c: any) => c[1])

                map.fitBounds(
                    [
                        [Math.min(...lngs), Math.min(...lats)],
                        [Math.max(...lngs), Math.max(...lats)],
                    ],
                    { padding: 30, duration: 600 }
                )
            })

            map.addControl(new maplibregl.NavigationControl())
        })

        return () => {
            map.remove()
            mapInstance.current = null
        }
    }, [GeomData?.data])

    // console.log("Regions: ", regions)
    const zoomToBounds = (bounds: any, code?: string) => {
        const map = mapInstance.current
        if (!map || !bounds) return

        const coords = bounds.coordinates[0]
        const lngs = coords.map((c: any) => c[0])
        const lats = coords.map((c: any) => c[1])

        map.fitBounds(
            [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 10, duration: 1000 }
        )

        if (code) {
            map.setFilter("province-highlight", ["==", ["get", "code"], code])
            setSelectedProvince(code)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.col1}>
                <Title title="Administrative Hierarchy" />
                <div className={styles.regions}>
                     {RegionLoading ? "" : RegionData?.data.data.map((region: any) => (
                    <div key={region.region_ocde}>
                            <div
                                style={{ fontWeight: "700", padding: 8, cursor: "pointer", backgroundColor: "#35408E", color: "white"}}
                                onClick={() => zoomToBounds(region.bounds)}
                            >
                                {region.region_name}
                            </div>

                            {region.provinces?.map((p: any) => (
                                <div
                                    key={p.code}
                                    style={{
                                        padding: 10,
                                        paddingLeft: 25,
                                        cursor: "pointer",
                                        borderRadius: 5,
                                        color: selectedProvince === p.code ? "black" : "#35408E",
                                        background: selectedProvince === p.code ? "rgb(192, 192, 199)" : "transparent",
                                        opacity: 0.9,
                                    }}
                                    onClick={() => zoomToBounds(p.bounds, p.code)}
                                >
                                    {p.name}
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
      <div
        className={`${styles.indicator} ${styles[legend.color]}`}
      />
      <Text style={{color: "#35408E"}} size="sm">{legend.label}</Text>
    </div>
  ))}
</div>
            {/* {isLoading ? "" : <div ref={mapRef} className={styles.col2} /> } */}
        </div>
    )
}