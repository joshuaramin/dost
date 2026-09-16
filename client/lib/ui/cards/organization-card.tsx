"use client";

import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/organization/organization-card.module.scss";
import { TbDots, TbEdit, TbTrash } from "react-icons/tb";

//components
import Avatar from "@/components/Avatar/avatar";

//lib & hooks
import Title from "@/lib/ui/title";
import { hasAnyPermission } from "@/lib/utils/hasAnyPermission";
import Text from "@/components/Typography/Text/text";
import useFormMutation from "@/lib/hooks/useMutation";
import ModalForm from "@/components/Modal/modal-form";
import Form from "@/components/Form/form";
import Button from "@/components/Button/button";
import { useForm } from "react-hook-form";
import { toastError, toastSuccess } from "../toast";
import headers from "@/lib/utils/headers";

interface Props {
  id: string;
  logo: string;
  address: string;
  contact: string;
  name: string;
}

export default function OrganizationCard({
  logo,
  address,
  contact,
  id,
  name,
}: Props) {
  const [toggle, setToggle] = useState<boolean>(false);
  const [onDeleteToggle, setOnDeleteToggle] = useState<boolean>(false);

  const canDelete = hasAnyPermission(
    ["organization-management:delete", "organization-management:update"],
    "/dashboard/system-maintenance/organization",
  );
  const onHandleToggle = () => {
    setToggle(() => !toggle);
  };

  const { handleSubmit } = useForm();

  const onHandleDeleteToggle = () => {
    setOnDeleteToggle((prev) => !prev);
  };

  const onDeleteMutation = useFormMutation({
    key: ["OnDeleteMutation", id],
    method: "PUT",
    url: `maintenance/organization/${id}`,
    headers,
  });

  const onHandleDeleteMutation = () => {
    onDeleteMutation.mutate(null, {
      onSuccess: () => {
        toastSuccess({
          title: "Deleted Successfully",
          body: "The item has been deleted successfully.",
        });
      },
      onError: () => {
        toastError({
          title: "Delete Failed",
          body: "Unable to delete the item. Please try again.",
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {onDeleteToggle && (
          <ModalForm
            title="Delete this item?"
            onHandleCloseToggle={onHandleDeleteToggle}
          >
            <Form onSubmit={handleSubmit(onHandleDeleteMutation)}>
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
        {toggle && (
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
        <div className={styles.header_col1}>
          <Avatar variant="lg" src={logo} />
          {canDelete && (
            <button onClick={onHandleToggle}>
              <TbDots size={18} />
            </button>
          )}
        </div>
        <Title title={name} />
      </div>
      <div className={styles.body}>
        <span>{address}</span>
        <br />
        <br />
        <span>Contact No: </span>
        <span>{contact}</span>
      </div>
    </div>
  );
}
