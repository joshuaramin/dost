import styles from "@/styles/components/Grid/grid.module.scss";
import React from "react";

interface GridProps {
    children: React.ReactNode;
    min?: number | string;
    max?: number | string;
    gap?: number | string;
}

interface RowProps {
    children: React.ReactNode;
    min?: number | string;
    max?: number | string;
    gap?: number | string;
}

interface ColumnProps {
    children: React.ReactNode;
    span?: number;
}

const getValue = (value: number | string) =>
    typeof value === "number" ? `${value}px` : value;

const Column: React.FC<ColumnProps> = ({
    children,
    span = 1,
}) => (
    <div
        className={styles.column}
        style={{
            gridColumn: `span ${span}`,
        }}
    >
        {children}
    </div>
);

const Row: React.FC<RowProps> = ({
    children,
    min = 250,
    max = "1fr",
    gap,
}) => (
    <div
        className={styles.row}
        style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(${getValue(min)}, ${getValue(max)}))`,
            gap,
        }}
    >
        {children}
    </div>
);

const Grid = Object.assign(
    ({
        children,
        min = 250,
        max = "1fr",
        gap = 10,
    }: GridProps) => (
        <div
            className={styles.grid}
            style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(${getValue(min)}, ${getValue(max)}))`,
                gap,
            }}
        >
            {children}
        </div>
    ),
    {
        Row,
        Column,
    }
);

export default Grid;