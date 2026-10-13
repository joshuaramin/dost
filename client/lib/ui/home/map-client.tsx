"use client";

import dynamic from "next/dynamic";

const SurveillanceMap = dynamic(() => import("@/lib/ui/home/map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#35408E",
      }}
    >
      Loading surveillance map...
    </div>
  ),
});

export default function SurveillanceMapClient() {
  return <SurveillanceMap />;
}
