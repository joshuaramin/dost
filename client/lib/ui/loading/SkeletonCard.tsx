"use client"

import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonCard() {
  return (
    <SkeletonTheme baseColor="#cacaca" highlightColor="#8a8a8a">
      <div
        style={{
          padding: "20px",
          boxShadow: "0px 0px 3px 0px #ccc",
          borderRadius: "4px",
          background: "#fff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <Skeleton height={35} width={200} />
          <div style={{ flex: 1 }}>
            <Skeleton height="100%" />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}