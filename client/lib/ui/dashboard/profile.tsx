"use client"

import Avatar from '@/components/avatar'
import { useRouter } from 'next/navigation'
import React from 'react'
import { TbSettings, TbBell } from 'react-icons/tb'

import styles from "@/styles/lib/ui/profile.module.scss";

export default function Profile() {

    const router = useRouter()
    return (
        <div className={styles.footer}>
            <div className={styles.col1}>
                <Avatar variant="medium" />
                <div>
                    <h2>John Doe</h2>
                    <span>Developer</span>
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
