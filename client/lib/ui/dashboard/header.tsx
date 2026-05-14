import React from 'react'
import { TbMenu2 } from 'react-icons/tb'

//components
import Title from '@/components/Typography/Title/title';
import Text from '@/components/Typography/Text/text';
import Avatar from '@/components/Avatar/avatar'

//lib & hooks
import styles from '@/styles/lib/ui/dashboard/header.module.scss'

export default function DashboardHeader() {
    return (
        <div className={styles.container}>
            <div className={styles.col1}>
               <Avatar src="/assets/logo.png" variant="lg" />
                <div>
                    <Title size="md">HIV GEOSPATIAL SURVIELLANCE</Title>
                    <Text>Advocacy Program</Text>
                </div>
            </div>
            <div className={styles.col2}>
              
                <button>
                    <TbMenu2 size={32} />
                </button>
            </div>
        </div>
    )
}
