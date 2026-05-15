"use client"

import React from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/user-management/user-management.module.scss';
import Checkbox from '@/components/Input/checkbox';

export default function UserManagement() {
  return (
    <div className={styles.container}>
        <table>
            <thead>
                <tr>
                    <th>
                        <Checkbox />
                    </th>
                    <th>Fullname</th>
                    <th>Email Address</th>
                    <th>Organization</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
  )
}
