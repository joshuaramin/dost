"use client";

import React from "react";
import styles from "@/styles/components/Pagination/pagination.module.scss";
import Text from "../Typography/Text/text";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

interface Props {
    totalItems: number;
    currentItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onNext: () => void;
    onPrev: () => void;
}

export default function Pagination({
    totalItems,
    currentItems,
    hasNextPage,
    hasPrevPage,
    onNext,
    onPrev,
}: Props) {
    const showingFrom = totalItems === 0 ? 0 : 1;
    const showingTo = Math.min(currentItems, totalItems);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Text size="sm">
                    Showing {showingFrom}-{showingTo} of {totalItems} entries
                </Text>
            </div>

            <div className={styles.footer}>
                <button
                    type="button"
                    disabled={!hasPrevPage}
                    onClick={onPrev}
                >
                    <TbChevronLeft size={20} />
                </button>

                <Text size="md">
                    {showingTo} / {totalItems}
                </Text>

                <button
                    type="button"
                    disabled={!hasNextPage}
                    onClick={onNext}
                >
                    <TbChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}