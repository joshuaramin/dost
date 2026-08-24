"use client";

import React, { useEffect } from "react";
import {
    SubmitHandler,
    useFieldArray,
} from "react-hook-form";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

import Form from "@/components/Form/form";

import useFormHook from "@/lib/hooks/useFormHook";
import TemplateSurvey from "@/lib/ui/dashboard/template-survey";
import { SurveyQuestionFormSchema } from "@/lib/validations/survey-management.validation";
import { SurveyQuestionFormField, SurveyQuestionField } from "@/lib/types/survey-management";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import { SurveyIDInterface } from "@/lib/interface/survey-management/survey.interface";
import QuestionCard from "./question-card";

interface Props {
    slug: string;
}

export default function SurveyID({ slug }: Props) {
    const { data, isLoading } = useFormQuery<SurveyIDInterface>({
        key: ["Survey", slug],
        url: `maintenance/survey/${slug}`,
        headers,
    });

    const {
        register,
        control,
        handleSubmit,
        errors,
        setValue,
        reset,
    } = useFormHook<typeof SurveyQuestionFormSchema>({
        schema: SurveyQuestionFormSchema,
        defaultValues: {
            questions: [
                {
                    survey_question_id: undefined,
                    text: "",
                    type: "SHORT_TEXT",
                    order_index: 1,
                    is_required: true,
                    options: [],
                },
            ],
        },
    });

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "questions",
    });

    useEffect(() => {
        if (!data?.data) {
            return;
        }

        const questions = data.data.questions ?? [];

        if (!questions.length) {
            reset({
                questions: [
                    {
                        survey_question_id: undefined,
                        text: "",
                        type: "SHORT_TEXT",
                        order_index: 1,
                        is_required: true,
                        options: [],
                    },
                ],
            });

            return;
        }

        const mappedQuestions: SurveyQuestionField[] =
            questions
                .filter(
                    (question) =>
                        !question.is_deleted
                )
                .sort((a, b) => {
                    if (
                        a.order_index !==
                        b.order_index
                    ) {
                        return (
                            a.order_index -
                            b.order_index
                        );
                    }

                    return (
                        new Date(
                            a.created_at
                        ).getTime() -
                        new Date(
                            b.created_at
                        ).getTime()
                    );
                })
                .map(
                    (
                        question,
                        questionIndex
                    ) => {
                        const mappedOptions =
                            (
                                question.options ??
                                []
                            )
                                .filter(
                                    (option) =>
                                        !option.is_deleted
                                )
                                .sort(
                                    (a, b) => {
                                        if (
                                            a.order_index !==
                                            b.order_index
                                        ) {
                                            return (
                                                a.order_index -
                                                b.order_index
                                            );
                                        }

                                        return (
                                            new Date(
                                                a.created_at
                                            ).getTime() -
                                            new Date(
                                                b.created_at
                                            ).getTime()
                                        );
                                    }
                                )
                                .map(
                                    (
                                        option,
                                        optionIndex
                                    ) => ({
                                        question_option_id:
                                            option.question_option_id,
                                        label:
                                            option.label,
                                        value:
                                            option.value,
                                        order_index:
                                            optionIndex + 1,
                                    })
                                );

                        return {
                            survey_question_id:
                                question.survey_question_id,
                            text: question.text,
                            type: question.type,
                            is_required:
                                question.is_required,
                            order_index:
                                questionIndex + 1,
                            options: mappedOptions,
                        };
                    }
                );

        reset({
            questions: mappedQuestions,
        });
    }, [data, reset]);

    const mutation =
        useFormMutation<SurveyQuestionFormField>({
            key: [
                "UpdateSurveyQuestions",
                slug,
            ],
            method: "POST",
            url: `maintenance/survey/${slug}`,
            headers,
        });

    const handleAddQuestion = () => {
        append({
            survey_question_id: undefined,
            text: "",
            type: "SHORT_TEXT",
            order_index: fields.length + 1,
            is_required: false,
            options: [],
        });
    };

    const handleRemoveQuestion = (index: number) => {
        if (fields.length <= 1) {
            return;
        }

        remove(index);
    };

    const onHandleSubmit: SubmitHandler<
        SurveyQuestionFormField
    > = (formData) => {
        console.log("SUBMIT DATA", formData);

        mutation.mutate(formData, {
            onSuccess: (response) => {
                alert("SUCCESS");
                console.log(response);
            },
            onError: (error) => {
                console.error(error);
            },
        });
    };

    return (
        <TemplateSurvey
            title={data?.data.title ?? ""}
        >
            <div className={styles.container}>
                <Form
                    onSubmit={handleSubmit(
                        onHandleSubmit
                    )}
                >
                    <div className={styles.question_container}>
                        {fields.map(
                            (field, index) => (
                                <QuestionCard
                                    slug={slug}
                                    key={field.id}
                                    control={control}
                                    errors={errors}
                                    fieldId={field.id}
                                    index={index}
                                    register={register}
                                    setValue={setValue}
                                    onRemove={handleRemoveQuestion}
                                    survey_question_id={field.survey_question_id}
                                    onAdd={handleAddQuestion}
                                    isLast={
                                        index ===
                                        fields.length -
                                            1
                                    }
                                    isOnlyQuestion={
                                        fields.length ===
                                        1
                                    }
                                />
                            )
                        )}
                    </div>
                </Form>
            </div>
        </TemplateSurvey>
    );
}