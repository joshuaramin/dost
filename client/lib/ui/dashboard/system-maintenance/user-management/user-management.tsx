"use client"

import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/user-management/user-management.module.scss';
import { format } from 'date-fns'

//lib & utils
import SkeletonTable from '@/lib/ui/loading/SkeletonTable';
import useFormHook from '@/lib/hooks/useFormHook';
import useFormQuery from '@/lib/hooks/useQuery';
import Template from '@/lib/ui/template';
import useFormMutation from '@/lib/hooks/useMutation';
import { sessionStore } from '@/lib/utils/sessions';
import { CreateUserSchema } from '@/lib/validations/user.validation';
import { UserResult } from '@/lib/interface/user/user.interface';


//components
import Input from '@/components/Input/input';
import Avatar from '@/components/Avatar/avatar';
import Checkbox from '@/components/Input/checkbox';
import Text from '@/components/Typography/Text/text';


import { TbEdit, TbEye, TbTrash } from 'react-icons/tb';
import Search from '@/components/Search/search';
import Pagination from '@/components/Pagination/pagination';

export default function UserManagement() {
  const token = sessionStore.getToken();

  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
    "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
    "Authorization": `Bearer ${token}`
  }

  const [open, setOpen] = useState<boolean>(false);
  const [ search, setSearch ] = useState<string>("");
  const [ page, setPage ] = useState<number>(0)

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

  const onHandleAddnewToggle = () => setOpen((prev) => !prev);

  const { data, isLoading } = useFormQuery<UserResult>({
    key: ["UserManagement"],
    url: "maintenance/users",
    headers,
    params: {
      orderBy: "created_at",
      sortBy: "asc",
      limit: 20
    }
  })


  const { errors, handleSubmit, register } = useFormHook({
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
    url: "maintenance/user-management",
    headers,
  })

  const onHandleSubmit = () => {
    mutation.mutateAsync({}, {
      onSuccess: () => {},
      onError: () => {}
    })
  }


  if(isLoading) {
    return (
      <div className={styles.loading}>
        <SkeletonTable />
      </div>
    )
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
        </div>
      }
    >
      <div className={styles.container}>
        <div className={styles.filter}>
          <Search onChange={onHandleSearch} value={search} onClear={onHandleClear}/>
          <Search onChange={onHandleSearch} value={search} onClear={onHandleClear}/>

          <Search onChange={onHandleSearch} value={search} onClear={onHandleClear}/>


        </div>
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
                      <button className={styles.actionBtn} aria-label="View user">
                        {/* <EyeIcon /> */}
                        <TbEye size={23} />
                      </button>
                      <button className={styles.actionBtn} aria-label="Edit user">
                        {/* <EditIcon /> */}
                        <TbEdit size={23} />
                      </button>
                      <button className={styles.actionBtn} aria-label="Delete user">
                        {/* <TrashIcon /> */}
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