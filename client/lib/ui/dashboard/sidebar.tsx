"use client";

import React from "react";
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

export default function DashboardSidebar() {

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
                {edges.map((edge, index) => (
                    <div className={styles.card} key={index}>
                        <div className={styles.body_header_container}>
                            <h3 className={PrimaryFont.className}>
                                {edge.node.name}
                            </h3>
                        </div>
                        {edge.node.children?.map((child) => (
                            <div className={styles.body_body_container} key={child.resource_id}>
                                <Link href={`/dashboard/${edge.node.slug}/${child.slug}`}>
                                    {child.name}
                                </Link>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Profile />
        </aside>
    );
}