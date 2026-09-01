"use client";

import React, { useState } from "react";

import Template from "@/lib/ui/template";
import styles from "@/styles/lib/ui/dashboard/insights/sentiment-analysis.module.scss";

import SelectArray from "@/components/Select/select-array";
import Title from "@/components/Typography/Title/title";
import Grid from "@/components/Grid/grid";
import Text from "@/components/Typography/Text/text";
import { PieChart, LineChart, BarChart } from "@/components/Charts";

import TitleWrapper from "@/lib/ui/titleWrapper";
import useFormQuery from "@/lib/hooks/useQuery";
import DashboardCharts from "@/lib/ui/template-chart";
import Tabs from "@/components/Tabs/tab";

type SentimentTab =
    | "Distribution"
    | "Timeline"
    | "By Platform"
    | "Key Mentions";

interface RegionFeature {
    id: string;
    properties: {
        id: unknown;
        name: string;
    };
}

interface RegionsResponse {
    data?: {
        regions?: {
            features?: RegionFeature[];
        };
    };
}

const tabs: SentimentTab[] = [
    "Distribution",
    "Timeline",
    "By Platform",
    "Key Mentions",
];

export default function SentimentAnalysis() {
    const [activeTab, setActiveTab] =
        useState<SentimentTab>("Distribution");

    const { data } = useFormQuery<RegionsResponse>({
        key: ["Regions"],
        url: "maintenance/geospatial/geom",
    });

    const sentimentOverview = [
        {
            title: "Positive Statement",
            percentage: 42,
        },
        {
            title: "Neutral Statement",
            percentage: 33,
        },
        {
            title: "Negative Statement",
            percentage: 50,
        },
    ];

    const regionOptions = (
        data?.data?.regions?.features ?? []
    ).map((node) => ({
        label: node.properties.name,
        value: node.id,
    }));

    return (
        <Template title="Sentiment Analysis">
            <div className={styles.container}>
                <Grid
                    min={220}
                    max="1fr"
                    gap={10}
                >
                    <SelectArray
                        label="Date Range"
                        value=""
                        name=""
                        options={[
                            "7 days",
                            "Last 30 days",
                            "90 Days",
                        ].map((node) => ({
                            label: node,
                            value: node.toLowerCase(),
                        }))}
                    />

                    <SelectArray
                        label="All Regions"
                        value=""
                        name=""
                        options={regionOptions}
                    />

                    <SelectArray
                        label="Age Group"
                        value=""
                        name=""
                        options={[
                            "13-17",
                            "18-24",
                            "25-35",
                        ].map((node) => ({
                            label: node,
                            value: node,
                        }))}
                    />

                    <SelectArray
                        label="Platform"
                        name=""
                        value=""
                        options={[
                            "Facebook",
                            "X",
                            "Instagram",
                            "Tiktok",
                            "Reddit",
                        ].map((node) => ({
                            label: node,
                            value: node.toLowerCase(),
                        }))}
                    />
                </Grid>

                <TitleWrapper title="Sentiment Overview" />

                <Grid
                    min={300}
                    gap={10}
                >
                    {sentimentOverview.map(
                        ({ title, percentage }) => (
                            <div
                                className={styles.card}
                                key={title}
                            >
                                <Title size="sm">
                                    {title}
                                </Title>

                                <div
                                    className={
                                        styles.sub
                                    }
                                >
                                    <Text size="sm">
                                        {percentage}%
                                    </Text>

                                    <Text size="sm">
                                        of total mentions
                                    </Text>
                                </div>

                                <progress
                                    value={percentage}
                                    max={100}
                                />
                            </div>
                        )
                    )}
                </Grid>

                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {activeTab === "Distribution" && (
                    <DashboardCharts
                        title="Sentiment Distribution"
                        description="Overall breakdown of sentiment in HIV discussions"
                    >
                        <PieChart
                            data={[42, 33, 25]}
                            labels={[
                                "Positive",
                                "Neutral",
                                "Negative",
                            ]}
                            colors={[
                                "#2E7D32",
                                "#78909C",
                                "#C62828",
                            ]}
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Timeline" && (
                    <DashboardCharts
                        title="Sentiment Timeline"
                        description="Sentiment trends over the selected period"
                    >
                        <LineChart
                            labels={[
                                "Week 1",
                                "Week 2",
                                "Week 3",
                                "Week 4",
                                "Week 5",
                                "Week 6",
                            ]}
                            datasets={[
                                {
                                    label: "Positive",
                                    data: [
                                        38,
                                        42,
                                        45,
                                        48,
                                        52,
                                        57,
                                    ],
                                },
                                {
                                    label: "Neutral",
                                    data: [
                                        34,
                                        32,
                                        35,
                                        31,
                                        29,
                                        28,
                                    ],
                                },
                                {
                                    label: "Negative",
                                    data: [
                                        28,
                                        26,
                                        20,
                                        21,
                                        19,
                                        15,
                                    ],
                                },
                            ]}
                            colors={[
                                "#2E7D32",
                                "#78909C",
                                "#C62828",
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "By Platform" && (
                    <DashboardCharts
                        title="Sentiment by Platform"
                        description="Sentiment distribution across monitored social media platforms"
                    >
                        <BarChart
                            labels={[
                                "Facebook",
                                "X",
                                "Instagram",
                                "TikTok",
                                "Reddit",
                            ]}
                            datasets={[
                                {
                                    label: "Positive",
                                    data: [
                                        52,
                                        45,
                                        61,
                                        48,
                                        39,
                                    ],
                                },
                                {
                                    label: "Neutral",
                                    data: [
                                        31,
                                        35,
                                        25,
                                        34,
                                        38,
                                    ],
                                },
                                {
                                    label: "Negative",
                                    data: [
                                        17,
                                        20,
                                        14,
                                        18,
                                        23,
                                    ],
                                },
                            ]}
                            colors={[
                                "#2E7D32",
                                "#78909C",
                                "#C62828",
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Key Mentions" && (
                    <DashboardCharts
                        title="Key Mentions"
                        description="Important HIV-related discussions identified during the selected period"
                    >
                        <Grid
                            min={300}
                            gap={10}
                        >
                            <div
                                className={
                                    styles.card
                                }
                            >
                                <Title size="sm">
                                    HIV Awareness
                                </Title>

                                <Text size="sm">
                                    Increased discussion
                                    around HIV
                                    awareness and
                                    prevention.
                                </Text>
                            </div>

                            <div
                                className={
                                    styles.card
                                }
                            >
                                <Title size="sm">
                                    Treatment Access
                                </Title>

                                <Text size="sm">
                                    Growing discussion
                                    around access to
                                    HIV treatment and
                                    healthcare services.
                                </Text>
                            </div>

                            <div
                                className={
                                    styles.card
                                }
                            >
                                <Title size="sm">
                                    Testing Centers
                                </Title>

                                <Text size="sm">
                                    Increased mentions
                                    of HIV testing
                                    locations and
                                    availability.
                                </Text>
                            </div>

                            <div
                                className={
                                    styles.card
                                }
                            >
                                <Title size="sm">
                                    Treatment
                                    Misinformation
                                </Title>

                                <Text size="sm">
                                    Emerging
                                    misinformation
                                    concerning HIV
                                    treatment side
                                    effects.
                                </Text>
                            </div>
                        </Grid>
                    </DashboardCharts>
                )}
            </div>
        </Template>
    );
}