"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/user-management/user-management-id.module.scss";

import useFormQuery from "@/lib/hooks/useQuery";
import Template from "@/lib/ui/template";
import headers from "@/lib/utils/headers";

import Text from "@/components/Typography/Text/text";
import Title from "@/components/Typography/Title/title";
import Avatar from "@/components/Avatar/avatar";

import { UserByIdInterface } from "@/lib/interface/user/user.interface";
import Tabs from "@/components/Tabs/tab";
import { DeviceSessionsResult } from "@/lib/interface/deviceSessions/device-sessions.interface";
import { sessionStore } from "@/lib/utils/sessions";
import Pagination from "@/components/Pagination/pagination";
import DeviceSessionCard from "@/lib/ui/cards/device-session-card";
import { ActivityLogsInterfaceResult } from "@/lib/interface/activitiy-logs/activity-log.interface";
import ActivityLogCard from "@/lib/ui/cards/activity-log-card";

interface Props {
    id: string;
}

const tabs = [
    "Activity Logs",
    "Device Sessions",
];

type UserTabs = (typeof tabs)[number];

export default function UserManagementID({
    id,
}: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();


    const sessions = sessionStore.get();

    const activeTabParam = searchParams.get("activeTab");

    const [activeTab, setActiveTab] = useState<string>(
        tabs.includes(activeTabParam as UserTabs)
            ? activeTabParam as UserTabs
            : "Activity Logs"
    );

    
    const handleTabChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
          const nextTab = typeof value === "function" ? value(activeTab) : value;

        if (!tabs.includes(nextTab as UserTabs)) {
            return;
        }

        setActiveTab(nextTab as UserTabs);

       router.push(
        `/dashboard/system-maintenance/user-management/${id}?activeTab=${encodeURIComponent(nextTab)}`,
        { scroll: false }
    )
    }
    
    const [ endCursor, setEndCursor ] = useState<string>("");
    const [ startCursor, setStartCursor ] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1)

    const {
        data: UserData,
        isLoading,
    } = useFormQuery<UserByIdInterface>({
        key: ["GetSpecificUser", id],
        url: `maintenance/users/${id}`,
        headers,
    });

    const { data: ActivityLogsData } = useFormQuery<ActivityLogsInterfaceResult>({
        key: ["ActivityLogs", id],
        url: `maintenance/activity-logs/${id}`,
        headers,
        params: {
            orderBy: "created_at",
            sortBy: "asc",
            limit: 5, 
            after: endCursor || undefined,
            before: startCursor || undefined,
        }
    })

    const { data: DeviceSessionData } = useFormQuery<DeviceSessionsResult>({
        key: ["DeviceSessions",  endCursor, startCursor, currentPage, sessions?.data.user_id, currentPage],
        url: `auth/device-sessions/${sessions?.data.user_id}`,
        headers,
        params: {
            orderBy: "created_at",
            sortBy: "asc",
            limit: 5, 
            after: endCursor || undefined,
            before: startCursor || undefined,
            user_id: sessions?.data.user_id
        }
    })

    const onHandleNextPage = () => { 
      const pageInfo = DeviceSessionData?.data.pageInfo;

       if (
            !pageInfo?.hasNextPage ||
            !pageInfo.endCursor
        ) {
            return;
        }

        setStartCursor("");
        setEndCursor(pageInfo.endCursor);

        setCurrentPage((prev) => prev + 1);
    }
    const onHandlePrevPage = () => {
        const pageInfo = DeviceSessionData?.data.pageInfo;

        if (
            !pageInfo?.hasPrevPage ||
            !pageInfo.startCursor
        ) {
            return;
        }

        setEndCursor("");
        setStartCursor(pageInfo.startCursor);

        setCurrentPage((prev) => prev - 1);
    };



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

                        <Text size="sm">
                            {user.is_active
                                ? "Active"
                                : "Inactive"}
                        </Text>
                    </div>
                </div>

                <div className={styles.body}>
                    <div className={styles.body_header}>
                        <Tabs
                            activeTab={activeTab}
                            setActiveTab={handleTabChange}
                            tabs={tabs}
                        />
                    </div>

                    <div className={styles.body_content}>
                    {activeTab === "Activity Logs" && (
                            <div className={styles.activity_logs_group}>
                                {ActivityLogsData?.data.edges.map(({ node: { activity_logs_id, created_at,  description,is_deleted, type}}) => (
                                    <ActivityLogCard 
                                        created_at={created_at}
                                        is_deleted={is_deleted}
                                        key={activity_logs_id}
                                        activity_logs_id={activity_logs_id}
                                        type={type}
                                        description={description}
                                    />
                                ))}
                            </div>
                    )}
                    {activeTab === "Device Sessions" && (
                        <div className={styles.session_group}>
                            {DeviceSessionData?.data.edges.map(({
                                    node: {device_sessions_id, browser, device_name, device_type, ip_address, is_deleted, is_revoked, os, user_agent}
                                }) => (
                                    <DeviceSessionCard 
                                        key={device_sessions_id}
                                        browser={browser}
                                        device_name={device_name}
                                        device_sessions_id={device_sessions_id}
                                        device_type={device_type}
                                        ip_address={ip_address}
                                        os={os}
                                        user_agent={user_agent}
                                    />
                                ))}
                                <Pagination 
                                    currentPage={currentPage}
                                    pageSize={5}
                                    totalItems={DeviceSessionData?.data.totalCount ?? 0}
                                    currentItems={DeviceSessionData?.data.totalCount ?? 0}
                                    hasNextPage={DeviceSessionData?.data.pageInfo.hasNextPage ?? false}
                                    hasPrevPage={DeviceSessionData?.data.pageInfo.hasPrevPage ?? false}
                                    onNext={onHandleNextPage}
                                    onPrev={onHandlePrevPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Template>
    );
}