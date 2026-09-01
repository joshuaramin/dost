"use client";

import React from "react";
import styles from "@/styles/components/Button/toggleButton.module.scss";

interface ToggleButtonProps {
    active: boolean;
    onToggle: () => void;
    activeLabel?: string;
    inactiveLabel?: string;
    disabled?: boolean;
}

export default function ToggleButton({
    active,
    onToggle,
    activeLabel = "ON",
    inactiveLabel = "OFF",
    disabled = false,
}: ToggleButtonProps) {
    return (
        <button
            type="button"
            className={`${styles.button} ${active ? styles.active : ""}`}
            onClick={onToggle}
            disabled={disabled}
            aria-pressed={active}
        >
            {active ? activeLabel : inactiveLabel}
        </button>
    );
}