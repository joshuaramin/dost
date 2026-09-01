"use client";

import React from "react";
import {
    Control,
    FieldErrors,
    UseFormGetValues,
    UseFormRegister,
    UseFormSetValue,
    useWatch,
} from "react-hook-form";
import { TbTrash } from "react-icons/tb";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

import Input from "@/components/Input/input";
import InputReadOnly from "@/components/Input/input-readonly";
import TextareaReadOnly from "@/components/Textarea/textarea-readonly";
import Button from "@/components/Button/button";
import ButtonToggle from "@/components/Toggle/buttonToggle";
import { Select } from "@/components/Select/select";
import Text from "@/components/Typography/Text/text";

import QuestionOptionCard from "./question-option-card";

import { SurveyQuestionFormField } from "@/lib/types/survey-management";
import useFormMutation from "@/lib/hooks/useMutation";
import headers from "@/lib/utils/headers";
import { toastSuccess } from "@/lib/ui/toast";

interface Props {
    slug: string;
    index: number;
    fieldId: string;
    survey_question_id?: string;
    control: Control<SurveyQuestionFormField>;
    register: UseFormRegister<SurveyQuestionFormField>;
    getValues: UseFormGetValues<SurveyQuestionFormField>;
    errors: FieldErrors<SurveyQuestionFormField>;
    setValue: UseFormSetValue<SurveyQuestionFormField>;
    isLast: boolean;
    isOnlyQuestion: boolean;
}

