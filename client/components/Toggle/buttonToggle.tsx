"use client";

import React from "react";
import {
    Control,
    Controller,
    FieldPathValue,
    FieldValues,
    Path,
} from "react-hook-form";

import Text from "@/components/Typography/Text/text";
import styles from "@/styles/components/Toggle/buttonToggle.module.scss";

interface ButtonToggleProps<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
> {
    name: TName;
    control: Control<TFieldValues>;
    trueValue: FieldPathValue<TFieldValues, TName>;
    falseValue: FieldPathValue<TFieldValues, TName>;
    trueLabel?: React.ReactNode;
    falseLabel?: React.ReactNode;
    label?: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

export default function ButtonToggle<
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>,
>({
    name,
    control,
    trueValue,
    falseValue,
    trueLabel,
    falseLabel,
    label,
    disabled = false,
    className,
}: ButtonToggleProps<TFieldValues, TName>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => {
                const isTrue = Object.is(
                    field.value,
                    trueValue
                );

                const currentLabel = isTrue
                    ? trueLabel ?? String(trueValue)
                    : falseLabel ?? String(falseValue);

                const handleToggle = () => {
                    if (disabled) {
                        return;
                    }

                    field.onChange(
                        isTrue
                            ? falseValue
                            : trueValue
                    );
                };

                return (
                    <div
                        className={`${styles.statusContainer} ${
                            className ?? ""
                        }`}
                    >
                        {label && (
                            <label>
                                {label}
                            </label>
                        )}

                        <div className={styles.col2}>
                            <button
                                type="button"
                                disabled={disabled}
                                aria-pressed={isTrue}
                                className={`${styles.statusToggle} ${
                                    isTrue
                                        ? styles.active
                                        : ""
                                }`}
                                onClick={handleToggle}
                            >
                                <span
                                    className={
                                        styles.thumb
                                    }
                                />
                            </button>

                            <Text size="sm">
                                {currentLabel}
                            </Text>
                        </div>
                    </div>
                );
            }}
        />
    );
}