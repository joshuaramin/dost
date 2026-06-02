"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permissions-card.module.scss';
import { TbDots, TbEdit, TbExternalLink, TbTrash } from 'react-icons/tb';


// components
import Button from '@/components/Button/button';
import Title from '@/components/Typography/Title/title';
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import Text from '@/components/Typography/Text/text';



interface Props {
    name: string;
    description: string
    slug: string
}

export default function RolesAndPermissionsCard({ name, description, slug }: Props) {


    const router = useRouter();
    const pathname = usePathname()

    const onHandleRoute = () => { 
        router.push(`${pathname}/${slug}`)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_col1}>
                <Title size="md"
                    onClick={() => router.push(`${pathname}/${slug}`)}
                    style={{
                        cursor: "pointer"
                    }}
                    >{name}</Title>
            </div>
            <button>
                <TbDots size={18} />
            </button>
            </div>
        <div className={styles.body}>
            {/* <Text size="sm" style={{
                color: "#7A7A7A",
                whiteSpace: "wrap"
            }}>
                {description}
            </Text> */}
            <Paragraph>
                {description}
            </Paragraph>
        </div>
        <div className={styles.footer}>
            <Button onClick={onHandleRoute} full={false} variant="primary" types="outline" size="md">
                <Text size="md" style={{
                    fontSize: 14
                }}>Go to Settings</Text>
            </Button>
        </div>
        </div>
    )
}
