"use client";

import React from "react";
import Image from "next/image";
import styles from "@/styles/lib/ui/dashboard/sidebar.module.scss";
import Title from "../title";
import Link from "next/link";
import Profile from "./profile";


//components
import Avatar from "@/components/Avatar/avatar";


//lib & hooks
import { PrimaryFont } from "@/lib/typography";
import useFormQuery from "@/lib/hooks/useQuery";
import { ResourceResult } from "@/lib/interface/resource/resource.interface";
import SkeletonSidebar from "../loading/SkeletonSidebar";

export default function DashboardSidebar() {

    const { data, isLoading, error } = useFormQuery<ResourceResult>({
        key: ["Resources"],
        url: "maintenance/resource",
        params: {
            limit: 20,
            orderBy: "order",
            sortBy: "asc",
        },
    })

    const edges = data?.data.edges ?? []
    if (isLoading) {
        return <aside className={styles.container}>
            <SkeletonSidebar />
        </aside>
    }

    return (
        <aside className={styles.container}>
            <div className={styles.header}>
                <Avatar variant="lg" src="/assets/logo.png" />
                <div>
                    <Title title="ADVOCAID" />
                    <span>Advocacy Program</span>
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