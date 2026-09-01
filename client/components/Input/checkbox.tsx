

import React from 'react'
import styles from '@/styles/components/Input/checkbox.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement>  {

}

export default function Checkbox({ ...props}: Props) {
  return (
    <div className={styles.container}>
        <input type='checkbox'  {...props} />
    </div>
  )
}