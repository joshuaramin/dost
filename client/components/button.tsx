import React, { ReactNode } from 'react'
import styles from '@/styles/components/Button/button.module.scss'

type Variant = "primary" | "secondary" | "disabled" | "danger"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant: Variant
    full?: boolean
}

export default function Button({
    full = false,
    variant,
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) {

    let btnClass = `${styles.btn} ${styles[variant]} ${styles.full}`
    if (className) btnClass += ` ${className}`



    return (
        <button
            className={btnClass}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}