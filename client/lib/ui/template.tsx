"use client"

import React, { ReactNode } from 'react'
import styles from '@/styles/lib/ui/template.module.scss'
import Title from './title'
import Text from '@/components/Typography/Text/text';

interface Props {
    title: string
    description?: string
    children: ReactNode
}

export default function Template({ title, children, description }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
            <div className={styles.header_col1}>
                <Title title={title} />
                <Text>{description}</Text>
            </div>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    )
}
