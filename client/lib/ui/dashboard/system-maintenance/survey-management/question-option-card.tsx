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
        name: (`questionnaire.${index}.options` as unknown) as ArrayPath<T>,
    });


    const toOptionValue = (label: string) =>
    label
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w]/g, "");


    return (
        <div className={styles.option_container}>
            {optionFields.map((option, optionIndex) => (
                <div key={option.id} className={styles.option}>
                    <Input
                        label=""
                        register={register}
                        name={
                            `questionnaire.${index}.options.${optionIndex}.label` as Path<T>
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        onChange={(e) => {
                            const label = e.target.value;

                            setValue(
                                `questionnaire.${index}.options.${optionIndex}.label` as Path<T>,
                                label as never
                            );

                            setValue(
                                `questionnaire.${index}.options.${optionIndex}.value` as Path<T>,
                                toOptionValue(label) as never
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
                        disabled={optionFields.length <= 1}
                        onClick={() => removeOption(optionIndex)}
                    >
                        <TbX />
                    </Button>
                </div>
            ))}

        <div className={styles.option_button}>
                <Button
                    type="button"
                    types="outline"
                    size="sm"
                    variant="primary"
                    onClick={() =>
                        appendOption({
                            label: "",
                            value: "",
                            order_index: optionFields.length + 1,
                        } as never)
                    }
                >
                    <TbPlus />
                    Add Option
                </Button>
            </div>
        </div>
    );
}