export default function QuestionCard({
    slug,
    index,
    fieldId,
    control,
    register,
    getValues,
    errors,
    setValue,
    survey_question_id,
    isLast,
    isOnlyQuestion,
}: Props) {
    const question = useWatch({
        control,
        name: `questions.${index}`,
    });

    const questionErrors = errors.questions?.[index];

    const questionId =
        question?.survey_question_id ??
        survey_question_id;

    const questionType =
        question?.type ?? "SHORT_TEXT";

    const isChoiceQuestion =
        questionType === "MULTIPLE_CHOICE" ||
        questionType === "CHECKBOX";

    const addMoreMutation =
        useFormMutation<
            SurveyQuestionFormField["questions"][number]
        >({
            key: ["AddMore", slug],
            method: "POST",
            url: `maintenance/survey/${slug}`,
            headers,
        });

    const deleteQuestionMutation =
        useFormMutation({
            key: [
                "SoftDelete",
                questionId ?? `question-${fieldId}`,
            ],
            method: "PATCH",
            url: questionId
                ? `maintenance/survey/${survey_question_id}`
                : "",
            headers,
        });

    const updateQuestionMutation =
        useFormMutation({
            key: [
                "UpdateQuestion",
                questionId ?? `question-${fieldId}`,
            ],
            method: "PATCH",
            url: questionId
                ? `maintenance/survey/question/${survey_question_id}`
                : "",
            headers,
        });

    const handleAddMore = () => {
        const questions = getValues("questions");

        const nextOrderIndex = questions.length + 1;

        addMoreMutation.mutate(
            {
                text: "",
                type: "SHORT_TEXT",
                order_index: nextOrderIndex,
                is_required: false,
                options: [],
            },
            {
                onSuccess: () => {
                    toastSuccess({
                        title: "Created Successfully",
                        body: "The question has been successfully created.",
                    });
                },
                onError: (error) => {
                    console.error(
                        "Failed to create survey question:",
                        error
                    );
                },
            }
        );
    };

    const handleDeleteCard = () => {
        if (!questionId) {
            return;
        }

        deleteQuestionMutation.mutate(null, {
            onSuccess: () => {
            
                toastSuccess({
                    title: "Deleted Successfully",
                    body: "The item has been successfully deleted.",
                });
            },
            onError: (error) => {
                console.error(
                    "Failed to delete survey question:",
                    error
                );
            },
        });
    };

    const handleUpdateCard = () => {
        const currentQuestion = getValues(
            `questions.${index}`
        );

        if (!currentQuestion) {
            return;
        }

        const currentQuestionId =
            currentQuestion.survey_question_id ??
            survey_question_id;

        if (!currentQuestionId) {
            return;
        }

        const currentType =
            currentQuestion.type ?? "SHORT_TEXT";

        const currentIsChoiceQuestion =
            currentType === "MULTIPLE_CHOICE" ||
            currentType === "CHECKBOX";

        const payload = {
            text: currentQuestion.text ?? "",
            type: currentType,
            is_required:
                currentQuestion.is_required === true,
            order_index: index + 1,
            options: currentIsChoiceQuestion
                ? (currentQuestion.options ?? []).map(
                    (option, optionIndex) => ({
                        question_option_id:
                        option.question_option_id,
                        label: option.label ?? "",
                        value: option.value ?? "",
                        order_index:
                        optionIndex + 1,
                    })
                )
            : [],
        };

        updateQuestionMutation.mutate(
            payload,
            {
                onSuccess: () => {
                    toastSuccess({
                        title: "Updated Successfully",
                        body: "The question has been successfully updated.",
                    });
                },
                onError: (error) => {
                    console.error(
                        "Failed to update survey question:",
                        error
                    );
                },
            }
        );
    };

    return (
        <div
            className={styles.question_card}
            data-question-id={
                questionId ?? fieldId
            }
        >
            <div className={styles.col_1}>
                <div className={styles.body}>
                    <div className={styles.questions}>
                        <Input
                            type="text"
                            label="Question"
                            register={register}
                            name={`questions.${index}.text`}
                            placeholder="Enter your question"
                            error={
                                questionErrors?.text
                            }
                            isRequired
                        />

                        {questionType ===
                            "SHORT_TEXT" && (
                            <InputReadOnly
                                readOnly
                                placeholder="Short Answer"
                            />
                        )}

                        {questionType ===
                            "LONG_TEXT" && (
                            <TextareaReadOnly
                                readOnly
                                placeholder="Long Answer"
                            />
                        )}

                        {isChoiceQuestion && (
                            <QuestionOptionCard
                                questionIndex={
                                    index
                                }
                                control={
                                    control
                                }
                                register={
                                    register
                                }
                                errors={
                                    errors
                                }
                                setValue={
                                    setValue
                                }
                            />
                        )}
                    </div>

                    <div
                        className={
                            styles.choice
                        }
                    >
                        <Select
                            control={
                                control
                            }
                            name={`questions.${index}.type`}
                            label="Question Type"
                            isRequired
                            options={[
                                {
                                    label: "Short Text",
                                    value: "SHORT_TEXT",
                                },
                                {
                                    label: "Long Text",
                                    value: "LONG_TEXT",
                                },
                                {
                                    label: "Multiple Choice",
                                    value: "MULTIPLE_CHOICE",
                                },
                                {
                                    label: "Checkbox",
                                    value: "CHECKBOX",
                                },
                            ]}
                            error={
                                questionErrors?.type
                            }
                        />
                    </div>
                </div>
            </div>

            <div
                className={styles.divider}
            />

            <div
                className={styles.footer}
            >
                <div
                    className={
                        styles.footer_1_col_1
                    }
                >
                    <Button
                        types="outline"
                        size="sm"
                        variant={
                            isOnlyQuestion
                                ? "disabled"
                                : "danger"
                        }
                        type="button"
                        onClick={
                            handleDeleteCard
                        }
                        disabled={
                            isOnlyQuestion ||
                            deleteQuestionMutation.isPending
                        }
                    >
                        <TbTrash
                            size={20}
                        />
                    </Button>

                    <hr />

                    <ButtonToggle
                        falseValue={
                            false
                        }
                        trueValue={
                            true
                        }
                        trueLabel="Required"
                        falseLabel="Not Required"
                        name={`questions.${index}.is_required`}
                        control={
                            control
                        }
                    />

                    <Button
                        type="button"
                        types="outline"
                        size="sm"
                        variant="primary"
                        onClick={
                            handleUpdateCard
                        }
                        disabled={
                            !questionId ||
                            updateQuestionMutation.isPending
                        }
                    >
                        <Text size="sm">
                            {updateQuestionMutation.isPending
                                ? "UPDATING..."
                                : "UPDATE"}
                        </Text>
                    </Button>
                </div>
            </div>

            {isLast && (
                <div
                    className={
                        styles.add
                    }
                >
                    <Button
                        type="button"
                        types="outline"
                        size="sm"
                        variant="primary"
                        onClick={
                            handleAddMore
                        }
                        disabled={
                            addMoreMutation.isPending
                        }
                    >
                        <Text size="sm">
                            {addMoreMutation.isPending
                                ? "CREATING..."
                                : "ADD MORE"}
                        </Text>
                    </Button>
                </div>
            )}
        </div>
    );
}