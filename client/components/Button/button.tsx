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
    types ="filled",
    className = "",
    ...props
}: ButtonProps) {
    const buttonClass = [
        styles.btn,
        styles[variant],
        styles[size],
        styles[types],
        full ? styles.full : "",
        className
    ].join(" ");

    return (
        <button
            className={buttonClass}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    )
}