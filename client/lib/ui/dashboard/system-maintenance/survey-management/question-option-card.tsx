"use client";

import React from "react";
import {
    Control,
    FieldErrors,
    FieldValues,
    Path,
    ArrayPath,
    UseFormRegister,
    UseFormSetValue,
    useFieldArray,
} from "react-hook-form";
import { TbPlus, TbX } from "react-icons/tb";

import Button from "@/components/Button/button";
import Input from "@/components/Input/input";

import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

interface Props<T extends FieldValues> {
    index: number;
    control: Control<T>;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    setValue: UseFormSetValue<T>;
}

export default function QuestionOptionCard<T extends FieldValues>({
    index,
    control,
    register,
    setValue,
}: Props<T>) {
    const {
        fields: optionFields,
        append: appendOption,
        remove: removeOption,
    } = useFieldArray({
        control,
        name: `questionnaire.${index}.options` as ArrayPath<T>,
    });

    const toOptionValue = (label: string) => {
        return label
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w]/g, "");
    };

    const handleOptionChange = (
        optionIndex: number,
        label: string
    ) => {
        const labelPath =
            `questionnaire.${index}.options.${optionIndex}.label` as Path<T>;

        const valuePath =
            `questionnaire.${index}.options.${optionIndex}.value` as Path<T>;

        setValue(
            labelPath,
            label as never,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );

        setValue(
            valuePath,
            toOptionValue(label) as never,
            {
                shouldDirty: true,
                shouldValidate: true,
            }
        );
    };

    const handleAddOption = () => {
        appendOption({
            label: "",
            value: "",
            order_index: optionFields.length + 1,
        } as never);
    };

    const handleRemoveOption = (
        optionIndex: number
    ) => {
        if (optionFields.length <= 1) {
            return;
        }

        removeOption(optionIndex);
    };

    return (
        <div className={styles.option_container}>
            {optionFields.map((option, optionIndex) => {
                const labelPath =
                    `questionnaire.${index}.options.${optionIndex}.label` as Path<T>;

                return (
                    <div
                        key={option.id}
                        className={styles.option}
                    >
                        <Input
                            label=""
                            register={register}
                            name={labelPath}
                            placeholder={`Option ${optionIndex + 1}`}
                            onChange={(event) => {
                                handleOptionChange(
                                    optionIndex,
                                    event.currentTarget.value
                                );
                            }}
                        />

                        <Button
                            type="button"
                            types="outline"
                            size="sm"
                            variant={
                                optionFields.length <= 1
                                    ? "disabled"
                                    : "danger"
                            }
                            disabled={
                                optionFields.length <= 1
                            }
                            onClick={() =>
                                handleRemoveOption(
                                    optionIndex
                                )
                            }
                        >
                            <TbX />
                        </Button>
                    </div>
                );
            })}

            <div className={styles.option_button}>
                <Button
                    type="button"
                    types="outline"
                    size="sm"
                    variant="primary"
                    onClick={handleAddOption}
                >
                    <TbPlus />
                    Add Option
                </Button>
            </div>
        </div>
    );
}