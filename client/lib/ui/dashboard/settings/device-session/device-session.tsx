"use client"

import React, { useState } from 'react'
import styles from "@/styles/lib/ui/dashboard/settings/settings.module.scss"

//components
import Title from '@/components/Typography/Title/title'
import Paragraph from '@/components/Typography/Paragraph/paragraph'
import Pagination from '@/components/Pagination/pagination';
import DeviceSessionCard from '@/lib/ui/cards/device-session-card';


//lib & hooks
import headers from '@/lib/utils/headers'
import useFormQuery from '@/lib/hooks/useQuery';
import { sessionStore } from '@/lib/utils/sessions';
import { DeviceSesssionResult } from '@/lib/interface/auth/device-sesssion.interface';
import EmptyState from '@/lib/ui/no-data';



export default function DeviceSessions() {

    const sessions = sessionStore.get();

    const limit = 20;
    const [ endCursor, setEndCursor ] = useState<string>("");
    const [ startCursor, setStartCursor ] = useState<string>("");

    const [currentPage, setCurrentPage] = useState<number>(1)

    const { data, isLoading } = useFormQuery<DeviceSesssionResult>({
        key: ["DeviceSessions",  limit, endCursor, startCursor, currentPage, sessions?.data.user_id, currentPage],
        url: `auth/device-sessions/${sessions?.data.user_id}`,
        headers,
        params: {
            orderBy: "created_at",
            sortBy: "asc",
            limit, 
            after: endCursor || undefined,
            before: startCursor || undefined,
            user_id: sessions?.data.user_id
        }
    })
    
    const onHandleNextPage = () => { 
      const pageInfo = data?.data.pageInfo;

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
        const pageInfo = data?.data.pageInfo;

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


    return (
            <div className={styles.tab_content}>
                <div className={styles.section_header}>
                    <Title size="md">
                        Device Sessions
                    </Title>
                    <Paragraph>
                        Manage the devices currently signed in to your Advocaid PH account.
                    </Paragraph>
                </div>

                <div className={styles.sessions_group}>
                    {
                       data?.data.totalCount === 0 ? 
                        <EmptyState />
                        
                       : data?.data.edges.map(({node: {device_sessions_id, browser, device_name, device_type, ip_address, is_deleted, is_revoked, os, user_agent}}) => (
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
                        ))
                    }
                <Pagination
                    currentPage={currentPage}
                    pageSize={limit}
                    totalItems={data?.data.totalCount ?? 0}
                    currentItems={data?.data.totalCount ?? 0}
                    hasNextPage={data?.data.pageInfo.hasNextPage ?? false}
                    hasPrevPage={data?.data.pageInfo.hasPrevPage ?? false}
                    onNext={onHandleNextPage}
                    onPrev={onHandlePrevPage}
                />

                </div>
            </div>
    )
}
