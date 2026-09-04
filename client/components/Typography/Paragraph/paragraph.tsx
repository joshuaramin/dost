import React from 'react'
import styles from '@/styles/components/Typography/paragraph.module.scss'

interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
    children: React.ReactNode
    
}

export default function Paragraph({children, ...props}: Props) {
    return (
        <p  {...props} className={styles.container}>{children}</p>
    )
}
