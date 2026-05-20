"use client"

import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/organization/organization.module.scss';
import { SubmitHandler } from 'react-hook-form';


// components
import Input from '@/components/Input/input';

//lib && hooks
import OrganizationCard from './organization-card';
import useFormHook from '@/lib/hooks/useFormHook';
import SkeletonCard from '@/lib/ui/loading/SkeletonCard';
import Template from '@/lib/ui/template';
import useFormQuery from '@/lib/hooks/useQuery';
import { sessionStore } from '@/lib/utils/sessions';
import { OrganizationResult } from '@/lib/interface/organization/organization.interface';
import { OrganizationSchema } from '@/lib/validations/organization';
import { OrganizationFormField } from '@/lib/types/organization';
import FileUpload from '@/components/FileUpload/fileUpload';
import useFormMutation from '@/lib/hooks/useMutation';
import { name } from 'next/dist/server/ci-info';
import { toastSuccess } from '@/lib/ui/toast';


export default function Organization() {


    const token = sessionStore.getToken()
    const [open, setOpen ]  = useState<boolean> (false);


    const onHandleAddNew = () => {
        setOpen((prev) => !prev)
    }

    const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
        "Authorization": `Bearer ${token}`
    }

    const { data, isLoading } = useFormQuery<OrganizationResult>({
        key: ["Organizatoin"],
        url: "maintenance/organization",
        headers
    })


    const { register, errors, handleSubmit, control } = useFormHook({
        schema: OrganizationSchema,
        defaultValues: {
            logo: File as unknown as never,
            name: "",
            address: "",
            contact: ""
        }
    })


    const mutation = useFormMutation({
        key: ["Organization"],
        method: "POST",
        url: "maintenance/organization",
        headers,
        isMultipart: true
    })

    const onHandleSubmit: SubmitHandler<OrganizationFormField> = (data) => {
        mutation.mutate({
            logo: data.logo,
            name: data.name,
            contact: data.contact,
            address: data.address
        }, {
            onSuccess: () => {
                toastSuccess({
                    title: "",
                    body: ""
                })
            },
            onError: () => {}
        })
    }

    if(isLoading) {
        return (
        <div className={styles.loading}>
            {Array.from({length: 20}).map((node, index) => (
                <SkeletonCard  key={index}/>
            ))}
        </div>
        )
    }

    return (
        <Template
            title="Organizations"
            modal={{
                modalTitle: "Add new Organization",
                handleSubmit,
                onHandleSubmit
            }}
            modalChildren={
                <div style={{display: "flex", gap: 10, flexDirection: "column"}}>
                    <FileUpload control={control} name={"logo"} multiple={false} />
                    <Input register={register} name={"name"} error={errors.name} label="Name" />
                    <Input register={register} name={"address"} error={errors.address} label="Address" />
                    <Input register={register} name={"contact"} error={errors.contact} label="Tel/Phone number" />
                </div>
            }
            onHandleCloseToggle={onHandleAddNew}
            onModalOpenToggle={open}

        >
            <div className={styles.container}>
                <div className={styles.grid}>
                    {data?.data.edges.map((node, index) => (
                        <OrganizationCard key={index}
                            address={node.node.address} contact={node.node.contact} logo={node.node.logo} name={node.node.name}
                        />
                    ))}
                </div>
            </div>
        </Template>
    )
}
