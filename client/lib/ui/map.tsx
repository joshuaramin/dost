"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import axios from "axios";
import "maplibre-gl/dist/maplibre-gl.css";

export default function App() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const apiKey =
            "v1.public.eyJqdGkiOiIyNTEwZDRjNC1kYzYzLTRjYjUtYTY2OC0yMWJhMGIxMjRjOGQifTs18NzYse14gsBbTCQqNsToOZIjoQ_1FWg2cHNd2AYtOEhvDAYalfpmAsG48RQVKDmDzo_9ZFYKonHtKwYdycCGJ6TyQWxcAMZC2fsu9ucOgQ80xLA8rW-uNCdlwj5asHHOZY0j8SetqQRzhFsOhMYfzBgSsMKAj_xAv011EBmXgLzEBh-j7Z6ehbhSZot5aSIS-av4mKcLfNOBGPln-5iGUd-enpfvU0LKFA5rJjqrvC-VxJul8Z6pqYrRjyVNalawMvhWwUCU7MzOU-v3dsrYOQPmuSmBehE3zQmXIYLQvBNJoUPe2y79JKi9soxAJtGf95an4egK7YS5V2XJJYk.MzRjYzZmZGUtZmY3NC00NDZiLWJiMTktNTc4YjUxYTFlOGZi";
        const mapName = "map";
        const region = "ap-southeast-1";

        const map = new maplibregl.Map({
            container: mapRef.current,
            style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
            center: [121.7740, 12.9000],
            zoom: 5.1,
        });

        map.on("load", async () => {
            const res = await fetch("http://localhost:4000/maintenance/regions");
            const data = await res.json();

            const heatmapRes = await axios.get("http://localhost:4000/maintenance/nlp");
            const heatmapData = heatmapRes.data.data


            map.addSource("regions", {
                type: "geojson",
                data: data.data.regions,
                promoteId: "code"
            });



            map.addSource("provinces", {
                type: "geojson",
                data: data.data.provinces,
                promoteId: "code"
            });
            map.addLayer({
                id: "province-labels",
                type: "symbol",
                source: "provinces",
                layout: {
                    "text-field": ["get", "name"],
                    "text-size": 12,
                    "text-font": ["Open Sans Bold"],
                    "text-anchor": "center"
                },
                paint: {
                    "text-color": "#111",
                    "text-halo-color": "#fff",
                    "text-halo-width": 1
                }
            });


            map.addSource("heatmap-provinces", {
                type: "geojson",
                data: heatmapData,
                promoteId: "province"
            });

            const createLayers = (
                id: string,
                source: string,
                fill: string,
                line: string,
                width: number
            ) => {
                map.addLayer({
                    id: `${id}-fill`,
                    type: "fill",
                    source,
                    paint: {
                        "fill-color": fill,
                        "fill-opacity": [
                            "case",
                            ["boolean", ["feature-state", "hover"], false],
                            0.7,
                            0.2
                        ]
                    }
                });

                map.addLayer({
                    id: `${id}-outline`,
                    type: "line",
                    source,
                    paint: {
                        "line-color": line,
                        "line-width": width
                    }
                });
            };

            map.addSource("municipalities", {
                type: "geojson",
                data: data.data.municipalities,
                promoteId: "code"
            });
            map.addLayer({
                id: "municipalities-line",
                type: "line",
                source: "municipalities",
                paint: {
                    "line-color": "#000",
                    "line-width": 0.5
                }
            })
            createLayers("regions", "regions", "#3b82f6", "#1f2937", 1.5);
            createLayers("provinces", "provinces", "#fff", "#14532d", 1);
            createLayers("municipalities", "municipalities", "#ccc", "#3b3b3b", 0.5);

            // Heatmap layer (choropleth)
            map.addLayer({
                id: "heatmap-fill",
                type: "fill",
                source: "heatmap-provinces",
                paint: {
                    "fill-color": [
                        "interpolate",
                        ["linear"],
                        ["get", "total_weight"],
                        0,
                        "#fef3c7",
                        1000,
                        "#fde68a",
                        5000,
                        "#fbbf24",
                        10000,
                        "#f59e0b",
                        20000,
                        "#dc2626"
                    ],
                    "fill-opacity": 1
                }
            });

            map.addLayer({
                id: "heatmap-outline",
                type: "line",
                source: "heatmap-provinces",
                paint: {
                    "line-color": "#000",
                    "line-width": 1
                }
            });

            map.addLayer({
                id: "heatmap-label",
                type: "symbol",
                source: "heatmap-provinces",
                layout: {
                    "text-field": ["get", "province"],
                    "text-size": 14
                },
                paint: {
                    "text-color": "#fff"
                }
            })

            map.moveLayer("heatmap-fill", "provinces-fill");
            map.moveLayer("heatmap-outline", "provinces-outline");

            // =========================
            // REGION / PROVINCE HOVER
            // =========================
            let hoveredId: string | number | null = null;
            let hoveredSource: string | null = null;

            const popup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            const layers = [
                { id: "regions-fill", source: "regions", label: "Region" },
                { id: "provinces-fill", source: "provinces", label: "Province" }
            ];

            layers.forEach(({ id, source, label }) => {
                map.on("mousemove", id, (e) => {
                    if (!e.features || e.features.length === 0) return;

                    const feature = e.features[0];

                    if (hoveredId !== null && hoveredSource !== null) {
                        map.setFeatureState(
                            { source: hoveredSource, id: hoveredId },
                            { hover: false }
                        );
                    }

                    hoveredId = feature.id as string | number;
                    hoveredSource = source;

                    map.setFeatureState(
                        { source, id: hoveredId },
                        { hover: true }
                    );

                    const props = feature.properties;

                    popup
                        .setLngLat(e.lngLat)
                        .setHTML(`
                            <div style="font-size:12px;color:#000">
                                <strong>${props.name}</strong><br/>
                                Type: ${label}<br/>
                                Code: ${props.code}
                            </div>
                        `)
                        .addTo(map);
                });

                map.on("mouseleave", id, () => {
                    if (hoveredId !== null && hoveredSource !== null) {
                        map.setFeatureState(
                            { source: hoveredSource, id: hoveredId },
                            { hover: false }
                        );
                    }

                    hoveredId = null;
                    hoveredSource = null;
                    popup.remove();
                });

                map.on("mouseenter", id, () => {
                    map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", id, () => {
                    map.getCanvas().style.cursor = "";
                });
            });

            // =========================
            // HEATMAP HOVER + POPUP
            // =========================
            let heatmapHoveredId: string | number | null = null;

            const heatmapPopup = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false
            });

            map.on("mousemove", "heatmap-fill", (e) => {
                if (!e.features || e.features.length === 0) return;

                const feature = e.features[0];

                if (heatmapHoveredId !== null) {
                    map.setFeatureState(
                        { source: "heatmap-provinces", id: heatmapHoveredId },
                        { hover: false }
                    );
                }

                heatmapHoveredId = feature.id as string | number;

                map.setFeatureState(
                    { source: "heatmap-provinces", id: heatmapHoveredId },
                    { hover: true }
                );

                const props = feature.properties;

                heatmapPopup
                    .setLngLat(e.lngLat)
                    .setHTML(`
                        <div style="font-size:12px;color:#000">
                            <strong>${props.province}</strong><br/>
                            Total Mentions: ${props.total_points}<br/>
                            Weight: ${props.total_weight}
                        </div>
                    `)
                    .addTo(map);
            });

            map.on("mouseleave", "heatmap-fill", () => {
                if (heatmapHoveredId !== null) {
                    map.setFeatureState(
                        { source: "heatmap-provinces", id: heatmapHoveredId },
                        { hover: false }
                    );
                }

                heatmapHoveredId = null;
                heatmapPopup.remove();
            });

            map.on("mouseenter", "heatmap-fill", () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", "heatmap-fill", () => {
                map.getCanvas().style.cursor = "";
            });

            map.addControl(new maplibregl.NavigationControl());
        });

        mapInstance.current = map;

        return () => {
            mapInstance.current?.remove();
        };
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}