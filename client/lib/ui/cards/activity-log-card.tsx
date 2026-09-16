import React from "react";

import Text from "@/components/Typography/Text/text";
import Paragraph from "@/components/Typography/Paragraph/paragraph";

import styles from "@/styles/lib/ui/cards/acitvity-log-card.module.scss";

import { format } from "date-fns";
import { TbLogs } from "react-icons/tb";

interface Props {
  activity_logs_id: string;
  type: string;
  description: string;
  is_deleted: boolean;
  created_at?: string;
}

export default function ActivityLogCard({
  type,
  description,
  created_at,
}: Props) {
  return (
    <div className={styles.activity_log_card}>
      <TbLogs size={24} />

      <div className={styles.activity_log_content}>
        <div className={styles.activity_log_header}>
          <div className={styles.activity_log_information}>
            <Text size="md">{type}</Text>

            <Paragraph>{description}</Paragraph>
          </div>

          <Text size="sm">
            {format(new Date(created_at as string), "MMMM dd yyyy")}
          </Text>
        </div>
      </div>
    </div>
  );
}
