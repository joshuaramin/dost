"use client"

import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permission.module.scss';
import RolesAndPermissionsCard from './roles-and-permissions-card'

// Components



//lib & hooks
import SkeletonCard from '@/lib/ui/loading/SkeletonCard';
import useFormQuery from '@/lib/hooks/useQuery';
import { sessionStore } from "@/lib/utils/sessions"
import { RolesAndPermissionResponse } from '@/lib/interface/roles-and-permissions/roles-and-permission';


export default function RolesPermissions() {

    const token = sessionStore.getToken()

    const { data, isLoading } = useFormQuery<RolesAndPermissionResponse>({
        key: ["RolesandPermissions"],
        url: "maintenance/roles",
        headers: {
            "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
            "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
            "Authorization": `Bearer ${token}`
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
        <div className={styles.container}>
            {data?.data.edges.map((node, index) => (
                <RolesAndPermissionsCard key={index} name={node.node.name} description={node.node.description} slug={node.node.slug} />
            ))}
        </div>
    )
}
