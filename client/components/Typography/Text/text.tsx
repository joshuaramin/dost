import React, { ReactNode } from 'react'
import styles from '@/styles/components/Typography/text.module.scss'

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children: ReactNode
}

export default function Text({
    children,
    ...props
}: Props) {
    return (
        <span className={styles.container} {...props}>{children}</span>
    )
}
