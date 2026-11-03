"use client";

import { useState } from "react";
import { TbFileSmile } from "react-icons/tb";

import styles from "@/styles/lib/ui/dashboard/insights/demographics.module.scss";

import Template from "@/lib/ui/template";
import SelectArray from "@/components/Select/select-array";
import TitleWrapper from "@/lib/ui/titleWrapper";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Grid from "@/components/Grid/grid";
import DashboardCharts from "@/lib/ui/template-chart";
import { BarChart } from "@/components/Charts";
import Tabs from "@/components/Tabs/tab";

import useFormQuery from "@/lib/hooks/useQuery";

type DemographicTab =
    | "Age & Gender"
    | "Regional Distribution"
    | "Language Breakdown"
    | "Demographic Comparison";

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

const tabs: DemographicTab[] = [
    "Age & Gender",
    "Regional Distribution",
    "Language Breakdown",
    "Demographic Comparison",
];

const genderColors = [
    "#1B4264",
    "#FFA400",
    "#6B7280",
];

const dashboardColors = [
    "#1B4264",
    "#2A5A7A",
    "#397493",
    "#6D9DB2",
    "#FFA400",
];

export default function Demographics() {
    const [activeTab, setActiveTab] =
        useState<DemographicTab>("Age & Gender");

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

    const overview = [
        {
            title: "Age Distribution",
            value: "Predominantly 18-34 age groups",
        },
        {
            title: "Gender Distribution",
            value: "54% male, 43% female, 3% other",
        },
        {
            title: "Top Region",
            value: "Metro Manila",
        },
    ];

    return (
        <Template title="Demographics">
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

                <TitleWrapper title="Demographics Overview" />

                <Grid
                    max="1fr"
                    min={300}
                    gap={10}
                >
                    {overview.map(({ title, value }) => (
                        <div
                            className={styles.card}
                            key={title}
                        >
                            <div
                                className={
                                    styles.iconChart
                                }
                            >
                                <TbFileSmile size={23} />
                            </div>

                            <Title size="md">
                                {title}
                            </Title>

                            <Paragraph>
                                {value}
                            </Paragraph>
                        </div>
                    ))}
                </Grid>

                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {activeTab === "Age & Gender" && (
                    <DashboardCharts
                        title="Age & Gender Distribution"
                        description="Analysis of HIV discussions across age groups and gender"
                    >
                        <BarChart
                            datasets={[
                                {
                                    label: "Male",
                                    data: [
                                        42,
                                        54,
                                        48,
                                        31,
                                    ],
                                },
                                {
                                    label: "Female",
                                    data: [
                                        38,
                                        43,
                                        44,
                                        35,
                                    ],
                                },
                                {
                                    label: "Others",
                                    data: [
                                        4,
                                        3,
                                        5,
                                        2,
                                    ],
                                },
                            ]}
                            labels={[
                                "13-17",
                                "18-24",
                                "25-34",
                                "35+",
                            ]}
                            colors={genderColors}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab ===
                    "Regional Distribution" && (
                    <DashboardCharts
                        title="Regional Distribution"
                        description="Distribution of HIV discussions across geographic regions"
                    >
                        <BarChart
                            datasets={[
                                {
                                    label: "Mentions",
                                    data: [
                                        450,
                                        320,
                                        280,
                                        190,
                                        160,
                                    ],
                                },
                            ]}
                            labels={[
                                "NCR",
                                "Region III",
                                "Region IV-A",
                                "Region VII",
                                "Region VI",
                            ]}
                            colors={[
                                "#1B4264",
                            ]}
                            showGrid
                            horizontal
                        />
                    </DashboardCharts>
                )}

                {activeTab ===
                    "Language Breakdown" && (
                    <DashboardCharts
                        title="Language Breakdown"
                        description="Distribution of HIV discussions by detected language"
                    >
                        <BarChart
                            datasets={[
                                {
                                    label: "Mentions",
                                    data: [
                                        520,
                                        280,
                                        120,
                                        80,
                                        45,
                                    ],
                                },
                            ]}
                            labels={[
                                "Filipino",
                                "English",
                                "Cebuano",
                                "Ilocano",
                                "Hiligaynon",
                            ]}
                            colors={[
                                "#1B4264",
                                "#2A5A7A",
                                "#397493",
                                "#6D9DB2",
                                "#FFA400",
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab ===
                    "Demographic Comparison" && (
                    <DashboardCharts
                        title="Demographic Comparison"
                        description="Comparison of demographic groups across HIV-related discussions"
                    >
                        <BarChart
                            datasets={[
                                {
                                    label: "13-17",
                                    data: [
                                        25,
                                        18,
                                        12,
                                    ],
                                },
                                {
                                    label: "18-24",
                                    data: [
                                        42,
                                        38,
                                        20,
                                    ],
                                },
                                {
                                    label: "25-34",
                                    data: [
                                        50,
                                        43,
                                        15,
                                    ],
                                },
                            ]}
                            labels={[
                                "Male",
                                "Female",
                                "Others",
                            ]}
                            colors={[
                                "#1B4264",
                                "#397493",
                                "#FFA400",
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}
            </div>
        </Template>
    );
}