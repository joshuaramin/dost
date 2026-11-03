"use client";

import { useState } from "react";
import {
    TbFileAnalytics,
    TbFileDownload,
    TbFileText,
    TbReportAnalytics,
} from "react-icons/tb";

import Template from "@/lib/ui/template";
import styles from "@/styles/lib/ui/dashboard/insights/generate-report.module.scss";

import SelectArray from "@/components/Select/select-array";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Text from "@/components/Typography/Text/text";
import Grid from "@/components/Grid/grid";
import TitleWrapper from "@/lib/ui/titleWrapper";

type ReportType =
    | "Sentiment Analysis"
    | "Demographics"
    | "Trends and Analytics"
    | "Risk Zones"
    | "Predictions"
    | "Comprehensive Report";

type ReportFormat = "PDF" | "Excel" | "CSV";

const reportTypes: ReportType[] = [
    "Sentiment Analysis",
    "Demographics",
    "Trends and Analytics",
    "Risk Zones",
    "Predictions",
    "Comprehensive Report",
];

const reportFormats: ReportFormat[] = [
    "PDF",
    "Excel",
    "CSV",
];

export default function Page() {
    const [reportType, setReportType] =
        useState<ReportType>("Comprehensive Report");

    const [reportFormat, setReportFormat] =
        useState<ReportFormat>("PDF");

    const reportDescription = {
        "Sentiment Analysis":
            "Generate a report containing sentiment distribution, sentiment trends, platform comparison, and key mentions.",
        Demographics:
            "Generate a report containing age, gender, regional, and language demographic analysis.",
        "Trends and Analytics":
            "Generate a report containing trending topics, mention volume, platform activity, and recent trends.",
        "Risk Zones":
            "Generate a report containing identified risk areas, regional risk levels, and risk trends.",
        Predictions:
            "Generate a report containing predicted trends, sentiment forecasts, regional forecasts, and emerging topics.",
        "Comprehensive Report":
            "Generate a complete report combining sentiment, demographics, trends, risk zones, and prediction insights.",
    };

    const handleGenerate = () => {
        console.log({
            reportType,
            reportFormat,
        });
    };

    return (
        <Template title="Generate Reports">
            <div className={styles.container}>
                <TitleWrapper title="Report Configuration" />

                <div className={styles.configuration}>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.icon}>
                                <TbReportAnalytics size={24} />
                            </div>

                            <div>
                                <Title size="md">
                                    Report Type
                                </Title>

                                <Paragraph>
                                    Select the type of report you
                                    want to generate.
                                </Paragraph>
                            </div>
                        </div>

                        <Grid
                            min={250}
                            max="1fr"
                            gap={10}
                        >
                            {reportTypes.map((type) => (
                                <button
                                    type="button"
                                    key={type}
                                    className={`${styles.reportType} ${
                                        reportType === type
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setReportType(type)
                                    }
                                >
                                    <TbFileAnalytics
                                        size={24}
                                    />

                                    <div>
                                        <Title size="sm">
                                            {type}
                                        </Title>

                                        <Text size="sm">
                                            {type ===
                                            "Comprehensive Report"
                                                ? "Complete system analysis"
                                                : `Generate ${type.toLowerCase()} report`}
                                        </Text>
                                    </div>
                                </button>
                            ))}
                        </Grid>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.icon}>
                                <TbFileText size={24} />
                            </div>

                            <div>
                                <Title size="md">
                                    Report Filters
                                </Title>

                                <Paragraph>
                                    Define the data included in
                                    the report.
                                </Paragraph>
                            </div>
                        </div>

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
                                    "Last 7 days",
                                    "Last 30 days",
                                    "Last 90 days",
                                    "Last 12 months",
                                ].map((node) => ({
                                    label: node,
                                    value: node.toLowerCase(),
                                }))}
                            />

                            <SelectArray
                                label="Region"
                                value=""
                                name=""
                                options={[
                                    {
                                        label: "All Regions",
                                        value: "all",
                                    },
                                    {
                                        label: "National Capital Region",
                                        value: "ncr",
                                    },
                                    {
                                        label: "Region III",
                                        value: "region-iii",
                                    },
                                    {
                                        label: "Region IV-A",
                                        value: "region-iv-a",
                                    },
                                    {
                                        label: "Region VI",
                                        value: "region-vi",
                                    },
                                    {
                                        label: "Region VII",
                                        value: "region-vii",
                                    },
                                ]}
                            />

                            <SelectArray
                                label="Age Group"
                                value=""
                                name=""
                                options={[
                                    "All Age Groups",
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
                                    "All Platforms",
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
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <div className={styles.icon}>
                                <TbFileDownload size={24} />
                            </div>

                            <div>
                                <Title size="md">
                                    Output Format
                                </Title>

                                <Paragraph>
                                    Select the format for the
                                    generated report.
                                </Paragraph>
                            </div>
                        </div>

                        <div className={styles.formatGroup}>
                            {reportFormats.map((format) => (
                                <button
                                    type="button"
                                    key={format}
                                    className={`${styles.format} ${
                                        reportFormat === format
                                            ? styles.active
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setReportFormat(format)
                                    }
                                >
                                    <TbFileText size={22} />

                                    <Text size="sm">
                                        {format}
                                    </Text>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <TitleWrapper title="Report Preview" />

                <div className={styles.preview}>
                    <div className={styles.previewIcon}>
                        <TbReportAnalytics size={40} />
                    </div>

                    <div className={styles.previewContent}>
                        <Title size="md">
                            {reportType}
                        </Title>

                        <Paragraph>
                            {reportDescription[reportType]}
                        </Paragraph>

                        <div className={styles.previewMeta}>
                            <Text size="sm">
                                Format: {reportFormat}
                            </Text>

                            <Text size="sm">
                                Date range: Last 30 days
                            </Text>

                            <Text size="sm">
                                Region: All Regions
                            </Text>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.generate}
                        onClick={handleGenerate}
                    >
                        <TbFileDownload size={22} />
                        <Text size="sm">
                            Generate Report
                        </Text>
                    </button>
                </div>
            </div>
        </Template>
    );
}