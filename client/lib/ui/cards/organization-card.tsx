"use client";

import React, { useState } from "react";
import styles from "@/styles/lib/ui/cards/organization-card.module.scss";
import { TbDots, TbEdit, TbTrash } from "react-icons/tb";

//components
import Avatar from "@/components/Avatar/avatar";
import FileUpload from "@/components/FileUpload/fileUpload";
import ModalForm from "@/components/Modal/modal-form";
import Form from "@/components/Form/form";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Input from "@/components/Input/input";

//lib & hooks
import Title from "@/lib/ui/title";
import { hasAnyPermission } from "@/lib/utils/hasAnyPermission";
import useFormMutation from "@/lib/hooks/useMutation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toastError, toastSuccess } from "../toast";
import headers from "@/lib/utils/headers";
import { sessionStore } from "@/lib/utils/sessions";
import useFormHook from "@/lib/hooks/useFormHook";
import { UpdateOrganizationSchema } from "@/lib/validations/organization";
import { OrganizationUpdatFormField } from "@/lib/types/organization";

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
  const token = sessionStore.get();
  const [toggle, setToggle] = useState<boolean>(false);
  const [onDeleteToggle, setOnDeleteToggle] = useState<boolean>(false);
  const [editToggle, setEditToggle] = useState<boolean>(false);

  const canDelete = hasAnyPermission(
    ["organization-management:delete", "organization-management:update"],
    "/dashboard/system-maintenance/organization",
  );
  const onHandleToggle = () => {
    setToggle(() => !toggle);
  };

  const { handleSubmit } = useForm();

  const {
    handleSubmit: handleEditSubmit,
    register,
    setValue,
    errors,
  } = useFormHook({
    schema: UpdateOrganizationSchema,
    defaultValues: {
      address,
      contact,
      logo: File as unknown as never,
      name,
    },
  });

  const onHandleDeleteToggle = () => {
    setOnDeleteToggle((prev) => !prev);
  };

  const onHandleEditToggle = () => {
    setEditToggle((prev) => !prev);
  };

  const onDeleteMutation = useFormMutation({
    key: ["OnDeleteMutation", id],
    method: "PATCH",
    url: `maintenance/organization/${id}`,
    headers,
  });

  const onEditMutation = useFormMutation({
    key: ["OnEditMutation", id],
    method: "PUT",
    url: `maintenance/organization/${id}`,
    headers,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
  });

  const onHandleEditSubmit: SubmitHandler<OrganizationUpdatFormField> = (
    data,
  ) => {
    onEditMutation.mutate(
      {
        name: data.name,
        address: data.address,
        contact: data.contact,
        logo: data.logo,
      },
      {
        onSuccess: () => {
          toastSuccess({
            title: "Updated Successfully",
            body: "The organization has been updated successfully.",
          });

          activityMutation.mutate(
            {
              type: "UPDATE",
              description: `User updated organization: ${data.name}.`,
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
            title: "Update Failed",
            body: "Something went wrong while updating the organization.",
          });
        },
      },
    );
  };

  const onHandleDeleteMutation = () => {
    onDeleteMutation.mutate(null, {
      onSuccess: () => {
        toastSuccess({
          title: "Deleted Successfully",
          body: "The item has been deleted successfully.",
        });

        activityMutation.mutate(
          {
            type: "DELETE",
            description: "User deleted an item.",
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
          body: "Unable to delete the item. Please try again.",
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {editToggle && (
          <ModalForm
            title="Edit Details"
            onHandleCloseToggle={onHandleEditToggle}
          >
            <Form onSubmit={handleEditSubmit(onHandleEditSubmit)}>
              <FileUpload
                register={register}
                label="Logo"
                setValue={setValue}
                accepted={{
                  image: ["jpeg", "jpg", "png", "webp"],
                }}
                isRequired={true}
                name={"logo"}
                multiple={false}
              />
              <Input
                register={register}
                name={"name"}
                error={errors.name}
                label="Name"
              />
              <Input
                register={register}
                name={"address"}
                error={errors.address}
                label="Address"
              />
              <Input
                register={register}
                name={"contact"}
                error={errors.contact}
                label="Tel/Phone number"
              />
              <div className={styles.model_footer}>
                <Button
                  onClick={onHandleEditToggle}
                  size="sm"
                  variant="neutral"
                  types="outline"
                >
                  <Text size="sm">Cancel</Text>
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  <Text size="sm">Submit</Text>
                </Button>
              </div>
            </Form>
          </ModalForm>
        )}
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
