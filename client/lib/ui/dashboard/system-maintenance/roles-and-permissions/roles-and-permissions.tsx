"use client"

import { useState } from 'react';
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permission.module.scss';
import { SubmitHandler } from 'react-hook-form';
import RolesAndPermissionsCard from './roles-and-permissions-card'

// Components
import Input from '@/components/Input/input';
import Textarea from '@/components/Textarea/textarea';


//lib & hooks
import Template from '@/lib/ui/template';
import useFormHook from '@/lib/hooks/useFormHook';
import SkeletonCard from '@/lib/ui/loading/SkeletonCard';
import useFormQuery from '@/lib/hooks/useQuery';
import useFormMutation from '@/lib/hooks/useMutation';
import { sessionStore } from "@/lib/utils/sessions"
import { RolesAndPermissionResponse } from '@/lib/interface/roles-and-permissions/roles-and-permission';
import { RolesSchema } from '@/lib/validations/role.validation';
import { RolesSchemaFormField } from '@/lib/types/roles-and-permissions';


export default function RolesPermissions() {

    const token = sessionStore.getToken()

     const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
        "Authorization": `Bearer ${token}`
    }
    const [ open, setOpen ] = useState<boolean>(false)

    const onHandleAddNewToggle = () => {
        setOpen(prev => !prev)
    }

    const { data, isLoading } = useFormQuery<RolesAndPermissionResponse>({
        key: ["RolesandPermissions"],
        url: "maintenance/roles",
        headers: {
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
            "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
            "Authorization": `Bearer ${token}`
        },
        
    })

     const { register, errors, handleSubmit } = useFormHook({
        schema: RolesSchema,
        defaultValues: {
            name: "",
            description: ""
        }
    })

    const mutaiton = useFormMutation<RolesSchemaFormField>({
        key: ["RolesAndPermission"],
        method: "POST",
        url: "maintenance/roles",
        headers
    })

    const onHandleSubmition: SubmitHandler<RolesSchemaFormField> = (data) => {
        mutaiton.mutateAsync({
            name: data.name,
            description: data.description
        }, {
            onSuccess: () => {},
            onError: () => {}
        })
    }



    if(isLoading) {
        return (
            <div className={styles.loading}>
                {Array.from({length: 20}).map((node, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>
        )
    }
    return (
        <Template 
            title="Roles and Permissions"
            onModalOpenToggle={open}
            onHandleCloseToggle={onHandleAddNewToggle}
            modal={{
                modalTitle: "Add New Roles", 
                handleSubmit: handleSubmit,
                onHandleSubmit: onHandleSubmition
            }}
            modalChildren={
                <div style={{ display: "flex", flexDirection: "column",  gap: 10}}>
                    <Input isRequired={true}  name={"name"} label="Name" register={register} error={errors.name}/>
                    <Textarea name="description" register={register} isRequired={true} label="Description" error={errors.description}/>
                </div>
            }
        >   
        <div className={styles.container}>
            {data?.data.edges.map((node, index) => (
                <RolesAndPermissionsCard key={index} name={node.node.name} description={node.node.description} slug={node.node.slug} />
            ))}
        </div>
        </Template>
    )
}
