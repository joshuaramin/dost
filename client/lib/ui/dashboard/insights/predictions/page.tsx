"use client";

import { useState } from "react";
import { TbFileSmile } from "react-icons/tb";

import styles from "@/styles/lib/ui/dashboard/insights/predictions.module.scss";

import SelectArray from "@/components/Select/select-array";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Title from "@/components/Typography/Title/title";
import Grid from "@/components/Grid/grid";
import Tabs from "@/components/Tabs/tab";
import { LineChart, BarChart } from "@/components/Charts";

import useFormQuery from "@/lib/hooks/useQuery";
import Template from "@/lib/ui/template";
import TitleWrapper from "@/lib/ui/titleWrapper";
import DashboardCharts from "@/lib/ui/template-chart";

type PredictionTab =
    | "Mention Forecast"
    | "Sentiment Forecast"
    | "Regional Forecast"
    | "Emerging Topics";

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

const tabs: PredictionTab[] = [
    "Mention Forecast",
    "Sentiment Forecast",
    "Regional Forecast",
    "Emerging Topics",
];

export default function Predictions() {
    const [activeTab, setActiveTab] =
        useState<PredictionTab>("Mention Forecast");

    const { data } = useFormQuery<RegionsResponse>({
        key: ["Regions"],
        url: "maintenance/geospatial/geom",
    });

    const regionOptions = (
        data?.data?.regions?.features ?? []
    ).map((node) => ({
        label: node.properties.name,
        value: node.id,
    }));

    const predictionInsights = [
        {
            title: "Trend Acceleration",
            description:
                "HIV awareness discussions predicted to increase by 45% over the next 30 days due to upcoming World AIDS Day campaigns.",
        },
        {
            title: "Sentiment Approval",
            description:
                "Positive sentiment projected to increase from 64% to 76% following the Department of Health's new educational campaign.",
        },
        {
            title: "Regional Growth",
            description:
                "Western Visayas expected to see the highest growth (30%) in HIV discussions as new testing centers open.",
        },
        {
            title: "Information Integrity",
            description:
                "23% chance of a new misinformation surge related to treatment side effects in the next two weeks.",
        },
    ];

    return (
        <Template title="Predictions">
            <div className={styles.container}>
                <Grid
                    max="1fr"
                    min={220}
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

                <TitleWrapper title="Predictions Insights" />

                <Grid
                    min={300}
                    gap={10}
                >
                    {predictionInsights.map(
                        ({ title, description }) => (
                            <div
                                key={title}
                                className={styles.card}
                            >
                                <div
                                    className={
                                        styles.iconChart
                                    }
                                >
                                    <TbFileSmile
                                        size={23}
                                    />
                                </div>

                                <Title size="md">
                                    {title}
                                </Title>

                                <Paragraph>
                                    {description}
                                </Paragraph>
                            </div>
                        )
                    )}
                </Grid>

                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {activeTab === "Mention Forecast" && (
                    <DashboardCharts
                        title="Mention Forecast"
                        description="Predicted volume of HIV-related discussions over the next 30 days"
                    >
                        <LineChart
                            labels={[
                                "Week 1",
                                "Week 2",
                                "Week 3",
                                "Week 4",
                                "Week 5",
                            ]}
                            datasets={[
                                {
                                    label: "Predicted Mentions",
                                    data: [
                                        420,
                                        480,
                                        540,
                                        610,
                                        690,
                                    ],
                                },
                            ]}
                            colors={[
                                "#1B4264",
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Sentiment Forecast" && (
                    <DashboardCharts
                        title="Sentiment Forecast"
                        description="Projected sentiment distribution for HIV-related discussions"
                    >
                        <LineChart
                            labels={[
                                "Week 1",
                                "Week 2",
                                "Week 3",
                                "Week 4",
                                "Week 5",
                            ]}
                            datasets={[
                                {
                                    label: "Positive",
                                    data: [
                                        64,
                                        67,
                                        70,
                                        73,
                                        76,
                                    ],
                                },
                                {
                                    label: "Neutral",
                                    data: [
                                        23,
                                        21,
                                        19,
                                        17,
                                        15,
                                    ],
                                },
                                {
                                    label: "Negative",
                                    data: [
                                        13,
                                        12,
                                        11,
                                        10,
                                        9,
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

                {activeTab === "Regional Forecast" && (
                    <DashboardCharts
                        title="Regional Forecast"
                        description="Projected growth of HIV-related discussions across regions"
                    >
                        <BarChart
                            labels={[
                                "NCR",
                                "Region III",
                                "Region IV-A",
                                "Western Visayas",
                                "Central Visayas",
                            ]}
                            datasets={[
                                {
                                    label: "Predicted Growth (%)",
                                    data: [
                                        18,
                                        21,
                                        24,
                                        30,
                                        22,
                                    ],
                                },
                            ]}
                            colors={[
                                "#1B4264",
                            ]}
                            horizontal
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Emerging Topics" && (
                    <DashboardCharts
                        title="Emerging Topics"
                        description="Topics predicted to experience increased discussion volume"
                    >
                        <BarChart
                            labels={[
                                "HIV Awareness",
                                "Treatment Access",
                                "Testing",
                                "Prevention",
                                "Side Effects",
                            ]}
                            datasets={[
                                {
                                    label: "Predicted Growth (%)",
                                    data: [
                                        45,
                                        38,
                                        32,
                                        27,
                                        23,
                                    ],
                                },
                            ]}
                            colors={[
                                "#1B4264",
                                "#2A5A7A",
                                "#397493",
                                "#6D9DB2",
                                "#FFA400",
                            ]}
                            horizontal
                            showGrid
                        />
                    </DashboardCharts>
                )}
            </div>
        </Template>
    );
}