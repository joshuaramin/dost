"use client"

import Template from '@/lib/ui/template';
import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/survey-management/survey-mangement.module.scss'
import { TbChartBar, TbDots, TbEdit } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';

//components
import Grid from '@/components/Grid/grid';
import Search from '@/components/Search/search';
import Title from '@/components/Typography/Title/title';
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import Pagination from '@/components/Pagination/pagination';
import Input from '@/components/Input/input';
import Textarea from '@/components/Textarea/textarea';

//lib & hooks
import useFormQuery from '@/lib/hooks/useQuery';
import NoData from '@/lib/ui/no-data';
import useFormHook from '@/lib/hooks/useFormHook';
import useFormMutation from '@/lib/hooks/useMutation';
import  headers  from '@/lib/utils/headers';
import { CreateSurveySchema, } from '@/lib/validations/survey-management.validation';
import {  SurveyIDInterface, SurveyResponse } from '@/lib/interface/survey-management/survey.interface';
import { CreateSurveyFormField} from '@/lib/types/survey-management';


export default function SurveyManagement() {

    const router = useRouter();
    const [open ,setOpen ] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const [after, setAfter] = useState<string>("")

    const { register, handleSubmit, errors } = useFormHook({
            schema: CreateSurveySchema,
            defaultValues: {
                title: "",
                description: "",
            }
        })
        const onHandleAddNew = () => { 
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


    
        const onHandleClear = () => {
            setSearch('')
        }   


        const mutation = useFormMutation({
            key: ["CreateSurvey"],
            url: "maintenance/survey",
            method: "POST",
            headers
        })

        const onHandleSubmit: SubmitHandler<CreateSurveyFormField> =  async(data) => {
            mutation.mutate({
                title: data.title,
                description: data.description,
            }, {
                onSuccess: (data: unknown) => {
                    const res = data as SurveyIDInterface;
                    router.push(`/dashboard/system-maintenance/survey-management/${res.data.slug}`)
                },
                onError: () => {}

            })
        }


        const { data, isLoading } = useFormQuery<SurveyResponse>({
            key: ["SurveyManagement", search, page],
            url: "maintenance/survey",
            headers,
            params: {
                search,
                page
            }
        })


    

        return (
            <Template title="Survey Management"
                onModalOpenToggle={open}
                onHandleCloseToggle={onHandleAddNew}
                modal={{
                    modalTitle: "Add new Survey",
                    handleSubmit,
                    onHandleSubmit
                }}
                modalChildren={
                <>
                    <Input 
                        label="Title"
                        name="title"
                        register={register}
                        error={errors.title}
                    />
                    <Textarea 
                        label="Description"
                        name="description"
                        register={register}
                        errors={errors.description} 
                        isRequired={true}
                        
                    />
                </>

                }
            >
                <div className={styles.container}>
                    <Search
                        onChange={onHandleSearch}
                        value={search}
                        onClear={onHandleClear}
                    />
                    <Grid min={350} max={"1fr"} gap={10}>
                        {data?.data.totalCount === 0 ? < NoData text="surveys found"/> : data?.data.edges.map(({ node }, index) => (
                            <div key={index} className={styles.card}>
                                <Title onClick={() => router.push(`/dashboard/system-maintenance/survey-management/${node.slug}`  )} size="md">{node.title}</Title>
                                <Paragraph>{node.description}</Paragraph>
                                <div className={styles.footerBtn}>
                                    <progress value={30} max={1000} />
                                <div>
                                    <button onClick={() => router.push(`/dashboard/system-maintenance/survey-management/${node.survey_id}`  )}>
                                        <TbEdit size={20} />
                                    </button>
                                    <button>
                                        <TbChartBar size={20} />
                                    </button>
                                    <button>
                                        <TbDots size={20} />
                                    </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Grid>
                <Pagination 
                    totalItems={data?.data.totalCount || 0}
                    currentCount={data?.data.edges.length || 0}
                    hasNextPage={data?.data.pageInfo.hasNextPage || false}
                    hasPrevPage={data?.data.pageInfo.hasPrevPage || false}
                    onNext={onHandleNextPage}
                    onPrev={onHandlePrevPage}
                />
                </div>
            </Template>
    )
}
