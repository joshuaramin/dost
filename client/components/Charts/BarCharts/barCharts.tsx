"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
    type ChartData,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import styles from "@/styles/components/Charts/BarChart.module.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface BarChartProps {
    labels: string[];
    datasets: ChartData<"bar">["datasets"];
    title?: string;
    height?: number;
    horizontal?: boolean;
    showLegend?: boolean;
    showGrid?: boolean;
    colors?: string[];
}

const BarChart = ({
    labels,
    datasets,
    title,
    height = 350,
    horizontal = false,
    showLegend = true,
    showGrid = true,
    colors = [],
}: BarChartProps) => {
    const data: ChartData<"bar"> = {
        labels,
        datasets: datasets.map((dataset, index) => ({
            ...dataset,
            backgroundColor:
                colors[index] ?? "#1B4264",
            borderColor:
                colors[index] ?? "#1B4264",
            borderWidth: 1,
            borderRadius: 6,
        })),
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: horizontal ? "y" : "x",
        plugins: {
            legend: {
                display: showLegend,
                position: "top",
            },
            title: {
                display: Boolean(title),
                text: title,
            },
        },
        scales: {
            x: {
                grid: {
                    display: showGrid,
                },
            },
            y: {
                grid: {
                    display: showGrid,
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div
            className={styles.container}
            style={{ height }}
        >
            <Bar
                data={data}
                options={options}
            />
        </div>
    );
};

export default BarChart;