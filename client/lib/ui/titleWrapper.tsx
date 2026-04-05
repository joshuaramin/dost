import React from 'react'
import styles from '@/styles/lib/ui/titleWrapper.module.scss';

interface TitleWrapperProps {
    title: string;

}

export default function TitleWrapper({ title }: TitleWrapperProps) {
    return (
        <div className={styles.container}>
            <hr />
            <h1>{title}</h1>
        </div>
    )
}
