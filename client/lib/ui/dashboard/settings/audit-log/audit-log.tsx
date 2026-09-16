"use client";

import React, { useState } from "react";

import styles from "@/styles/lib/ui/dashboard/settings/settings.module.scss";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Title from "@/components/Typography/Title/title";

import EmptyState from "../../../no-data";
import { sessionStore } from "@/lib/utils/sessions";
import useFormQuery from "@/lib/hooks/useQuery";
import { ActivityLogsInterfaceResult } from "@/lib/interface/activitiy-logs/activity-log.interface";

import headers from "@/lib/utils/headers";
import ActivityLogCard from "@/lib/ui/cards/activity-log-card";
import Pagination from "@/components/Pagination/pagination";

export default function AuditLog() {
  const token = sessionStore.get();

  const limit = 20;
  const [endCursor, setEndCursor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [startCursor, setStartCursor] = useState<string>("");

  const { data: ActivityLogsData } = useFormQuery<ActivityLogsInterfaceResult>({
    key: ["ActivityLogs", token?.data.user_id],
    url: `maintenance/activity-logs/${token?.data.user_id}`,
    headers,
    params: {
      orderBy: "created_at",
      sortBy: "desc",
      limit: limit,
      after: endCursor || undefined,
      before: startCursor || undefined,
    },
  });

  const onHandleNextPage = () => {
    const pageInfo = ActivityLogsData?.data.pageInfo;

    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    setStartCursor("");
    setEndCursor(pageInfo.endCursor);

    setCurrentPage((prev) => prev + 1);
  };
  const onHandlePrevPage = () => {
    const pageInfo = ActivityLogsData?.data.pageInfo;

    if (!pageInfo?.hasPrevPage || !pageInfo.startCursor) {
      return;
    }

    setEndCursor("");
    setStartCursor(pageInfo.startCursor);

    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className={styles.tab_content}>
      <div className={styles.section_header}>
        <Title size="md">Audit Logs</Title>
        <Paragraph>
          Review system activities and user actions recorded within Advocaid PH.
        </Paragraph>
      </div>
      {ActivityLogsData?.totalCount === 0 ? (
        <EmptyState
          title="No audit logs found"
          description="There are currently no audit logs available to display."
        />
      ) : (
        <div className={styles.sessions_group}>
          {ActivityLogsData?.data.edges.map(
            ({
              node: {
                activity_logs_id,
                created_at,
                description,
                is_deleted,
                type,
              },
            }) => (
              <ActivityLogCard
                created_at={created_at}
                is_deleted={is_deleted}
                key={activity_logs_id}
                activity_logs_id={activity_logs_id}
                type={type}
                description={description}
              />
            ),
          )}
          <Pagination
            currentPage={currentPage}
            pageSize={limit}
            totalItems={ActivityLogsData?.totalCount ?? 0}
            currentItems={ActivityLogsData?.totalCount ?? 0}
            hasNextPage={ActivityLogsData?.data.pageInfo.hasNextPage ?? false}
            hasPrevPage={ActivityLogsData?.data.pageInfo.hasPrevPage ?? false}
            onNext={onHandleNextPage}
            onPrev={onHandlePrevPage}
          />
        </div>
      )}
    </div>
  );
}
