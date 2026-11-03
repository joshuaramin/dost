import React, { ReactNode } from 'react'
import styles from '@/styles/layout/dashboard.module.scss';
import DashboardSidebar from '@/lib/ui/dashboard/sidebar';
import DashboardHeader from '@/lib/ui/dashboard/header';
interface Props {
    children: ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <div className={styles.container}>
            <DashboardSidebar />
            <div className={styles.children}>
                <DashboardHeader />
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}
