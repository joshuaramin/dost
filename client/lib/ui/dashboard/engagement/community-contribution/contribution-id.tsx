"use client";

import { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/contribution-id.module.scss";
import Image from "next/image";
import {
    TbMoodSad,
    TbMoodHappy,
    TbMoodNeutral,
} from "react-icons/tb";
import { SubmitHandler } from "react-hook-form";
import Link from "next/link";


//Components
import Textarea from "@/components/Textarea/textarea";
import Text from "@/components/Typography/Text/text";


//lib & hooks
import useFormHook from "@/lib/hooks/useFormHook";
import useFormMutation from "@/lib/hooks/useMutation";
import useFormQuery from "@/lib/hooks/useQuery";
import headers from "@/lib/utils/headers";
import Template from "@/lib/ui/template";
import { UpdateContributionSchema } from '@/lib/validations/contribution.validation'
import { UpdateContributionFormField } from "@/lib/types/contribution.types";
import { sessionStore } from "@/lib/utils/sessions";
<<<<<<< HEAD
import { ContributionIdInterface } from "@/lib/interface/contribution/contribution.interface";
=======
import { toastError, toastSuccess } from "@/lib/ui/toast";
>>>>>>> fde791795b86f8b94169ae00a914f7aecbc8f6ef

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

type ContributionSentiment =
    | "POSITIVE"
    | "NEGATIVE"
    | "NEUTRAL";

const normalizeClassification = (value?: string | number | null): ContributionClassification => {
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

const normalizeSentiment = (value?: string | number | null): ContributionSentiment => {
    switch (value) {
        case "POSITIVE":
        case 2:
            return "POSITIVE";

        case "NEGATIVE":
        case 1:
            return "NEGATIVE";

        case "NEUTRAL":
        case 0:
        default:
            return "NEUTRAL";
    }
};

const getSentimentIcon = (sentiment: ContributionSentiment) => {
    switch (sentiment) {
        case "POSITIVE":
            return <TbMoodHappy />;

        case "NEGATIVE":
            return <TbMoodSad />;

        case "NEUTRAL":
        default:
            return <TbMoodNeutral />;
    }
};

export default function ContributionID({ id }: Props) {
    const token = sessionStore.get();

    const [status, setStatus] =
        useState<ContributionStatus>("PENDING");

    const [reason, setReason] = useState("");
    const [reasonError, setReasonError] = useState("");

    const { data, isLoading } =
        useFormQuery<ContributionIdInterface>({
            key: ["ContributionId", id],
            url: `maintenance/contribution/${id}`,
            headers,
        });

    const contribution = data?.data;


    const { register, errors, handleSubmit, setValue } = useFormHook({
    schema: UpdateContributionSchema,
    defaultValues: {
        sentiment: normalizeSentiment(
            data?.data?.sentiment,
        ) as never,
        slug: data?.data?.slug || "",
        status: "" as never,
        review_reason: "",
        user_id: token?.data.user_id || "",
        },
    });


    const mutation = useFormMutation({
        key: ["ContributionID", id],
        url: `maintenance/contribution/${id}`,
        method: "PATCH",
        headers,
    });

    const classification = normalizeClassification(contribution?.classification);

    const classificationClass = {
        PENDING: styles.classificationPending,
        FACTUAL: styles.classificationFactual,
        MISINFORMATION:
            styles.classificationMisinformation,
    }[classification];

    const sentiment = normalizeSentiment(
        contribution?.sentiment,
    );

    const sentimentClass = {
        POSITIVE: styles.sentimentPositive,
        NEGATIVE: styles.sentimentNegative,
        NEUTRAL: styles.sentimentNeutral,
    }[sentiment];
    

    const handleStatusUpdate: SubmitHandler<UpdateContributionFormField> = (data) => {
        if (
            data.status === "DECLINED" &&
            !reason.trim()
        ) {
            setReasonError(
                "A reason is required when declining a contribution.",
            );

            return;
        }

        setReasonError("");

        setStatus(data.status);

        mutation.mutate({
            id: contribution?.contribution_id,
<<<<<<< HEAD
            status: data.status,
            review_at: Date.now(),
            review_reason: data.review_reason,
            sentiment: data.sentiment,
            user_id: token?.data.user_id,
        }, { 
            onSuccess: () => {},
            onError: () => {}
=======
            status: nextStatus,
            review_at: new Date(Date.now()),
            review_reason: reason.trim(),
            user_id: token?.data.user_id
        }, {
            onSuccess: () => {
            toastSuccess({
                title: "Contribution Updated Successfully",
                body: `The contribution has been marked as ${nextStatus.toLowerCase()}.`,
            });
            },
            onError: () => {
                toastError({
                    title: "Failed to Update Contribution",
                    body: "Something went wrong while updating the contribution. Please try again.",
                });
            }
>>>>>>> fde791795b86f8b94169ae00a914f7aecbc8f6ef
        });
    };

    const statusClass = {
        PENDING: styles.statusPending,
        APPROVED: styles.statusApproved,
        DECLINED: styles.statusDeclined,
    }[status];

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
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <div>
                            <Text size="sm" className={styles.eyebrow}>
                                Contribution Review
                            </Text>
                        </div>

                        <Text size="sm" className={`${styles.status} ${statusClass}`}>
                            <Text size="sm" className={styles.statusDot}>
                                {status}
                            </Text>
                        </Text>
                    </div>

                    <div className={styles.headerMeta}>
                        <Text size="sm">{contribution.type}</Text>

                        <Text size="sm" className={styles.metaDivider}>
                            /
                        </Text>

                        <Text
                            size="sm"
                            className={`${styles.classification} ${classificationClass}`}
                        >
                            {classification}
                        </Text>
                    </div>
                </div>

                <div className={styles.contentLayout}>
                    <main className={styles.main}>
                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <Text size="sm" className={styles.sectionLabel}>
                                        Submission
                                    </Text>
                                    <h2>
                                        Contribution Content
                                    </h2>
                                </div>
                            </div>

                            {contribution.image_url && (
                                <div className={styles.imageContainer}>
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
                                        width={1200}
                                        height={800}
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
                                    <Link
                                        href={
                                            contribution.source_url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={
                                            styles.source
                                        }
                                    >
                                        <Text
                                            size="sm"
                                            className={
                                                styles.sourceIcon
                                            }
                                        >
                                            ↗
                                        </Text>

                                        <Text
                                            size="sm"
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

                                        <Text
                                            size="sm"
                                            className={
                                                styles.sourceArrow
                                            }
                                        >
                                            →
                                        </Text>
                                    </Link>
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
                                    <Text
                                        size="sm"
                                        className={
                                            styles.sectionLabel
                                        }
                                    >
                                        Analysis
                                    </Text>

                                    <h2>Classification</h2>
                                </div>

                                <Text size="sm"className={`${styles.classification} ${classificationClass}`}>
                                    {classification}
                                </Text>
                            </div>

                            <div className={styles.analysisGrid}>
                                <div className={styles.analysisItem}>
                                    <span>
                                        Classification
                                    </span>

                                    <strong>
                                        {classification}
                                    </strong>
                                </div>

                                <div className={styles.analysisItem} >
                                    <span>
                                        Classification
                                        Method
                                    </span>

                                    <strong>
                                        {
                                            contribution.classification_method ||
                                            "N/A"
                                        }
                                    </strong>
                                </div>

                                <div className={styles.analysisItem}>
                                    <Text size="sm">
                                        Confidence Score
                                    </Text>

                                    <Text size="lg">
                                        {contribution.confidence_score !==
                                            null &&
                                        contribution.confidence_score !==
                                            undefined
                                            ? `${contribution.confidence_score}%`
                                            : "N/A"}
                                    </Text>
                                </div>
                            </div>
                        </section>

                        <section className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <Text
                                        size="sm"
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

                            <div className={styles.locationGrid}>
                                <div className={styles.locationItem}>
                                    <Text size="lg">
                                        Province
                                    </Text>

                                    <strong>{contribution.province}</strong>
                                </div>

                                <div className={styles.locationItem}>
                                    <Text size="lg">
                                        Municipality
                                    </Text>

                                    <strong>
                                        {contribution.municipality ||
                                            "N/A"}
                                    </strong>
                                </div>

                                <div className={styles.locationItem}>
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
                                sentiment, and source before
                                deciding whether it should be
                                approved.
                            </p>

                            <div className={styles.currentStatus}>
                                <Text size="sm">
                                    Current Status
                                </Text>

                                <strong className={statusClass}>
                                    {status}
                                </strong>
                            </div>
                            <div className={styles.reviewSentiment}>
                                <div className={styles.reviewSentimentHeader}>
                                    {JSON.stringify(sentimentClass, null ,2)}
                                </div>
                            </div>

                            <div className={styles.reasonField}>
                                <div className={styles.reasonLabel}>
                                    <Text size="sm">
                                        Required for decline
                                    </Text>
                                </div>
                                <Textarea 
                                    register={register}
                                    cols={6}
                                    name="review_reason"
                                    placeholder="Enter the reason for your review decissions"
                                    label="Review Reason" 
                                    errors={errors.review_reason}
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
                                        mutation.isPending ||
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

                                    {mutation.isPending &&
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
                                        mutation.isPending ||
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

                                    {mutation.isPending &&
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
                                            mutation.isPending
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

                        {/* <section className={styles.card}>
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

                                    <strong
                                        className={`${styles.classification} ${classificationClass}`}
                                    >
                                        {classification}
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.detailRow
                                    }
                                >
                                    <span>
                                        Classification
                                        Method
                                    </span>

                                    <strong>
                                        {
                                            contribution.classification_method ||
                                            "N/A"
                                        }
                                    </strong>
                                </div>

                                <div
                                    className={
                                        styles.detailRow
                                    }
                                >
                                    <span>
                                        Sentiment
                                    </span>

                                    <strong
                                        className={`${styles.sentiment} ${sentimentClass}`}
                                    >
                                        {getSentimentIcon(
                                            sentiment,
                                        )}

                                        {sentiment}
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
                        </section> */}

                        {contribution.confidence_score !==
                            null &&
                            contribution.confidence_score !==
                                undefined && (
                                <section
                                    className={
                                        styles.card
                                    }
                                >
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
                                                Classification
                                                Confidence
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
                                </section>
                            )}
                    </aside>
                </div>
            </div>
        </div>
    );
}