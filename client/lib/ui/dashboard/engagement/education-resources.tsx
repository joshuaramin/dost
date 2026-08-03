"use client"


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources.module.scss'


//components
import Search from '@/components/Search/search';
import Grid from '@/components/Grid/grid';
import Pagination from '@/components/Pagination/pagination';
import SelectArray from '@/components/Select/select-array';


//lib and hooks
import Template from '@/lib/ui/template';
import useFormQuery from '@/lib/hooks/useQuery';
import NoData from '@/lib/ui/no-data';
import headers from '@/lib/utils/headers'
import EducationResourceCard from '@/lib/ui/educational-resource/education-reosurce-card';
import SkeletonCard from '@/lib/ui/loading/SkeletonCard';
import { EducationalResourceResult, EducationCategoryResult } from '@/lib/interface/education-resource/educational-resources.interface';
import { EducationResourceType, EducationStatus } from '@/lib/validations/education.validation';

export default function EducationResources() {

  const [ search, setSearch ] = useState<string>("");
  const [ endCursor, setEndCursor ] = useState<string>("");
  const [ startCursor, setStartCursor ] = useState<string>("");
  const [ category, setCategory ] = useState<string>("");
  const [ type, setType ] = useState<string>("");
  const [ status, setStatus  ] = useState<string>("")

  const onHandleNextPage = () => { 
    setEndCursor(() => endCursor)
  }

  const onHandlePrevPage = () => {
    setStartCursor(() => startCursor)
  }


  const onHandleClear = () => {
    setSearch("")
  }

  const onHandleSearch = (e: React.SyntheticEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }

    const { data, isLoading } = useFormQuery<EducationalResourceResult>({
      key: ["EducationResource", search, endCursor, startCursor, category, type, status],
      url: "maintenance/educational-resource",
      params: {
          orderBy: "created_at",
          sortBy: "asc",
          limit: 20,
          search,
          category,
          type,
          after: endCursor,
          before: startCursor,
          status
        },
      headers
    })

  const { data: EducationCategory } = useFormQuery<EducationCategoryResult>({
    key: ["EducationCategory", category],
    url: `maintenance/educational-resource/category`
  })

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
          {data?.data.totalCount === 0 ? <NoData text="Educational Resoucre" /> : 
          <Grid max={"1fr"} min={400}>
            {isLoading ? Array.from({ length: 6}).map((node, index) => (
              <SkeletonCard  key={index} /> 
            )) :data?.data.edges.map(({ node: { education_resource_id, external_link, thumbnail, summary, type, title, slug, }}, index) => (
              <EducationResourceCard
                  key={index}
                  summary={summary}
                  thumbnail={thumbnail}
                  slug={slug}
                  type={type}
                  title={title}
                  educational_resource_id={education_resource_id}
                  route={
                    type === "EXTERNAL_LINK"
                      ? external_link
                      : `/dashboard/engagement/educational-resources/${slug}`
                  }
                />
            ))}
          </Grid>
          }
          <Pagination
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
