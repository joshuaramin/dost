"use client"

import React from 'react'
import {
    FieldError,
    FieldValues,
    Path,
    UseFormRegister,
    RegisterOptions
} from 'react-hook-form'
import styles from '@/styles/components/Input/input.module.scss'

interface InputProps<T extends FieldValues>
    extends React.InputHTMLAttributes<HTMLInputElement> {
    name: Path<T>
    label: string
    isRequired?: boolean
    register: UseFormRegister<T>
    rules?: RegisterOptions<T, Path<T>>
    error?: FieldError
}

export default function Input<T extends FieldValues>({
    name,
    label,
    isRequired = false,
    register,
    rules,
    error,
    className = "",
    ...props
}: InputProps<T>) {

    const hasError = !!error

    return (
        <div className={styles.input_group}>
            <div className={styles.input_label_container}>
                <label htmlFor={name}>
                    {label}
                    {isRequired && <span className={styles.required}> *</span>}
                </label>
            </div>

            <input
                id={name}
                className={`${styles.input} ${hasError ? styles.error : ""} ${className}`}
                {...register(name, {
                    required: isRequired ? `${label} is required` : false,
                    ...rules
                })}
                {...props}
            />

            {hasError && (
                <div className={styles.error_message}>
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    )
}