"use client";

import React, { useState } from "react";

import Search from "@/components/Search/search";
import Template from "@/lib/ui/template";
import styles from "@/styles/lib/ui/dashboard/insights/trends-and-analytics.module.scss";

import SelectArray from "@/components/Select/select-array";
import TitleWrapper from "@/lib/ui/titleWrapper";
import Title from "@/components/Typography/Title/title";
import Text from "@/components/Typography/Text/text";
import Grid from "@/components/Grid/grid";
import DashboardCharts from "@/lib/ui/template-chart";
import Tabs from "@/components/Tabs/tab";
import { LineChart, BarChart } from "@/components/Charts";

import useFormQuery from "@/lib/hooks/useQuery";

import {
    TbTrendingDown,
    TbTrendingUp,
} from "react-icons/tb";

type TrendsTab =
    | "Timeline"
    | "Platform"
    | "Topics"
    | "Recent Mentions";

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

const tabs: TrendsTab[] = [
    "Timeline",
    "Platform",
    "Topics",
    "Recent Mentions",
];

export default function TrendsAndTopics() {
    const [search, setSearch] = useState<string>("");
    const [activeTab, setActiveTab] =
        useState<TrendsTab>("Timeline");

    const { data } = useFormQuery<RegionsResponse>({
        key: ["Regions"],
        url: "maintenance/geospatial/geom",
    });

    const onHandleSearch = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearch(e.currentTarget.value);
    };

    const onHandleClear = () => {
        setSearch("");
    };

    const regionOptions = (
        data?.data?.regions?.features ?? []
    ).map((node) => ({
        label: node.properties.name,
        value: node.id,
    }));

    const trendingTopics = [
        {
            title: "#HIVAwareness",
            trend: "up",
            percentage: "+143%",
        },
        {
            title: "HIV Treatment Access",
            trend: "up",
            percentage: "+88%",
        },
        {
            title: "Testing centers",
            trend: "up",
            percentage: "+62%",
        },
        {
            title: "Prevention Methods",
            trend: "down",
            percentage: "-10%",
        },
    ];

    return (
        <Template title="Trends and Analytics">
            <div className={styles.container}>
                <Grid
                    max="1fr"
                    min={220}
                    gap={10}
                >
                    <Grid.Column span={1}>
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
                    </Grid.Column>

                    <Grid.Column span={1}>
                        <SelectArray
                            label="All Regions"
                            value=""
                            name=""
                            options={regionOptions}
                        />
                    </Grid.Column>

                    <Grid.Column span={1}>
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
                    </Grid.Column>

                    <Grid.Column>
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
                    </Grid.Column>
                </Grid>

                <TitleWrapper title="Trending Topics" />

                <Grid
                    min={300}
                    max="1fr"
                    gap={10}
                >
                    {trendingTopics.map(
                        ({
                            title,
                            percentage,
                            trend,
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
                                    {trend === "up" ? (
                                        <TbTrendingUp
                                            size={40}
                                        />
                                    ) : (
                                        <TbTrendingDown
                                            size={40}
                                        />
                                    )}
                                </div>

                                <div>
                                    <Title size="md">
                                        {title}
                                    </Title>

                                    <Text size="sm">
                                        {percentage}
                                    </Text>
                                </div>
                            </div>
                        )
                    )}
                </Grid>

                <Tabs
                    tabs={tabs}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {activeTab === "Timeline" && (
                    <DashboardCharts
                        title="Trend Timeline"
                        description="Volume of HIV-related discussions over the selected period"
                    >
                        <LineChart
                            labels={[
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                            ]}
                            datasets={[
                                {
                                    label: "Mentions",
                                    data: [
                                        120,
                                        180,
                                        150,
                                        220,
                                        280,
                                        310,
                                    ],
                                },
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Platform" && (
                    <DashboardCharts
                        title="Trends by Platform"
                        description="Distribution of HIV-related discussions across social media platforms"
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
                                    label: "Mentions",
                                    data: [
                                        450,
                                        320,
                                        280,
                                        190,
                                        120,
                                    ],
                                },
                            ]}
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Topics" && (
                    <DashboardCharts
                        title="Trending Topics"
                        description="Most discussed HIV-related topics during the selected period"
                    >
                        <BarChart
                            labels={[
                                "#HIVAwareness",
                                "Treatment Access",
                                "Testing Centers",
                                "Prevention",
                                "HIV Education",
                            ]}
                            datasets={[
                                {
                                    label: "Mentions",
                                    data: [
                                        520,
                                        410,
                                        360,
                                        280,
                                        210,
                                    ],
                                },
                            ]}
                            horizontal
                            showGrid
                        />
                    </DashboardCharts>
                )}

                {activeTab === "Recent Mentions" && (
                    <DashboardCharts
                        title="Recent Mentions"
                        description="Recent HIV-related discussions identified from monitored platforms"
                    >
                        <div
                            className={
                                styles.mentions
                            }
                        >
                            <div
                                className={
                                    styles.mention
                                }
                            >
                                <Title size="sm">
                                    HIV Awareness
                                </Title>

                                <Text size="sm">
                                    Discussion about HIV
                                    awareness and
                                    prevention.
                                </Text>
                            </div>

                            <div
                                className={
                                    styles.mention
                                }
                            >
                                <Title size="sm">
                                    Treatment Access
                                </Title>

                                <Text size="sm">
                                    Discussion about
                                    accessibility of
                                    HIV treatment
                                    services.
                                </Text>
                            </div>

                            <div
                                className={
                                    styles.mention
                                }
                            >
                                <Title size="sm">
                                    Testing Centers
                                </Title>

                                <Text size="sm">
                                    Discussion about
                                    HIV testing
                                    facilities.
                                </Text>
                            </div>
                        </div>
                    </DashboardCharts>
                )}
            </div>
        </Template>
    );
}