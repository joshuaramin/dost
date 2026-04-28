import React, { ReactNode } from 'react'
import styles from '@/styles/layout/dashboard.module.scss';
import Sidebar from '@/lib/ui/sidebar';
interface Props {
    children: ReactNode
}

export default function RootLayout({ children }: Props) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.children}>
                {children}
            </div>
        </div>
    )
}
