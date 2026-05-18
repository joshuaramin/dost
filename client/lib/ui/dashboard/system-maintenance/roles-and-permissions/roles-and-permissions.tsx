"use client"

import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permission.module.scss';
import RolesAndPermissionsCard from './roles-and-permissions-card'

// Components



//lib & hooks
import SkeletonCard from '@/lib/ui/loading/SkeletonCard';
import useFormQuery from '@/lib/hooks/useQuery';
import { sessionStore } from "@/lib/utils/sessions"
import { RolesAndPermissionResponse } from '@/lib/interface/roles-and-permissions/roles-and-permission';
import Template from '@/lib/ui/template';
import { useState } from 'react';
import Input from '@/components/Input/input';
import Textarea from '@/components/Textarea/textarea';
import useFormHook from '@/lib/hooks/useFormHook';
import { RolesSchema } from '@/lib/validations/role.validation';


export default function RolesPermissions() {

    const token = sessionStore.getToken()

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
        }
    })

     const { register, errors } = useFormHook({
        schema: RolesSchema,
        defaultValues: {
            name: "",
            description: ""
        }
    })


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
                modalTitle: "Add New Permissions",
            }}
            modalChildren={
                <div style={{ display: "flex", flexDirection: "column",  gap: 10}}>
                    <Input  name={"name"} label="Name" register={register} />
                    <Textarea  isRequired={true} label="Description" />
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
