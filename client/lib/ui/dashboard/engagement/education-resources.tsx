"use client"


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources.module.scss'


//components
import { Select } from '@/components/Select/select';
import ReactEditor from '@/components/Lexical/editor';
import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';
import Search from '@/components/Search/search';
import Input from '@/components/Input/input';
import Pagination from '@/components/Pagination/pagination';
import Textarea from '@/components/Textarea/textarea';


//lib and hooks
import useFormHook from '@/lib/hooks/useFormHook';
import Template from '@/lib/ui/template';
import { EducationResourceSchema } from '@/lib/validations/education.validation';
import SelectArray from '@/components/Select/select-array';
import { sessionStore } from '@/lib/utils/sessions';
import useFormQuery from '@/lib/hooks/useQuery';
import { EducationalResourceInterface, EducationalResourceResult } from '@/lib/interface/education-resource/educational-resources.interface';
import NoData from '../../no-data';

export default function EducationResources() {


    const token = sessionStore.getToken()
  const [ open, setOpen ] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>("");
  const [ page, setPage ] = useState<number>(0)


    const headers = {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
        "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
        "Authorization": `Bearer ${token}`
    }

    const { data, isLoading, error} = useFormQuery<EducationalResourceResult>({
       key: ["EducationResource"],
       url: "maintenance/educationResource",
       params: {
          orderBy: "created_at",
          sortBy: "asc",
          limit: 20
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

  console.log(data)

  const { register, errors, handleSubmit, setValue, watch } = useFormHook({
    schema: EducationResourceSchema,
    defaultValues: {
      category: "",
      content: "",
      excerpt: "",
      title: ""
    }
  })


  const onHandleSubmit = () => {}
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
          value=""
          options={[
            { label: "Prevention", value: "prevention" }, 
            { label: "Testing", value: "testing" }, 
            { label: "Treatment", value: "treatment" },
            { label: "Support", value: "support" }, 
            { label: "Awareness", value: "awareness" },
            { label: "Research", value: "research" }
          ]}
        />
        <Textarea isRequired={true} label="Excerpt" register={register} name={"excerpt"} error={errors.excerpt} style={{ height: "20px"}}/>
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
      <div className={styles.filter}>
          <Search />
            <SelectArray 
            full={false}
            
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
      </div>
      
        {data?.data.totalCount === 0 ? <NoData text="Educational Resoucre" /> :    
        <div className={styles.grid}>
          {data?.data.edges.map(({ node: { category, content,  excerpt, title}}, index) => (
            <div className={styles.card} key={index}>
              <div className={styles.image} />
              <Title size="md">{title}</Title>
              <div>
                <Text className={styles.tag} size="sm">
                  {category}
                </Text>
              </div>
              <Text size="sm">{excerpt}</Text>
            </div>
          ))}
        </div>
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
