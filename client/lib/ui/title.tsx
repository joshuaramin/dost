import React from 'react'
import styles from "@/styles/lib/ui/title.module.scss"

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    title: string;
}

export default function Title({ title, ...props }: Props) {
    return (
        <h1
            className={styles.title}
            {...props}
        >{title}</h1>
    )
}
