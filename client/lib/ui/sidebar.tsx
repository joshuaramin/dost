"use client";

import React from "react";
import Image from "next/image";
import styles from "@/styles/lib/ui/sidebar.module.scss";
import Title from "./title";
import useFormQuery from "../hooks/useQuery";
import { PrimaryFont } from "../typography";
import { ResourceResult } from "@/lib/interface/resource/resource.interface";
import Link from "next/link";
import Profile from "./dashboard/profile";
import Avatar from "@/components/avatar";

export default function Sidebar() {

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
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <aside className={styles.container}>
            <div className={styles.header}>
                <Avatar variant="large" src="/assets/logo.png" />
                <div>
                    <Title title="ADOVAID" />
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