"use client";

import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/user-management/user-management-id.module.scss";

//lib & hoks
import useFormQuery from "@/lib/hooks/useQuery";
import Template from "@/lib/ui/template";
import headers from "@/lib/utils/headers";

// components
import Text from "@/components/Typography/Text/text";
import Title from "@/components/Typography/Title/title";
import Avatar from "@/components/Avatar/avatar";

import { UserByIdInterface } from "@/lib/interface/user/user.interface";

interface Props {
    id: string;
}

type UserTab =
    | "Activity Logs"
    | "Device Sessions";

export default function UserManagementID({
    id,
}: Props) {
    const [activeTab, setActiveTab] =
        useState<UserTab>("Activity Logs");

    const {
        data: UserData,
        isLoading,
    } = useFormQuery<UserByIdInterface>({
        key: ["GetSpecificUser", id],
        url: `maintenance/users/${id}`,
        headers,
    });

    const user = UserData?.data;

    if (isLoading) {
        return (
            <Template
                title="User Management"
                description=""
            >
                <div className={styles.container}>
                    <div className={styles.body}>
                        <Text size="sm">
                            Loading user information...
                        </Text>
                    </div>
                </div>
            </Template>
        );
    }

    if (!user) {
        return (
            <Template
                title="User Management"
                description=""
            >
                <div className={styles.container}>
                    <div className={styles.body}>
                        <Text size="sm">
                            User not found.
                        </Text>
                    </div>
                </div>
            </Template>
        );
    }

    const firstName =
        user.Profile?.first_name ?? "";

    const lastName =
        user.Profile?.last_name ?? "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    const roleName =
        user.role?.name ?? "No role assigned";

    const tabs: UserTab[] = [
        "Activity Logs",
        "Device Sessions",
    ];

    return (
        <Template
            title="User Management"
            description=""
        >
            <div className={styles.container}>
                <div className={styles.header}>
                    <Avatar variant="xxl" />

                    <div className={styles.sub_header}>
                        <Title size="lg">
                            {fullName || "Unnamed User"}
                        </Title>

                        <Text size="md">
                            {roleName}
                        </Text>
                    </div>

                    <div
                        className={`${styles.status} ${
                            user.is_active
                                ? styles.active
                                : styles.inactive
                        }`}
                    >
                        <span className={styles.statusIndicator} />
                        {user.is_active}
                        <Text size="sm">
                            {user.is_active ? "Active" : "Inactive"}
                        </Text>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.body_header}>
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={
                                    activeTab === tab
                                        ? styles.active
                                        : ""
                                }
                                onClick={() =>
                                    setActiveTab(tab)
                                }
                            >
                                <Text size="sm">
                                    {tab}
                                </Text>
                            </button>
                        ))}
                    </div>

                    <div
                        className={
                            styles.body_content
                        }
                    >
                        {activeTab ===
                            "Activity Logs" && (
                            <div>
                                 {JSON.stringify(user.ActivityLog, null, 2)}
                            </div>
                        )}

                        {activeTab ===
                            "Device Sessions" && (
                            <Text size="sm">
                                Device sessions will
                                appear here.
                            </Text>
                        )}
                    </div>
                </div>
            </div>
        </Template>
    );
}