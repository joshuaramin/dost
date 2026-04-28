import React, { ReactNode } from 'react'
import styles from '@/styles/components/Button/button.module.scss'

type Variant = "primary" | "secondary" | "disabled" | "danger"
type Size = "sm" | "md" | "lg"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant: Variant
    size: Size
    full?: boolean
}

export default function Button({
    full = false,
    variant = "primary",
    size = "sm",
    children,
    disabled,
    className = "",
    ...props
}: ButtonProps) {

    let btnClass = `${styles.btn} ${styles.full} ${styles[size]}`
    if (variant) btnClass += ` ${styles[variant]}`
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