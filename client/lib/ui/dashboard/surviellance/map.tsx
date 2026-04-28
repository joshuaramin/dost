"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import styles from "@/styles/lib/ui/dashboard/surviellance/map.module.scss";

import Title from "@/lib/ui/title";

export default function MapUI() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const apiKey = process.env.NEXT_PUBLIC_AWS_MAP_API as string;
        const region = process.env.NEXT_PUBLIC_AWS_MAP_REGION;

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: `https://maps.geo.${region}.amazonaws.com/v2/styles/Standard/descriptor?key=${apiKey}&color-scheme=Light`,
            center: [121.7740, 12.9000],
            zoom: 5.1,
        });

        map.on("load", async () => {
            const res = await fetch("http://localhost:4000/maintenance/geospatial/geom");
            const data = await res.json();


            console.log(data)
            const regionsFeatures = data.data.regions.features.filter(
                (f: any) =>
                    f?.geometry &&
                    (f.geometry.type === "Polygon" ||
                        f.geometry.type === "MultiPolygon")
            );

            map.addSource("regions", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: regionsFeatures,
                },
            });

            map.addSource("provinces", {
                type: "geojson",
                data: data.data.provinces,
            });

            map.addSource("municipalities", {
                type: "geojson",
                data: data.data.municipalities,
            });

            map.addLayer({
                id: "regions-fill",
                type: "fill",
                source: "regions",
                paint: {
                    "fill-color": "#3b82f6",
                    "fill-opacity": 0.12,
                },
            });

            map.addLayer({
                id: "regions-outline",
                type: "line",
                source: "regions",
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": "#0f172a",
                    "line-width": 2.5,
                    "line-opacity": 0.1,
                },
            });

            map.addLayer({
                id: "provinces-fill",
                type: "fill",
                source: "provinces",
                paint: {
                    "fill-color": "#cbd5e1",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        0.7,
                        0.2,
                    ],
                },
            });

            map.addLayer({
                id: "provinces-line",
                type: "line",
                source: "provinces",
                paint: {
                    "line-color": "#334155",
                    "line-width": 0.6,
                },
            });

            map.addLayer({
                id: "province-labels",
                type: "symbol",
                source: "provinces",
                layout: {
                    "text-field": ["get", "name"],
                    "text-size": 11,
                    "text-font": ["Open Sans Bold"],
                    "text-anchor": "center",
                },
                paint: {
                    "text-color": "#111",
                    "text-halo-color": "#fff",
                    "text-halo-width": 0.5,
                },
            });

            // -----------------------------------
            // MUNICIPALITIES
            // -----------------------------------
            map.addLayer({
                id: "municipalities-fill",
                type: "fill",
                source: "municipalities",
                paint: {
                    "fill-color": "#e2e8f0",
                    "fill-opacity": 0.15,
                },
            });

            map.addLayer({
                id: "municipalities-line",
                type: "line",
                source: "municipalities",
                paint: {
                    "line-color": "#475569",
                    "line-width": 0.3,
                },
            });

            map.addLayer({
                id: "municipalities-labels",
                type: "symbol",
                source: "municipalities",
                layout: {
                    "text-field": ["get", "name"],
                    "text-size": 10,
                    "text-font": ["Open Sans Bold"],
                    "text-anchor": "center",
                },
                paint: {
                    "text-color": "#111",
                    "text-halo-color": "#fff",
                    "text-halo-width": 1,
                },
            });

            map.moveLayer("regions-outline");

            const popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
            });

            let lastHTML = "";

            map.on("mousemove", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["provinces-fill"],
                });

                if (!features.length) {
                    popup.remove();
                    lastHTML = "";
                    return;
                }

                const p = features[0].properties;

                const html = `
                    <div style="font-size:12px;color:#000">
                        <strong>${p?.name ?? "Unknown"}</strong><br/>
                        Type: Province<br/>
                        Code: ${p?.code ?? "-"}
                    </div>
                `;

                if (html !== lastHTML) {
                    lastHTML = html;
                    popup.setLngLat(e.lngLat).setHTML(html).addTo(map);
                }
            });

            map.on("mouseenter", "provinces-fill", () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "provinces-fill", () => {
                map.getCanvas().style.cursor = "";
            });

            map.addControl(new maplibregl.NavigationControl());
        });

        mapInstance.current = map;

        return () => {
            mapInstance.current?.remove();
        };
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div>
                    <Title title="Geospatial Signal map" />
                    <span>Province Level</span>
                </div>
            </div>
            <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
        </div>
    );
}