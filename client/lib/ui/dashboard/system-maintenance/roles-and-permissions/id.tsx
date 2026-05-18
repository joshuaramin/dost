"use client"

import React, { useEffect, useState } from 'react'
import styles from "@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/id.module.scss";
import { useParams } from 'next/navigation'

// components
import Button from '@/components/Button/button'

// lib & hooks
import useFormQuery from '@/lib/hooks/useQuery'
import Template from '@/lib/ui/template'
import { sessionStore } from '@/lib/utils/sessions'
import { RoleIDInterface } from '@/lib/interface/roles-and-permissions/roles-and-permission'
import { ResourceResult } from '@/lib/interface/resource/resource.interface'
import useFormHook from '@/lib/hooks/useFormHook'
import { AddRolePermissionsSchema } from '@/lib/validations/role.validation'
import useFormMutation from '@/lib/hooks/useMutation'
import { SubmitHandler } from 'react-hook-form'
import { RolesAndPermissionsFormField } from '@/lib/types/roles-and-permissions'
import Form from '@/components/Form/form'
import { toastError, toastSuccess } from '@/lib/ui/toast'

export default function PageID() {

    const token = sessionStore.getToken()
    const params = useParams<{ id: string }>()

    const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
        "Authorization": `Bearer ${token}`
    }

    const [ open, setOpen ] = useState<boolean>(false);

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

    const {
        handleSubmit,
        setValue,
        watch,
        errors
    } = useFormHook({
        schema: AddRolePermissionsSchema,
        defaultValues: {
            permissions: []
        }
    })

    const permissions = watch("permissions") || []

    // initialize from API
    useEffect(() => {
        const rolePermissions = data?.data?.rolePermissions
        if (!rolePermissions) return

        const initial = rolePermissions.map((p) => p.permission_id)

        setValue("permissions", initial)
    }, [data?.data?.rolePermissions, setValue])

    // toggle logic (single source of truth: RHF)
    const togglePermission = (id: string) => {
        const current = watch("permissions") || []

        const updated = current.includes(id)
            ? current.filter((k) => k !== id)
            : [...current, id]

        setValue("permissions", updated, {
            shouldDirty: true,
            shouldValidate: true
        })
    }

    const mutation = useFormMutation({
        key: ["CreateUpdatePermission", params.id],
        method: "PUT",
        url: `maintenance/roles/addRolePermission/${params.id}`,
        headers
    })

    const onHandleSubmitHandler: SubmitHandler<RolesAndPermissionsFormField> = async (data) => {
        return await mutation.mutateAsync(
            {
                permissions: data.permissions
            },
            {
                onSuccess: () => {
                    toastSuccess({
                        title: "Success",
                        body: "Role permissions updated successfully."
                    })
                },
                onError: (error) => {
                    toastError({
                        title: "Error",
                        body: error.message
                    })
                }
            }
        )
    }

    const actions = ["Create", "Read", "Update", "Delete", "Deny", "Export"]

    const onHandleAddNew = () => {
        setOpen((prev) => !prev)
    }

    return (
        <Template
            title={data?.data.name ?? ""}
            description={data?.data.description ?? ""}
        >
            <div className={styles.container}>

                <Form onSubmit={handleSubmit(onHandleSubmitHandler)}>

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

                                            {child.permissions.map(({ permission_id, name }) => {
                                                const isChecked =
                                                    permissions.includes(permission_id)

                                                return (
                                                    <td key={name}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() =>
                                                                togglePermission(permission_id)
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
                        <Button
                            type="submit"
                            types="filled"
                            size="sm"
                            variant="primary"
                        >
                            Submit
                        </Button>
                    </div>

                </Form>

            </div>
        </Template>
    )
}