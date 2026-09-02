"use client" 

import React, { useState } from 'react'
import styles from "@/styles/lib/ui/education-resoucre/educational-resources-card.module.scss";
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { TbArrowRight, TbDots, TbPencil, TbTrash } from 'react-icons/tb';


//components
import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import ModalForm from '@/components/Modal/modal-form';
import Form from '@/components/Form/form';
import Button from '@/components/Button/button';


//libs & hooks
import { hasAnyPermission } from '@/lib/utils/hasAnyPermission';
import useFormMutation from '@/lib/hooks/useMutation';
import headers from '@/lib/utils/headers'
import Link from 'next/link';

interface Props {
    title: string
    slug: string
    summary: string
    route: string
    type: string
    thumbnail: string
    educational_resource_id?: string
}


export default function EducationResourceCard({  thumbnail,  slug, type, title, summary, route, educational_resource_id}: Props) {

  const router = useRouter();

  const [ toggle, setToggle ] = useState<boolean>(false);
  const [ deleteToggle, setDeleteToggle ] = useState<boolean>(false);

  const { handleSubmit } = useForm();

  const canDelete = hasAnyPermission([
    "educational-resources:delete",
    "educational-resources:update",
  ], "/dashboard/engagement/educational-resources" )


  const mutation = useFormMutation({
    key: ["DeleteEducationalResource", slug],
    method: "PATCH",
    url: `maintenance/educational-resource/${educational_resource_id}`,
    headers
  })

  const onHandleSubmit = () => {
    mutation.mutate(null, {
      onSuccess: () => {},
      onError: () => {}
    })
  }

  const onHandleToggle = () => {{
    setToggle((prev) => !prev)
  }}

  const onHandleDeleteToggle = () => {
    setDeleteToggle((prev) => !prev)
  }


  return (
    <div className={styles.education_card}>
            {/* {canDelete && (
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
                    <Form
                       onSubmit={handleSubmit(onHandleSubmit)}
                    >
                    <Text size="md" style={{ fontWeight: "400"}}>
                          Are you sure you want to delete this item? This action is permanent and cannot be undone. Once deleted, the item and any associated information may no longer be available or recoverable. Please confirm that you want to continue.
                        </Text>
                          <div className={styles.model_footer}>
                            <Button onClick={onHandleDeleteToggle} size="sm" variant="disabled" types="outline">
                                <Text size="sm">Cancel</Text>
                            </Button>
                            <Button size="sm" variant="danger">
                                <Text size="sm">Confirm</Text>
                            </Button>
                        </div>
                    </Form>
                  </ModalForm>
                )}
              </div>
            )} */}
          <div className={styles.header}>
            {/* <Image src={thumbnail} alt={title} objectFit="cover" layout="fill" /> */}
            </div>
            <div className={styles.body}>
              <div className={styles.sub_body}>
                <Title onClick={() => {
                  router.push(route)
                }} size="md">{title.length <= 60 ? title : title.slice(0, 60)}</Title>
                <Paragraph >{summary}</Paragraph>
              </div>
            </div>
            <div className={styles.footer}>
              <div className={styles.footerBtn}>
                {/* <Link href={route}>Visit Site  <TbArrowRight size={18} /></Link> */}
                <Link href={route}>Read More</Link>
              </div>
  
            </div>
          </div>
  )
}
