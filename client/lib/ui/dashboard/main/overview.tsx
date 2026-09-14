"use client"

import React from "react"
import {
  TbArrowDown,
  TbArrowUp,
  TbAlertTriangle,
  TbChartDonut,
  TbChartLine,
  TbCircleCheck,
  TbMapPinExclamation,
  TbMessageCircle,
  TbShieldExclamation,
  TbTrendingUp,
  TbUsers,
} from "react-icons/tb"

// components
import Text from "@/components/Typography/Text/text"
import Title from "@/components/Typography/Title/title"
import TitleWrapper from "../../titleWrapper"
import SurveillanceMap from "../../home/map"
import Template from "../../template"

// styles
import styles from "@/styles/lib/ui/dashboard/main/overview.module.scss"

type Metric = {
  title: string
  value: string
  description: string
  percentage: string
  trend: "up" | "down"
  icon: React.ReactNode
}

type Trend = {
  title: string
  value: string
  percentage: string
}

type RiskArea = {
  name: string
  province: string
  mentions: number
  risk: "High" | "Moderate" | "Low"
  percentage: string
}

type Activity = {
  title: string
  description: string
  time: string
  type: "misinformation" | "trend" | "referral" | "analysis"
}

const metrics: Metric[] = [
  {
    title: "Posts Analyzed",
    value: "140K",
    description: "Total posts processed",
    percentage: "+12.4%",
    trend: "up",
    icon: <TbMessageCircle size={32} />,
  },
  {
    title: "High-Risk Zones",
    value: "24",
    description: "Areas requiring attention",
    percentage: "+8.2%",
    trend: "up",
    icon: <TbMapPinExclamation size={32} />,
  },
  {
    title: "NLP Accuracy",
    value: "91.40%",
    description: "Classification accuracy",
    percentage: "+2.8%",
    trend: "up",
    icon: <TbChartLine size={32} />,
  },
  {
    title: "Testing Referrals",
    value: "3,120",
    description: "Generated referrals",
    percentage: "+15.6%",
    trend: "up",
    icon: <TbUsers size={32} />,
  },
]

const hotTopics: Trend[] = [
  {
    title: "#HIVAwareness",
    value: "18.4K",
    percentage: "+101%",
  },
  {
    title: "#HIVPrevention",
    value: "14.2K",
    percentage: "+88%",
  },
  {
    title: "#HIVTesting",
    value: "9.8K",
    percentage: "+56%",
  },
  {
    title: "#HIVStigma",
    value: "7.4K",
    percentage: "+47%",
  },
]

const riskAreas: RiskArea[] = [
  {
    name: "Quezon City",
    province: "Metro Manila",
    mentions: 18420,
    risk: "High",
    percentage: "24.8%",
  },
  {
    name: "Cebu City",
    province: "Cebu",
    mentions: 12680,
    risk: "High",
    percentage: "18.2%",
  },
  {
    name: "Davao City",
    province: "Davao del Sur",
    mentions: 9840,
    risk: "Moderate",
    percentage: "14.6%",
  },
  {
    name: "Antipolo",
    province: "Rizal",
    mentions: 7240,
    risk: "Moderate",
    percentage: "10.8%",
  },
  {
    name: "Bacoor",
    province: "Cavite",
    mentions: 5820,
    risk: "Low",
    percentage: "8.4%",
  },
]

const activities: Activity[] = [
  {
    title: "Misinformation cluster detected",
    description: "New misinformation activity identified in Metro Manila.",
    time: "12 minutes ago",
    type: "misinformation",
  },
  {
    title: "#HIVAwareness is trending",
    description: "Mention volume increased significantly over the last 24 hours.",
    time: "34 minutes ago",
    type: "trend",
  },
  {
    title: "Testing referral threshold reached",
    description: "A high-risk area generated more than 500 potential referrals.",
    time: "1 hour ago",
    type: "referral",
  },
  {
    title: "NLP analysis completed",
    description: "12,480 new social media posts were successfully classified.",
    time: "2 hours ago",
    type: "analysis",
  },
]

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "misinformation":
      return <TbShieldExclamation size={22} />

    case "trend":
      return <TbTrendingUp size={22} />

    case "referral":
      return <TbUsers size={22} />

    default:
      return <TbCircleCheck size={22} />
  }
}

