import React from 'react'
import styles from '@/styles/lib/ui/dashboard/not-found/not-found.module.scss';
import Title from '@/components/Typography/Title/title';
import Text from '@/components/Typography/Text/text';


export default function PagN() {
  return (
    <div className={styles.container}>
        <Title size="lg">404 NOT FOUND</Title>
        <Text size="md">The page you’re looking for doesn’t exist or has been moved.</Text>
    </div>
  )
}
