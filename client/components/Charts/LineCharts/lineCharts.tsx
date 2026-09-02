"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    type ChartOptions,
    type ChartData,
} from "chart.js";

import { Line } from "react-chartjs-2";

import styles from "@/styles/components/Charts/LineChart.module.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    labels: string[];
    datasets: ChartData<"line">["datasets"];
    title?: string;
    height?: number;
    showLegend?: boolean;
    showGrid?: boolean;
    fill?: boolean;
    tension?: number;
    colors?: string[];
}

const LineChart = ({
    labels,
    datasets,
    title,
    height = 350,
    showLegend = true,
    showGrid = true,
    fill = false,
    tension = 0.3,
    colors = [],
}: LineChartProps) => {
    const data: ChartData<"line"> = {
        labels,
        datasets: datasets.map((dataset, index) => {
            const color =
                colors[index] ?? "#1B4264";

            return {
                ...dataset,
                fill,
                tension,
                borderColor: color,
                backgroundColor: fill
                    ? `${color}33`
                    : color,
                pointBackgroundColor: color,
                pointBorderColor: color,
                pointHoverBackgroundColor: color,
                pointHoverBorderColor: color,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            };
        }),
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        plugins: {
            legend: {
                display: showLegend,
                position: "top",
            },
            title: {
                display: Boolean(title),
                text: title,
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: showGrid,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: showGrid,
                },
            },
        },
    };

    return (
        <div
            className={styles.container}
            style={{ height }}
        >
            <Line
                data={data}
                options={options}
            />
        </div>
    );
};

export default LineChart;