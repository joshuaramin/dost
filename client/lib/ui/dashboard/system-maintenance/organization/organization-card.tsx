import React from 'react'
import styles from '@/styles/lib/ui/dashboard/system-maintenance/organization/organization-card.module.scss';
import { TbDots, TbEdit, TbTrash } from 'react-icons/tb';


//components
import Avatar from '@/components/Avatar/avatar';


//lib & hooks
import Title from '@/lib/ui/title';



interface Props {
    logo: string
    address: string
    contact: string
    name: string
}

export default function OrganizationCard({ logo, address, contact, name }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_col1}>
                    <Avatar variant='lg' src={logo} />
                    <button>
                        <TbDots size={18} />
                    </button>
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
            {/* <div className={styles.footer}>
                <Button size="md" variant='danger' types="outline">
                    <TbTrash size={18} />
                </Button>
                <Button size="md" variant='primary' types="outline">
                    <TbEdit size={18} />
                </Button>
            </div> */}
        </div >
    )
}
