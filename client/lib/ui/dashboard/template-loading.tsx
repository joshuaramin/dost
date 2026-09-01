import React, { ReactNode } from 'react'
import styles from '@/styles/lib/ui/dashboard/template-loading.module.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import SkeletonCard from '../loading/SkeletonCard';
import SkeletonSidebar from '../loading/SkeletonSidebar';


export default function TemplateLoading() {
  return (
     <div className={styles.container}>
          <div className={styles.sidebar}>
            <SkeletonSidebar />
          </div>
    </div>
  )
}