function getRiskClass(risk: RiskArea["risk"]) {
  switch (risk) {
    case "High":
      return styles.high

    case "Moderate":
      return styles.moderate

    default:
      return styles.low
  }
}

export default function Overview() {
  return (
    <Template
      title="Platform Ovevrview"
      description="Get a comprehensive overview of the HIV/AIDS situation in the Philippines, including key metrics, trends, and insights to inform your advocacy efforts."
    >
      <section className={styles.section}>
        <div className={styles.section_header}>
          <Text size="sm">
            Last updated: Today
          </Text>
        </div>

        <div className={styles.metrics}>
          {metrics.map((metric) => (
            <div
              className={styles.metric_card}
              key={metric.title}
            >
              <div className={styles.metric_header}>
                <div className={styles.icon}>
                  {metric.icon}
                </div>

                <div className={styles.metric_trend}>
                  {metric.trend === "up" ? (
                    <TbArrowUp size={16} />
                  ) : (
                    <TbArrowDown size={16} />
                  )}

                  <Text size="sm" weight="bold">
                    {metric.percentage}
                  </Text>
                </div>
              </div>

              <div className={styles.metric_body}>
                <Text size="sm">
                  {metric.title}
                </Text>

                <Title size="lg">
                  {metric.value}
                </Title>

                <Text size="sm">
                  {metric.description}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <TitleWrapper title="Trending Topics" />

        <div className={styles.trends}>
          {hotTopics.map((topic) => (
            <div
              className={styles.trend_card}
              key={topic.title}
            >
              <div className={styles.trend_icon}>
                <TbTrendingUp size={22} />
              </div>

              <div className={styles.trend_content}>
                <Title size="md">
                  {topic.title}
                </Title>

                <div className={styles.trend_footer}>
                  <Text size="sm">
                    {topic.value} mentions
                  </Text>

                  <span>
                    <TbArrowUp size={15} />
                    <Text size="sm" weight="bold">
                      {topic.percentage}
                    </Text>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <TitleWrapper title="Geospatial Intelligence" />

        <div className={styles.map_wrapper}>
          <SurveillanceMap />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={styles.panel}>
            <div className={styles.panel_header}>
              <div>
                <Title size="md">
                  High-Risk Areas
                </Title>

                <Text size="sm">
                  Locations with elevated HIV-related activity
                </Text>
              </div>

              <TbMapPinExclamation size={24} />
            </div>

            <div className={styles.risk_list}>
              {riskAreas.map((area) => (
                <div
                  className={styles.risk_item}
                  key={`${area.name}-${area.province}`}
                >
                  <div className={styles.risk_location}>
                    <div className={styles.risk_icon}>
                      <TbMapPinExclamation size={20} />
                    </div>

                    <div>
                      <Title size="sm">
                        {area.name}
                      </Title>

                      <Text size="sm">
                        {area.province}
                      </Text>
                    </div>
                  </div>

                  <div className={styles.risk_stats}>
                    <Text size="sm">
                      {area.mentions.toLocaleString()} mentions
                    </Text>

                    <span
                      className={`${styles.risk_badge} ${getRiskClass(
                        area.risk
                      )}`}
                    >
                      {area.risk}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.panel}>
            <div className={styles.panel_header}>
              <div>
                <Title size="md">
                  Sentiment Overview
                </Title>

                <Text size="sm">
                  Overall sentiment across analyzed content
                </Text>
              </div>

              <TbChartDonut size={24} />
            </div>

            <div className={styles.sentiment}>
              <div className={styles.sentiment_item}>
                <div>
                  <Text size="sm">
                    Positive
                  </Text>

                  <Title size="lg">
                    42.8%
                  </Title>
                </div>

                <Text size="sm">
                  59,920 posts
                </Text>
              </div>

              <div className={styles.sentiment_item}>
                <div>
                  <Text size="sm">
                    Neutral
                  </Text>

                  <Title size="lg">
                    38.6%
                  </Title>
                </div>

                <Text size="sm">
                  54,040 posts
                </Text>
              </div>

              <div className={styles.sentiment_item}>
                <div>
                  <Text size="sm">
                    Negative
                  </Text>

                  <Title size="lg">
                    18.6%
                  </Title>
                </div>

                <Text size="sm">
                  26,040 posts
                </Text>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <TitleWrapper title="Barangay Intelligence" />

        <div className={styles.panel}>
          <div className={styles.panel_header}>
            <div>
              <Title size="md">
                Priority Barangays
              </Title>

              <Text size="sm">
                Barangays requiring closer monitoring based on current activity
              </Text>
            </div>

            <TbMapPinExclamation size={24} />
          </div>

          <div className={styles.table}>
            <div className={styles.table_header}>
              <Text size="sm" weight="bold">
                Barangay
              </Text>

              <Text size="sm" weight="bold">
                Municipality
              </Text>

              <Text size="sm" weight="bold">
                Mentions
              </Text>

              <Text size="sm" weight="bold">
                Risk
              </Text>

              <Text size="sm" weight="bold">
                Change
              </Text>
            </div>

            {[
              {
                barangay: "Commonwealth",
                municipality: "Quezon City",
                mentions: "4,820",
                risk: "High",
                change: "+18.4%",
              },
              {
                barangay: "Payatas",
                municipality: "Quezon City",
                mentions: "3,940",
                risk: "High",
                change: "+15.2%",
              },
              {
                barangay: "Lahug",
                municipality: "Cebu City",
                mentions: "2,840",
                risk: "Moderate",
                change: "+11.8%",
              },
              {
                barangay: "Talomo",
                municipality: "Davao City",
                mentions: "2,410",
                risk: "Moderate",
                change: "+9.6%",
              },
            ].map((barangay) => (
              <div
                className={styles.table_row}
                key={`${barangay.barangay}-${barangay.municipality}`}
              >
                <Text size="sm">
                  {barangay.barangay}
                </Text>

                <Text size="sm">
                  {barangay.municipality}
                </Text>

                <Text size="sm">
                  {barangay.mentions}
                </Text>

                <span
                  className={`${styles.risk_badge} ${getRiskClass(
                    barangay.risk as RiskArea["risk"]
                  )}`}
                >
                  {barangay.risk}
                </span>

                <span className={styles.positive_change}>
                  <TbArrowUp size={15} />
                  <Text size="sm" weight="bold">
                    {barangay.change}
                  </Text>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <TitleWrapper title="Recent Intelligence" />

        <div className={styles.activity_list}>
          {activities.map((activity) => (
            <div
              className={styles.activity_item}
              key={`${activity.title}-${activity.time}`}
            >
              <div className={styles.activity_icon}>
                {getActivityIcon(activity.type)}
              </div>

              <div className={styles.activity_content}>
                <Title size="sm">
                  {activity.title}
                </Title>

                <Text size="sm">
                  {activity.description}
                </Text>
              </div>

              <Text size="sm">
                {activity.time}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.alert}>
          <div className={styles.alert_icon}>
            <TbAlertTriangle size={24} />
          </div>

          <div>
            <Title size="sm">
              Surveillance attention required
            </Title>

            <Text size="sm">
              24 high-risk zones and 8 emerging misinformation clusters
              currently require monitoring.
            </Text>
          </div>
        </div>
      </section>
    </Template>
  )
}