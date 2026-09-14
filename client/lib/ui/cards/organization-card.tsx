"use client"


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/organization/organization-card.module.scss';
import { TbDots, TbEdit, TbTrash } from 'react-icons/tb';


//components
import Avatar from '@/components/Avatar/avatar';


//lib & hooks
import Title from '@/lib/ui/title';
import { hasAnyPermission } from '@/lib/utils/hasAnyPermission';



interface Props {
    logo: string
    address: string
    contact: string
    name: string
}

export default function OrganizationCard({ logo, address, contact, name }: Props) {

    const [ toggle, setToggle ] = useState<boolean>(false);

    const onHandleToggle = () => {
        setToggle(() => !toggle)
    }

    const canDelete = hasAnyPermission([
        "organization-management:delete",
        "organization-management:update"
    ], "/dashboard/system-maintenance/organization")

    
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_col1}>
                    <Avatar variant='lg' src={logo} />
                    {canDelete && (
                        <button onClick={onHandleToggle}>
                            <TbDots size={18} />
                        </button>
                    )}
                </div>
                <Title title={name} />
            </div>
            <div className={styles.body}>
                <span>{address}</span>
                <br />
                <br />
                <span>Contact No: {" "}</span>
                <span>{contact}</span>
            </div>
        </div >
    )
}
