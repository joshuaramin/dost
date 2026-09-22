"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permissions-card.module.scss";
import {
  TbArrowRight,
  TbDots,
  TbEdit,
  TbExternalLink,
  TbTrash,
} from "react-icons/tb";

import headers from "@/lib/utils/headers";

// components
import Button from "@/components/Button/button";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Text from "@/components/Typography/Text/text";
import useFormMutation from "@/lib/hooks/useMutation";
import { sessionStore } from "@/lib/utils/sessions";
import ModalForm from "@/components/Modal/modal-form";
import { useForm } from "react-hook-form";
import Form from "@/components/Form/form";
import { toastError, toastSuccess } from "../toast";

interface Props {
  name: string;
  description: string;
  slug: string;
}

export default function RolesAndPermissionsCard({
  name,
  description,
  slug,
}: Props) {
  const token = sessionStore.get();
  const router = useRouter();
  const pathname = usePathname();

  const { handleSubmit } = useForm();
  const [deleteToggle, setDeleteToggle] = useState<boolean>(false);
  const [optionToggle, setOptionToggle] = useState<boolean>(false);

  const onHandleOptionToggle = () => {
    setOptionToggle((prev) => !optionToggle);
  };
  const onHandleDeleteToggle = () => {
    setDeleteToggle((prev) => !prev);
  };
  const onHandleRoute = () => {
    router.push(`${pathname}/${slug}`);
  };

  const activitytMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",

    headers,
  });

  const deleteMutation = useFormMutation({
    key: ["Roles-and-Permission", name],
    method: "PATCH",
    url: `maintenance/roles/${slug}`,
    headers,
  });

  const onHandleSubmit = () => {
    deleteMutation.mutate(null, {
      onSuccess: () => {
        toastSuccess({
          title: "Deleted Successfully",
          body: `The role and permission "${name}" have been deleted successfully.`,
        });
        activitytMutation.mutate(
          {
            type: "DELETE",
            description: `User delete a role and permission: ${name}`,
            user_id: token?.data.user_id,
          },
          {
            onSuccess: () => {},
            onError: () => {},
          },
        );
      },
      onError: () => {
        toastError({
          title: "Delete Failed",
          body: `Unable to delete the role and permission "${name}". Please try again.`,
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      {deleteToggle && (
        <ModalForm
          title="Delete this item?"
          onHandleCloseToggle={onHandleDeleteToggle}
        >
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <Text size="md" style={{ fontWeight: "400" }}>
              This action is permanent and cannot be undone. The item and its
              associated information will be permanently deleted.
            </Text>
            <div className={styles.model_footer}>
              <Button
                onClick={onHandleDeleteToggle}
                size="sm"
                variant="neutral"
                types="outline"
              >
                <Text size="sm">Cancel</Text>
              </Button>
              <Button size="sm" variant="danger">
                <Text size="sm">Confirm</Text>
              </Button>
            </div>
          </Form>
        </ModalForm>
      )}
      {optionToggle && (
        <div className={styles.options}>
          <button>
            <TbEdit size={18} />
            <Text size="sm">Edit</Text>
          </button>
          <button onClick={onHandleDeleteToggle}>
            <TbTrash size={18} />
            <Text size="sm">Delete</Text>
          </button>
        </div>
      )}
      <div className={styles.header}>
        <div className={styles.header_col1}>
          <Title
            size="md"
            onClick={() => router.push(`${pathname}/${slug}`)}
            style={{
              cursor: "pointer",
            }}
          >
            {name}
          </Title>
        </div>
        <button onClick={onHandleOptionToggle}>
          <TbDots size={18} />
        </button>
      </div>
      <div className={styles.body}>
        <Paragraph>{description}</Paragraph>
      </div>
      <div className={styles.footer}>
        <Button
          onClick={onHandleRoute}
          full={false}
          variant="primary"
          types="outline"
          size="md"
        >
          <Text
            size="md"
            style={{
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            Go to Settings <TbArrowRight size={23} />
          </Text>
        </Button>
      </div>
    </div>
  );
}
