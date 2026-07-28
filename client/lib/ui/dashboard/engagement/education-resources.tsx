"use client"


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources.module.scss'
import { usePathname } from 'next/navigation';
import { SubmitHandler, useWatch } from 'react-hook-form';


//components
import { Select } from '@/components/Select/select';
import ReactEditor from '@/components/Lexical/editor';
import Search from '@/components/Search/search';
import Input from '@/components/Input/input';
import Grid from '@/components/Grid/grid';
import Pagination from '@/components/Pagination/pagination';
import Textarea from '@/components/Textarea/textarea';
import SelectArray from '@/components/Select/select-array';
import FileUpload from '@/components/FileUpload/fileUpload';


//lib and hooks
import useFormHook from '@/lib/hooks/useFormHook';
import Template from '@/lib/ui/template';
import useFormQuery from '@/lib/hooks/useQuery';
import NoData from '../../no-data';
import headers from '@/lib/utils/headers'
import useFormMutation from '@/lib/hooks/useMutation';
import EducationResourceCard from '../../educational-resource/education-reosurce-card';
import SkeletonCard from '../../loading/SkeletonCard';
import { EducationResourceFormField } from '@/lib/types/education-resource.type';
import { sessionStore } from '@/lib/utils/sessions';
import { EducationalResourceResult, EducationCategoryResult } from '@/lib/interface/education-resource/educational-resources.interface';
import {  CreateEducationResourceSchema, EducationResourceType } from '@/lib/validations/education.validation';

