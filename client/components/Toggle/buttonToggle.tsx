"use client";

import React from "react";
import {
    Control,
    FieldValues,
    Path,
    UseFormSetValue,
    useWatch,
} from "react-hook-form";

import Text from "@/components/Typography/Text/text";
import styles from "@/styles/components/Toggle/buttonToggle.module.scss";

interface ButtonToggleProps<
    T extends FieldValues,
    TrueValue = unknown,
    FalseValue = unknown
> {
    name: Path<T>;
    control: Control<T>;
    setValue: UseFormSetValue<T>;

    trueValue: TrueValue;
    falseValue: FalseValue;

    trueLabel?: React.ReactNode;
    falseLabel?: React.ReactNode;

    label?: React.ReactNode;

    disabled?: boolean;

    shouldDirty?: boolean;
    shouldValidate?: boolean;
    shouldTouch?: boolean;

    className?: string;
}

export default function ButtonToggle<
    T extends FieldValues,
    TrueValue = unknown,
    FalseValue = unknown
>({
    name,
    control,
    setValue,

    trueValue,
    falseValue,

    trueLabel,
    falseLabel,

    label,

    disabled = false,

    shouldDirty = true,
    shouldValidate = true,
    shouldTouch = false,

    className,
}: ButtonToggleProps<T, TrueValue, FalseValue>) {
    const value = useWatch({
        control,
        name,
    });

    const isTrue = Object.is(value, trueValue);

    const currentLabel = isTrue
        ? (trueLabel ?? String(trueValue))
        : (falseLabel ?? String(falseValue));

    const handleToggle = () => {
        if (disabled) {
            return;
        }

        const nextValue = isTrue ? falseValue : trueValue;

        setValue(
            name,
            nextValue as T[Path<T>],
            {
                shouldDirty,
                shouldValidate,
                shouldTouch,
            }
        );
    };

    return (
        <div className={`${styles.statusContainer} ${className ?? ""}`}>
            {label && <label>{label}</label>}

            <div className={styles.col2}>
                <button
                    type="button"
                    disabled={disabled}
                    aria-pressed={isTrue}
                    className={`${styles.statusToggle} ${
                        isTrue ? styles.active : ""
                    }`}
                    onClick={handleToggle}
                >
                    <span className={styles.thumb} />
                </button>

                <Text size="sm">
                    {currentLabel}
                </Text>
            </div>
        </div>
    );
}