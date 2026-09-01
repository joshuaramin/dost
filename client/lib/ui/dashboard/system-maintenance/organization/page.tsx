"use client"

import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/organization/organization.module.scss';
import { SubmitHandler } from 'react-hook-form';


// components
import FileUpload from '@/components/FileUpload/fileUpload';
import Input from '@/components/Input/input';
import Grid from '@/components/Grid/grid';
import Pagination from '@/components/Pagination/pagination';
import Search from '@/components/Search/search';


//lib && hooks
import OrganizationCard from './organization-card';
import useFormHook from '@/lib/hooks/useFormHook';
import Template from '@/lib/ui/template';
import headers  from '@/lib/utils/headers';
import useFormMutation from '@/lib/hooks/useMutation';
import useFormQuery from '@/lib/hooks/useQuery';
import { OrganizationResult } from '@/lib/interface/organization/organization.interface';
import { OrganizationSchema } from '@/lib/validations/organization';
import { OrganizationFormField } from '@/lib/types/organization';
import { toastSuccess } from '@/lib/ui/toast';
import NoData from '@/lib/ui/no-data';




export default function Organization() {

    const limit = 20;
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ open, setOpen ]  = useState<boolean> (false);
    const [ search, setSearch ] = useState<string>("");
    const [ endCursor, setEndCursor ] = useState<string>("")
    const [ startCursor, setStartCursor ] = useState<string>("")

    const { data, isLoading } = useFormQuery<OrganizationResult>({
        key: ["Organizatoin", search, endCursor, startCursor],
        url: "maintenance/organization",
        headers, 
        params: {
            search,
            after: endCursor,
            before: startCursor,
            limit: 20
        }
    })


    const { register, errors, handleSubmit, setValue } = useFormHook({
        schema: OrganizationSchema,
        defaultValues: {
            logo: File as unknown as never,
            name: "",
            address: "",
            contact: ""
        }
    })


    const mutation = useFormMutation({
        key: ["Organization"],
        method: "POST",
        url: "maintenance/organization",
        headers,
        isMultipart: true
    })

    const onHandleSubmit: SubmitHandler<OrganizationFormField> = (data) => {
        mutation.mutate({
            logo: data.logo,
            name: data.name,
            contact: data.contact,
            address: data.address
        }, {
            onSuccess: () => {
                toastSuccess({
                    title: "",
                    body: ""
                })
            },
            onError: () => {}
        })
    }

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
        setStartCursor(() => startCursor)
    }

    const onHandleAddNew = () => {
        const pageInfo = data?.data.pageInfo;

        if (
            !pageInfo?.hasPrevPage ||
            !pageInfo.startCursor
        ) {
            return;
        }

        setEndCursor("");
        setStartCursor(pageInfo.startCursor);

        setCurrentPage((prev) =>
            Math.max(prev - 1, 1)
        );
    }

    const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
    }
    return (
        <Template
            title="Organization Management"
            modal={{
                modalTitle: "Add new Organization",
                handleSubmit,
                onHandleSubmit
            }}
            modalChildren={
                <div style={{display: "flex", gap: 10, flexDirection: "column"}}>
                    <FileUpload 
                    register={register} label=""  
                    setValue={setValue}  
                    accepted={{
                        "image": ["jpeg", "jpg", "png", "webp"]
                    }}
                    isRequired={true}
                    name={"logo"} multiple={false} />
                    <Input register={register} name={"name"} error={errors.name} label="Name" />
                    <Input register={register} name={"address"} error={errors.address} label="Address" />
                    <Input register={register} name={"contact"} error={errors.contact} label="Tel/Phone number" />
                </div>
            }
            onHandleCloseToggle={onHandleAddNew}
            onModalOpenToggle={open}

        >
            <div className={styles.container}>
                <Search onChange={onHandleSearch} value={search} />
                {data?.data.totalCount === 0?  (
                    <NoData text="Organization" />
                ) :    <Grid max={450} min={330} gap={10}>
                        {data?.data.edges.map((node, index) => (
                        <OrganizationCard key={index}
                            address={node.node.address} contact={node.node.contact} logo={node.node.logo} name={node.node.name}
                        />
                    ))}
                </Grid>}
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
