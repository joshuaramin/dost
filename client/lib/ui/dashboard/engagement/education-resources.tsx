"use client"


import React, { ChangeEvent, useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources.module.scss'


//components
import Search from '@/components/Search/search';
import Grid from '@/components/Grid/grid';
import Pagination from '@/components/Pagination/pagination';
import SelectArray from '@/components/Select/select-array';


//lib and hooks
import Template from '@/lib/ui/template';
import useFormQuery from '@/lib/hooks/useQuery';
import headers from '@/lib/utils/headers'
import { EducationalResourceResult, EducationCategoryResult } from '@/lib/interface/education-resource/educational-resources.interface';
import { EducationResourceType, EducationStatus } from '@/lib/validations/education.validation';
import Table from '@/components/Table/table';
import { format } from 'date-fns';
import { TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

export default function EducationResources() {

  const router = useRouter()
  const limit = 20;
  const [ search, setSearch ] = useState<string>("");
  const [ endCursor, setEndCursor ] = useState<string>("");
  const [ startCursor, setStartCursor ] = useState<string>("");
  const [ category, setCategory ] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [ type, setType ] = useState<string>("");
  const [ status, setStatus  ] = useState<string>("")


    const { data, isLoading } = useFormQuery<EducationalResourceResult>({
      key: ["EducationResource", limit, search, endCursor, startCursor, category, type, status],
      url: "maintenance/educational-resource",
      params: {
          orderBy: "created_at",
          sortBy: "asc",
          limit,
          search,
          category,
          type,
          after: endCursor || undefined,
          before: startCursor || undefined,
          status,
          currentPage
        },
      headers
    })

  const { data: EducationCategory } = useFormQuery<EducationCategoryResult>({
    key: ["EducationCategory", category],
    url: `maintenance/educational-resource/category`
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
      <Template 
        title="Educational Resources" 
        description="Access educational materials about HIV prevention, treatment, and awareness"
        create="/dashboard/engagement/educational-resources/create"
      >
      <div className={styles.container}>
          <Grid>
            <Search
              onChange={onHandleSearch}
              onClear={onHandleClear}
              value={search}
            />
          
            <SelectArray
              onSelect={(val) => {
                setCategory(val)
              }}
              full={false}
              value={category}
              label="Category"
              name="category"
              options={(EducationCategory?.data.edges || []).map(({ node }) => ({
                label: node.name,
                value: node.name
              }))}
            />
          <SelectArray
              onSelect={(val) => {
                setType(val)
              }}
              full={false}
              value={type}
              label="Type"
              name="type"
              options={(EducationResourceType?.options || []).map((type) => ({
                  label: type.replace("_", " "),
                  value: type,
              }))}
            />
            <SelectArray
              onSelect={(val) => {
                setStatus(val)
              }}
              full={false}
              value={status}
              label="Status"
              name="status"
              options={(EducationStatus?.options || []).map((type) => ({
                  label: type,
                  value: type,
              }))}
            />
        </Grid>

            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Title</Table.Head>
                  <Table.Head>Summary</Table.Head>
                  <Table.Head>Category</Table.Head>
                  <Table.Head>Type</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Date Publushed</Table.Head>
                  <Table.Head>Actions</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data?.data.edges.map(({ node: { education_resource_id, category, type, slug, status, created_at, title, summary }}) => (
                  <Table.Row key={education_resource_id}>
                    <Table.Cell>{title}</Table.Cell>
                    <Table.Cell style={{ textAlign: "justify"}}>{summary.slice(0, 100)}</Table.Cell>
                    <Table.Cell>{category.name}</Table.Cell>
                    <Table.Cell>{type}</Table.Cell>
                    <Table.Cell>{status}</Table.Cell>
                    <Table.Cell>
                      {format(new Date(created_at), "MMMM dd, yyyy")}
                    </Table.Cell>
                    <Table.Cell>
                      <button onClick={() => router.push("/")}>
                        <TbEye size={18} />
                      </button>
                        <button onClick={() => router.push(`/dashboard/engagement/educational-resources/edit/${slug}`)}>
                        <TbEdit size={18} />
                      </button>
                        <button>
                        <TbTrash size={18} />
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
