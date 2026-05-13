"use client"

import React from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/organization/organization.module.scss';
import OrganizationCard from './organization-card';
import useFormQuery from '@/lib/hooks/useQuery';
import { sessionStore } from '@/lib/utils/sessions';


export default function Organization() {


    const token = sessionStore.getToken()
    const { data } = useFormQuery({
        key: ["Organizatoin"],
        url: "maintenance/organization",
        headers: {
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
            "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
            "Authorization": `Bearer ${token}`
        }
    })

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {data?.data.edges.map((node, index) => (
                    <OrganizationCard key={index}
                        address={node.node.address} contact={node.node.contact} logo={node.node.logo} name={node.node.name}
                    />
                ))}

            </div>
        </div>
    )
}
