"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permissions-card.module.scss";
import { TbArrowRight, TbDots, TbEdit, TbTrash } from "react-icons/tb";

//components
import Button from "@/components/Button/button";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Text from "@/components/Typography/Text/text";
import useFormMutation from "@/lib/hooks/useMutation";
import { sessionStore } from "@/lib/utils/sessions";
import ModalForm from "@/components/Modal/modal-form";
import { SubmitHandler, useForm } from "react-hook-form";
import Form from "@/components/Form/form";
import { toastError, toastSuccess } from "../toast";
import Input from "@/components/Input/input";

//lib & hooks
import useFormHook from "@/lib/hooks/useFormHook";
import { UpdateRoleSchema } from "@/lib/validations/role.validation";
import headers from "@/lib/utils/headers";
import Textarea from "@/components/Textarea/textarea";
import { RolesUpdateFormField } from "@/lib/types/roles-and-permissions";

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

  const optionsRef = useRef<HTMLDivElement>(null);

  const { handleSubmit } = useForm();

  const {
    register,
    errors,
    handleSubmit: handleEditSubmit,
  } = useFormHook({
    schema: UpdateRoleSchema,
    defaultValues: {
      description,
      name,
    },
    shouldUnregister: true,
  });

  const [deleteToggle, setDeleteToggle] = useState<boolean>(false);
  const [optionToggle, setOptionToggle] = useState<boolean>(false);
  const [editToggle, setEditToggle] = useState<boolean>(false);

  const onHandleOptionToggle = () => {
    setOptionToggle((prev) => !prev);
  };

  const onHandleDeleteToggle = () => {
    setDeleteToggle((prev) => !prev);
    setOptionToggle(false);
  };

  const onHandleEditToggle = () => {
    setEditToggle((prev) => !prev);
    setOptionToggle(false);
  };

  const onHandleRoute = () => {
    router.push(`${pathname}/${slug}`);
  };

  useEffect(() => {
    if (!optionToggle) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setOptionToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionToggle]);

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

  const updateMutation = useFormMutation({
    key: ["RoleAndPermissionUpdate", name],
    method: "PUT",
    url: `maintenance/roles/${slug}`,
    headers,
  });

  const onHandleEditSubmit: SubmitHandler<RolesUpdateFormField> = (
    data: any,
  ) => {
    updateMutation.mutate(
      {
        name: data.name,
        description: data.description,
      },
      {
        onSuccess: () => {
          toastSuccess({
            title: "Updated Successfully",
            body: `The role "${name}" has been updated successfully.`,
          });

          activitytMutation.mutate(
            {
              type: "UPDATE",
              description: `User updated role and permission: ${name}`,
              user_id: token?.data.user_id,
            },
            {
              onSuccess: () => {},
              onError: () => {},
            },
          );
          setEditToggle(false);
          window.location.reload();
        },
        onError: () => {
          toastError({
            title: "Update Failed",
            body: `Unable to update the role "${name}". Please try again.`,
          });
        },
      },
    );
  };

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
        setDeleteToggle(false);
        window.location.reload();
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
      {editToggle && (
        <ModalForm
          title="Edit Details"
          onHandleCloseToggle={onHandleEditToggle}
        >
          <Form onSubmit={handleEditSubmit(onHandleEditSubmit)}>
            <div className={styles.body}>
              <Input
                label="Name"
                name="name"
                register={register}
                error={errors.name}
              />

              <Textarea
                label="Description"
                register={register}
                name="description"
                errors={errors.description}
              />
            </div>

            <div className={styles.model_footer}>
              <Button
                onClick={onHandleEditToggle}
                size="sm"
                variant="neutral"
                types="outline"
              >
                <Text size="sm">Cancel</Text>
              </Button>

              <Button size="sm" variant="primary">
                <Text size="sm">Confirm</Text>
              </Button>
            </div>
          </Form>
        </ModalForm>
      )}

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
                <Text size="sm">Submit</Text>
              </Button>
            </div>
          </Form>
        </ModalForm>
      )}

      {optionToggle && (
        <div ref={optionsRef} className={styles.options}>
          <button onClick={onHandleEditToggle}>
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
