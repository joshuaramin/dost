import React, { ReactNode } from 'react'
import styles from '@/styles/components/Form/form.module.scss'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: ReactNode
}

export default function Form(
    {
        children,
        ...props
    }: FormProps
) {
    return (
        <form className={styles.container} {...props}>
            {children}
        </form>
    )
}
