"use client";

import React, { ChangeEvent, useState } from "react";
import styles from "@/styles/components/Select/select.module.scss";
import {
    Control,
    Controller,
    FieldError,
    FieldPath,
    FieldValues,
} from "react-hook-form";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";
import Text from "../Typography/Text/text";

type Option = {
    value: string;
    label: string;
};

interface Props<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    isRequired: boolean;
    error?: FieldError;
    options: Option[];
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Select<T extends FieldValues>({
    control,
    name,
    label,
    isRequired,
    error,
    options,
    onChange,
    ...props
}: Props<T>) {
    const [toggle, setToggle] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <div {...props} className={styles.container}>
                    <div className={styles.header}>
                        <label>{label}</label>
                        {isRequired && (
                            <span className={styles.isRequired}>*</span>
                        )}
                    </div>

                    <div className={styles.select}>
                        <div
                            className={
                                error
                                    ? styles.selectError
                                    : styles.selectContainer
                            }
                        >
                            <Text size="sm">
                                {options.find(
                                    (option) => option.value === field.value
                                )?.label ??
                                    `Please select a ${label.toLowerCase()}`}
                            </Text>

                            <button
                                type="button"
                                onClick={() => setToggle((prev) => !prev)}
                            >
                                {toggle ? (
                                    <TbCaretUpFilled size={23} />
                                ) : (
                                    <TbCaretDownFilled size={23} />
                                )}
                            </button>
                        </div>

                        {toggle && (
                            <div
                                className={
                                    error
                                        ? styles.optionContainerError
                                        : styles.optionContainer
                                }
                            >
                                <input
                                    type="text"
                                    placeholder="Search here"
                                    onChange={onChange}
                                />

                                <div className={styles.option}>
                                    {options.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            className={styles.option}
                                            onClick={() => {
                                                console.log("Before:", field.value);
                                                console.log("Setting:", option.value);

                                                field.onChange(option.value);

                                                setTimeout(() => {
                                                    console.log("After:", field.value);
                                                }, 0);

                                                setToggle(false);
                                            }}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.errorBody}>
                        <span className={styles.error}>
                            {error?.message}
                        </span>
                    </div>
                </div>
            )}
        />
    );
}