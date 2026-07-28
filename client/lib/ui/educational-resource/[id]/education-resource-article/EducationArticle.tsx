import React from 'react'
import parser from 'html-react-parser'
import styles from '@/styles/lib/ui/education-resoucre/educational-resource.module.scss'


interface Props {
    contents: string
}

export default function EducationArticle({ contents }: Props) {
  return (
    <div className={styles.container_body}>
        {parser(contents)}
    </div>
  )
}
