"use client"

import React, { useEffect, useState } from 'react'
import styles from "@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/id.module.scss";
import { useParams } from 'next/navigation'

import useFormQuery from '@/lib/hooks/useQuery'
import Template from '@/lib/ui/template'
import { sessionStore } from '@/lib/utils/sessions'
import { RoleIDInterface } from '@/lib/interface/roles-and-permissions/roles-and-permission'
import { ResourceResult } from '@/lib/interface/resource/resource.interface'
import Button from '@/components/Button/button';

export default function PageID() {

    const token = sessionStore.getToken()
    const params = useParams<{ id: string }>()

    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
        "Authorization": `Bearer ${token}`
    }

    const { data } = useFormQuery<RoleIDInterface>({
        key: ["RolesandPermissions", params.id],
        enabled: !!params.id,
        url: `maintenance/roles/${params.id}`,
        headers
    })

    const { data: ResourceData } = useFormQuery<ResourceResult>({
        key: ["Resources"],
        url: "maintenance/resource",
        headers
    })

    useEffect(() => {
        const permissions = data?.data?.rolePermissions

        if (!permissions) return

        setSelectedKeys(
            permissions.map((p) => p.permission_id)
        )
    }, [data?.data?.rolePermissions])

    const togglePermission = (id: string) => {
        setSelectedKeys((prev) =>
            prev.includes(id)
                ? prev.filter((k) => k !== id)
                : [...prev, id]
        )
    }

    const actions = ["Create", "Read", "Update", "Delete", "Deny", "Export"]

    return (
        <Template
            title={data?.data.name ?? ""}
            description={data?.data.description ?? ""}
        >
            <div className={styles.container}>
                <table style={{ width: "100%" }}>
                    <thead>
                        <tr>
                            <th>Module / Permissions</th>

                            {actions.map((name) => (
                                <th key={name}>{name}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {ResourceData?.data.edges.map((edge) => (
                            <React.Fragment key={edge.node.resource_id}>

                                <tr>
                                    <th colSpan={actions.length + 1}>
                                        <strong>{edge.node.name}</strong>
                                    </th>
                                </tr>

                                {edge.node.children?.map((child) => (
                                    <tr
                                        className={styles.body_tr}
                                        key={child.resource_id}
                                    >
                                        <th
                                            className={styles.body_th}
                                            style={{ paddingLeft: 20 }}
                                        >
                                            {child.name}
                                        </th>

                                        {actions.map((action) => {
                                            const permission = child.permissions.find(
                                                (p) =>
                                                    p.name.toLowerCase() === action.toLowerCase()
                                            )

                                            const isChecked = permission
                                                ? selectedKeys.includes(permission.permission_id)
                                                : false

                                            return (
                                                <td key={action}>
                                                    <input
                                                        type="checkbox"
                                                        disabled={!permission}
                                                        checked={isChecked}
                                                        onChange={() =>
                                                            permission &&
                                                            togglePermission(permission.permission_id)
                                                        }
                                                    />
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}

                            </React.Fragment>
                        ))}
                    </tbody>
                </table>

                <div className={styles.btn}>
                    <Button types="filled" size="sm" variant="primary">
                        Submit
                    </Button>
                </div>
            </div>
        </Template>
    )
}