"use client"

import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function SkeletonSidebar() {
    return (
        <SkeletonTheme
            baseColor="#cacaca"
            highlightColor="#8a8a8a"
        >
            <div
                style={{
                    minHeight: "100vh",
                    height: "100dvh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "16px",
                    boxSizing: "border-box",
                }}
            >
                <div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <Skeleton circle width={45} height={45} />

                        <div style={{ flex: 1 }}>
                            <Skeleton height={40} />
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            marginTop: 20,
                        }}
                    >
                        <Skeleton height={25} />

                        <div style={{ paddingLeft: 40 }}>
                            <Skeleton
                                count={3}
                                height={25}
                                style={{ marginTop: 10 }}
                            />
                        </div>

                        <Skeleton height={25} />

                        <div style={{ paddingLeft: 40 }}>
                            <Skeleton
                                count={3}
                                height={25}
                                style={{ marginTop: 10 }}
                            />
                        </div>

                        <Skeleton height={25} />

                        <div style={{ paddingLeft: 40 }}>
                            <Skeleton
                                count={3}
                                height={25}
                                style={{ marginTop: 10 }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <Skeleton circle width={45} height={45} />

                    <div style={{ flex: 1 }}>
                        <Skeleton height={40} />
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    )
}