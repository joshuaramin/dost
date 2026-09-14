"use client";

import React, { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray } from "react-hook-form";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

//components
import Text from "@/components/Typography/Text/text";
import Title from "@/components/Typography/Title/title";
import Form from "@/components/Form/form";

//lib & hooks
import useFormHook from "@/lib/hooks/useFormHook";
import TemplateSurvey from "@/lib/ui/dashboard/template-survey";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import QuestionCard from "../../../cards/question-card";
import { SurveyIDInterface } from "@/lib/interface/survey-management/survey.interface";
import { SurveyQuestionFormSchema } from "@/lib/validations/survey-management.validation";
import { SurveyQuestionFormField } from "@/lib/types/survey-management";
import { sessionStore } from "@/lib/utils/sessions";

interface Props {
  slug: string;
}

type SurveyTab = "question" | "response";

export default function SurveyID({ slug }: Props) {
  const token = sessionStore.get();
  const [activeTab, setActiveTab] = useState<SurveyTab>("question");

  const { data: SurveyData, isLoading } = useFormQuery<SurveyIDInterface>({
    key: ["Survey", slug],
    url: `maintenance/survey/${slug}`,
    headers,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
  });
  const {
    register,
    control,
    handleSubmit,
    errors,
    setValue,
    reset,
    getValues,
  } = useFormHook<typeof SurveyQuestionFormSchema>({
    schema: SurveyQuestionFormSchema,
    shouldUnregister: false,
    defaultValues: {
      questions: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (!SurveyData?.data) {
      return;
    }

    const questions = SurveyData.data.questions ?? [];

    const activeQuestions = questions
      .filter((question) => question.is_deleted === false)
      .sort((a, b) => {
        if (a.order_index !== b.order_index) {
          return a.order_index - b.order_index;
        }

        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

    if (activeQuestions.length === 0) {
      reset({
        questions: [
          {
            survey_question_id: undefined,
            text: "",
            type: "SHORT_TEXT",
            order_index: 1,
            is_required: false,
            options: [],
          },
        ],
      });

      return;
    }

    const mappedQuestions = activeQuestions.map((question, questionIndex) => {
      const mappedOptions = [...(question.options ?? [])]
        .filter((option) => option.is_deleted === false)
        .sort((a, b) => {
          if (a.order_index !== b.order_index) {
            return a.order_index - b.order_index;
          }

          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        })
        .map((option, optionIndex) => ({
          question_option_id: option.question_option_id,
          label: option.label ?? "",
          value: option.value ?? "",
          order_index: option.order_index ?? optionIndex + 1,
        }));

      return {
        survey_question_id: question.survey_question_id,
        text: question.text ?? "",
        type: question.type,
        order_index: question.order_index ?? questionIndex + 1,
        is_required: question.is_required === true,
        options: mappedOptions,
      };
    });

    reset(
      {
        questions: mappedQuestions,
      },
      {
        keepDefaultValues: false,
      },
    );
  }, [SurveyData?.data, reset]);

  const mutation = useFormMutation<SurveyQuestionFormField>({
    key: ["UpdateSurveyQuestions", slug],
    method: "POST",
    url: `maintenance/survey/${slug}`,
    headers,
  });

  const onHandleSubmit: SubmitHandler<SurveyQuestionFormField> = (formData) => {
    mutation.mutate(formData, {
      onSuccess: (response) => {
        console.log("SUCCESS", response);

        activityMutation.mutate(
          {
            type: "UPDATE",
            description: `User updated the questions for survey: ${slug}.`,
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
      },
      onError: (error) => {
        console.error("Failed to update survey questions:", error);
      },
    });
  };

  if (isLoading) {
    return (
      <TemplateSurvey title="" slug="">
        <div className={styles.container}>
          <div className={styles.question_container}>Loading...</div>
        </div>
      </TemplateSurvey>
    );
  }

  return (
    <TemplateSurvey title={SurveyData?.data.title ?? ""} slug={slug}>
      <div className={styles.sub_header}>
        <button
          type="button"
          className={activeTab === "question" ? styles.active : undefined}
          onClick={() => setActiveTab("question")}
        >
          <Text size="sm">Questions</Text>
        </button>

        <button
          type="button"
          className={activeTab === "response" ? styles.active : undefined}
          onClick={() => setActiveTab("response")}
        >
          <Text size="sm">Responses</Text>
        </button>
      </div>

      {activeTab === "question" && (
        <div className={styles.container}>
          <Form onSubmit={handleSubmit(onHandleSubmit)}>
            <div className={styles.question_container}>
              {fields.map((field, index) => (
                <QuestionCard
                  slug={slug}
                  key={field.id}
                  control={control}
                  getValues={getValues}
                  errors={errors}
                  fieldId={field.id}
                  index={index}
                  register={register}
                  setValue={setValue}
                  survey_question_id={field.survey_question_id}
                  isLast={index === fields.length - 1}
                  isOnlyQuestion={fields.length === 1}
                />
              ))}
            </div>
          </Form>
        </div>
      )}

      {activeTab === "response" && (
        <div className={styles.response_container}>
          {SurveyData?.data?.questions?.map(
            ({ survey_question_id, text, answers }) => (
              <div className={styles.response_card} key={survey_question_id}>
                <div className={styles.response_header}>
                  <Title size="md">{text}</Title>
                </div>

                <div className={styles.answer}>
                  <Text size="sm">Answers: {answers?.length ?? 0}</Text>

                  {answers?.length ? (
                    answers.map(({ answer_text }, index) => (
                      <div
                        className={styles.survey_question_answer_card}
                        key={index}
                      >
                        <Text size="sm">{answer_text || "No answer"}</Text>
                      </div>
                    ))
                  ) : (
                    <Text size="sm">No answers submitted.</Text>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </TemplateSurvey>
  );
}
