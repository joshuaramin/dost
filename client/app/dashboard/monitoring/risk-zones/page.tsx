"use client";

import { useState } from "react";
import {
    TbAlertTriangle,
    TbMapPin,
    TbTrendingUp,
    TbShieldCheck,
} from "react-icons/tb";

import Template from "@/lib/ui/template";
import styles from "@/styles/lib/ui/monitoring/risk-zones.module.scss";

import SelectArray from "@/components/Select/select-array";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Text from "@/components/Typography/Text/text";
import Grid from "@/components/Grid/grid";
import Tabs from "@/components/Tabs/tab";
import DashboardCharts from "@/lib/ui/template-chart";
import { BarChart, LineChart } from "@/components/Charts";

import TitleWrapper from "@/lib/ui/titleWrapper";
import useFormQuery from "@/lib/hooks/useQuery";

type RiskZoneTab =
    | "Risk Overview"
    | "Regional Risk"
    | "Risk Trends"
    | "High Risk Areas";

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

const tabs: RiskZoneTab[] = [
    "Risk Overview",
    "Regional Risk",
    "Risk Trends",
    "High Risk Areas",
];

export default function Page() {
    const [activeTab, setActiveTab] =
        useState<RiskZoneTab>("Risk Overview");

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
            title: "High Risk Areas",
            value: "12",
            description: "regions requiring attention",
            icon: <TbAlertTriangle size={24} />,
        },
        {
            title: "Highest Risk Region",
            value: "NCR",
            description: "highest concentration of risk signals",
            icon: <TbMapPin size={24} />,
        },
        {
            title: "Risk Increase",
            value: "+28%",
            description: "compared with previous period",
            icon: <TbTrendingUp size={24} />,
        },
        {
            title: "Low Risk Areas",
            value: "34",
            description: "regions with limited risk signals",
            icon: <TbShieldCheck size={24} />,
        },
    ];

    return (
        <Template title="Risk Zones">
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
                            "25-34",
                            "35+",
                        ].map((node) => ({
                            label: node,
                            value: node,
                        }))}
                    />

                    <SelectArray
                        label="Platform"
                        value=""
                        name=""
                        options={[
                            "Facebook",
                            "X",
                            "Instagram",
                            "TikTok",
                            "Reddit",
                        ].map((node) => ({
                            label: node,
                            value: node.toLowerCase(),
                        }))}
                    />
                </Grid>

                <TitleWrapper title="Risk Zone Overview" />

                <Grid
                    max="1fr"
                    min={260}
                    gap={10}
                >
                    {overview.map(
                        ({
                            title,
                            value,
                            description,
                            icon,
                        }) => (
                            <div
                                className={styles.card}
                                key={title}
                            >
                                <div
                                    className={
                                        styles.iconChart
                                    }
                                >
                                    {icon}
                                </div>

                                <Title size="sm">
                                    {title}
                                </Title>

                                <Text size="lg">
                                    {value}
                                </Text>

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

                {activeTab === "Risk Overview" && (
                    <DashboardCharts
                        title="Risk Overview"
                        description="Distribution of identified risk signals across monitored areas"
                    >
                        <BarChart
                            labels={[
                                "NCR",
                                "Region IV-A",
                                "Region III",
                                "Region VII",
                                "Region VI",
                            ]}
                            datasets={[
                                {
                                    label: "Risk Score",
                                    data: [
                                        82,
                                        68,
                                        61,
                                        54,
                                        47,
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

                {activeTab === "Regional Risk" && (
                    <DashboardCharts
                        title="Regional Risk Distribution"
                        description="Comparison of risk levels across geographic regions"
                    >
                        <BarChart
                            labels={[
                                "NCR",
                                "Region III",
                                "Region IV-A",
                                "Region VI",
                                "Region VII",
                            ]}
                            datasets={[
                                {
                                    label: "High Risk",
                                    data: [
                                        82,
                                        61,
                                        68,
                                        47,
                                        54,
                                    ],
                                },
                                {
                                    label: "Moderate Risk",
                                    data: [
                                        45,
                                        42,
                                        51,
                                        38,
                                        41,
                                    ],
                                },
                            ]}
                            colors={[
                                "#C62828",
                                "#FFA400",
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Risk Trends" && (
                    <DashboardCharts
                        title="Risk Trends"
                        description="Risk signal progression over the selected period"
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
                                    label: "Risk Score",
                                    data: [
                                        42,
                                        48,
                                        51,
                                        57,
                                        63,
                                        68,
                                    ],
                                },
                            ]}
                            colors={[
                                "#C62828",
                            ]}
                            fill
                            tension={0.35}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "High Risk Areas" && (
                    <DashboardCharts
                        title="High Risk Areas"
                        description="Areas with the highest concentration of risk indicators"
                    >
                        <Grid
                            max="1fr"
                            min={280}
                            gap={10}
                        >
                            {[
                                {
                                    region: "National Capital Region",
                                    score: 82,
                                    level: "High",
                                },
                                {
                                    region: "Region IV-A",
                                    score: 68,
                                    level: "High",
                                },
                                {
                                    region: "Region III",
                                    score: 61,
                                    level: "High",
                                },
                                {
                                    region: "Central Visayas",
                                    score: 54,
                                    level: "Moderate",
                                },
                            ].map(
                                ({
                                    region,
                                    score,
                                    level,
                                }) => (
                                    <div
                                        className={
                                            styles.riskCard
                                        }
                                        key={region}
                                    >
                                        <div
                                            className={
                                                styles.riskHeader
                                            }
                                        >
                                            <Title size="sm">
                                                {region}
                                            </Title>

                                            <Text size="sm">
                                                {level}
                                            </Text>
                                        </div>

                                        <div
                                            className={
                                                styles.riskScore
                                            }
                                        >
                                            <Text size="lg">
                                                {score}
                                            </Text>

                                            <Text size="sm">
                                                risk score
                                            </Text>
                                        </div>

                                        <progress
                                            value={score}
                                            max={100}
                                        />
                                    </div>
                                )
                            )}
                        </Grid>
                    </DashboardCharts>
                )}
            </div>
        </Template>
    );
}