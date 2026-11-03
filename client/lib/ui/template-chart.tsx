import styles from "@/styles/components/Charts/chart.module.scss";
import { ReactNode } from "react";

interface DashboardChartsProps {
    title?: string;
    description?: string;
    children: ReactNode;
}

export default function DashboardCharts({
    title,
    description,
    children,
}: DashboardChartsProps) {
    return (
        <div className={styles.chartGrid}>
            <div className={`${styles.chartCard} ${styles.chartCardFull}`}>
                {(title || description) && (
                    <div className={styles.chartHeader}>
                        {title && (
                            <h3 className={styles.chartTitle}>
                                {title}
                            </h3>
                        )}

                        {description && (
                            <p className={styles.chartDescription}>
                                {description}
                            </p>
                        )}
                    </div>
                )}

                <div className={styles.chartContent}>
                    {children}
                </div>
            </div>
        </div>
    );
}