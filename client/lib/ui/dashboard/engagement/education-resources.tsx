"use client"


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources.module.scss'
import { usePathname } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';


//components
import { Select } from '@/components/Select/select';
import ReactEditor from '@/components/Lexical/editor';
import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';
import Search from '@/components/Search/search';
import Input from '@/components/Input/input';
import Grid from '@/components/Grid/grid';
import Pagination from '@/components/Pagination/pagination';
import Textarea from '@/components/Textarea/textarea';
import SelectArray from '@/components/Select/select-array';


//lib and hooks
import useFormHook from '@/lib/hooks/useFormHook';
import Template from '@/lib/ui/template';
import { EducationResourceSchema } from '@/lib/validations/education.validation';
import useFormQuery from '@/lib/hooks/useQuery';
import { EducationalResourceResult } from '@/lib/interface/education-resource/educational-resources.interface';
import NoData from '../../no-data';
import headers from '@/lib/utils/headers'
import useFormMutation from '@/lib/hooks/useMutation';
import { EducationResourceFormField } from '@/lib/types/education-resource.type';
import EducationResourceCard from '../../educational-resource/education-reosurce-card';
import SkeletonCard from '../../loading/SkeletonCard';

export default function EducationResources() {



  const [ open, setOpen ] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>("");
  const [ page, setPage ] = useState<number>(0)
  const pathname = usePathname();


    const { data, isLoading, error} = useFormQuery<EducationalResourceResult>({
       key: ["EducationResource", search, page],
       url: "maintenance/educationResource",
       params: {
          orderBy: "created_at",
          sortBy: "asc",
          limit: 20,
          search
        },
       headers
    })
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


  const { register, errors, handleSubmit, setValue, watch } = useFormHook({
    schema: EducationResourceSchema,
    defaultValues: {
      category: "",
      content: "",
      excerpt: "",
      title: ""
    }
  })

  const mutation = useFormMutation({
    key: ["CreateEducationResource"],
    url: "maintenance/educationResource",
    method: "POST",
    headers
  })

  const onHandleSubmit: SubmitHandler<EducationResourceFormField> = (data) => {
    mutation.mutate({
      title: data.title,
      category: data.category,
      content: data.content,
      excerpt: data.excerpt
    }, {
      onSuccess: () => {},
      onError: () => {}
    })
  }

  return (
     <Template 
     title="Educational Resources" 
     description="Access educational materials about HIV prevention, treatment, and awareness"
     onModalOpenToggle={open}
     onHandleCloseToggle={onHnadleOpenToggle}
     modalChildren={
      <div style={{ display: "flex", flexDirection: "column", gap: 20}}>
        <Input register={register} name={"title"} label="Title" isRequired={true} error={errors.title}/>
        <Select 
          register={register}
          error={errors.category}
          setValue={setValue}
          onChange={() => {}}
          isRequired={true}
          label="Category"
          name="category"
          value={watch("category")}
          options={[
            { label: "Prevention", value: "Prevention" }, 
            { label: "Testing", value: "Testing" }, 
            { label: "Treatment", value: "Treatment" },
            { label: "Support", value: "Support" }, 
            { label: "Awareness", value: "Awareness" },
            { label: "Research", value: "Research" }
          ]}
        />
        <Textarea isRequired={true} label="Excerpt" register={register} name={"excerpt"} errors={errors.excerpt} style={{ height: "20px"}}/>
        <ReactEditor 
          error={errors.content}
          height={200}
          isRequired={true}
          label="Content"
          name="content"
          setValue={setValue}
        />
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
            value=""
            label="Category"
            name="category"
              options={[
            { label: "Prevention", value: "prevention" }, 
            { label: "Testing", value: "testing" }, 
            { label: "Treatment", value: "treatment" },
            { label: "Support", value: "support" }, 
            { label: "Awareness", value: "awareness" },
            { label: "Research", value: "research" }
          ]}
          />
        </Grid>
{/*       
        {data?.data.totalCount === 0 ? <NoData text="Educational Resoucre" /> : 
        <Grid max={"1fr"} min={400}>
          {isLoading ? Array.from({ length: 6}).map((node, index) => (
            <SkeletonCard  key={index} /> 
          )) :data?.data.edges.map(({ node: { category, content,  excerpt, title, slug}}, index) => (
              <EducationResourceCard
                key={index}
                category={category} 
                excerpt={excerpt} 
                title={title} 
                slug={slug} 
                route={`/dashboard/engagement/educational-resources/${slug}`}
              />
          ))}
        </Grid>
        } */}
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
