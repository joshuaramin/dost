"use client";

import Template from "@/lib/ui/template";
import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/contribution.module.scss";

import Table from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import { useRouter } from "next/navigation";
import useFormQuery from "@/lib/hooks/useQuery";
import { ContributionResult } from "@/lib/interface/contribution/contribution.interface";
import Grid from "@/components/Grid/grid";
import { TbEye } from "react-icons/tb";
import headers from "@/lib/utils/headers";
import EmptyState from "@/lib/ui/no-data";
import SelectArray from "@/components/Select/select-array";
import Badge from "@/components/Badge/badge";

export default function CommunityContribution() {
  const router = useRouter();

  const limit = 20;
  const [search, setSearch] = useState<string>("");
  const [endCursor, setEndCursor] = useState<string>("");
  const [startCursor, setStartCursor] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [classification, setClassification] = useState<string>("");
  const [sentiment, setSentiment] = useState<string>("");
  const [type, setType] = useState<string>("");

  const { data } = useFormQuery<ContributionResult>({
    key: [
      "Contribution",
      search,
      endCursor,
      startCursor,
      classification,
      sentiment,
      type,
    ],
    url: "maintenance/contribution",
    headers,
    params: {
      limit,
      search,
      after: endCursor,
      before: startCursor,
      currentPage,
      classification,
      sentiment,
      type,
    },
  });

  const onHandleNextPage = () => {
    const pageInfo = data?.data.pageInfo;

    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    setStartCursor("");
    setEndCursor(pageInfo.endCursor);

    setCurrentPage((prev) => prev + 1);
  };

  const onHandlePrevPage = () => {
    const pageInfo = data?.data.pageInfo;

    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) {
      return;
    }

    setStartCursor("");
    setEndCursor(pageInfo.endCursor);

    setCurrentPage((prev) => prev - 1);
  };

  const sentimentVariant = {
    POSITIVE: "success",
    NEGATIVE: "danger",
    NEUTRAL: "default",
  } as const;

  return (
    <Template title="Contribution">
      <div className={styles.container}>
        <Grid>
          <SelectArray
            label="Type"
            onSelect={(val) => setType(val)}
            value={type}
            name="Type"
            full={false}
            options={[
              "Public Discussion",
              "Resource Availability",
              "Healthcare Service",
              "Community Event",
              "Educational Content",
            ].map((val) => ({
              label: val,
              value: val,
            }))}
          />
          <SelectArray
            label="Classification"
            onSelect={(val) => setClassification(val)}
            value={classification}
            name="classification"
            full={false}
            options={["FACTUAL", "MISINFORMATION"].map((val) => ({
              label: val,
              value: val,
            }))}
          />
          <SelectArray
            label="Sentiment"
            onSelect={(val) => setSentiment(val)}
            value={sentiment}
            name="sentiment"
            full={false}
            options={["POSITIVE", "NEUTRAL", "NEGATIVE"].map((val) => ({
              label: val,
              value: val,
            }))}
          />
        </Grid>
        {data?.data.totalCount === 0 ? (
          <EmptyState
            title="No data found"
            description="There is currently no data to display."
          />
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Type</Table.Head>
                <Table.Head>Classification</Table.Head>
                <Table.Head>Classification Method</Table.Head>
                <Table.Head>Sentiment</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Region</Table.Head>
                <Table.Head>Province</Table.Head>
                <Table.Head>Municipality</Table.Head>
                <Table.Head>Barangay</Table.Head>
                <Table.Head>Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data.edges.map(
                ({
                  node: {
                    contribution_id,
                    type,
                    classification,
                    status,
                    classification_method,
                    sentiment,
                    barangay,
                    province,
                    region,
                    municipality,
                  },
                }) => (
                  <Table.Row key={contribution_id}>
                    <Table.Cell>{type}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="md"
                        variant={
                          String(classification) === "FACTUAL"
                            ? "success"
                            : "danger"
                        }
                      >
                        {classification}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{classification_method ?? "N/A"}</Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="md"
                        variant={
                          sentimentVariant[
                            String(sentiment) as keyof typeof sentimentVariant
                          ] ?? "default"
                        }
                      >
                        {sentiment}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge
                        size="md"
                        variant={status === "APPROVED" ? "success" : "danger"}
                      >
                        {status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{region || "N?A"}</Table.Cell>
                    <Table.Cell>{province || "N/A"}</Table.Cell>
                    <Table.Cell>{municipality || "N/A"}</Table.Cell>
                    <Table.Cell>{barangay || "N/A"}</Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/engagement/community-contributions/${contribution_id}`,
                          )
                        }
                      >
                        <TbEye size={23} />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ),
              )}
            </Table.Body>
          </Table>
        )}
        <Pagination
          currentPage={currentPage}
          pageSize={limit}
          totalItems={data?.data.totalCount ?? 0}
          currentItems={data?.data.totalCount ?? 0}
          hasNextPage={data?.data.pageInfo.hasNextPage ?? false}
          hasPrevPage={data?.data.pageInfo.hasPrevPage ?? false}
          onNext={onHandleNextPage}
          onPrev={onHandlePrevPage}
        />
      </div>
    </Template>
  );
}
