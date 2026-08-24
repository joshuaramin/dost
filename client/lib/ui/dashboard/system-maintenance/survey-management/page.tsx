"use client"

import Template from '@/lib/ui/template';
import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/survey-management/survey-mangement.module.scss'
import { TbEye, TbTrash } from 'react-icons/tb';
import { usePathname, useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { format } from 'date-fns'

//components
import Search from '@/components/Search/search';
import Pagination from '@/components/Pagination/pagination';
import Input from '@/components/Input/input';
import Textarea from '@/components/Textarea/textarea';
import Table from '@/components/Table/table';

//lib & hooks
import useFormQuery from '@/lib/hooks/useQuery';
import useFormHook from '@/lib/hooks/useFormHook';
import useFormMutation from '@/lib/hooks/useMutation';
import  headers  from '@/lib/utils/headers';
import { CreateSurveySchema, } from '@/lib/validations/survey-management.validation';
import {  SurveyIDInterface, SurveyResponse } from '@/lib/interface/survey-management/survey.interface';
import { CreateSurveyFormField} from '@/lib/types/survey-management';


export default function SurveyManagement() {

    const pathname = usePathname()
    const router = useRouter();
    const limit = 20;
    const [open ,setOpen ] = useState<boolean>(false);
    const [ currentPage, setCurrentPage ] = useState<number>(1)
    const [search, setSearch] = useState<string>("");
    const [ endCursor, setEndCursor ] = useState<string>("")
    const [ startCursor, setStartCursor ] = useState<string>("")


    const { register, handleSubmit, errors } = useFormHook({
            schema: CreateSurveySchema,
            defaultValues: {
                title: "",
                description: "",
            }
        })

    
        const onHandleClear = () => {
            setSearch('')
            setCurrentPage(1);
            setEndCursor("");
            setStartCursor("");
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
                    router.push(`${pathname}/${res.data.slug}`)
                },
                onError: () => {}

            })
        }


        const { data, isLoading } = useFormQuery<SurveyResponse>({
            key: ["SurveyManagement", search, endCursor, startCursor, currentPage],
            url: "maintenance/survey",
            headers,
            params: {
                search,
                limit,
                after: endCursor || undefined,
                before: startCursor || undefined
            }
        })


        const onHandleAddNew = () => { 
            setOpen((prev) => !prev)
        }
        const onHandleNextPage = () => { 
            const pageInfo = data?.data.pageInfo

            if(!pageInfo?.hasNextPage || !pageInfo.endCursor) {
                return;
            }

            setStartCursor("");
            setEndCursor(pageInfo.endCursor)
        }

        const onHandlePrevPage = () => {
            const pageInfo = data?.data.pageInfo

            if(!pageInfo?.hasNextPage || !pageInfo.endCursor) {
                return;
            }

            setStartCursor("");
            setEndCursor(pageInfo.endCursor)
        }

        const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.currentTarget.value)
        }


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
                    <Table size="sm" variant="bordered">
                        <Table.Header>
                            <Table.Row>
                                <Table.Head>Title</Table.Head>
                                <Table.Head>Description</Table.Head>
                                <Table.Head>Total No. of Questions</Table.Head>
                                <Table.Head>Total No. of Respondents</Table.Head>
                                <Table.Head>Status</Table.Head>
                                <Table.Head>Date Created</Table.Head>
                                <Table.Head>Actions</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                        {data?.data.edges.map(({node: {survey_id, slug, title, questions, created_at, description, is_published, _count}}) => (
                            <Table.Row key={survey_id}>
                                <Table.Cell>{title}</Table.Cell>
                                <Table.Cell>{description}</Table.Cell>
                                <Table.Cell>{questions.length}</Table.Cell>
                                <Table.Cell>{_count?.responses ?? 0}</Table.Cell>
                                <Table.Cell>{is_published ? "PUBLISHED" : "DRAFT"}</Table.Cell>
                                <Table.Cell>{format(new Date(created_at),  "MMMM dd, yyyy")}</Table.Cell>
                                <Table.Cell>
                                    <button onClick={() => router.push(`${pathname}/${slug}`)}>
                                        <TbEye size={23} />
                                    </button>
                                    <button>
                                        <TbTrash size={20} />
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
