"use client"

import React from "react";
import toast from "react-hot-toast";
import { TbCircleCheckFilled, TbAlertTriangleFilled, TbInfoCircleFilled } from "react-icons/tb";
import { format } from "date-fns";
import styles from "@/styles/lib/toast/index.module.scss";
import { PrimaryFont, SecondaryFont } from "@/lib/typography";

type ToastType = "success" | "error" | "warning";

interface ToastProps {
    title: string;
    body?: string;
}

const ICONS = {
    success: TbCircleCheckFilled,
    error: TbInfoCircleFilled,
    warning: TbAlertTriangleFilled,
};

export function showToast(type: ToastType, { title, body }: ToastProps) {
    const Icon = ICONS[type];

    return toast.custom((t) => (
        <div
            className={`${styles.container} ${styles[type]} ${t.visible ? styles.enter : styles.leave
                }`}
            onClick={() => toast.dismiss(t.id)}
        >
            <div className={styles.icon_container}>
                <Icon size={26} />
            </div>

            <div className={styles.body_container}>
                <h1 className={PrimaryFont.className}>{title}</h1>

                {body && (
                    <p className={SecondaryFont.className}>{body}</p>
                )}

                <span className={styles.timestamp}>
                    {format(new Date(), "dd MMM yyyy hh:mm aa")}
                </span>
            </div>
        </div>
    ));
}

export const toastSuccess = (props: ToastProps) =>
    showToast("success", props);

export const toastError = (props: ToastProps) =>
    showToast("error", props);

export const toastWarning = (props: ToastProps) =>
    showToast("warning", props);