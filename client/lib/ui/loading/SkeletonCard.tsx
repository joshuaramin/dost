

import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function SkeletonCard() {
  return (
    <SkeletonTheme baseColor="#cacaca" highlightColor="#8a8a8a">
    <div style={{ padding: "20px 10px", boxShadow: "0px 0px 3px 0px #ccc", borderRadius: "4px"}}>
        <div style={{ display:"flex", flexDirection: "column", gap: 5}}>
        <Skeleton height={35} width={200}/>
        <Skeleton height={100}/>
      </div>
    </div>
    </SkeletonTheme>
  )
}
