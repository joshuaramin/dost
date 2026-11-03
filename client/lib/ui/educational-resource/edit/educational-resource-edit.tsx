"use client";

import Template from "@/lib/ui/template";
import React, { useEffect, useRef } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/educational-resources-edit.module.scss";
import { SubmitHandler, useWatch } from "react-hook-form";

import FileUpload from "@/components/FileUpload/fileUpload";
import Input from "@/components/Input/input";
import ReactEditor from "@/components/Lexical/editor";
import { Select } from "@/components/Select/select";
import Textarea from "@/components/Textarea/textarea";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Form from "@/components/Form/form";

import {
  EducationResourceType,
  UpdateEducationResourceSchema,
} from "@/lib/validations/education.validation";
import useFormHook from "@/lib/hooks/useFormHook";
import { sessionStore } from "@/lib/utils/sessions";
import useFormQuery from "@/lib/hooks/useQuery";
import {
  EducationCategoryResult,
  EducationResourceIdInterface,
} from "@/lib/interface/education-resource/educational-resources.interface";
import { EducationResourceFormField } from "@/lib/types/education-resource.type";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import ButtonToggle from "@/components/Toggle/buttonToggle";
import { toastError, toastSuccess } from "../../toast";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export default function EducationalResourceEdit({ id }: Props) {
  const sessions = sessionStore.get();
  const initializedRef = useRef<string | null>(null);
  const router = useRouter();

  const { register, errors, handleSubmit, setValue, reset, control } =
    useFormHook({
      schema: UpdateEducationResourceSchema,
      defaultValues: {
        attachments: [],
        category_id: "",
        is_featured: false,
        status: "DRAFT",
        tags: [],
        title: "",
        type: "ARTICLE",
        content: "",
        summary: "",
        external_link: "",
        user_id: sessions?.data.user_id,
      },
    });

  const { data: resourceResponse, isLoading: isResourceLoading } =
    useFormQuery<EducationResourceIdInterface>({
      key: ["EducationalResourceId", id],
      url: `maintenance/educational-resource/${id}`,
    });

  const resource = resourceResponse?.data;

  const { data: EducationCategory } = useFormQuery<EducationCategoryResult>({
    key: ["EducationCategory"],
    url: "maintenance/educational-resource/category",
  });

  useEffect(() => {
    if (!resource) {
      return;
    }

    if (initializedRef.current === id) {
      return;
    }

    const externalLink =
      resource.external_link &&
      resource.external_link !== "undefined" &&
      resource.external_link !== "null"
        ? resource.external_link
        : "";

    reset({
      attachments: [],
      category_id: resource.category?.education_category_id ?? "",
      is_featured: Boolean(resource.is_featured),
      status: resource.status ?? "DRAFT",
      tags: resource.tags ?? [],
      title: resource.title ?? "",
      type: resource.type ?? "ARTICLE",
      content: resource.content ?? "",
      summary: resource.summary ?? "",
      external_link: externalLink,
      user_id: resource.Author?.user_id ?? sessions?.data.user_id,
    });

    initializedRef.current = id;
  }, [resource, reset, id, sessions?.data.user_id]);

  const watchedType = useWatch({
    control,
    name: "type",
  });

  const type = watchedType || resource?.type || "ARTICLE";

  const mutation = useFormMutation<EducationResourceFormField>({
    key: ["UpdateEducationalResource"],
    url: `maintenance/educational-resource/${resource?.education_resource_id}`,
    method: "PUT",
    headers,
    isMultipart: true,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
    headers,
  });

  const onDeleteMutation = useFormMutation({
    key: ["DeleteEducationalResource"],
    method: "PATCH",
    url: `maintenance/educational-resource/${resource?.slug}`,
    headers,
  });

  const onHandleSubmit: SubmitHandler<Partial<EducationResourceFormField>> = (
    formData,
  ) => {
    const externalLink =
      formData.external_link &&
      formData.external_link !== "undefined" &&
      formData.external_link !== "null"
        ? formData.external_link
        : "";

    mutation.mutate(
      {
        title: formData.title ?? "",
        category_id: formData.category_id ?? "",
        content: formData.content ?? "",
        summary: formData.summary ?? "",
        is_featured: formData.is_featured ?? false,
        attachments: formData.attachments ?? [],
        status: formData.status ?? "DRAFT",
        tags: formData.tags ?? [],
        type: formData.type ?? type,
        external_link: externalLink,
        user_id: formData.user_id ?? sessions?.data.user_id,
      },
      {
        onSuccess: () => {
          activityMutation.mutate({
            type: "UPDATE",
            description: `User updated the educational resource "${formData.title ?? resource?.title}".`,
            user_id: sessions?.data.user_id,
          });

          toastSuccess({
            title: "Educational Resource Updated Successfully",
            body: `"${formData.title ?? resource?.title}" has been updated successfully and the latest changes have been saved.`,
          });
        },
        onError: (error) => {
          console.error("Failed to update educational resource:", error);

          toastError({
            title: "Failed to Update Educational Resource",
            body: "Something went wrong while updating the educational resource. Please review your changes and try again.",
          });
        },
      },
    );
  };

  const onHandleDeleteMutation = () => {
    if (!resource) {
      return;
    }

    onDeleteMutation.mutate(null, {
      onSuccess: () => {
        activityMutation.mutate({
          type: "DELETE",
          description: `User deleted the educational resource "${resource.title}".`,
          user_id: sessions?.data.user_id,
        });

        toastSuccess({
          title: "Educational Resource Deleted Successfully",
          body: `"${resource.title}" has been deleted successfully.`,
        });

        router.push("/dashboard/engagement/educational-resources");
      },
      onError: (error) => {
        console.error("Failed to delete educational resource:", error);

        toastError({
          title: "Failed to Delete Educational Resource",
          body: `Unable to delete "${resource.title}". Please try again.`,
        });
      },
    });
  };

  if (isResourceLoading) {
    return (
      <Template title="Update Educational Resources">
        <div className={styles.container}>
          <Text size="sm">Loading educational resource...</Text>
        </div>
      </Template>
    );
  }

  if (!resource) {
    return (
      <Template title="Update Educational Resources">
        <div className={styles.container}>
          <Text size="sm">Educational resource not found.</Text>
        </div>
      </Template>
    );
  }

  return (
    <Template title="Update Educational Resources">
      <div className={styles.container}>
        <Input
          register={register}
          name="title"
          label="Title"
          isRequired
          error={errors.title}
          placeholder="Enter title"
        />

        <Select
          control={control}
          error={errors.category_id}
          isRequired
          label="Category"
          name="category_id"
          options={
            EducationCategory?.data.edges.map(({ node }) => ({
              label: node.name,
              value: node.education_category_id,
            })) ?? []
          }
        />

        <Select
          control={control}
          name="type"
          label="Type"
          isRequired
          error={errors.type}
          options={EducationResourceType.options.map((resourceType) => ({
            label: resourceType.replaceAll("_", " "),
            value: resourceType,
          }))}
        />

        <Textarea
          isRequired
          label="Summary"
          register={register}
          name="summary"
          errors={errors.summary}
          style={{ height: "100px" }}
        />

        {type === "ARTICLE" && (
          <ReactEditor
            error={errors.content}
            height={200}
            isRequired
            label="Content"
            name="content"
            control={control}
            value={resource.content ?? ""}
          />
        )}

        {type === "CATALOGUE" && (
          <FileUpload
            label="File Upload"
            name="attachments"
            register={register}
            setValue={setValue}
            accepted={{
              image: ["jpeg", "jpg", "webp", "png"],
            }}
            error={
              Array.isArray(errors.attachments)
                ? errors.attachments[0]
                : errors.attachments
            }
            isRequired
            multiple
          />
        )}

        {type === "EXTERNAL_LINK" && (
          <Input
            register={register}
            name="external_link"
            label="External Link"
            isRequired
            error={errors.external_link}
            placeholder="https://example.com"
          />
        )}

        <ButtonToggle
          control={control}
          name="status"
          falseValue="DRAFT"
          trueValue="PUBLISHED"
          falseLabel="DRAFT"
          trueLabel="PUBLISHED"
          label="Status"
        />

        <div className={styles.footer}>
          <Button
            variant="primary"
            size="md"
            type="submit"
            disabled={mutation.isPending || onDeleteMutation.isPending}
          >
            <Text size="sm">{mutation.isPending ? "Saving..." : "Save"}</Text>
          </Button>

          <Button
            variant="danger"
            size="md"
            type="button"
            disabled={mutation.isPending || onDeleteMutation.isPending}
            onClick={onHandleDeleteMutation}
          >
            <Text size="sm">
              {onDeleteMutation.isPending ? "Deleting..." : "Delete"}
            </Text>
          </Button>
        </div>
      </div>
    </Template>
  );
}
