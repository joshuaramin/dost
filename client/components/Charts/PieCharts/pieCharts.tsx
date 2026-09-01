"use client";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
    type ChartOptions,
    type ChartData,
} from "chart.js";

import { Pie } from "react-chartjs-2";

import styles from "@/styles/components/Charts/PieChart.module.scss";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    Title
);

interface PieChartProps {
    labels: string[];
    data: number[];
    title?: string;
    height?: number;
    showLegend?: boolean;
    colors?: string[];
}

const PieChart = ({
    labels,
    data: values,
    title,
    height = 350,
    showLegend = true,
    colors = [],
}: PieChartProps) => {
    const segmentColors = labels.map(
        (_, index) =>
            colors[index] ?? "#1B4264"
    );

    const data: ChartData<"pie"> = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: segmentColors,
                borderColor: "#FFFFFF",
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    };

    const options: ChartOptions<"pie"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: showLegend,
                position: "right",
            },
            title: {
                display: Boolean(title),
                text: title,
            },
        },
    };

    return (
        <div
            className={styles.container}
            style={{ height }}
        >
            <Pie
                data={data}
                options={options}
            />
        </div>
    );
};

export default PieChart;