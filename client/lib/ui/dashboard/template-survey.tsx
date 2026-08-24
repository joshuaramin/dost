"use client";

import React, { ReactNode, useState } from "react";
import styles from "@/styles/lib/ui/dashboard/template-survey.module.scss";
import Title from "@/components/Typography/Title/title";
import Text from "@/components/Typography/Text/text";
import { TbCaretDownFilled, TbCopy } from "react-icons/tb";
import { toastSuccess } from "../toast";

interface Props {
    children: ReactNode;
    title: string;
}

export default function TemplateSurvey({ children, title }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleToggle = () => {
        setIsOpen((previous) => !previous);
    };

    const handlePublish = () => {
        setIsOpen(false);
    };

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toastSuccess({
            title: "Link Copied",
            body: "The survey link has been successfully copied to your clipboard.",
        })
        setIsOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Title size="md">{title}</Title>

                <div className={styles.btngroup}>
                    <button type="button" onClick={handlePublish}>
                        <Text size="sm">PUBLISH</Text>
                    </button>

                    <button
                        type="button"
                        onClick={handleToggle}
                        aria-label="Open publish options"
                        aria-expanded={isOpen}
                    >
                        <TbCaretDownFilled size={20} />
                    </button>
                </div>

                {isOpen && (
                    <div className={styles.url}>
                        <button type="button" onClick={handleCopyLink}>
                            <TbCopy size={18} />
                            <Text size="sm">Copy Link</Text>
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.body}>
                {children}
            </div>
        </div>
    );
}