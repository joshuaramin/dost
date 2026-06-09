"use client"


import React, { useState } from 'react'
import Template from '@/lib/ui/template';
import Input from '@/components/Input/input';
import useFormHook from '@/lib/hooks/useFormHook';
import { EducationResourceSchema } from '@/lib/validations/education.validation';
import Textarea from '@/components/Textarea/textarea';
import { error } from 'next/dist/build/output/log';

export default function EducationResources() {


  const [ open, setOpen ] = useState<boolean>(false);

  const onHnadleOpenToggle = () => {
    setOpen((prev) => !prev)
  }



  const { register, errors, handleSubmit } = useFormHook({
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
      <>
        <Input register={register} name={"title"} label="Title" isRequired={true} error={errors.title}/>
        <select>
          {["Prevention", "Testing", "Treatment", "Support", "Awareness", "Research"].map((node, index) => (
            <option key={index}>{node}</option>
          ))}
        </select>
        <Textarea isRequired={true} label="Excerpt" register={register} name={"excerpt"} error={errors.excerpt} style={{ height: "20px"}}/>
        <Textarea isRequired={true} label="Content" register={register} name={"content"} error={errors.content}/>
      </>
     }
     modal={{
      modalTitle: "Add new education resources",
      handleSubmit,
      onHandleSubmit
     }}
     >
    </Template>
  )
}
