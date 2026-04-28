import React, { ReactNode } from 'react'
import styles from '@/styles/lib/ui/template.module.scss'
import Title from './title'

interface Props {
    title: string
    description?: string
    children: ReactNode
}

export default function Template({ title, children }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title title={title} />
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    )
}
