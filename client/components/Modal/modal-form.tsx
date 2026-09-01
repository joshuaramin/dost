"use client"

import React, { ReactNode } from 'react'
import styles from '@/styles/components/Modal/modal-form.module.scss';
import { TbX } from 'react-icons/tb';
import Title from '@/components/Typography/Title/title';
import Text from '../Typography/Text/text';
import Button from '../Button/button';

interface Props extends React.HTMLAttributes<HTMLDivElement>{
    children: ReactNode
    height?: number
    width?: number
    title: string
    onHandleCloseToggle: () => void;
}


export default function ModalForm({ children, title, width, height, onHandleCloseToggle}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        <div className={styles.sub_container_header}>
          <Title size="md">{title}</Title>
          <button onClick={onHandleCloseToggle}>
            <TbX size={18} />
          </button>
        </div>
        <div className={styles.sub_container_body}>
          {children}
        </div>
      </div>
    </div>
  )
}
