"use client" 

import React from 'react'
import styles from "@/styles/lib/ui/education-resoucre/educational-resources-card.module.scss";
import { useRouter } from 'next/navigation';


//components

import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';
import Paragraph from '@/components/Typography/Paragraph/paragraph';


//libs & hooks


interface Props {
    category: string
    title: string
    slug: string
    excerpt: string
    route: string
}


export default function EducationResourceCard({ category, slug, title, excerpt, route}: Props) {

  const router = useRouter();


  return (
     <div className={styles.education_card}>
            {/* <div className={styles.header}></div> */}
            <div className={styles.body}>
              <div className={styles.tags}>
                <Text size="sm">{category}</Text>
              </div>
              <div className={styles.sub_body}>
                <Title onClick={() => router.push(route)} size="md">{title}</Title>
                <Paragraph >{excerpt}</Paragraph>
              </div>
            </div>
          </div>
  )
}
