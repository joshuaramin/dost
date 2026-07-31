"use client" 

import React, { useState } from 'react'
import styles from "@/styles/lib/ui/education-resoucre/educational-resources-card.module.scss";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { TbDots, TbPencil, TbTrash } from 'react-icons/tb';


//components
import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import ModalForm from '@/components/Modal/modal-form';


//libs & hooks
import { hasAnyPermission } from '@/lib/utils/hasAnyPermission';


interface Props {
    title: string
    slug: string
    summary: string
    route: string
    type: string
    thumbnail: string
}


export default function EducationResourceCard({  thumbnail,  slug, type, title, summary, route}: Props) {

  const router = useRouter();

  const [ toggle, setToggle ] = useState<boolean>(false);
  const [ deleteToggle, setDeleteToggle ] = useState<boolean>(false);

  const canDelete = hasAnyPermission([
    "educational-resources:delete",
    "educational-resources:update",
  ], "/dashboard/engagement/educational-resources" )


  const onHandleToggle = () => {{
    setToggle((prev) => !prev)
  }}

  const onHandleDeleteToggle = () => {
    setDeleteToggle((prev) => !prev)
  }


  return (
    <div className={styles.education_card}>
          <div className={styles.header}>
            {canDelete && (
              <div className={styles.footer}>
                <button className={styles.option_button} onClick={onHandleToggle}>
                    <TbDots size={23} />
                </button>
                {toggle && (
                  <div className={styles.toggleContainer}>
                    <button onClick={() => router.push(`/dashboard/engagement/educational-resources/edit/${slug}`)}>
                        <TbPencil size={23} />
                        <Text size="sm">Edit</Text>
                      </button>
                      <button onClick={onHandleDeleteToggle}>
                        <TbTrash size={23} />
                        <Text size="sm">Delete</Text>
                      </button>
                  </div>
                )}
                {deleteToggle && (
                  <ModalForm
                    title="Are you sure do you want to delete this?"
                    onHandleCloseToggle={onHandleDeleteToggle}
                  >
                    asds
                  </ModalForm>
                )}
              </div>
            )}

            <Image src={thumbnail} alt={title} objectFit="cover" layout="fill" />
            </div>
            <div className={styles.body}>
              <div className={styles.tags}>
                <Text size="sm">{type.replaceAll("_", " ")}</Text>
              </div>
              <div className={styles.sub_body}>
                <Title onClick={() => {
                  router.push(route)
                }} size="md">{title.length <= 60 ? title : title.slice(0, 60)}</Title>
                <Paragraph >{summary}</Paragraph>
              </div>
            </div>
          </div>
  )
}
