"use client"

import { useState } from 'react';
import styles from '@/styles/lib/ui/dashboard/system-maintenance/roles-and-permission/roles-and-permission.module.scss';
import { SubmitHandler } from 'react-hook-form';
import RolesAndPermissionsCard from './roles-and-permissions-card'

// Components
import Input from '@/components/Input/input';
import Textarea from '@/components/Textarea/textarea';
import Grid from '@/components/Grid/grid';
import Search from '@/components/Search/search';
import Pagination from '@/components/Pagination/pagination';

//lib & hooks
import Template from '@/lib/ui/template';
import useFormHook from '@/lib/hooks/useFormHook';
import useFormQuery from '@/lib/hooks/useQuery';
import headers  from '@/lib/utils/headers';
import useFormMutation from '@/lib/hooks/useMutation';
import { RolesAndPermissionResponse } from '@/lib/interface/roles-and-permissions/roles-and-permission';
import { RolesSchema } from '@/lib/validations/role.validation';
import { RolesSchemaFormField } from '@/lib/types/roles-and-permissions';
import NoData from '@/lib/ui/no-data';

export default function RolesPermissions() {

    const limit = 20;
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ open, setOpen ] = useState<boolean>(false);
    const [ search, setSearch ] = useState<string>("");
    const [ endCursor, setEndCursor ] = useState<string>("")
    const [ startCursor, setStartCursor ] = useState<string>("")


    const { data, isLoading } = useFormQuery<RolesAndPermissionResponse>({
        key: ["RolesandPermissions",  search, endCursor, startCursor],
        url: "maintenance/roles",
        headers,
        params: {
            search, limit, orderBy: "created_at", sortBy: "desc",
            after: endCursor || undefined, 
            before: startCursor || undefined
        }
    })

    const { register, errors, handleSubmit } = useFormHook({
        schema: RolesSchema,
        defaultValues: {
            name: "",
            description: ""
        }
    })

    const mutaiton = useFormMutation<RolesSchemaFormField>({
        key: ["RolesAndPermission",],
        method: "POST",
        url: "maintenance/roles",
        headers,  
    })

    const onHandleSubmition: SubmitHandler<RolesSchemaFormField> = (data) => {
        mutaiton.mutateAsync({
            name: data.name,
            description: data.description
        }, {
            onSuccess: () => {},
            onError: () => {}
        })
    }

    const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value);
        setCurrentPage(1);
        setEndCursor("");
        setStartCursor("");
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


    const onHandleAddNewToggle = () => {
        setOpen(prev => !prev)
    }

    return (
        <Template 
            title="Roles and Permissions"
            onModalOpenToggle={open}
            onHandleCloseToggle={onHandleAddNewToggle}
            modal={{
                modalTitle: "Add New Roles", 
                handleSubmit: handleSubmit,
                onHandleSubmit: onHandleSubmition
            }}
            modalChildren={
                <div style={{ display: "flex", flexDirection: "column",  gap: 10}}>
                    <Input isRequired={true}  name={"name"} label="Name" register={register} error={errors.name}/>
                    <Textarea name="description" register={register} isRequired={true} label="Description" errors={errors.description}/>
                </div>
            }
        >   
        <div className={styles.container}>
            <Search 
                onChange={onHandleSearch} value={search}
            />
            {data?.data.totalCount === 0 ? <NoData text="Roles and Permissions" /> : (
                <Grid min={330} gap={10}>
                    {data?.data.edges.map((node, index) => (
                        <RolesAndPermissionsCard key={index} name={node.node.name} description={node.node.description} slug={node.node.slug} />
                    ))}
                </Grid>
            )}
        <Pagination
            pageSize={limit}
            currentPage={currentPage}
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
