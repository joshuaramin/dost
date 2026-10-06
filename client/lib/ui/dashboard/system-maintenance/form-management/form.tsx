"use client";

import React from "react";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/form-management/form-management.module.scss";
import { useRouter } from "next/navigation";
import { TbEye } from "react-icons/tb";

//components
import Grid from "@/components/Grid/grid";
import Table from "@/components/Table/table";
import Pagination from "@/components/Pagination/pagination";
import SelectArray from "@/components/Select/select-array";

//lib
import Template from "@/lib/ui/template";
import useFormQuery from "@/lib/hooks/useQuery";
import EmptyState from "@/lib/ui/no-data";
import headers from "@/lib/utils/headers";
import { FormManagementInterfaceResult } from "@/lib/interface/form-management/form-management.interface";

export default function FormPage() {
  const router = useRouter();
  const limit = 20;

  const [endCursor, setEndCursor] = React.useState<string>("");
  const [startCursor, setStartCursor] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [selectedFormType, setSelectedFormType] = React.useState<string>("");

  const { data } = useFormQuery<FormManagementInterfaceResult>({
    key: ["FormManagement", limit, endCursor, startCursor, selectedFormType],
    url: "maintenance/form",
    headers,
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
    setCurrentPage(1);
    setEndCursor("");
    setStartCursor("");
  };

  const onHandleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setEndCursor("");
    setStartCursor("");
  };

  return (
    <Template title="Form Management" description="">
      <div className={styles.container}>
        <Grid>
          <SelectArray
            name=""
            onSelect={(val) => {
              setSelectedFormType(val);
            }}
            value={selectedFormType}
            full={true}
            label="Form Type"
            options={[
              "Bug",
              "App Crash",
              "Login Issue",
              "Account Problem",
              "Location/Map Issue",
              "Performance Issue",
              "Incorrect Information",
              "Other",
            ].map((option) => ({ value: option, label: option }))}
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
                <Table.Head>Submitted By</Table.Head>
                <Table.Head>Submitted At</Table.Head>
                <Table.Head>Action</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data?.data.edges.map(
                ({ node: { type, form_id, created_at, user } }) => (
                  <Table.Row key={form_id}>
                    <Table.Cell>{type}</Table.Cell>
                    <Table.Cell>
                      {user?.Profile.first_name || "Unknown"}
                    </Table.Cell>
                    <Table.Cell>
                      {new Date(created_at).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() =>
                          router.push(
                            `/dashboard/system-maintenance/form-management/${form_id}`,
                          )
                        }
                      >
                        <TbEye size={18} />
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
