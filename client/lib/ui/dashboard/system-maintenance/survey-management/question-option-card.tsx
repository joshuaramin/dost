"use client";

import React from "react";
import {
    Control,
    FieldErrors,
    UseFormRegister,
    UseFormSetValue,
    useFieldArray,
    useWatch,
} from "react-hook-form";

import { TbTrash } from "react-icons/tb";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

import Input from "@/components/Input/input";
import Button from "@/components/Button/button";
import ButtonToggle from "@/components/Toggle/buttonToggle";
import Text from "@/components/Typography/Text/text";

import { SurveyQuestionFormField } from "@/lib/types/survey-management";

interface Props {
    questionIndex: number;
    control: Control<SurveyQuestionFormField>;
    register: UseFormRegister<SurveyQuestionFormField>;
    errors: FieldErrors<SurveyQuestionFormField>;
    setValue: UseFormSetValue<SurveyQuestionFormField>;
}

export default function QuestionOptionCard({
    questionIndex,
    control,
    register,
    errors,
    setValue,
}: Props) {
    const question = useWatch({
        control,
        name: `questions.${questionIndex}`,
    });

    const questionErrors =
        errors.questions?.[questionIndex];

    const options = question?.options ?? [];

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: `questions.${questionIndex}.options`,
    });

    const handleAddOption = () => {
        append({
            question_option_id: undefined,
            label: "",
            value: "",
            order_index: fields.length + 1,
        });
    };

    const handleRemoveOption = (optionIndex: number) => {
        if (fields.length <= 1) {
            return;
        }

        remove(optionIndex);
    };

    return (
        <div className={styles.option_container}>
            {fields.map((field, optionIndex) => {
                const optionError =
                    questionErrors?.options?.[
                        optionIndex
                    ];

                return (
                    <div
                        key={field.id}
                        className={styles.option_card}
                    >
                        <div
                            className={
                                styles.option_header
                            }
                        >
                            <Text size="sm">
                                Option{" "}
                                {optionIndex + 1}
                            </Text>

                            <Button
                                type="button"
                                types="outline"
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                    handleRemoveOption(
                                        optionIndex
                                    )
                                }
                                disabled={
                                    fields.length <= 1
                                }
                            >
                                <TbTrash size={18} />
                            </Button>
                        </div>

                        <Input
                            type="text"
                            label="Label"
                            register={register}
                            name={`questions.${questionIndex}.options.${optionIndex}.label`}
                            placeholder="Enter option label"
                            error={
                                optionError?.label
                            }
                            isRequired
                        />

                        <Input
                            type="text"
                            label="Value"
                            register={register}
                            name={`questions.${questionIndex}.options.${optionIndex}.value`}
                            placeholder="Enter option value"
                            error={
                                optionError?.value
                            }
                            isRequired
                        />

                        <input
                            type="hidden"
                            {...register(
                                `questions.${questionIndex}.options.${optionIndex}.order_index`,
                                {
                                    valueAsNumber: true,
                                }
                            )}
                        />
                    </div>
                );
            })}

            <Button
                type="button"
                types="outline"
                size="sm"
                variant="primary"
                onClick={handleAddOption}
            >
                <Text size="sm">
                    ADD OPTION
                </Text>
            </Button>
        </div>
    );
}