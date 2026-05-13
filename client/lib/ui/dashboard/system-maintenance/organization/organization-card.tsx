import React from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/organization/organization-card.module.scss';
import Avatar from '@/components/Avatar/avatar';
import Title from '@/lib/ui/title';
import Button from '@/components/Button/button';
import { TbEdit, TbTrash } from 'react-icons/tb';



interface Props {
    logo: string
    address: string
    contact: number
    name: string
}

export default function OrganizationCard({ logo, address, contact, name }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Avatar variant='lg' src={logo} />
                <Title title={name} />
            </div>
            <div className={styles.body}>
                <span>{address}</span>
                <br />
                <br />
                <span>Contact No: {" "}</span>
                <span>{contact}</span>
            </div>
            <div className={styles.footer}>
                <Button size="md" variant='danger' types="outline">
                    <TbTrash size={18} />
                </Button>
                <Button size="md" variant='primary' types="outline">
                    <TbEdit size={18} />
                </Button>
            </div>
        </div >
    )
}
