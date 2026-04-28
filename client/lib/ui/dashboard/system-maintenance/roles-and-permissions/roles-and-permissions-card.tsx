"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permissions-card.module.scss';
import { TbArrowRight } from 'react-icons/tb';
import Title from '@/lib/ui/title';



interface Props {
    name: string;
    description: string
    slug: string
}

export default function RolesAndPermissionsCard({ name, description, slug }: Props) {


    const router = useRouter();;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title title={name}></Title>
            </div>
            <div className={styles.body}>
                <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus, voluptatum.
                </p>
            </div>
            <div className={styles.footer}>
                <button onClick={() => router.push(`/dashboard/system-maintenance/roles-and-permissions/${slug}`)}>
                    <TbArrowRight size={23} />
                </button>
            </div>
        </div>
    )
}
