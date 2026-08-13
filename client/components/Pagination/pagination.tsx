"use client";

import React from "react";
import styles from "@/styles/components/Pagination/pagination.module.scss";
import Text from "../Typography/Text/text";
import { TbChevronLeft, TbChevronRight } from "react-icons/tb";

interface Props {
    totalItems: number;
    currentItems: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onNext: () => void;
    onPrev: () => void;
}

export default function Pagination({
    totalItems,
    currentItems,
    currentPage,
    pageSize,
    hasNextPage,
    hasPrevPage,
    onNext,
    onPrev,
}: Props) {
    const showingFrom =
        totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

    const showingTo =
        totalItems === 0
            ? 0
            : Math.min(
                  (currentPage - 1) * pageSize + currentItems,
                  totalItems
              );

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
                    aria-label="Previous page"
                >
                    <TbChevronLeft size={20} />
                </button>

                <Text size="md">
                    {showingFrom}-{showingTo} / {totalItems}
                </Text>

                <button
                    type="button"
                    disabled={!hasNextPage}
                    onClick={onNext}
                    aria-label="Next page"
                >
                    <TbChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}