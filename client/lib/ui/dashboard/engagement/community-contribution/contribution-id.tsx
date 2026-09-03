"use client";

import { useState } from "react";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";
import {
    ContributionIdInterface,
} from "@/lib/interface/contribution/contribution.interface";
import headers from "@/lib/utils/headers";
import Template from "@/lib/ui/template";
import styles from "@/styles/lib/ui/dashboard/enagagement/contribution-id.module.scss";
import Text from "@/components/Typography/Text/text";
import Image from 'next/image'
import { sessionStore } from "@/lib/utils/sessions";

interface Props {
    id: string;
}

type ContributionStatus =
    | "PENDING"
    | "APPROVED"
    | "DECLINED";

type ContributionClassification =
    | "PENDING"
    | "FACTUAL"
    | "MISINFORMATION";

const normalizeClassification = (
    value?: string | number,
): ContributionClassification => {
    switch (value) {
        case "FACTUAL":
        case 2:
            return "FACTUAL";

        case "MISINFORMATION":
        case 1:
            return "MISINFORMATION";

        case "PENDING":
        case 0:
        default:
            return "PENDING";
    }
};

export default function ContributionID({ id }: Props) {

    const token = sessionStore.get()
    const [status, setStatus] = useState<ContributionStatus>("PENDING");
    const [reason, setReason] = useState("");

    const [reasonError, setReasonError] = useState("");

    const { data, isLoading } = useFormQuery<ContributionIdInterface>({
            key: ["ContributionId", id],
            url: `maintenance/contribution/${id}`,
            headers,
        });

    const contribution = data?.data;

    const { mutate, isPending } = useFormMutation({
        key: ["ContributionID", id],
        url: `maintenance/contribution/${id}`,
        method: "PATCH",
        headers
    });

    const handleStatusUpdate = ( nextStatus: ContributionStatus ) => {
        if (nextStatus === "DECLINED" && !reason.trim()) {
            setReasonError(
                "A reason is required when declining a contribution.",
            );

            return;
        }

        setReasonError("");

        setStatus(nextStatus);

        mutate({
            id: contribution?.contribution_id,
            status: nextStatus,
            review_at: new Date(Date.now()),
            review_reason: reason.trim(),
            user_id: token?.data.user_id
        });
    };

    const statusClass = {
        PENDING: styles.statusPending,
        APPROVED: styles.statusApproved,
        DECLINED: styles.statusDeclined,
    }[status];

    const classificationClass = {
        PENDING: styles.classificationPending,
        FACTUAL: styles.classificationFactual,
        MISINFORMATION:
            styles.classificationMisinformation,
    }[
        normalizeClassification(
            contribution?.classification,
        )
    ];

    if (isLoading) {
        return (
            <Template title="Contribution">
                <div className={styles.loading}>
                    <div className={styles.spinner} />

                    <span>
                        Loading contribution...
                    </span>
                </div>
            </Template>
        );
    }

    if (!contribution) {
        return (
            <Template title="Contribution">
                <div className={styles.notFound}>
                    <div className={styles.notFoundIcon}>
                        !
                    </div>

                    <h2>
                        Contribution not found
                    </h2>

                    <p>
                        The contribution may have been
                        deleted or is no longer available.
                    </p>
                </div>
            </Template>
        );
    }

    return (
        <div>
            <div className={styles.page}>
                {token?.data.user_id}
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <Text size="sm"
                                className={
                                    styles.eyebrow
                                }
                            >
                                Contribution Review
                            </Text>

                            <Text size="sm"
                                className={
                                    styles.contributionId
                                }
                            >
                                ID:{" "}
                                {
                                    contribution.contribution_id
                                }
                            </Text>
                        </div>

                        <Text size="sm"
                            className={`${styles.status} ${statusClass}`}
                        >
                            <Text size="sm"
                                className={
                                    styles.statusDot
                                }
                            >

                            {status}
                            </Text>
                        </Text>
                    </div>

                    <div className={styles.headerMeta}>
                        <Text size="sm">
                            {contribution.type}
                        </Text>

                        <Text size="sm"
                            className={
                                styles.metaDivider
                            }
                        >
                            /
                        </Text>

                        <Text size="sm"
                            className={`${styles.classification} ${classificationClass}`}
                        >
                            {contribution.classification}
                        </Text>
                    </div>
                </div>

                <div className={styles.contentLayout}>
                    <main className={styles.main}>
                        <section className={styles.card}>
                            <div
                                className={
                                    styles.cardHeader
                                }
                            >
                                <div>
                                    <Text size="sm"
                                        className={
                                            styles.sectionLabel
                                        }
                                    >
                                        Submission
                                    </Text>

                                    <h2>
                                        Contribution Content
                                    </h2>
                                </div>
                            </div>

                            {contribution.image_url && (
                                <div
                                    className={
                                        styles.imageContainer
                                    }
                                >
                                    <Image
                                        src={
                                            contribution.image_url
                                        }
                                        alt={
                                            contribution.type
                                        }
                                        className={
                                            styles.image
                                        }
                                    />
                                </div>
                            )}

                            <div
                                className={
                                    styles.contentBody
                                }
                            >
                                {contribution.content}
                            </div>

                            {contribution.source_url && (
                                <div
                                    className={
                                        styles.sourceContainer
                                    }
                                >
                                    <a
                                        href={
                                            contribution.source_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={
                                            styles.source
                                        }
                                    >
                                        <Text size="sm"
                                            className={
                                                styles.sourceIcon
                                            }
                                        >
                                            ↗
                                        </Text>

                                        <Text size="sm"
                                            className={
                                                styles.sourceText
                                            }
                                        >
                                            <small>
                                                Original
                                                Source
                                            </small>

                                            <strong>
                                                View original
                                                source
                                            </strong>
                                        </Text>

                                        <Text size="sm"
                                            className={
                                                styles.sourceArrow
                                            }
                                        >
                                            →
                                        </Text >
                                    </a>
                                </div>
                            )}
                        </section>

                        <section className={styles.card}>
                            <div
                                className={
                                    styles.cardHeader
                                }
                            >
                                <div>
                                    <Text size="sm"
                                        className={
                                            styles.sectionLabel
                                        }
                                    >
                                        Analysis
                                    </Text>

                                    <h2>
                                        Classification
                                    </h2>
                                </div>

                                <Text size="sm"
                                    className={`${styles.classification} ${classificationClass}`}
                                >
                                    {
                                        contribution.classification
                                    }
                                </Text>
                            </div>

                            <div
                                className={
                                    styles.analysisGrid
                                }
                            >
                                <div
                                    className={
                                        styles.analysisItem
                                    }
                                >
                                    <span>
                                        Classification
                                    </span>

                                    <strong>
                                        {
                                            contribution.classification
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.analysisItem
                                    }
                                >
                                    <span>
                                        Classification
                                        Method
                                    </span>

                                    <strong>
                                        {
                                            contribution.classification_method
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.analysisItem
                                    }
                                >
                                    <span>
                                        Confidence Score
                                    </span>

                                    <strong>
                                        {contribution.confidence_score !==
                                            null &&
                                        contribution.confidence_score !==
                                            undefined
                                            ? `${contribution.confidence_score}%`
                                            : "N/A"}
                                    </strong>
                                </div>
                            </div>

                            {contribution.confidence_score !==
                                null &&
                                contribution.confidence_score !==
                                    undefined && (
                                    <div
                                        className={
                                            styles.confidence
                                        }
                                    >
                                        <div
                                            className={
                                                styles.confidenceHeader
                                            }
                                        >
                                            <Text size="md">
                                                AI Confidence
                                            </Text>

                                            <strong>
                                                {
                                                    contribution.confidence_score
                                                }
                                                %
                                            </strong>
                                        </div>

                                        <div
                                            className={
                                                styles.progressTrack
                                            }
                                        >
                                            <div
                                                className={
                                                    styles.progressValue
                                                }
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        Math.max(
                                                            0,
                                                            Number(
                                                                contribution.confidence_score,
                                                            ),
                                                        ),
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                        </section>

                        <section className={styles.card}>
                            <div
                                className={
                                    styles.cardHeader
                                }
                            >
                                <div>
                                    <Text size="md"
                                        className={
                                            styles.sectionLabel
                                        }
                                    >
                                        Geography
                                    </Text>

                                    <h2>
                                        Location
                                    </h2>
                                </div>
                            </div>

                            <div
                                className={
                                    styles.locationGrid
                                }
                            >
                                <div
                                    className={
                                        styles.locationItem
                                    }
                                >
                                    <span>
                                        Province
                                    </span>

                                    <strong>
                                        {
                                            contribution.province
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.locationItem
                                    }
                                >
                                    <span>
                                        Municipality
                                    </span>

                                    <strong>
                                        {contribution.municipality ||
                                            "N/A"}
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.locationItem
                                    }
                                >
                                    <span>
                                        Barangay
                                    </span>

                                    <strong>
                                        {contribution.barangay ||
                                            "N/A"}
                                    </strong>
                                </div>
                            </div>
                        </section>
                    </main>

                    <aside className={styles.sidebar}>
                        <section
                            className={`${styles.card} ${styles.reviewCard}`}
                        >
                            <div
                                className={
                                    styles.reviewHeader
                                }
                            >
                                <div
                                    className={
                                        styles.reviewIcon
                                    }
                                >
                                    ✓
                                </div>

                                <div>
                                    <span
                                        className={
                                            styles.sectionLabel
                                        }
                                    >
                                        Moderation
                                    </span>

                                    <h2>
                                        Review Decision
                                    </h2>
                                </div>
                            </div>

                            <p
                                className={
                                    styles.reviewDescription
                                }
                            >
                                Review the contribution
                                content, classification,
                                and source before deciding
                                whether it should be
                                approved.
                            </p>

                            <div
                                className={
                                    styles.currentStatus
                                }
                            >
                                <span>
                                    Current Status
                                </span>

                                <strong
                                    className={
                                        statusClass
                                    }
                                >
                                    {status}
                                </strong>
                            </div>

                            <div
                                className={
                                    styles.reasonField
                                }
                            >
                                <div
                                    className={
                                        styles.reasonLabel
                                    }
                                >
                                    <label htmlFor="reason">
                                        Review Reason
                                    </label>

                                    <span>
                                        Required for decline
                                    </span>
                                </div>

                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(event) => {
                                        setReason(
                                            event.target
                                                .value,
                                        );

                                        if (
                                            event.target.value.trim()
                                        ) {
                                            setReasonError(
                                                "",
                                            );
                                        }
                                    }}
                                    placeholder="Enter the reason for your review decision..."
                                    rows={5}
                                    disabled={isPending}
                                    className={
                                        reasonError
                                            ? styles.textareaError
                                            : styles.textarea
                                    }
                                />

                                {reasonError && (
                                    <span
                                        className={
                                            styles.errorMessage
                                        }
                                    >
                                        {reasonError}
                                    </span>
                                )}
                            </div>

                            <div
                                className={
                                    styles.reviewActions
                                }
                            >
                                <button
                                    type="button"
                                    className={
                                        styles.approveButton
                                    }
                                    disabled={
                                        isPending ||
                                        status ===
                                            "APPROVED"
                                    }
                                    onClick={() =>
                                        handleStatusUpdate(
                                            "APPROVED",
                                        )
                                    }
                                >
                                    <span>✓</span>

                                    {isPending &&
                                    status ===
                                        "APPROVED"
                                        ? "Approving..."
                                        : "Approve"}
                                </button>

                                <button
                                    type="button"
                                    className={
                                        styles.declineButton
                                    }
                                    disabled={
                                        isPending ||
                                        status ===
                                            "DECLINED"
                                    }
                                    onClick={() =>
                                        handleStatusUpdate(
                                            "DECLINED",
                                        )
                                    }
                                >
                                    <span>×</span>

                                    {isPending &&
                                    status ===
                                        "DECLINED"
                                        ? "Declining..."
                                        : "Decline"}
                                </button>

                                {status !== "PENDING" && (
                                    <button
                                        type="button"
                                        className={
                                            styles.pendingButton
                                        }
                                        disabled={
                                            isPending
                                        }
                                        onClick={() =>
                                            handleStatusUpdate(
                                                "PENDING",
                                            )
                                        }
                                    >
                                        Return to Pending
                                    </button>
                                )}
                            </div>
                        </section>

                        <section className={styles.card}>
                            <div
                                className={
                                    styles.cardHeader
                                }
                            >
                                <div>
                                    <span
                                        className={
                                            styles.sectionLabel
                                        }
                                    >
                                        Details
                                    </span>

                                    <h2>
                                        Submission Details
                                    </h2>
                                </div>
                            </div>

                            <div
                                className={
                                    styles.details
                                }
                            >
                                <div
                                    className={
                                        styles.detailRow
                                    }
                                >
                                    <span>
                                        Type
                                    </span>

                                    <strong>
                                        {
                                            contribution.type
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.detailRow
                                    }
                                >
                                    <span>
                                        Classification
                                    </span>

                                    <strong>
                                        {
                                            contribution.classification
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.detailRow
                                    }
                                >
                                    <span>
                                        Method
                                    </span>

                                    <strong>
                                        {
                                            contribution.classification_method
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.detailRow
                                    }
                                >
                                    <span>
                                        Status
                                    </span>

                                    <strong
                                        className={
                                            statusClass
                                        }
                                    >
                                        {status}
                                    </strong>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </div>
    );
}