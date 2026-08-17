"use client";

import React, { useEffect } from "react";
import {
    SubmitHandler,
    useFieldArray,
} from "react-hook-form";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

import Button from "@/components/Button/button";
import Form from "@/components/Form/form";

import useFormHook from "@/lib/hooks/useFormHook";
import TemplateSurvey from "@/lib/ui/dashboard/template-survey";

import {
    SurveyQuestionFormSchema,
} from "@/lib/validations/survey-management.validation";

import {
    SurveyQuestionFormField,
    SurveyQuestionField,
} from "@/lib/types/survey-management";

import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";

import headers from "@/lib/utils/headers";

import {
    SurveyIDInterface,
} from "@/lib/interface/survey-management/survey.interface";

import QuestionCard from "./question-card";

interface Props {
    slug: string;
}

export default function SurveyID({
    slug,
}: Props) {
    const {
        data,
        isLoading,
    } = useFormQuery<SurveyIDInterface>({
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
            questionnaire: [
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
        name: "questionnaire",
    });

    useEffect(() => {
        const questions =
            data?.data?.questions ?? [];

        if (!questions.length) {
            reset({
                questionnaire: [
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
                                            optionIndex +
                                            1,
                                    })
                                );

                        return {
                            survey_question_id:
                                question.survey_question_id,

                            text:
                                question.text,

                            type:
                                question.type,

                            is_required:
                                question.is_required,

                            order_index:
                                questionIndex +
                                1,

                            options:
                                mappedOptions,
                        };
                    }
                );

        reset({
            questionnaire:
                mappedQuestions,
        });
    }, [
        data,
        reset,
    ]);

    const mutation =
        useFormMutation({
            key: [
                "UpdateSurveyQuestions",
                slug,
            ],

            method: "POST",

            url: `maintenance/survey/${slug}`,

            headers,
        });

    const handleAddQuestion =
        () => {
            append({
                survey_question_id:
                    undefined,

                text: "",

                type: "SHORT_TEXT",

                order_index:
                    fields.length + 1,

                is_required: false,

                options: [],
            });
        };

    const handleRemoveQuestion =
        (
            index: number
        ) => {
            if (
                fields.length <= 1
            ) {
                return;
            }

            remove(index);
        };

    const onHandleSubmit:
        SubmitHandler<
            SurveyQuestionFormField
        > = (
            formData
        ) => {
            const questionnaire =
                formData.questionnaire.map(
                    (
                        question,
                        questionIndex
                    ) => ({
                        ...question,

                        order_index:
                            questionIndex +
                            1,

                        options:
                            (
                                question.options ??
                                []
                            ).map(
                                (
                                    option,
                                    optionIndex
                                ) => ({
                                    ...option,

                                    order_index:
                                        optionIndex +
                                        1,
                                })
                            ),
                    })
                );

            mutation.mutate({
                questionnaire,
            });
        };

    if (isLoading) {
        return (
            <TemplateSurvey
                title={slug}
            >
                <div
                    className={
                        styles.container
                    }
                >
                    Loading...
                </div>
            </TemplateSurvey>
        );
    }

    return (
        <TemplateSurvey
            title={slug}
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
                                    key={field.id}
                                    control={control}
                                    errors={errors}
                                    fieldId={field.id}
                                    index={index}
                                    register={register}
                                    options={field.options}
                                    setValue={setValue}
                                    onRemove={
                                        handleRemoveQuestion
                                    }
                                    onAdd={
                                        handleAddQuestion
                                    }
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

                    <div
                        className={
                            styles.submit_container
                        }
                    >
                        <Button
                            type="submit"
                            types="filled"
                            size="md"
                            variant="primary"
                        >
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </TemplateSurvey>
    );
}