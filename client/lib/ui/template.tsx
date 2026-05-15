/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import React, { ReactNode, useEffect, useState } from 'react'
import styles from '@/styles/lib/ui/template.module.scss'
import Title from './title'
import Text from '@/components/Typography/Text/text';
import Button from '@/components/Button/button';
import { hasAnyPermission } from '../utils/hasAnyPermission';
import { usePathname } from 'next/navigation';

interface Props {
    title: string
    description?: string
    children: ReactNode
}

export default function Template({ title, children, description }: Props) {


    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    const pathname = usePathname();

    if(!mounted) return null;
  
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_col1}>
                    <Title title={title} />
                    <Text>{description}</Text>
                </div>
                {mounted && hasAnyPermission([
                    "system-maintenance:create",
                    "user-management:create",
                    "roles-and-permissions:create",
                    "organization:create"
                ],   
                pathname,
                    [
                        "/dashboard/products",
                        "/dashboard/booking",
                        "/dashboard/system-maintenance/user-management",
                        "/dashboard/system-maintenance/roles-and-permissions",
                        "/dashboard/system-maintenance/organization",
                    ]) && 
                (
                    <div className={styles.header_col2}>
                        <Button size="md" variant="primary">
                            <Text>Add New</Text>
                        </Button>
                    </div>
                )}
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    )
}
