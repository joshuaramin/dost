"use client";

import Template from "@/lib/ui/template";
import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/educational-resources-create.module.scss";
import { SubmitHandler, useWatch } from "react-hook-form";

//components
import FileUpload from "@/components/FileUpload/fileUpload";
import Input from "@/components/Input/input";
import ReactEditor from "@/components/Lexical/editor";
import { Select } from "@/components/Select/select";
import Textarea from "@/components/Textarea/textarea";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Form from "@/components/Form/form";

//lib & hooks
import {
  CreateEducationResourceSchema,
  EducationResourceType,
} from "@/lib/validations/education.validation";
import useFormHook from "@/lib/hooks/useFormHook";
import { sessionStore } from "@/lib/utils/sessions";
import useFormQuery from "@/lib/hooks/useQuery";
import { EducationCategoryResult } from "@/lib/interface/education-resource/educational-resources.interface";
import { EducationResourceFormField } from "@/lib/types/education-resource.type";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import ButtonToggle from "@/components/Toggle/buttonToggle";
import { toastError, toastSuccess } from "@/lib/ui/toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const [category, setCategory] = useState<string>("");
  const sessions = sessionStore.get();
  const router = useRouter();

  const { data: EducationCategory } = useFormQuery<EducationCategoryResult>({
    key: ["EducationCategory", category],
    url: `maintenance/educational-resource/category?search=${category}`,
  });

  const { register, errors, handleSubmit, setValue, control } = useFormHook({
    schema: CreateEducationResourceSchema,
    defaultValues: {
      attachments: [],
      category_id: "",
      is_featured: false,
      status: "DRAFT",
      tags: [],
      title: "",
      type: "" as string as never,
      content: "",
      summary: "",
      user_id: "",
    },
  });

  const mutation = useFormMutation<EducationResourceFormField>({
    key: ["CreateEducationResource"],
    url: "maintenance/educational-resource",
    method: "POST",
    headers,
    isMultipart: true,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
  });

  const onHandleSubmit: SubmitHandler<EducationResourceFormField> = (data) => {
    mutation.mutate(
      {
        title: data.title,
        category_id: data.category_id,
        content: data.content,
        summary: data.summary,
        is_featured: Boolean(false),
        attachments: data.attachments,
        status: data.status,
        tags: data.tags,
        type: data.type,
        external_link: data.external_link,
        user_id: sessions?.data.user_id,
      },
      {
        onSuccess: (data) => {
          console.log(data);
          const response = data as { data: { slug: string } };
          router.push(
            `/dashboard/engagement/educational-resources/${response.data.slug}`,
          );
          toastSuccess({
            title: "Educational Resource Created Successfully",
            body: "The new educational resource has been added and is now available in the system.",
          });

          activityMutation.mutate(
            {
              type: "CREATE",
              description: "User created a new educational resource.",
              user_id: sessionStorage?.data.user_id,
            },
            {
              onSuccess: (data) => {
                console.log("Activity Log created", data);
              },
            },
          );
        },
        onError: () => {
          toastError({
            title: "Failed to Create Educational Resource",
            body: "Something went wrong while creating the educational resource. Please try again.",
          });
        },
      },
    );
  };

  const type = useWatch({
    control,
    name: "type",
    exact: true,
  });

  return (
    <Template title="Create new Educational Resources">
      <div className={styles.container}>
        <Form onSubmit={handleSubmit(onHandleSubmit)}>
          <Input
            register={register}
            name={"title"}
            label="Title"
            isRequired={true}
            error={errors.title}
          />
          <Select
            control={control}
            error={errors.category_id}
            isRequired={true}
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
            options={EducationResourceType.options.map((type) => ({
              label: type.replace("_", " "),
              value: type,
            }))}
          />
          <Textarea
            isRequired={true}
            label="Summary"
            register={register}
            name={"summary"}
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
              value={"content"}
            />
          )}

          {type === "CATALOGUE" && (
            <FileUpload
              label="Attachments"
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
              isRequired={true}
              multiple={true}
            />
          )}

          {type === "EXTERNAL_LINK" && (
            <Input
              register={register}
              name="external_link"
              label="External Link"
              isRequired
              error={errors.external_link}
            />
          )}

          <div className={styles.footer}>
            <ButtonToggle
              falseValue={"DRAFT"}
              falseLabel={"DRAFT"}
              trueLabel={"PUBLISH"}
              trueValue={"PUBLISHED"}
              control={control}
              name="status"
            />
          </div>

          <Button variant="primary" size="md">
            <Text size="sm">Save</Text>
          </Button>
        </Form>
      </div>
    </Template>
  );
}
