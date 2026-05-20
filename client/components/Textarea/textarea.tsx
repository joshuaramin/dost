import React from 'react'
import styles from '@/styles/components/Texarea/textarea.module.scss';
import { SecondaryFont } from '@/lib/typography';
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';
import cn from '@/lib/utils/cn';

interface Props<T extends FieldValues> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    name: Path<T>
    isRequired: boolean
    register: UseFormRegister<T>
    rules?: RegisterOptions<T, Path<T>>
    error?: FieldError | undefined
}

export default function Textarea<T extends FieldValues>(
    {label, isRequired, error, name,  register }: Props<T>
) {

  const hasError = !!error

  return (
    <div className={styles.container}>
        <div className={styles.textarea_label_container}>
            <label>{label}</label>
            {isRequired &&  <span className={styles.required}>*</span>}
        </div>
        <textarea className={cn(error ? styles.error :  "", SecondaryFont.className)} {...register(name)} />
        {hasError && (
                <div className={styles.error_message}>
                    <span>{error.message}</span>
                </div>
            )}
    </div>
  )
}
