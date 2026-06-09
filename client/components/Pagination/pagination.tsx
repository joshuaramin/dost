"use client"


import React from 'react'
import styles from '@/styles/components/Pagination/pagination.module.scss';
import Text from '../Typography/Text/text';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';


interface Props {
  totalItems: number
  currentCount: number
  hasNextPage: boolean
  hasPrevPage: boolean
  onNext: () => void
  onPrev: () => void
}

export default function Pagination({ 
  currentCount, hasNextPage, hasPrevPage,
    onNext, onPrev, 
   totalItems
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text size="sm">Showing {currentCount} out of {totalItems} entries</Text>
      </div>
      <div className={styles.footer}>
        <button disabled={hasPrevPage} onClick={onPrev}>
          <TbChevronLeft size={20} />
        </button>
        <Text size="md">{currentCount}</Text>
        <button disabled={hasNextPage} onClick={onNext}>
          <TbChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
