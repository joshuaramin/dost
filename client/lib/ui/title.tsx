import React from 'react'
import styles from "@/styles/lib/ui/title.module.scss"
import cn from '../utils/cn';
import { PrimaryFont } from '../typography';

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
    title: string;
}

export default function Title({ title, ...props }: Props) {
    return (
        <h1
            className={cn(styles.title, PrimaryFont.className)}
            {...props}
        >{title}</h1>
    )
}
