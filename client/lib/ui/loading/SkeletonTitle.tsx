"use client"
import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


export default function SkeletonTitle() {
  return (
   <SkeletonTheme baseColor="#cacaca" highlightColor="#8a8a8a">
        <Skeleton height={50} />
   </SkeletonTheme>
  )
}
