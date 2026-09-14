"use client"

import React from "react"
import { useRouter } from "next/navigation"

import styles from "@/styles/lib/ui/dashboard/enagagement/survey-card.module.scss"

import Title from "@/components/Typography/Title/title"
import Text from "@/components/Typography/Text/text"
import Paragraph from "@/components/Typography/Paragraph/paragraph"

interface Props {
    title: string
    description: string
    total: number
    slug: string
}

export default function SurveyCard({
    title,
    description,
    slug,
    total,
}: Props) {
    const router = useRouter()

    const handleNavigate = () => {
        router.push(`/survey/${slug}`)
    }

    return (
        <article className={styles.container}>
            <div className={styles.container_header}>
                <Title
                    size="md"
                    onClick={handleNavigate}
                >
                    {title}
                </Title>
            </div>

            <div className={styles.container_body}>
                <Paragraph>
                    {description}
                </Paragraph>
            </div>

            <div className={styles.container_footer}>
                <Text size="md">
                    Questions: {total}
                </Text>
            </div>
        </article>
    )
}