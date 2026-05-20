"use client"

import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/user-management/user-management.module.scss';
import Checkbox from '@/components/Input/checkbox';
import Template from '@/lib/ui/template';
import { sessionStore } from '@/lib/utils/sessions';
import useFormQuery from '@/lib/hooks/useQuery';
import { UserResult } from '@/lib/interface/user/user.interface';
import { format } from 'date-fns'
import Avatar from '@/components/Avatar/avatar';
import Text from '@/components/Typography/Text/text';
import useFormHook from '@/lib/hooks/useFormHook';
import { CreateUserSchema } from '@/lib/validations/user.validation';
import Input from '@/components/Input/input';

export default function UserManagement() {
  const token = sessionStore.getToken();

  const headers = {
    "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY,
    "x-api-version": process.env.NEXT_PUBLIC_API_VERSION_KEY,
    "Authorization": `Bearer ${token}`
  }

  const [open, setOpen] = useState<boolean>(false);
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


  const onHandleSubmit = () => {

  }
  return (
    <Template
      title="User Management"
      onHandleCloseToggle={onHandleAddnewToggle}
      onModalOpenToggle={open}
      modal={{
        modalTitle: "Add new User",
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
                      </button>
                      <button className={styles.actionBtn} aria-label="Edit user">
                        {/* <EditIcon /> */}
                      </button>
                      <button className={styles.actionBtn} aria-label="Delete user">
                        {/* <TrashIcon /> */}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Template>
  )
}