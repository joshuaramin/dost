"use client";

import Template from "@/lib/ui/template";
import React, { useEffect, useState } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/educational-resources-create.module.scss";
import { SubmitHandler, useWatch } from "react-hook-form";

// components
import FileUpload from "@/components/FileUpload/fileUpload";
import Input from "@/components/Input/input";
import ReactEditor from "@/components/Lexical/editor";
import { Select } from "@/components/Select/select";
import Textarea from "@/components/Textarea/textarea";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Form from "@/components/Form/form";
import Preview from "@/components/Image/preview";

// lib & hooks
import {
    EducationResourceType,
    UpdateEducationResourceSchema,
} from "@/lib/validations/education.validation";

import useFormHook from "@/lib/hooks/useFormHook";
import { sessionStore } from "@/lib/utils/sessions";
import useFormQuery from "@/lib/hooks/useQuery";

import {
    EducationalResourceInterface,
    EducationCategoryResult,
} from "@/lib/interface/education-resource/educational-resources.interface";

import { EducationResourceFormField } from "@/lib/types/education-resource.type";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import ButtonToggle from "@/components/Toggle/buttonToggle";

interface Props {
    id: string;
}

export default function EducationalResourceEdit({
    id,
}: Props) {
    const [category, setCategory] = useState<string>("");

    const sessions = sessionStore.get();

    const {
        data: EducationCategory,
    } = useFormQuery<EducationCategoryResult>({
        key: ["EducationCategory", category],
        url: `maintenance/educational-resource/category?search=${encodeURIComponent(
            category
        )}`,
    });

    const {
        data: resourceResponse,
        isLoading,
    } = useFormQuery<EducationalResourceInterface>({
        key: ["EducationalResourceId", id],
        url: `maintenance/educational-resource/${id}`,
    });

    const resource = resourceResponse?.data;

    const {
        register,
        errors,
        handleSubmit,
        setValue,
        reset,
        control,
    } = useFormHook({
        schema: UpdateEducationResourceSchema,

        defaultValues: {
            attachments: [],
            category_id: "",
            is_deleted: false,
            is_featured: false,
            status: "DRAFT",
            tags: [],
            title: "",
            type: "ARTICLE",
            content: "",
            summary: "",
            thumbnail: undefined,
            external_link: "",
            user_id: sessions?.data.user_id,
        },
    });

    useEffect(() => {
        if (!resource) {
            return;
        }

        reset({
            attachments: resource.attachments ?? [],
            category_id: resource.category_id ?? "",
            is_deleted: resource.is_deleted ?? false,
            is_featured: resource.is_featured ?? false,
            status: resource.status ?? "DRAFT",
            tags: resource.tags ?? [],
            title: resource.title ?? "",
            type: resource.type ?? "ARTICLE",
            content: resource.content ?? "",
            summary: resource.summary ?? "",
            thumbnail: undefined,
            external_link: resource.external_link ?? "",
            user_id:
                resource.user_id ??
                sessions?.data.user_id,
        });
    }, [
        resource,
        reset,
        sessions?.data.user_id,
    ]);

    const mutation =
        useFormMutation<EducationResourceFormField>({
            key: ["UpdateEducationalResource"],
            url: `maintenance/educational-resource/${id}`,
            method: "PATCH",
            headers,
            isMultipart: true,
        });

    const onHandleSubmit: SubmitHandler<
        EducationResourceFormField
    > = (formData) => {
        mutation.mutate(
            {
                title: formData.title,
                category_id: formData.category_id,
                content: formData.content,
                summary: formData.summary,
                is_deleted: formData.is_deleted ?? false,
                is_featured:
                    formData.is_featured ?? false,
                attachments: formData.attachments,
                status: formData.status,
                tags: formData.tags,
                type: formData.type,
                thumbnail: formData.thumbnail,
                external_link: formData.external_link,
                user_id: formData.user_id,
            },
            {
                onSuccess: () => {
                    alert(
                        "Successfully updated educational resource."
                    );
                },
                onError: (error) => {
                    console.error(error);

                    alert(
                        "Failed to update educational resource."
                    );
                },
            }
        );
    };

    const status = useWatch({
        control,
        name: "status",
    });

    const type = useWatch({
        control,
        name: "type",
    });

    const content = useWatch({
        control,
        name: "content",
    });

    const onHandleCategorySearch = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCategory(e.currentTarget.value);
    };

    if (isLoading) {
        return (
            <Template title="Update Educational Resources">
                <div className={styles.container}>
                    <Text size="sm">
                        Loading educational resource...
                    </Text>
                </div>
            </Template>
        );
    }

    if (!resource) {
        return (
            <Template title="Update Educational Resources">
                <div className={styles.container}>
                    <Text size="sm">
                        Educational resource not found.
                    </Text>
                </div>
            </Template>
        );
    }

    return (
        <Template title="Update Educational Resources">
            <div className={styles.container}>
                <Form
                    onSubmit={handleSubmit(
                        onHandleSubmit
                    )}
                >
                    <Input
                        register={register}
                        name="title"
                        label="Title"
                        isRequired
                        error={errors.title}
                        placeholder="Enter title"
                    />

                    {resource.thumbnail && (
                        <Preview
                            src={resource.thumbnail}
                            alt={resource.title}
                            fill={true}
                        />
                    )}

                    <FileUpload
                        register={register}
                        name="thumbnail"
                        isRequired={false}
                        accepted={{
                            image: [
                                "jpeg",
                                "jpg",
                                "webp",
                                "png",
                            ],
                        }}
                        error={errors.thumbnail}
                        label="Thumbnail"
                        setValue={setValue}
                        multiple={false}
                    />

                    <Select
                        control={control}
                        error={errors.category_id}
                        isRequired
                        label="Category"
                        name="category_id"
                        options={
                            EducationCategory?.data?.edges?.map(
                                ({ node }) => ({
                                    label: node.name,
                                    value: node.education_category_id,
                                })
                            ) ?? []
                        }
                    />

                    <Select
                        control={control}
                        name="type"
                        label="Type"
                        isRequired
                        error={errors.type}
                        options={EducationResourceType.options.map(
                            (resourceType) => ({
                                label: resourceType.replaceAll(
                                    "_",
                                    " "
                                ),
                                value: resourceType,
                            })
                        )}
                    />

                    <Textarea
                        isRequired
                        label="Summary"
                        register={register}
                        name="summary"
                        errors={errors.summary}
                        style={{
                            height: "100px",
                        }}
                    />

                    {type === "ARTICLE" && (
                        <ReactEditor
                            error={errors.content}
                            height={200}
                            isRequired
                            label="Content"
                            name="content"
                            setValue={setValue}
                            value={content}
                        />
                    )}

                    {type === "CATALOGUE" && (
                        <FileUpload
                            label="File Upload"
                            name="attachments"
                            register={register}
                            setValue={setValue}
                            accepted={{
                                image: [
                                    "jpeg",
                                    "jpg",
                                    "webp",
                                    "png",
                                ],
                            }}
                            error={
                                Array.isArray(
                                    errors.attachments
                                )
                                    ? errors
                                        .attachments[0]
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
                            error={
                                errors.external_link
                            }
                        />
                    )}

                    <div
                        className={
                            styles.footer
                        }
                    >
                     
                        <Button
                            variant="primary"
                            size="md"
                            type="submit"
                        >
                            <Text size="sm">
                                {mutation.isPending
                                    ? "Saving..."
                                    : "Save"}
                            </Text>
                        </Button>
                    </div>
                </Form>
            </div>
        </Template>
    );
}