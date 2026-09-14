import React from 'react'


import styles from "@/styles/lib/ui/dashboard/settings/settings.module.scss"
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import Title from '@/components/Typography/Title/title'

import EmptyState from '../../../no-data';

export default function AuditLog() {
    return (
        <div className={styles.tab_content}>
            <div className={styles.section_header}>
                <Title size="md">Audit Logs</Title>
                <Paragraph>Review system activities and user actions recorded within Advocaid PH.</Paragraph>
            </div>
            <EmptyState 
                title="No audit logs found"
                description="There are currently no audit logs available to display."
            />

        </div>
    )
}
