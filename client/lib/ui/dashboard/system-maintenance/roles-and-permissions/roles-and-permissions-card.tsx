"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permissions-card.module.scss';
import { TbDots, TbEdit, TbExternalLink, TbTrash } from 'react-icons/tb';


//components
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
                <TbExternalLink size={16} />
               </div>
               <button>
                <TbDots size={18} />
               </button>
            </div>
            <Text size="sm" style={{
                color: "#7A7A7A",
                whiteSpace: "wrap"
            }}>
                {/* {description.length < 80 ? description : `${description.slice(0, 60)}...`} */}
                {description}
            </Text>
            {/* <div className={styles.footer}>
                <Button types='outline' variant='danger' size='md'>
                    <TbTrash size={20} />
                </Button>
                <Button types='outline' variant='primary' size='md'>
                    <TbEdit size={20} />
                </Button>
            </div> */}
        </div>
    )
}
