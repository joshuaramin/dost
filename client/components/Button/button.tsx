import React, { ReactNode } from 'react'
import styles from '@/styles/components/Button/button.module.scss'
type Variant = "primary" | "secondary" | "disabled" | "danger"
type Size = "sm" | "md" | "lg"
type types = "outline" | "filled"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant: Variant
    size: Size
    types?: types
    full?: boolean
}

export default function Button({
    full = false,
    variant,
    size = "sm",
    children,
    disabled,
    types,
    className = "",
    ...props
}: ButtonProps) {



    return (
        <button
            className={`
                ${styles.btn} 
                ${styles[variant]}
                ${styles.full} 
                ${styles[size]}
                ${styles[types]}
                ${styles.full}
                ${className}
                `}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}