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
import SkeletonCard from '@/lib/ui/loading/SkeletonCard';
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

    const [ open, setOpen ]  = useState<boolean> (false);
    const [ page, setPage ] = useState<number>(1);
    const [ search, setSearch ] = useState<string>("");


    const onHandleNextPage = () => { 
        setPage(() => page + 1)
    }

    const onHandlePrevPage = () => {
        setPage(() =>page - 1)
    }

    const onHandleAddNew = () => {
        setOpen((prev) => !prev)
    }

  const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value)
  }

    const { data, isLoading } = useFormQuery<OrganizationResult>({
        key: ["Organizatoin", search, page],
        url: "maintenance/organization",
        headers, 
        params: {
            search, page
        }
    })


    const { register, errors, handleSubmit, control } = useFormHook({
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

    // if(isLoading) {
    //     return (
    //     <div className={styles.loading}>
    //         {Array.from({length: 20}).map((node, index) => (
    //             <SkeletonCard  key={index}/>
    //         ))}
    //     </div>
    //     )
    // }

    return (
        <Template
            title="Organizations"
            modal={{
                modalTitle: "Add new Organization",
                handleSubmit,
                onHandleSubmit
            }}
            modalChildren={
                <div style={{display: "flex", gap: 10, flexDirection: "column"}}>
                    <FileUpload control={control} name={"logo"} multiple={false} />
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
