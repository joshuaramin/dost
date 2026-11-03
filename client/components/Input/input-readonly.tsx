import React from 'react'
import styles from '@/styles/components/Input/input.module.scss'


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder: string
}

export default function InputReadOnly({ placeholder,  ...props }: InputProps) {
    return (
         <div className={styles.input_group}>
                <div className={styles.input_label_container}>
                </div>

                <input
                    className={styles.input}
                    placeholder={placeholder}
                    {...props}
                />
        </div>
    )
}
