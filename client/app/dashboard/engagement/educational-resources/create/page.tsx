"use client" 

import Template from '@/lib/ui/template';
import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/enagagement/educational-resources-create.module.scss'
import { SubmitHandler, useWatch } from 'react-hook-form';



//components
import FileUpload from '@/components/FileUpload/fileUpload';
import Input from '@/components/Input/input';
import ReactEditor from '@/components/Lexical/editor';
import { Select } from '@/components/Select/select';
import Textarea from '@/components/Textarea/textarea';
import Button from '@/components/Button/button';
import Text from '@/components/Typography/Text/text';
import Form from '@/components/Form/form';


//lib & hooks
import { CreateEducationResourceSchema, EducationCategory, EducationResourceType } from '@/lib/validations/education.validation';
import useFormHook from '@/lib/hooks/useFormHook';
import { sessionStore } from '@/lib/utils/sessions';
import useFormQuery from '@/lib/hooks/useQuery';
import { EducationCategoryResult } from '@/lib/interface/education-resource/educational-resources.interface';
import { EducationResourceFormField } from '@/lib/types/education-resource.type';
import useFormMutation from '@/lib/hooks/useMutation';
import headers from '@/lib/utils/headers'
import ButtonToggle from '@/components/Toggle/buttonToggle';


export default function Page() {


    const [category, setCategory] = useState<string>("")
    const sessions = sessionStore.get();



    const onHandleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(e.currentTarget.value)
    }

    const { data: EducationCategory } = useFormQuery<EducationCategoryResult>({
        key: ["EducationCategory", category],
        url: `maintenance/educational-resource/category?search=${category}`
    })

    const onHandleTypeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setType(e.currentTarget.value);
    }

    

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
        user_id: ""
        }
    })

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
            user_id: sessions?.data.user_id,
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


    return (
    <Template
        title="Create new Educational Resources"
    >
        
        <div className={styles.container}>
            <Form onSubmit={handleSubmit(onHandleSubmit)}>
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
                    label="Attachments"
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

        <div className={styles.footer}>
        <ButtonToggle 
            falseName={"DRAFT"}
            trueName={"PUBLISHED"}
            label={""}
            control={control}
            name="status"
            setValue={setValue}
        />

        <Button
            variant="primary"
            size="md"
        >
            <Text size="sm">Save</Text>
        </Button>
        </div>
            </Form>
        </div>
    </Template>
    )
}
