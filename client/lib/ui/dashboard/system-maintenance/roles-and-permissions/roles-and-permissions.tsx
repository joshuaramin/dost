"use client"

import React from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permission.module.scss';
import RolesAndPermissionsCard from './roles-and-permissions-card'
import useFormQuery from '@/lib/hooks/useQuery';

export default function RolesPermissions() {


    const { data } = useFormQuery({
        key: ["RolesandPermissions"],
        url: "maintenance/roles",
        headers: {
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
            "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
            "Authorization": `Bearer ${process.env.AUTHORIZATION as string}`
        }
    })
    console.log(data)
    return (
        <div className={styles.container}>
            {data ? "WORKING" : "NOT WORKING"}
            {JSON.stringify(data, null, 2)}
            {/* {data.data.edges.map((node, index) => (
                <RolesAndPermissionsCard key={index} name='Administration' description='adsadass' slug='administration' />
            ))} */}
        </div>
    )
}
