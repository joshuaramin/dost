"use client";

import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/sidebar.module.scss";
import Title from "@/components/Typography/Title/title";
import Link from "next/link";
import Profile from "./profile";


//components
import Avatar from "@/components/Avatar/avatar";
import Text from "@/components/Typography/Text/text";


//lib & hooks
import useFormQuery from "@/lib/hooks/useQuery";
import { ResourceResult } from "@/lib/interface/resource/resource.interface";
import { PrimaryFont } from "@/lib/typography";
import TemplateLoading from "./template-loading";
import headers from '@/lib/utils/headers'
import { sessionStore } from "@/lib/utils/sessions";
import { TbChevronDown, TbChevronRight } from "react-icons/tb";

export default function DashboardSidebar() {


    const sessions = sessionStore.get()

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const onHandleDropDown = (id: string) =>{
        setOpenMenus((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

    const { data, isLoading, error } = useFormQuery<ResourceResult>({
        key: ["Resources"],
        url: "maintenance/resource",
        params: {
            limit: 20,
            orderBy: "order",
            sortBy: "asc",
        },
        headers
    })

    const edges = data?.data.edges ?? []
    if (isLoading) {
        return <TemplateLoading />
    }

    return (
        <aside className={styles.container}>
            <div className={styles.header}>
                <Avatar variant="lg" src="/assets/logo.png" />
                <div>
                <Title size="md">ADVOCAID</Title>
                    <Text size="sm">Advocacy Program</Text>
                </div>
            </div>
            <div className={styles.body}>
            {edges
                .filter((edge) => {
                const userPermissions = sessions?.data?.Role?.permission ?? [];

                const childPermissions =
                    edge.node.children?.flatMap((child) => child.permissions ?? []) ?? [];

                return childPermissions.some((permission) =>
                    userPermissions.includes(permission.name as string as never )
                );
                })
                .map((edge) => {
                const userPermissions = sessions?.data?.Role?.permission ?? [];

                const visibleChildren =
                    edge.node.children?.filter((child) =>
                    (child.permissions ?? []).some((permission) =>
                        userPermissions.includes(permission.name as string as never)
                    )
                    ) ?? [];

                if (visibleChildren.length === 0) return null;

            return (
                <div className={styles.card} key={edge.node.resource_id}>
                    <div className={styles.body_header_container}>
                        <h3 className={PrimaryFont.className}>
                            {edge.node.name}
                        </h3>

                        <button
                            type="button"
                            onClick={() => onHandleDropDown(edge.node.resource_id)}
                        >
                            {openMenus[edge.node.resource_id] ? (
                                <TbChevronDown size={18} />
                            ) : (
                                <TbChevronRight size={18} />
                            )}
                        </button>
                    </div>

                    <div className={styles.body_child_container}>
                    {openMenus[edge.node.resource_id] && (
                        <div className={styles.child}>
                            {visibleChildren.map((child) => (
                                <div
                                    className={styles.body_body_container}
                                    key={child.resource_id}
                                >
                                    <Link
                                        href={`/dashboard/${edge.node.slug}/${child.slug}`}
                                    >
                                        {child.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    </div>
                </div>
            );
                })}
            </div>
            <Profile />
        </aside>
    );
}