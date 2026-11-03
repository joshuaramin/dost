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
    TbCheck,
} from "react-icons/tb";
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
    error?: FieldError | undefined
    options: Option[];
}

export default function MultiSelect<T extends FieldValues>({
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
                const selectedValues: string[] = Array.isArray(field.value)
                    ? field.value
                    : [];

                const selectedOptions = options.filter((option) =>
                    selectedValues.includes(option.value)
                );

                const allSelected =
                    options.length > 0 &&
                    selectedValues.length === options.length;

                const toggleOption = (value: string) => {
                    if (selectedValues.includes(value)) {
                        field.onChange(
                            selectedValues.filter(
                                (item) => item !== value
                            )
                        );
                    } else {
                        field.onChange([
                            ...selectedValues,
                            value,
                        ]);
                    }
                };

                const selectAll = () => {
                    field.onChange(options.map((option) => option.value));
                };

                const clearAll = () => {
                    field.onChange([]);
                };

                const displayValue = () => {
                    if (selectedValues.length === 0) {
                        return `Please select ${label.toLowerCase()}`;
                    }


                    if (selectedOptions.length <= 2) {
                        return selectedOptions
                            .map((option) => option.label)
                            .join(", ");
                    }

                    return `${selectedOptions.length} selected`;
                };

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
                            >
                                <Text size="sm">
                                    {displayValue()}
                                </Text>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setToggle(
                                            (previous) => !previous
                                        );
                                        setSearch("");
                                    }}
                                >
                                    {toggle ? (
                                        <TbCaretUpFilled
                                            size={23}
                                        />
                                    ) : (
                                        <TbCaretDownFilled
                                            size={23}
                                        />
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

                                    <div
                                        className={styles.option}
                                    >
                                        <button
                                            type="button"
                                            className={styles.option}
                                            onClick={clearAll}
                                        >
                                            <span>All</span>

                                            {selectedValues.length ===
                                                0 && (
                                                <TbCheck
                                                    size={20}
                                                />
                                            )}
                                        </button>

                                        <button
                                            type="button"
                                            className={styles.option}
                                            onClick={selectAll}
                                        >
                                            <span>
                                                Select All
                                            </span>

                                            {allSelected && (
                                                <TbCheck
                                                    size={20}
                                                />
                                            )}
                                        </button>

                                        {filteredOptions.map(
                                            (option) => {
                                                const selected =
                                                    selectedValues.includes(
                                                        option.value
                                                    );

                                                return (
                                                    <button
                                                        key={
                                                            option.value
                                                        }
                                                        type="button"
                                                        className={`${styles.option} ${
                                                            selected
                                                                ? styles.selected
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            toggleOption(
                                                                option.value
                                                            )
                                                        }
                                                    >
                                                        <span>
                                                            {
                                                                option.label
                                                            }
                                                        </span>

                                                        {selected && (
                                                            <TbCheck
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        )}
                                                    </button>
                                                );
                                            }
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