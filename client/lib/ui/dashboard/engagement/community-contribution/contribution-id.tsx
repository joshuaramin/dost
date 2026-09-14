"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/contribution-id.module.scss";
import Image from "next/image";
import { TbMoodSad, TbMoodHappy, TbMoodNeutral } from "react-icons/tb";
import Link from "next/link";

import Title from "@/components/Typography/Title/title";
import Textarea from "@/components/Textarea/textarea";
import Text from "@/components/Typography/Text/text";

import useFormHook from "@/lib/hooks/useFormHook";
import useFormMutation from "@/lib/hooks/useMutation";
import useFormQuery from "@/lib/hooks/useQuery";
import headers from "@/lib/utils/headers";
import Template from "@/lib/ui/template";
import { UpdateContributionSchema } from "@/lib/validations/contribution.validation";
import { sessionStore } from "@/lib/utils/sessions";
import { ContributionIdInterface } from "@/lib/interface/contribution/contribution.interface";
import cn from "@/lib/utils/cn";
import { toastSuccess } from "@/lib/ui/toast";
import Paragraph from "@/components/Typography/Paragraph/paragraph";

interface Props {
  id: string;
}

type ContributionStatus = "PENDING" | "APPROVED" | "DECLINED";

type ContributionClassification = "PENDING" | "FACTUAL" | "MISINFORMATION";

type ContributionSentiment = "POSITIVE" | "NEGATIVE" | "NEUTRAL";

const normalizeStatus = (
  value?: string | number | null,
): ContributionStatus => {
  switch (value) {
    case "APPROVED":
    case 2:
      return "APPROVED";

    case "DECLINED":
    case 1:
      return "DECLINED";

    case "PENDING":
    case 0:
    default:
      return "PENDING";
  }
};

const normalizeClassification = (
  value?: string | number | null,
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

const normalizeSentiment = (
  value?: string | number | null,
): ContributionSentiment => {
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
      return <TbMoodHappy size={23} />;

    case "NEGATIVE":
      return <TbMoodSad size={23} />;

    case "NEUTRAL":
    default:
      return <TbMoodNeutral size={23} />;
  }
};

