"use client";

import dynamic from "next/dynamic";

const MapUI = dynamic(() => import("@/lib/ui/dashboard/monitoring/map/map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  ),
});

export default MapUI;
