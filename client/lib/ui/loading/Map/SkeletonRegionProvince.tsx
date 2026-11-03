import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonRegionProvince() {
    return (
        <SkeletonTheme baseColor="#cacaca" highlightColor="#8a8a8a">
            <div style={{ marginTop: 2 }}>
                <Skeleton height={30} />
                <div style={{ paddingLeft: 40, paddingBottom: 10 }}>
                    <Skeleton style={{ marginTop: 10 }} count={4} height={25} />
                </div>
            </div>
        </SkeletonTheme>
    )
}
