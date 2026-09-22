"use client";

import React, { ReactNode, useState } from "react";
import styles from "@/styles/lib/ui/dashboard/template-survey.module.scss";
import Title from "@/components/Typography/Title/title";
import Text from "@/components/Typography/Text/text";
import { TbCaretDownFilled, TbCopy } from "react-icons/tb";
import { toastError, toastSuccess } from "../toast";
import useFormMutation from "@/lib/hooks/useMutation";
import { sessionStore } from "@/lib/utils/sessions";
import headers from "@/lib/utils/headers";

interface Props {
  children: ReactNode;
  title: string;
  slug: string;
  status: boolean;
}

export default function TemplateSurvey({
  children,
  title,
  slug,
  status,
}: Props) {
  const token = sessionStore.get();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const publishedMutation = useFormMutation({
    key: ["SurveyPublished", slug],
    method: "PATCH",
    url: `maintenance/survey/publish/${slug}`,
    headers,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
    headers,
  });

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  const handlePublish = () => {
    if (status) {
      return;
    }

    publishedMutation.mutate(
      {
        is_published: true,
      },
      {
        onSuccess: () => {
          toastSuccess({
            title: "Survey Published",
            body: `"${title}" has been successfully published and is now available to respondents.`,
          });

          activityMutation.mutate(
            {
              type: "UPDATE",
              description: `User published the survey "${title}".`,
              user_id: token?.data.user_id,
            },
            {
              onSuccess: () => {},
              onError: () => {},
            },
          );

          setIsOpen(false);
        },
        onError: () => {
          toastError({
            title: "Publish Failed",
            body: `Unable to publish "${title}". Please try again.`,
          });
        },
      },
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/survey/${slug}`,
      );

      toastSuccess({
        title: "Link Copied",
        body: "The survey link has been successfully copied to your clipboard.",
      });

      setIsOpen(false);
    } catch {
      toastError({
        title: "Copy Failed",
        body: "Unable to copy the survey link. Please try again.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title
          style={{
            color: "35408E",
          }}
          size="md"
        >
          {title}
        </Title>

        <div className={styles.btngroup}>
          <button
            type="button"
            disabled={status || publishedMutation.isPending}
            onClick={handlePublish}
          >
            <Text size="sm">
              {publishedMutation.isPending
                ? "PUBLISHING..."
                : status
                  ? "PUBLISHED"
                  : "PUBLISH"}
            </Text>
          </button>

          <button
            type="button"
            onClick={handleToggle}
            aria-label="Open publish options"
            aria-expanded={isOpen}
          >
            <TbCaretDownFilled size={20} />
          </button>
        </div>

        {isOpen && (
          <div className={styles.url}>
            <button type="button" onClick={handleCopyLink}>
              <TbCopy size={18} />
              <Text size="sm">Copy Link</Text>
            </button>
          </div>
        )}
      </div>

      <div className={styles.body}>{children}</div>
    </div>
  );
}
