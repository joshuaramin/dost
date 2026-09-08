import React, { ReactNode } from "react"

import styles from "@/styles/lib/ui/no-data.module.scss"

import Text from "@/components/Typography/Text/text"
import Paragraph from "@/components/Typography/Paragraph/paragraph"

interface Props {
    title?: string
    description?: string
    children?: ReactNode
}

export default function EmptyState({
    title = "No data found",
    description,
    children,
}: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.second_layer}>
                <Text size="lg">
                    {title}
                </Text>
                {description && (
                    <Paragraph style={{ textAlign: "center" }}>
                        {description}
                    </Paragraph>
                )}

                {children}
            </div>
        </div>
    )
}