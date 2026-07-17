import React, { ReactNode } from 'react'
import styles from '@/styles/lib/ui/dashboard/template-survey.module.scss'
import Title from '@/components/Typography/Title/title';
import Button from '@/components/Button/button';

interface Props {
    children: ReactNode
    title: string
}

export default function TemplateSurvey({ children, title }: Props) {
  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <Title size="md">{title}</Title>
            <Button
                types="filled"
                size="md"
                variant="primary"
            >Publish</Button>
        </div>
        <div className={styles.body}>
            {children}
        </div>
    </div>
  )
}
