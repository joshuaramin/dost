"use client"


import React, { useState } from 'react'
import Template from '@/lib/ui/template';
import Input from '@/components/Input/input';
import useFormHook from '@/lib/hooks/useFormHook';
import { EducationResourceSchema } from '@/lib/validations/education.validation';
import Textarea from '@/components/Textarea/textarea';
import SelectArray from '@/components/Select/select-array';
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources.module.scss'
import { Select } from '@/components/Select/select';
import ReactEditor from '@/components/Lexical/editor';
import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';
import Search from '@/components/Search/search';

export default function EducationResources() {


  const [ open, setOpen ] = useState<boolean>(false);

  const onHnadleOpenToggle = () => {
    setOpen((prev) => !prev)
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
      <div className={styles.header}>
          <Search />
          <SelectArray 
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
      
      <div className={styles.grid}>
        {[
          { title: "HIV Prevention Guide", excerpt: "Essential Information about prevention methods", category: "Prevention"},
          { title: "Understanding HIV Testing", excerpt: "Learn about different testing methods and what result mean", category: "Testing"}
            ].map(({ excerpt, title, category}, index) => (
              <div className={styles.card} key={index}>
                  <Title size="md">{title}</Title>
                <div>
                  <Text className={styles.tag} size="md">{category}</Text>
                </div>
                <Text size="sm">{excerpt}</Text>
              </div>
            ))}
          </div>
      </div>
    </Template>
  )
}
