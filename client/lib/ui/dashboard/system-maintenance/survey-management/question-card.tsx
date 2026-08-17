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

import {
    SurveyQuestionFormField,
} from "@/lib/types/survey-management";

interface Props {
    index: number;
    fieldId: string;
    control: Control<SurveyQuestionFormField>;
    register: UseFormRegister<SurveyQuestionFormField>;
    errors: FieldErrors<SurveyQuestionFormField>;
    setValue: UseFormSetValue<SurveyQuestionFormField>;
    onRemove: (index: number) => void;
    onAdd: () => void;
    isLast: boolean;
    isOnlyQuestion: boolean;
}

export default function QuestionCard({
    index,
    fieldId,
    control,
    register,
    errors,
    setValue,
    onRemove,
    onAdd,
    isLast,
    isOnlyQuestion,

}: Props) {
    const questionType = useWatch({
        control,
        name: `questionnaire.${index}.type`,
    });

    const questionOptions = questionnaire?.[index].options


    console.log("QUESITON OPTIONS", questionOptions)
    const questionErrors =
        errors.questionnaire?.[index];

    const isChoiceQuestion =
        questionType === "MULTIPLE_CHOICE" ||
        questionType === "CHECKBOX";

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
                            name={`questionnaire.${index}.text`}
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
                            name={`questionnaire.${index}.type`}
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
                {(questionOptions || []).map(({label, value, order_index, question_option_id }) => (
                    <Text size="sm" key={index}>{label}</Text>
                ))}
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
                        onClick={() => onRemove(index)}
                        disabled={isOnlyQuestion}
                    >
                        <TbTrash size={23} />
                    </Button>

                    <hr />

                    <ButtonToggle
                        control={control}
                        falseName="Not Required"
                        label=""
                        name={`questionnaire.${index}.is_required`}
                        setValue={setValue}
                        trueName="Required"
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
                        onClick={onAdd}
                    >
                        <Text size="sm">
                            ADD MORE
                        </Text>
                    </Button>
                </div>
            )}
        </div>
    );
}