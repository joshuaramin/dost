"use client"

import Template from '@/lib/ui/template';
import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/contribution.module.scss';


import Table from '@/components/Table/table'
import Pagination from '@/components/Pagination/pagination';
import { useRouter } from 'next/navigation';
import useFormQuery from '@/lib/hooks/useQuery';
import { ContributionResult } from '@/lib/interface/contribution/contribution.interface';
import Grid from '@/components/Grid/grid';
import Search from '@/components/Search/search';
import { TbEye } from 'react-icons/tb';
import headers from '@/lib/utils/headers';

export default function CommunityContribution() {

    const router = useRouter();

    const limit = 20;
    const [ search, setSearch ] = useState<string>("");
    const [ endCursor, setEndCursor] = useState<string>("");
    const [ startCursor, setStartCursor ] = useState<string>("");
    const [ currentPage, setCurrentPage ] = useState<number>(1);


    const { data } = useFormQuery<ContributionResult>({
        key: ["Contribution", search, endCursor, startCursor],
        url: "maintenance/contribution",
        headers,
        params: {
            limit, search,  after: endCursor, before: startCursor, currentPage
        }
    })

      const onHandleNextPage = () => { 
      const pageInfo = data?.data.pageInfo;

       if (
            !pageInfo?.hasNextPage ||
            !pageInfo.endCursor
        ) {
            return;
        }

        setStartCursor("");
        setEndCursor(pageInfo.endCursor);

        setCurrentPage((prev) => prev + 1);
    }

    const onHandlePrevPage = () => {
      const pageInfo = data?.data.pageInfo;

       if (
            !pageInfo?.hasNextPage ||
            !pageInfo.endCursor
        ) {
            return;
        }

        setStartCursor("");
        setEndCursor(pageInfo.endCursor);

        setCurrentPage((prev) => prev  - 1);
    }


     const onHandleClear = () => {
        setSearch("");
        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
    };

    const onHandleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value)
      setCurrentPage(1);
      setEndCursor("");
      setStartCursor("");
    }

    return (
        <Template title="Contribution">
            <div className={styles.container}>
                <Grid>
                    <Search 
                        onChange={onHandleSearch}
                        onClear={onHandleClear}
                        value={search}
                    />
                </Grid>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.Head>Title</Table.Head>
                            <Table.Head>Type</Table.Head>
                            <Table.Head>Classification</Table.Head>
                            <Table.Head>Classification Method</Table.Head>
                            <Table.Head>Status</Table.Head>
                            <Table.Head>Region</Table.Head>
                            <Table.Head>Province</Table.Head>
                            <Table.Head>Municipality</Table.Head>
                            <Table.Head>Barangay</Table.Head>
                            <Table.Head>Action</Table.Head>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.data.edges.map(({node: { contribution_id, type, title, classification, status, classification_method, slug,

                            barangay, province, region, municipality
                        }}) => (
                            <Table.Row key={contribution_id}>
                                <Table.Cell>{title}</Table.Cell>
                                <Table.Cell>{type}</Table.Cell>
                                <Table.Cell>{classification}</Table.Cell>
                                <Table.Cell>{classification_method}</Table.Cell>
                                <Table.Cell>{status}</Table.Cell>
                                <Table.Cell>{region}</Table.Cell>
                                <Table.Cell>{province}</Table.Cell>
                                <Table.Cell>{municipality}</Table.Cell>
                                <Table.Cell>{barangay}</Table.Cell>
                                <Table.Cell>
                                    <button onClick={() => router.push(`/dashboard/engagement/community-contributions/${slug}`)}>
                                        <TbEye size={23} />
                                    </button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
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
    )
}