export default function ContributionID({ id }: Props) {
  const token = sessionStore.get();

  const { data, isLoading } = useFormQuery<ContributionIdInterface>({
    key: ["ContributionId", id],
    url: `maintenance/contribution/${id}`,
    headers,
  });

  const contribution = data?.data;

  const [status, setStatus] = useState<ContributionStatus>("PENDING");
  const [sentiment, setSentiment] = useState<ContributionSentiment>("NEUTRAL");
  const [reasonError, setReasonError] = useState("");

  const { register, errors, setValue, getValues } = useFormHook({
    schema: UpdateContributionSchema,
    defaultValues: {
      contribution_id: "",
      sentiment: "",
      status: "",
      review_reason: "",
      user_id: "",
    },
  });

  const mutation = useFormMutation({
    key: ["ContributionID", id],
    url: `maintenance/contribution/${id}`,
    method: "PATCH",
    headers,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
  });

  useEffect(() => {
    if (!contribution) {
      return;
    }

    const normalizedStatus = normalizeStatus(contribution.status);
    const normalizedSentiment = normalizeSentiment(contribution.sentiment);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(normalizedStatus);
    setSentiment(normalizedSentiment);

    setValue("contribution_id", id);
    setValue("status", normalizedStatus);
    setValue("sentiment", normalizedSentiment);
    setValue("user_id", token?.data.user_id || "");
  }, [contribution, id, setValue, token?.data.user_id]);

  const classification = normalizeClassification(contribution?.classification);

  const classificationClass = {
    PENDING: styles.classificationPending,
    FACTUAL: styles.classificationFactual,
    MISINFORMATION: styles.classificationMisinformation,
  }[classification];

  const statusClass = {
    PENDING: styles.statusPending,
    APPROVED: styles.statusApproved,
    DECLINED: styles.statusDeclined,
  }[status];

  const handleSentimentChange = (value: ContributionSentiment) => {
    setSentiment(value);
    setValue("sentiment", value);
  };

  const onSubmit = (newStatus: ContributionStatus) => {
    const formData = getValues();

    const reviewReason = String(formData.review_reason || "").trim();

    if (newStatus === "DECLINED" && !reviewReason) {
      setReasonError("Reason for decline is required");
      return;
    }

    setReasonError("");

    const selectedSentiment = normalizeSentiment(
      formData.sentiment || sentiment,
    );

    mutation.mutate(
      {
        contribution_id: id,
        status: newStatus,
        review_at: new Date().toISOString(),
        review_reason: reviewReason,
        sentiment: selectedSentiment,
        user_id: token?.data.user_id,
      },
      {
        onSuccess: () => {
          setStatus(newStatus);
          setSentiment(selectedSentiment);

          setValue("status", newStatus);
          setValue("sentiment", selectedSentiment);

          toastSuccess({
            title: "Contribution Updated Successfully",
            body: `The contribution has been marked as ${newStatus.toLowerCase()}.`,
          });

          activityMutation.mutate(
            {
              type: "UPDATE",
              description: `User updated the status of contribution ID: ${id}.`,
              user_id: token?.data.user_id,
            },
            {
              onSuccess: (data) => {
                {
                  console.log("Acitvity Log created", data);
                }
              },
            },
          );
        },
        onError: (err) => {
          console.log(err);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Template title="Contribution">
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <span>Loading contribution...</span>
        </div>
      </Template>
    );
  }

  if (!contribution) {
    return (
      <Template title="Contribution">
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>!</div>

          <h2>Contribution not found</h2>

          <Paragraph>
            The contribution may have been deleted or is no longer available.
          </Paragraph>
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

                  <h2>Contribution Content</h2>
                </div>
              </div>

              {contribution.image_url && (
                <div className={styles.imageContainer}>
                  <Image
                    src={contribution.image_url}
                    alt={contribution.type}
                    className={styles.image}
                    width={1200}
                    height={800}
                  />
                </div>
              )}

              <div className={styles.contentBody}>{contribution.content}</div>

              {contribution.source_url && (
                <div className={styles.sourceContainer}>
                  <Link
                    href={contribution.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.source}
                  >
                    <Text size="sm" className={styles.sourceIcon}>
                      ↗
                    </Text>

                    <Text size="sm" className={styles.sourceText}>
                      <small>Original Source</small>
                      <strong>View original source</strong>
                    </Text>

                    <Text size="sm" className={styles.sourceArrow}>
                      →
                    </Text>
                  </Link>
                </div>
              )}
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <Text size="sm" className={styles.sectionLabel}>
                    Analysis
                  </Text>

                  <h2>Classification</h2>
                </div>

                <Text
                  size="sm"
                  className={`${styles.classification} ${classificationClass}`}
                >
                  {classification}
                </Text>
              </div>

              <div className={styles.analysisGrid}>
                <div className={styles.analysisItem}>
                  <span>Classification</span>
                  <strong>{classification}</strong>
                </div>

                <div className={styles.analysisItem}>
                  <span>Classification Method</span>
                  <strong>{contribution.classification_method || "N/A"}</strong>
                </div>

                <div className={styles.analysisItem}>
                  <Text size="sm">Confidence Score</Text>

                  <Text size="lg">
                    {contribution.confidence_score !== null &&
                    contribution.confidence_score !== undefined
                      ? `${contribution.confidence_score}%`
                      : "N/A"}
                  </Text>
                </div>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <Text size="sm" className={styles.sectionLabel}>
                    Geography
                  </Text>

                  <h2>Location</h2>
                </div>
              </div>

              <div className={styles.locationGrid}>
                <div className={styles.locationItem}>
                  <Text size="lg">Province</Text>
                  <strong>{contribution.province}</strong>
                </div>

                <div className={styles.locationItem}>
                  <Text size="lg">Municipality</Text>
                  <strong>{contribution.municipality || "N/A"}</strong>
                </div>

                <div className={styles.locationItem}>
                  <span>Barangay</span>
                  <strong>{contribution.barangay || "N/A"}</strong>
                </div>
              </div>
            </section>
          </main>

          <aside className={styles.sidebar}>
            <section className={`${styles.card} ${styles.reviewCard}`}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewIcon}>✓</div>

                <div>
                  <span className={styles.sectionLabel}>Moderation</span>

                  <Title size="md">Review Decision</Title>
                </div>
              </div>

              <p className={styles.reviewDescription}>
                Review the contribution content, classification, sentiment, and
                source before deciding whether it should be approved.
              </p>

              <div className={styles.currentStatus}>
                <Text size="sm">Current Status</Text>

                <strong className={statusClass}>{status}</strong>
              </div>

              <div className={styles.reviewSentiment}>
                <div className={styles.reviewSentimentHeader}>
                  {["POSITIVE", "NEUTRAL", "NEGATIVE"].map((value) => {
                    const sentimentValue = value as ContributionSentiment;

                    const isSelected = sentiment === sentimentValue;

                    return (
                      <div
                        className={styles.container_sentinment}
                        key={sentimentValue}
                      >
                        <button
                          type="button"
                          className={cn(
                            styles.sentimentBadge,
                            isSelected && styles.sentimentBadgeActive,
                          )}
                          aria-pressed={isSelected}
                          onClick={() => handleSentimentChange(sentimentValue)}
                        >
                          {getSentimentIcon(sentimentValue)}

                          <Text size="sm">{sentimentValue}</Text>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {status === "PENDING" ? (
                <>
                  <div className={styles.reasonField}>
                    <div className={styles.reasonLabel}>
                      <Text size="sm">Required for decline</Text>
                    </div>

                    <Textarea
                      register={register}
                      cols={6}
                      name="review_reason"
                      placeholder="Enter the reason for your review decision"
                      label="Review Reason"
                      errors={errors.review_reason}
                    />

                    {reasonError && (
                      <span className={styles.errorMessage}>{reasonError}</span>
                    )}
                  </div>

                  <div className={styles.reviewActions}>
                    <button
                      type="button"
                      className={styles.approveButton}
                      disabled={mutation.isPending}
                      onClick={() => onSubmit("APPROVED")}
                    >
                      <span>✓</span>

                      {mutation.isPending ? "Approving..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      className={styles.declineButton}
                      disabled={mutation.isPending}
                      onClick={() => onSubmit("DECLINED")}
                    >
                      <span>×</span>

                      {mutation.isPending ? "Declining..." : "Decline"}
                    </button>
                  </div>
                </>
              ) : null}
            </section>

            {contribution.confidence_score !== null &&
              contribution.confidence_score !== undefined && (
                <section className={styles.card}>
                  <div className={styles.confidence}>
                    <div className={styles.confidenceHeader}>
                      <Text size="md">Classification Confidence</Text>

                      <strong>{contribution.confidence_score}%</strong>
                    </div>

                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressValue}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(0, Number(contribution.confidence_score)),
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
