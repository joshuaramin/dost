"use client";

import React from "react";
import {
    Control,
    FieldErrors,
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
    survey_question_id?: string
    control: Control<SurveyQuestionFormField>;
    register: UseFormRegister<SurveyQuestionFormField>;
    errors: FieldErrors<SurveyQuestionFormField>;
    setValue: UseFormSetValue<SurveyQuestionFormField>;
    onRemove: (index: number) => void;
    onAdd: (question: SurveyQuestionFormField["questions"][number]) => void;
    isLast: boolean;
    isOnlyQuestion: boolean;
}

export default function QuestionCard({
    slug,
    index,
    fieldId,
    control,
    register,
    errors,
    setValue,
    onRemove,survey_question_id,
    isLast,
    isOnlyQuestion,
}: Props) {
    const questionType = useWatch({
        control,
        name: `questions.${index}.type`,
    });

    const questionErrors = errors.questions?.[index];

    const isChoiceQuestion =
        questionType === "MULTIPLE_CHOICE" ||
        questionType === "CHECKBOX";

    const addMoreMutation =
        useFormMutation<SurveyQuestionFormField["questions"][number]>({
            key: ["AddMore", slug],
            method: "POST",
            url: `maintenance/survey/${slug}`,
            headers,
        });

        const onDeleteSingleCard = useFormMutation({
            key: ["SoftDelete", survey_question_id],
            method: "PATCH",
            url: `maintenance/survey/${survey_question_id}`,
            headers
        })

    const handleAddMore = () => {
        addMoreMutation.mutate(
            {
                text: "",
                type: "SHORT_TEXT",
                order_index: index + 2,
                is_required: false,
                options: [],
            },
            {
                onSuccess: (response) => {
                    
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

    const onDeleteCard = () => {
            onDeleteSingleCard.mutate(null, {
                onSuccess: () => {
                    toastSuccess({
                        title: "Deleted Successfully",
                        body: "The item has been successfully deleted."
                    })
                },
                onError: (error) => {
                     console.error(
                        "Failed to create survey question:",
                        error
                    );
                }
            })
    }
    return (
        <div
            className={styles.question_card}
            key={fieldId}
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
                            error={questionErrors?.text}
                            isRequired
                        />

                        {questionType === "SHORT_TEXT" && (
                            <InputReadOnly
                                readOnly
                                placeholder="Short Answer"
                            />
                        )}

                        {questionType === "LONG_TEXT" && (
                            <TextareaReadOnly
                                readOnly
                                placeholder="Long Answer"
                            />
                        )}

                        {isChoiceQuestion && (
                            <QuestionOptionCard
                                index={index}
                                control={control}
                                register={register}
                                errors={errors}
                                setValue={setValue}
                            />
                        )}
                    </div>

                    <div className={styles.choice}>
                        <Select
                            control={control}
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
                            error={questionErrors?.type}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.footer}>
                <div className={styles.footer_1_col_1}>
                    <Button
                        types="outline"
                        size="sm"
                        variant={
                            isOnlyQuestion
                                ? "disabled"
                                : "danger"
                        }
                        type="button"
                        onClick={() => {
                            onDeleteCard()
                        }}
                        disabled={isOnlyQuestion}
                    >
                        <TbTrash size={20} />
                    </Button>

                    <hr />

                    <ButtonToggle
                        falseValue={false}
                        trueValue={true}
                        trueLabel="Required"
                        falseLabel="Not Required"
                        label=""
                        name={`questions.${index}.is_required`}
                        setValue={setValue}
                        control={control}
                    />
                </div>
            </div>

            {isLast && (
                <div className={styles.add}>
                    <Button
                        type="button"
                        types="outline"
                        size="sm"
                        variant="primary"
                        onClick={handleAddMore}
                        disabled={addMoreMutation.isPending}
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