import React from 'react'
import styles from '@/styles/lib/ui/dashboard/header.module.scss'
import Avatar from '@/components/Avatar/avatar'
import { TbMenu2 } from 'react-icons/tb'

export default function DashboardHeader() {
    return (
        <div className={styles.container}>
            <div></div>
            <div className={styles.col2}>
                <Avatar variant='md' />
                <button>
                    <TbMenu2 size={28} />
                </button>
            </div>
        </div>
    )
}