export default function EducationResources() {



  const [ open, setOpen ] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>("");
  const [ page, setPage ] = useState<number>(0)
  const [ category, setCategory ] = useState<string>("");
  const sessions = sessionStore.get();

  const pathname = usePathname();


    const onHnadleOpenToggle = () => {
    setOpen((prev) => !prev)
  }

  const onHandleNextPage = () => { 
    setPage(() => page + 1)
  }

  const onHandlePrevPage = () => {
    setPage(() =>page - 1)
  }

  const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value)
  }


  const onHandleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.currentTarget.value)
  }

  const onHandleTypeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // setType(e.currentTarget.value);
  }


    const { data, isLoading } = useFormQuery<EducationalResourceResult>({
      key: ["EducationResource", search, page],
      url: "maintenance/educational-resource",
      params: {
          orderBy: "created_at",
          sortBy: "asc",
          limit: 20,
          search
        },
      headers
    })

  const { data: EducationCategory } = useFormQuery<EducationCategoryResult>({
    key: ["EducationCategory", category],
    url: `maintenance/educational-resource/category?search=${category}`
  })

  const { register, errors, handleSubmit, setValue, watch,  getValues, control} = useFormHook({
    schema: CreateEducationResourceSchema,
    defaultValues: {
      attachments: [],
      category_id: "",
      is_deleted: false,
      is_featured: false,
      status: "DRAFT",
      tags: [],
      title: "",
      type: "ARTICLE",
      content: "",
      summary: "",
      thumbnail: "" as unknown as File,
      user_id: sessions?.data.user_id,
    }
  })


  console.log("Errors:", errors)
  const mutation = useFormMutation<EducationResourceFormField>({
    key: ["CreateEducationResource"],
    url: "maintenance/educational-resource",
    method: "POST",
    headers,
    isMultipart: true
  })

  const onHandleSubmit: SubmitHandler<EducationResourceFormField> = (data) => {
    mutation.mutate({
      title: data.title,
      category_id: data.category_id,
      content: data.content,
      summary: data.summary,
      is_deleted: Boolean(false),
      is_featured: Boolean(false),
      attachments: data.attachments,
      status: data.status,
      tags: data.tags,
      type: data.type,
      thumbnail: data.thumbnail,
      external_link: data.external_link,
      user_id: data.user_id
    }, 
    {
      onSuccess: () => {
        alert("Successs")
      },
      onError: (data) => {
        alert("NO SUCCESS")
        console.log(data)
      }
    })
  }


  const type = useWatch({
    control,
    name: "type",
    exact: true
  })


  console.log("Type: ", type)
  return (
      <Template 
      title="Educational Resources" 
      description="Access educational materials about HIV prevention, treatment, and awareness"
      onModalOpenToggle={open}
      onHandleCloseToggle={onHnadleOpenToggle}
      modalChildren={
        <div style={{ display: "flex", flexDirection: "column", gap: 20}}>
          <Input 
            register={register}
            name={"title"}
            label="Title" 
            isRequired={true} 
            error={errors.title}
          />
          <FileUpload 
            register={register}
            name="thumbnail"
            isRequired={true}
            // accepted={{}}
            accepted={{
              "image": ["jpeg", "jpg", "webp", "png"]
            }}
            error={errors.thumbnail}
            label="Thumbnail"
            setValue={setValue}
            multiple={false}
          />
          <Select 
            control={control}
            error={errors.category_id}
            onChange={onHandleCategorySearch}
            isRequired={true}
            label="Category"
            name="category_id"
            options={
              EducationCategory?.data.edges.map(({ node }) => ({
                label: node.name,
                value: node.education_category_id
            })) ?? []}
          />
        <Select
              control={control}
              name="type"
              label="Type"
              isRequired
              error={errors.type}
              onChange={onHandleTypeSearch}
              options={EducationResourceType.options.map((type) => ({
                  label: type.replace("_", " "),
                  value: type,
              }))}
          />
          <Textarea 
              isRequired={true} 
              label="Summary" 
              register={register} 
              name={"summary"} 
              errors={errors.summary} 
              style={{ height: "100px"}}
          />
          {type === "ARTICLE"  && (
              <ReactEditor
                  error={errors.content}
                  height={200}
                  isRequired
                  label="Content"
                  name="content"
                  setValue={setValue}
              />
          )}


          {type === "CATALOGUE" && (
            <FileUpload 
              label="File Upload"
              name="attachments"
              register={register}
              setValue={setValue}
              accepted={{
                "image": ["jpeg", "jpg", "webp", "png"]
              }}
              error={Array.isArray(errors.attachments) ? errors.attachments[0] : errors.attachments}
              isRequired={true}
              multiple={true}
            />
          )}

          {type === "EXTERNAL_LINK" && (
              <Input
                  register={register}
                  name="external_link"
                  label="External Link"
                  isRequired
                  error={errors.external_link}
              />
          )}
        </div>
      }
      modal={{
        modalTitle: "Add new education resources",
        handleSubmit,
        onHandleSubmit
      }}
      >
      <div className={styles.container}>
          <Grid>
            <Search
              onChange={onHandleSearch}
              value={search}
            />
            <SelectArray 
              full={false}
              value={category}
              label="Category"
              name="category"
              style={{
                width: "200px"
              }}
              options={(EducationCategory?.data.edges || []).map(({ node }) => ({
                label: node.name,
                value: node.education_category_id
              }))}
            />
        </Grid>
        
          {data?.data.totalCount === 0 ? <NoData text="Educational Resoucre" /> : 
          <Grid max={"1fr"} min={400}>
            {isLoading ? Array.from({ length: 6}).map((node, index) => (
              <SkeletonCard  key={index} /> 
            )) :data?.data.edges.map(({ node: { external_link, thumbnail, summary, type, title, slug, }}, index) => (
              <EducationResourceCard
                  key={index}
                  summary={summary}
                  thumbnail={thumbnail}
                  slug={slug}
                  type={type}
                  title={title}
                  route={
                    type === "EXTERNAL_LINK"
                      ? external_link
                      : `//dashboard/engagement/educational-resources/${slug}`
                  }
                />
            ))}
          </Grid>
          }
          <Pagination 
            totalItems={data?.data.totalCount || 0}
            currentCount={data?.data.edges.length || 0}
            hasNextPage={data?.data.pageInfo.hasNextpage || false}
            hasPrevPage={data?.data.pageInfo.hasPrevPage || false}
            onNext={onHandleNextPage}
            onPrev={onHandlePrevPage}
          />
        </div>
      </Template>
  )
}
