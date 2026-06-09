import React, { ReactNode } from 'react'
import styles from '@/styles/components/Typography/title.module.scss'
import cn from '@/lib/utils/cn'
import { PrimaryFont } from '@/lib/typography';

type Size = 'sm' | 'md' | 'lg'

interface Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
  className?: string
  size: Size
}

export default function Title({
  children,
  className,
  size,
  ...props
}: Props) {
  const headingClass = cn(styles.title, styles[size], className, PrimaryFont.className)

  return (
    <h1 className={headingClass} {...props}>
      {children}
    </h1>
  )
}