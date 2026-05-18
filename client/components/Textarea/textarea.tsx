import React from 'react'
import styles from '@/styles/components/Texarea/textarea.module.scss';
import { SecondaryFont } from '@/lib/typography';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    isRequired: boolean
}

export default function Textarea(
    {label, isRequired}: Props
) {
  return (
    <div className={styles.container}>
        <div>
            <label>{label}</label>
            {isRequired &&  <span>*</span>}
        </div>
        <textarea className={SecondaryFont.className} />
    </div>
  )
}
