"use client";

import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/enagagement/survey.module.scss";
import { usePathname, useRouter } from "next/navigation";

import Grid from "@/components/Grid/grid";
import Search from "@/components/Search/search";
import Template from "@/lib/ui/template";
import headers from "@/lib/utils/headers";
import useFormQuery from "@/lib/hooks/useQuery";
import { SurveyResponse } from "@/lib/interface/survey-management/survey.interface";
import Pagination from "@/components/Pagination/pagination";
import SurveyCard from "./survey-card";
import NoData from "@/lib/ui/no-data";
import EmptyState from "@/lib/ui/no-data";

export default function Surveypage() {
  const pathname = usePathname();
  const router = useRouter();
  const limit = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [endCursor, setEndCursor] = useState<string>("");
  const [startCursor, setStartCursor] = useState<string>("");

  const { data, isLoading } = useFormQuery<SurveyResponse>({
    key: ["SurveyManagement", search, endCursor, startCursor, currentPage],
    url: "maintenance/survey",
    headers,
    params: {
      search,
      limit,
      after: endCursor || undefined,
      before: startCursor || undefined,
      is_published: false,
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

  const onHandleClear = () => {
    setSearch("");
    setCurrentPage(1);
    setEndCursor("");
    setStartCursor("");
  };

  const onHandleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
    setCurrentPage(1);
    setEndCursor("");
    setStartCursor("");
  };

  return (
    <Template title="Survey">
      <div className={styles.container}>
        <Grid>
          <Search
            onChange={onHandleSearch}
            onClear={onHandleClear}
            value={search}
          />
        </Grid>

        <Grid max={"1fr"} min={330}>
          {data?.data.totalCount === 0 ? (
            <EmptyState
              title="No data found"
              description="There is currently no data to display."
            />
          ) : (
            data?.data.edges.map(
              ({
                node: { survey_id, slug, title, description, questions },
              }) => (
                <SurveyCard
                  key={survey_id}
                  title={title}
                  description={description}
                  total={questions.length}
                  slug={slug}
                />
              ),
            )
          )}
        </Grid>

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
