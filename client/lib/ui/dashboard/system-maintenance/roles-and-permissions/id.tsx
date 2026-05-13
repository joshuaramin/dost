"use client"

import React from 'react'
import styles from "@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/id.module.scss";
import { useParams } from 'next/navigation'
import { Metadata } from 'next'

import useFormQuery from '@/lib/hooks/useQuery'
import Template from '@/lib/ui/template'
import { sessionStore } from '@/lib/utils/sessions'
import { RoleIDInterface } from '@/lib/interface/roles-and-permissions/roles-and-permission'
import { ResourceResult } from '@/lib/interface/resource/resource.interface'
import Button from '@/components/Button/button';


export async function generateMetadata(): Promise<Metadata> {
    return { title: "Hello World" }
}

export default function PageID() {

    const token = sessionStore.getToken()
    const params = useParams<{ id: string }>()

    const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
        "Authorization": `Bearer ${token}`
    }

    const { data, isLoading } = useFormQuery<RoleIDInterface>({
        key: ["RolesandPermissions", params.id],
        url: `maintenance/roles/${params.id}`,
        headers: {
            ...headers
        }
    })


    const { data: ResourceData } = useFormQuery<ResourceResult>({
        key: ["Resources"],
        url: "maintenance/resource",
        headers: {
            ...headers
        }
    })

    const actions = ["Create", "Read", "Update", "Delete", "Deny", "Export"]
    return (
        <Template title={params.id.toUpperCase()} >
            <div className={styles.container} >
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Module / Permissions</th>
                            {actions.map((name, index) => (
                                <th key={index}>{name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ResourceData?.data.edges.map((edge, index) => (
                            <React.Fragment key={index}>
                                <tr>
                                    <td colSpan={2}>
                                        <strong>{edge.node.name}</strong>
                                    </td>
                                </tr>
                                {edge.node.children?.map((child) => (
                                    <tr key={child.resource_id}>
                                        <td style={{ paddingLeft: 20 }}>
                                            {child.name}
                                        </td>
                                        {actions.map((node, index) => (
                                            <td key={index}>
                                                <input type="checkbox" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                            </React.Fragment>
                        ))}
                    </tbody>

                </table>
                <div className={styles.btn}>
                    <Button types='filled' size='sm' variant='primary'>Submit</Button>
                </div>
            </div>
        </Template >
    )
}
