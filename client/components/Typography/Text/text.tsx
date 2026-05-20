import React, { ReactNode } from 'react'
import styles from '@/styles/components/Typography/text.module.scss'
import cn from '@/lib/utils/cn';
import { SecondaryFont } from '@/lib/typography';


type Size = "sm" | "md" | "lg"

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    children: ReactNode
    size: Size
}

export default function Text({
    children, size,
    ...props
}: Props) {

    const sizeClass = [styles.container, styles[size]].join(" ")
    return (
        <span className={cn(sizeClass)} {...props}>{children}</span>
    )
}
