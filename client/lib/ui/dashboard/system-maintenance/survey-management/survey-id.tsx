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
import { SurveyQuestionFormField } from "@/lib/types/survey-management";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import { SurveyIDInterface } from "@/lib/interface/survey-management/survey.interface";
import QuestionCard from "./question-card";

interface Props {
    slug: string;
}

export default function SurveyID({ slug }: Props) {
    const { data, isLoading } =
        useFormQuery<SurveyIDInterface>({
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
        getValues,
    } = useFormHook<typeof SurveyQuestionFormSchema>({
        schema: SurveyQuestionFormSchema,
        defaultValues: {
            questions: [],
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

        const activeQuestions = questions
            .filter(
                (question) =>
                    question.is_deleted === false
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
            });

        if (activeQuestions.length === 0) {
            reset({
                questions: [
                    {
                        survey_question_id:
                            undefined,
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

        const mappedQuestions =
            activeQuestions.map(
                (
                    question,
                    questionIndex
                ) => {
                    const mappedOptions =
                        [
                            ...(question.options ??
                                []),
                        ]
                            .filter(
                                (option) =>
                                    option.is_deleted ===
                                    false
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
                                    option,
                                    optionIndex
                                ) => ({
                                    question_option_id:
                                        option.question_option_id,
                                    label:
                                        option.label ??
                                        "",
                                    value:
                                        option.value ??
                                        "",
                                    order_index:
                                        option.order_index ??
                                        optionIndex +
                                            1,
                                })
                            );

                    return {
                        survey_question_id:
                            question.survey_question_id,

                        text:
                            question.text ??
                            "",

                        type:
                            question.type,

                        order_index:
                            question.order_index ??
                            questionIndex + 1,

                        is_required:
                            question.is_required ===
                            true,

                        options:
                            mappedOptions,
                    };
                }
            );

        reset(
            {
                questions:
                    mappedQuestions,
            },
            {
                keepDefaultValues:
                    false,
            }
        );
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
        const questions =
            getValues("questions");

        append({
            survey_question_id:
                undefined,
            text: "",
            type: "SHORT_TEXT",
            order_index:
                questions.length + 1,
            is_required: false,
            options: [],
        });
    };

    const handleRemoveQuestion = (
        index: number
    ) => {
        if (fields.length <= 1) {
            return;
        }

        remove(index);
    };

    const onHandleSubmit:
        SubmitHandler<
            SurveyQuestionFormField
        > = (formData) => {
            mutation.mutate(formData, {
                onSuccess: (response) => {
                    console.log(
                        "SUCCESS",
                        response
                    );
                },
                onError: (error) => {
                    console.error(
                        "Failed to update survey questions:",
                        error
                    );
                },
            });
        };

    if (isLoading) {
        return (
            <TemplateSurvey title="">
                <div
                    className={
                        styles.container
                    }
                >
                    <div
                        className={
                            styles.question_container
                        }
                    >
                        Loading...
                    </div>
                </div>
            </TemplateSurvey>
        );
    }

    return (
        <TemplateSurvey
            title={
                data?.data.title ?? ""
            }
        >
            <div
                className={
                    styles.container
                }
            >
                <Form
                    onSubmit={handleSubmit(
                        onHandleSubmit
                    )}
                >
                    <div
                        className={
                            styles.question_container
                        }
                    >
                        {fields.map(
                            (
                                field,
                                index
                            ) => (
                                <QuestionCard
                                    slug={slug}
                                    key={field.id}
                                    control={
                                        control
                                    }
                                    getValues={
                                        getValues
                                    }
                                    errors={
                                        errors
                                    }
                                    fieldId={
                                        field.id
                                    }
                                    index={
                                        index
                                    }
                                    register={
                                        register
                                    }
                                    setValue={
                                        setValue
                                    }
                                    survey_question_id={field.survey_question_id}
                                
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