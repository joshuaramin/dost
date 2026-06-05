"use client"

import Avatar from '@/components/Avatar/avatar'
import { useRouter } from 'next/navigation'
import React from 'react'
import { TbSettings, TbBell } from 'react-icons/tb'

import styles from "@/styles/lib/ui/profile.module.scss";
import { sessionStore } from '@/lib/utils/sessions';
import Title from '@/components/Typography/Title/title';
import Text from '@/components/Typography/Text/text';

export default function Profile() {

    const router = useRouter()


    const token = sessionStore.get();

    return (
        <div className={styles.footer}>
            <div className={styles.col1}>
                <Avatar variant="md" />
                <div className={styles.header}>
                    <Title size="sm" style={{ color: "#fff"}}>
                        {token?.data.Profile.first_name} {token?.data.Profile.last_name}
                    </Title>
                    <Text size="sm">{token?.data.Role.name}</Text>
                </div>
            </div>
            <div className={styles.col2}>
                <button onClick={() => router.push('/dashboard/settings')}>
                    <TbSettings size={28} />
                </button>
                <button>
                    <TbBell size={28} />
                </button>
            </div>
        </div>
    )
}
