import React from 'react'
import styles from '@/styles/components/Select/select.module.scss';
import { UseFormRegister, FieldValues, FieldError } from 'react-hook-form';
import Text from '../Typography/Text/text';


type SelectOption = {
    key: string
    value: string
}
interface Props<T extends FieldValues> extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string
    name: string 
    register: UseFormRegister<T>
    error: FieldError | undefined
    options: SelectOption[]
}

export default function Select<T extends FieldValues>({label, name, register, error, options}: Props<T>) {


    const hasError = !!error
    return (
        <div className={styles.select_group}>
            <div className={styles.label}>
                <span>{label}</span>
                <span>*</span>
            </div>
            <div>
                {options.map((node, index) => (
                    <button key={index}>
                        <Text size="sm">{node.key}</Text>
                    </button>
                ))}
            </div>
            {hasError && (
                <div className={styles.error_message}>
                    <span>{error.message}</span>
                </div>
            )}
        </div>
    )
}
