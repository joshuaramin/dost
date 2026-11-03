"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/Select/select-array.module.scss";
import Text from "../Typography/Text/text";
import { TbCaretDownFilled, TbCaretUpFilled } from "react-icons/tb";

type Options = {
    value: string;
    label: string;
};

interface Props {
    label?: string;
    labelShow?: boolean;
    full?: boolean;
    name: string;
    options?: Options[];
    value: string;
    onSelect?: (value: string) => void;
    className?: string;
}

export default function SelectArray({
    label,
    full = true,
    labelShow,
    name,
    options = [],
    value,
    onSelect,
    className = "",
}: Props) {
    const [toggle, setToggle] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setToggle(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectArray = [
        styles.container,
        full ? styles.full : "",
        className,
    ].join(" ");

    return (
        <div className={selectArray} ref={containerRef}>
            {label && labelShow && (
                <div className={styles.header}>
                    <label htmlFor={name}>{label}</label>
                </div>
            )}

            <div className={styles.select}>
                <div className={styles.selectContainer}>
                    <Text size="sm">
                        {options.find((option) => option.value === value)?.label ??
                            `Please select a ${label?.toLowerCase()}`}
                    </Text>

                    <button
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={toggle}
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
                        className={styles.optionContainer}
                        role="listbox"
                    >
                        <button
                            type="button"
                            onClick={() => {
                                onSelect?.("");
                                setToggle(false);
                            }}
                        >
                            <Text size="sm">All</Text>
                        </button>

                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                className={styles.option}
                                onClick={() => {
                                    onSelect?.(option.value);
                                    setToggle(false);
                                }}
                            >
                                <Text size="sm">{option.label}</Text>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}