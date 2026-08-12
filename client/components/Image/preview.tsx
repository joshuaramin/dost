import React from "react";
import Image from "next/image";
import styles from "@/styles/components/Image/preview.module.scss";

interface Props {
    src: string;
    height?: number;
    width?: number;
    fill?: boolean;
    alt: string;
}

export default function Preview({
    src,
    height,
    width,
    fill = false,
    alt,
}: Props) {
    return (
        <div className={styles.container}>
            <Image
                src={src}
                alt={alt}
                fill={fill}
                height={!fill ? height : undefined}
                width={!fill ? width : undefined}
            />
        </div>
    );
}