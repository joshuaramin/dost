import React from 'react'
import styles from '@/styles/components/Texarea/textarea.module.scss';
import { SecondaryFont } from '@/lib/typography';


interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    placeholder: string
}

export default function TextareaReadOnly({ placeholder, ...props}: Props) {
  return (
     <div className={styles.container} >
        <div className={styles.textarea_label_container}>
        </div>
        <textarea {...props} className={ SecondaryFont.className}  placeholder={placeholder}/>
    </div>
  )
}
