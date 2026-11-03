"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import styles from "@/styles/components/Select/select.module.scss";
import {
    Control,
    Controller,
    FieldError,
    FieldPath,
    FieldValues,
} from "react-hook-form";
import {
    TbCaretDownFilled,
    TbCaretUpFilled,
} from "react-icons/tb";
import Text from "../Typography/Text/text";

type Option = {
    value: string | number | null | undefined;
    label: string;
};

interface Props<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    isRequired: boolean;
    error?: FieldError;
    options: Option[];
}

export function Select<T extends FieldValues>({
    control,
    name,
    label,
    isRequired,
    error,
    options,
}: Props<T>) {
    const [toggle, setToggle] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return options;
        }

        return options.filter((option) =>
            option.label.toLowerCase().includes(query)
        );
    }, [options, search]);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const selectedOption = options.find(
                    (option) => option.value === field.value
                );

                return (
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <label>{label}</label>

                            {isRequired && (
                                <span className={styles.isRequired}>
                                    *
                                </span>
                            )}
                        </div>

                        <div className={styles.select}>
                            <div
                                className={
                                    error
                                        ? styles.selectError
                                        : styles.selectContainer
                                }
                                onClick={() => {
                                    setToggle((previous) => !previous);
                                    setSearch("");
                                }}
                            >
                                <Text size="sm">
                                    {selectedOption?.label ??
                                        `Please select a ${label.toLowerCase()}`}
                                </Text>

                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();

                                        setToggle(
                                            (previous) => !previous
                                        );

                                        setSearch("");
                                    }}
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
                                        value={search}
                                        placeholder="Search here"
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>
                                        ) => {
                                            setSearch(
                                                event.target.value
                                            );
                                        }}
                                    />

                                    <div className={styles.option}>
                                        {filteredOptions.map(
                                            (option) => (
                                                <button
                                                    key={String(
                                                        option.value
                                                    )}
                                                    type="button"
                                                    className={
                                                        styles.option
                                                    }
                                                    onClick={() => {
                                                        field.onChange(
                                                            option.value
                                                        );

                                                        field.onBlur();

                                                        setToggle(
                                                            false
                                                        );

                                                        setSearch("");
                                                    }}
                                                >
                                                    {option.label}
                                                </button>
                                            )
                                        )}
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
                );
            }}
        />
    );
}