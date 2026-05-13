"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permissions-card.module.scss';
import { TbEdit, TbExternalLink, TbTrash } from 'react-icons/tb';


//components

//lib & hooks
import Title from '@/lib/ui/title';
import Button from '@/components/Button/button';
import Text from '@/components/Typography/Text/text';



interface Props {
    name: string;
    description: string
    slug: string
}

export default function RolesAndPermissionsCard({ name, description, slug }: Props) {


    const router = useRouter();
    const pathname = usePathname()

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title

                    onClick={() => router.push(`${pathname}/${slug}`)}
                    style={{
                        cursor: "pointer"
                    }}
                    title={name}></Title>
                <TbExternalLink size={16} />
            </div>
            <Text>
                {description.slice(0, 120)}...
            </Text>
            <div className={styles.footer}>
                <Button types='outline' variant='danger' size='md'>
                    <TbTrash size={20} />
                </Button>
                <Button types='outline' variant='primary' size='md'>
                    <TbEdit size={20} />
                </Button>
            </div>
        </div>
    )
}
