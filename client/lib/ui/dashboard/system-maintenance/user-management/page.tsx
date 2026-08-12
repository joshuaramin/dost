"use client"

import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/user-management/user-management.module.scss';
import { TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import { format } from 'date-fns'
import { useRouter } from 'next/navigation';


//lib & utils
import useFormHook from '@/lib/hooks/useFormHook';
import useFormQuery from '@/lib/hooks/useQuery';
import Template from '@/lib/ui/template';
import useFormMutation from '@/lib/hooks/useMutation';
import { CreateUserSchema } from '@/lib/validations/user.validation';
import { OrganizationResult } from '@/lib/interface/organization/organization.interface';
import { UserResult } from '@/lib/interface/user/user.interface';
import { RolesAndPermissionResponse } from '@/lib/interface/roles-and-permissions/roles-and-permission';
import  headers from '@/lib/utils/headers';


//components
import Input from '@/components/Input/input';
import Checkbox from '@/components/Input/checkbox';
import Search from '@/components/Search/search';
import Pagination from '@/components/Pagination/pagination';
import { Select } from '@/components/Select/select';
import SelectArray from '@/components/Select/select-array';
import Grid from '@/components/Grid/grid';
import { SubmitHandler, useWatch } from 'react-hook-form';
import { UserFormFields } from '@/lib/types/user.type';
import Table from '@/components/Table/table';

export default function UserManagement() {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>("");
  const [ endCursor, setEndCursor ] = useState<string>("")
  const [ startCursor, setStartCursor ] = useState<string>("")
  const [ organization_id, setOrganization ] = useState<string>("");
  const [ role_id, setRole ] = useState<string>("")




  const onHandleNextPage = () => { 
    setEndCursor(() => endCursor )
  }

  const onHandlePrevPage = () => {
    setStartCursor(() => startCursor)
  }

  const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.currentTarget.value)
  }


  const onHandleClear = () => {
      setSearch('')
  }

  const onHandleAddnewToggle = () => setOpen((prev) => !prev);

  const { data, isLoading } = useFormQuery<UserResult>({
    key: ["UserManagement", search, endCursor, startCursor, role_id, organization_id],
    url: "maintenance/users",
    headers,
    params: {
      orderBy: "created_at",
      sortBy: "asc",
      limit: 20,
      search,
      role_id,
      organization_id,
      after: endCursor,
      before: startCursor
    }
  })

  const { data: RoleData } = useFormQuery<RolesAndPermissionResponse>({
    key: ["RoleMangement"],
    url: `maintenance/roles/`,
    headers
  })

  const { data: OrganizationData } = useFormQuery<OrganizationResult>({
    key: ["Organizatoin"],
    url: "maintenance/organization",
    headers
  })

  const { errors, handleSubmit, register, watch, control} = useFormHook({
    schema: CreateUserSchema,
    defaultValues: {
      email: "",
      first_name: "",
      is_active: false,
      last_name: "",
      organization_id: "",
      role_id: ""
    }
  })


  const mutation = useFormMutation({
    key:["CreateUser"],
    method: "POST",
    url: "maintenance/users",
    headers,
  })

  const onHandleSubmit: SubmitHandler<UserFormFields>= (data) => {
    mutation.mutateAsync({
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      organization_id: data.organization_id,
      role_id: data.role_id
    }, {
      onSuccess: () => {},
      onError: () => {}
    })
  }


  const status = useWatch({
    control,
    name: "is_active"
  })

  return (
    <Template
      title="User Management"
      onHandleCloseToggle={onHandleAddnewToggle}
      onModalOpenToggle={open}
      modal={{
        modalTitle: "Add new user",
        handleSubmit,
        onHandleSubmit
      }}
      modalChildren={
        <div style={{ display: "flex", flexDirection: "column", gap: 20}}>
          <Input label="Email Address" name="email" register={register} error={errors.email}  isRequired/>
          <div style={{ display: "flex", gap: 20}}>
              <Input label="First Name" name="first_name" register={register} error={errors.first_name}  isRequired/>
              <Input label="Last Name" name="last_name" register={register} error={errors.last_name}  isRequired/>
          </div>
          <Select 
                label="Role"
                name="role_id"
                control={control}
                
                error={errors.role_id} 
                isRequired={true}
                options={(RoleData?.data.edges || []).map(({node}) => ({
                  label: node.name,
                  value: node.role_id
                }))}
          />
          <Select 
                label="Organization"
                name="organization_id"
                control={control}
                error={errors.organization_id} 
                isRequired={true}
                options={(OrganizationData?.data.edges || []).map(({node}) => ({
                  label: node.name,
                  value: node.organization_id
                }))}
          />
        </div>
      }
    >
      <div className={styles.container}>
      <Grid gap={3}>
      <Grid.Column span={1}>
              <Search onChange={onHandleSearch} value={search} onClear={onHandleClear}/>
      </Grid.Column>
      <Grid.Column span={1}>
        <SelectArray
          value={organization_id}
          label="Organizations"
            options={(OrganizationData?.data.edges || []).map(({node}) => ({
                  label: node.name,
                  value: node.organization_id
                }))}
            name="email"
            onSelect={(val) => {
              setOrganization(val)
            }}
        />
      </Grid.Column>
      <Grid.Column span={1}>
          <SelectArray
            value={role_id}
            label="Role"

            options={(RoleData?.data.edges || []).map(({node}) => ({
                  label: node.name,
                  value: node.role_id
                }))}
            name="email"
            onSelect={(val) => {
              setRole(val)
            }}
        />
      </Grid.Column>  
      </Grid>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>
                  <Checkbox />
              </Table.Head>
              <Table.Head>
                Name
              </Table.Head>
                <Table.Head>
                Email
              </Table.Head>
              <Table.Head>
                Status
              </Table.Head>
              <Table.Head>
                Organization
              </Table.Head>
              <Table.Head>
                Actions
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.data.edges.map(({node: { user_id, email, Profile: {first_name, last_name }, is_active, organization: { name } }}) => (
              <Table.Row key={user_id}>
                  <Table.Cell>
                      <Checkbox />
                  </Table.Cell>
                  <Table.Cell>
                    {first_name} {last_name}</Table.Cell>
                  <Table.Cell>{email}</Table.Cell>
                  <Table.Cell>{is_active ? "Active" : "Inactive"}</Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>
                    <button onClick={() => router.push(`/dashboard/system-maintenance/user-management/${user_id}`)}>
                      <TbEye size={18} />
                    </button>
                    <button>
                      <TbEdit size={18} />
                    </button>
                    <button>
                      <TbTrash size={18} />
                    </button>
                  </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Pagination 
          totalItems={data?.data.totalCount || 0}
          currentItems={data?.data.edges.length || 0}
          hasNextPage={data?.data.pageInfo.hasNextPage || false}
          hasPrevPage={data?.data.pageInfo.hasPrevPage || false}
          onNext={onHandleNextPage}
          onPrev={onHandlePrevPage}
          
        />
      </div>
    </Template>
  )
}