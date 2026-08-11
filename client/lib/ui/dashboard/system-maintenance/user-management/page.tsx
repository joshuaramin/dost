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
import Avatar from '@/components/Avatar/avatar';
import Checkbox from '@/components/Input/checkbox';
import Text from '@/components/Typography/Text/text';
import Search from '@/components/Search/search';
import Pagination from '@/components/Pagination/pagination';
import { Select } from '@/components/Select/select';
import SelectArray from '@/components/Select/select-array';
import Grid from '@/components/Grid/grid';
import { SubmitHandler } from 'react-hook-form';
import { UserFormFields } from '@/lib/types/user.type';

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

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th><Checkbox /></th>
                <th>Full name</th>
                <th>Email address</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Joined date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={7} className={styles.stateCell}>
                    <Text size="sm">Loading...</Text>
                  </td>
                </tr>
              )}

              {!isLoading && !data?.data.edges.length && (
                <tr>
                  <td colSpan={7} className={styles.stateCell}>
                    <Text size="sm">No users found.</Text>
                  </td>
                </tr>
              )}

              {!isLoading && data?.data.edges.map(({ node, cursor }) => (
                <tr key={cursor}>
                  <td>
                    <Checkbox />
                  </td>

                  <td>
                    <div className={styles.nameCell}>
                      <Avatar variant="md" />
                      <Text size="sm">
                        {node.Profile.first_name} {node.Profile.last_name}
                      </Text>
                    </div>
                  </td>

                  <td>
                    <Text size="sm">{node.email}</Text>
                  </td>

                  <td>
                    <Text size="sm">{node.organization.name}</Text>
                  </td>

                  <td>
                    <Text size="sm">{node.role.name}</Text>
                  </td>

                  <td>
                    <Text size="sm">
                      {format(new Date(node.created_at), "MMMM dd, yyyy")}
                    </Text>
                  </td>

                  <td>
                    <div className={styles.actionCell}>
                      <button
                      onClick={() => router.push(`/dashboard/system-maintenance/user-management/${node.user_id}`)}
                      className={styles.actionBtn} aria-label="View user">
                        <TbEye size={23} />
                      </button>
                      <button 
                        onClick={() => router.push(`/dashboard/system-maintenance/user-management/${node.user_id}/edit`)}
                      className={styles.actionBtn} aria-label="Edit user">
                        <TbEdit size={23} />
                      </button>
                      <button 
                      
                      className={styles.actionBtn} aria-label="Delete user">
                        <TbTrash size={23} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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