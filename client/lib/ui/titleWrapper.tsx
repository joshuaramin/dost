import React from 'react'
import styles from '@/styles/lib/ui/titleWrapper.module.scss';
import { PrimaryFont } from '../typography';

interface TitleWrapperProps {
    title: string;

}

export default function TitleWrapper({ title }: TitleWrapperProps) {
    return (
        <div className={styles.container}>
            <hr />
            <h1 className={PrimaryFont.className}>{title}</h1>
        </div>
    )
}
