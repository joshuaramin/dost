"use client"

import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function SkeletonBody() {
  return (
  <SkeletonTheme baseColor="#cacaca" highlightColor="#8a8a8a">
        <Skeleton height={400} />
   </SkeletonTheme>
  )
}
