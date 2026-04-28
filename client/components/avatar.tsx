import React from 'react'
import styles from '@/styles/components/Avatar/avatar.module.scss'
import Image from 'next/image'


type Variant = "small" | "medium" | "large"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    variant: Variant
    src?: string
    alt?: string
}

export default function Avatar({
    variant = "medium",
    src,
    alt = "avatar",
    ...rest
}: Props) {
    return (
        <div
            className={`${styles.container} ${styles[variant]}`}
            {...rest}
        >
            {src ? <Image src={src} alt={alt} layout='fill' /> : <Image layout='fill' src={"/assets/default.jpg"} alt={alt} />}
        </div>
    );
}