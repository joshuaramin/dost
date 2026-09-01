import React from 'react'
import styles from '@/styles/components/Texarea/textarea.module.scss';
import { SecondaryFont } from '@/lib/typography';
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';
import cn from '@/lib/utils/cn';

interface Props<T extends FieldValues> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    name: Path<T>
    isRequired?: boolean
    register: UseFormRegister<T>
    rules?: RegisterOptions<T, Path<T>>
    errors?: FieldError | undefined
}

export default function Textarea<T extends FieldValues>(
    {label, isRequired = false, errors, name,  register, ...props }: Props<T>
) {

  const hasError = !!errors

  return (
    <div className={styles.container} >
        <div className={styles.textarea_label_container}>
            <label>{label}</label>
            {isRequired &&  <span className={styles.required}>*</span>}
        </div>
        <textarea {...props} className={cn(errors ? styles.error :  "", SecondaryFont.className)} {...register(name)} />
        {hasError && (
                <div className={styles.error_message}>
                    <span>{errors.message}</span>
                </div>
            )}
    </div>
  )
}
