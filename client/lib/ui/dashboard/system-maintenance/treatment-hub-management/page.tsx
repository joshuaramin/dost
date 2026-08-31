"use client";

import React, { useState } from "react";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/treatment-hub-management/treatment-hub-management.module.scss";
import { TbEdit, TbEye, TbTrash } from "react-icons/tb";
import { useRouter } from "next/navigation";

//components
import SelectArray from "@/components/Select/select-array";
import Grid from "@/components/Grid/grid";
import Pagination from "@/components/Pagination/pagination";
import Search from "@/components/Search/search";
import Table from "@/components/Table/table";

//libs & hooks
import headers from "@/lib/utils/headers";
import Template from "@/lib/ui/template";
import useFormQuery from "@/lib/hooks/useQuery";
import { TreatmentHubResult } from "@/lib/interface/treatment-hub/treatment-hub.interface";
import { RegionsInterfaceResult } from "@/lib/interface/geom/regions.interface";


export default function TreatmentHub() {
    const router = useRouter();

    const limit = 20;

    const [search, setSearch] = useState("");
    const [region, setRegions] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [endCursor, setEndCursor] = useState("");
    const [startCursor, setStartCursor] = useState("");

    const { data: RegionsData } =
        useFormQuery<RegionsInterfaceResult>({
            key: ["GetAllRegions"],
            url: "maintenance/geospatial/regions",
            headers,
        });

    const { data: treatmentHubData } =
        useFormQuery<TreatmentHubResult>({
            key: [
                "GetAllTreatmentHub",
                endCursor,
                startCursor,
                search,
                region,
                limit,
                currentPage,
            ],
            url: "maintenance/treatment-hub",
            headers,
            params: {
                limit,
                after: endCursor || undefined,
                before: startCursor || undefined,
                search,
                psgc_code: region,
            },
        });

    const onHandleSearch = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearch(e.currentTarget.value);
        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
    };

    const onHandleClear = () => {
        setSearch("");
        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
    };

    const onHandleRegionChange = (value: string) => {
        setRegions(value);
        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
    };

    const onHandleNextPage = () => {
        const pageInfo = treatmentHubData?.data.pageInfo;

        if (
            !pageInfo?.hasNextPage ||
            !pageInfo.endCursor
        ) {
            return;
        }

        setStartCursor("");
        setEndCursor(pageInfo.endCursor);

        setCurrentPage((prev) => prev + 1);
    };

    const onHandlePrevPage = () => {
        const pageInfo = treatmentHubData?.data.pageInfo;

        if (
            !pageInfo?.hasPrevPage ||
            !pageInfo.startCursor
        ) {
            return;
        }

        setEndCursor("");
        setStartCursor(pageInfo.startCursor);

        setCurrentPage((prev) =>
            Math.max(prev - 1, 1)
        );
    };

    return (
        <Template
            title="Treatment Hub Management"
            create="/dashboard/system-maintenance/treatment-hub-management/create"
        >
            <div className={styles.container}>
                <Grid gap={3}>
                    <Search
                        onChange={onHandleSearch}
                        onClear={onHandleClear}
                        value={search}
                    />

                    <SelectArray
                        value={region}
                        label="Region"
                        options={(
                            RegionsData?.data.data || []
                        ).map(({ code, name }) => ({
                            label: `${name} ${code}`,
                            value: code,
                        }))}
                        name="region"
                        onSelect={onHandleRegionChange}
                    />
                </Grid>

                <Table
                    size="md"
                    variant="bordered"
                >
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>
                                Name
                            </Table.Head>

                            <Table.Head>
                                Address
                            </Table.Head>

                            <Table.Head>
                                Service
                            </Table.Head>

                            <Table.Head>
                                Contact Number
                            </Table.Head>

                            <Table.Head>
                                Status
                            </Table.Head>

                            <Table.Head>
                                Region/Province/Municipalities/Barangays
                            </Table.Head>

                            <Table.Head>
                                Province
                            </Table.Head>

                            <Table.Head>
                                Municipality
                            </Table.Head>

                            <Table.Head>
                                Barangay
                            </Table.Head>

                            <Table.Head>
                                Actions
                            </Table.Head>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {treatmentHubData?.data.edges.map(
                            ({
                                node: {
                                    treatment_hub_id,
                                    slug,
                                    name,
                                    address,
                                    contact_number,
                                    status,
                                    regions,
                                    provinces,
                                    municipalities,
                                    barangays,
                                    services
                                },
                            }) => (
                                <Table.Row
                                    key={treatment_hub_id}
                                >
                                    <Table.Cell>
                                        {name}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {address}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {services[0].services.name}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {contact_number}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {status}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {regions.name}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {provinces.name_1}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {municipalities.name_2 ?? ""}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {barangays?.name_3 ?? ""}
                                    </Table.Cell>

                                    <Table.Cell colSpan={4}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/system-maintenance/treatment-hub-management/${slug}`
                                                )
                                            }
                                        >
                                            <TbEye size={18} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/system-maintenance/treatment-hub-management/edit/${slug}`
                                                )
                                            }
                                        >
                                            <TbEdit size={18} />
                                        </button>

                                        <button
                                            type="button"
                                        >
                                            <TbTrash size={18} />
                                        </button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        )}
                    </Table.Body>
                </Table>

                <Pagination
                    totalItems={
                        treatmentHubData?.data.totalCount ?? 0
                    }
                    currentItems={
                        treatmentHubData?.data.edges.length ?? 0
                    }
                    currentPage={currentPage}
                    pageSize={limit}
                    hasNextPage={
                        treatmentHubData?.data.pageInfo
                            .hasNextPage ?? false
                    }
                    hasPrevPage={
                        treatmentHubData?.data.pageInfo
                            .hasPrevPage ?? false
                    }
                    onNext={onHandleNextPage}
                    onPrev={onHandlePrevPage}
                />
            </div>
        </Template>
    );
}