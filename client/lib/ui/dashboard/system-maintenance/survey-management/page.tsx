"use client";

import Template from "@/lib/ui/template";
import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/survey-mangement.module.scss";
import { TbEye, TbTrash } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { format } from "date-fns";

import Search from "@/components/Search/search";
import Pagination from "@/components/Pagination/pagination";
import Input from "@/components/Input/input";
import Textarea from "@/components/Textarea/textarea";
import Table from "@/components/Table/table";
import ModalForm from "@/components/Modal/modal-form";
import Form from "@/components/Form/form";
import Text from "@/components/Typography/Text/text";
import Button from "@/components/Button/button";

import {
  SurveyIDInterface,
  SurveyResponse,
} from "@/lib/interface/survey-management/survey.interface";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormHook from "@/lib/hooks/useFormHook";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import { CreateSurveySchema } from "@/lib/validations/survey-management.validation";

import { CreateSurveyFormField } from "@/lib/types/survey-management";
import EmptyState from "@/lib/ui/no-data";
import { toastError, toastSuccess } from "@/lib/ui/toast";
import { sessionStore } from "@/lib/utils/sessions";

export default function SurveyManagement() {
  const token = sessionStore.get();
  const pathname = usePathname();
  const router = useRouter();
  const limit = 20;

  const [open, setOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [endCursor, setEndCursor] = useState<string>("");
  const [startCursor, setStartCursor] = useState<string>("");

  const { handleSubmit: handleDelete } = useForm();

  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);

  const [selectedSurveyTitle, setSelectedSurveyTitle] = useState<string>("");

  const [deleteToggle, setDeleteToggle] = useState<boolean>(false);

  const { register, handleSubmit, errors } = useFormHook({
    schema: CreateSurveySchema,
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useFormMutation({
    key: ["CreateSurvey"],
    url: "maintenance/survey",
    method: "POST",
    headers,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
  });

  const surveyMutation = useFormMutation({
    key: ["SurveyDelete"],
    method: "PUT",
    url: selectedSurveyId
      ? `maintenance/survey/${selectedSurveyId}`
      : "maintenance/survey",
    headers,
  });

  const { data, isLoading } = useFormQuery<SurveyResponse>({
    key: ["SurveyManagement", search, endCursor, startCursor, currentPage],
    url: "maintenance/survey",
    headers,
    params: {
      search,
      limit,
      after: endCursor || undefined,
      before: startCursor || undefined,
    },
  });

  const onHandleClear = () => {
    setSearch("");
    setCurrentPage(1);
    setEndCursor("");
    setStartCursor("");
  };

  const onHandleSubmit: SubmitHandler<CreateSurveyFormField> = async (data) => {
    mutation.mutate(
      {
        title: data.title,
        description: data.description,
      },
      {
        onSuccess: (data: unknown) => {
          const res = data as SurveyIDInterface;

          activityMutation.mutate(
            {
              type: "CREATE",
              description: `User created a new survey: ${res.data.title}.`,
              user_id: token?.data.user_id,
            },
            {
              onSuccess: (activityData) => {
                console.log("Activity Log created", activityData);
              },
              onError: (error) => {
                console.error("Failed to create activity log:", error);
              },
            },
          );

          toastSuccess({
            title: "Survey Created Successfully",
            body: "The new survey has been created and is now ready to configure.",
          });

          router.push(`${pathname}/${res.data.slug}`);
        },
        onError: () => {
          toastError({
            title: "Failed to Create Survey",
            body: "Something went wrong while creating the survey. Please try again.",
          });
        },
      },
    );
  };

  const onHandleAddNew = () => {
    setOpen((prev) => !prev);
  };

  const onHandleNextPage = () => {
    const pageInfo = data?.data.pageInfo;

    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    setStartCursor("");
    setEndCursor(pageInfo.endCursor);
    setCurrentPage((prev) => prev + 1);
  };

  const onHandlePrevPage = () => {
    const pageInfo = data?.data.pageInfo;

    if (!pageInfo?.hasPrevPage || !pageInfo.startCursor) {
      return;
    }

    setEndCursor("");
    setStartCursor(pageInfo.startCursor);
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setCurrentPage(1);
    setEndCursor("");
    setStartCursor("");
  };

  const onHandleSurveyDelete = (survey_id: string, title: string) => {
    setSelectedSurveyId(survey_id);
    setSelectedSurveyTitle(title);
    setDeleteToggle(true);
  };

  const onDeleteMutation = () => {
    if (!selectedSurveyId) {
      return;
    }

    surveyMutation.mutate(null, {
      onSuccess: () => {
        toastSuccess({
          title: "Survey Deleted",
          body: `"${selectedSurveyTitle}" has been deleted successfully.`,
        });

        activityMutation.mutate(
          {
            type: "DELETE",
            description: `User deleted the survey "${selectedSurveyTitle}".`,
            user_id: token?.data.user_id,
          },
          {
            onSuccess: (activityData) => {
              console.log("Activity Log created", activityData);
            },
            onError: (error) => {
              console.error("Failed to create activity log:", error);
            },
          },
        );

        setDeleteToggle(false);
        setSelectedSurveyId(null);
        setSelectedSurveyTitle("");

        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
      },
      onError: () => {
        toastError({
          title: "Delete Failed",
          body: `Unable to delete the survey "${selectedSurveyTitle}". Please try again.`,
        });
      },
    });
  };

  return (
    <Template
      title="Survey Management"
      onModalOpenToggle={open}
      onHandleCloseToggle={onHandleAddNew}
      modal={{
        modalTitle: "Add new Survey",
        handleSubmit,
        onHandleSubmit,
      }}
      modalChildren={
        <>
          <Input
            label="Title"
            name="title"
            register={register}
            error={errors.title}
          />

          <Textarea
            label="Description"
            name="description"
            register={register}
            errors={errors.description}
            isRequired={true}
          />
        </>
      }
    >
      <div className={styles.container}>
        <Search
          onChange={onHandleSearch}
          value={search}
          onClear={onHandleClear}
        />

        {isLoading ? (
          <EmptyState title="Loading" description="Loading surveys..." />
        ) : data?.data.totalCount === 0 ? (
          <EmptyState
            title="No data found"
            description="There is currently no data to display."
          />
        ) : (
          <Table size="sm" variant="bordered">
            <Table.Header>
              <Table.Row>
                <Table.Head>Title</Table.Head>
                <Table.Head>Total No. of Questions</Table.Head>
                <Table.Head>Total No. of Respondents</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Date Created</Table.Head>
                <Table.Head>Actions</Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data?.data.edges.map(
                ({
                  node: {
                    survey_id,
                    slug,
                    title,
                    questions,
                    created_at,
                    is_published,
                    _count,
                  },
                }) => (
                  <Table.Row key={survey_id}>
                    <Table.Cell>{title}</Table.Cell>

                    <Table.Cell>{questions.length}</Table.Cell>

                    <Table.Cell>{_count?.responses ?? 0}</Table.Cell>

                    <Table.Cell>
                      {is_published ? "PUBLISHED" : "DRAFT"}
                    </Table.Cell>

                    <Table.Cell>
                      {format(new Date(created_at), "MMMM dd, yyyy")}
                    </Table.Cell>

                    <Table.Cell>
                      <button
                        type="button"
                        onClick={() => router.push(`${pathname}/${slug}`)}
                      >
                        <TbEye size={23} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onHandleSurveyDelete(survey_id, title)}
                        disabled={surveyMutation.isPending}
                      >
                        <TbTrash size={20} />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ),
              )}
            </Table.Body>
          </Table>
        )}

        {deleteToggle && selectedSurveyId && (
          <ModalForm
            title="Delete Survey"
            onHandleCloseToggle={() => {
              setDeleteToggle(false);
              setSelectedSurveyId(null);
              setSelectedSurveyTitle("");
            }}
          >
            <Form onSubmit={handleDelete(onDeleteMutation)}>
              <Text size="md" style={{ fontWeight: "400" }}>
                Are you sure you want to delete{" "}
                <strong>"{selectedSurveyTitle}"</strong>? This action is
                permanent and cannot be undone. The survey and its associated
                information will be permanently deleted.
              </Text>

              <div className={styles.model_footer}>
                <Button
                  type="button"
                  onClick={() => {
                    setDeleteToggle(false);
                    setSelectedSurveyId(null);
                    setSelectedSurveyTitle("");
                  }}
                  size="sm"
                  variant="neutral"
                  types="outline"
                >
                  <Text size="sm">Cancel</Text>
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  disabled={surveyMutation.isPending}
                >
                  <Text size="sm">
                    {surveyMutation.isPending ? "Deleting..." : "Confirm"}
                  </Text>
                </Button>
              </div>
            </Form>
          </ModalForm>
        )}

        <Pagination
          currentPage={currentPage}
          pageSize={limit}
          totalItems={data?.data.totalCount ?? 0}
          currentItems={data?.data.edges?.length ?? 0}
          hasNextPage={data?.data.pageInfo.hasNextPage ?? false}
          hasPrevPage={data?.data.pageInfo.hasPrevPage ?? false}
          onNext={onHandleNextPage}
          onPrev={onHandlePrevPage}
        />
      </div>
    </Template>
  );
}
