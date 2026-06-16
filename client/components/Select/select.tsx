/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { ChangeEvent, useState } from 'react'
import styles from '@/styles/components/Select/select.module.scss';
import { FieldError, UseFormRegister, FieldValues } from 'react-hook-form';
import { TbCaretDownFilled, TbCaretUpFilled } from 'react-icons/tb';
import Text from '../Typography/Text/text';


type Options = {
    value: string
    label: string
}

interface Props<T extends FieldValues = any> {
    ref?: React.Ref<HTMLElement>
    label: string
    name: string
    isRequired: boolean
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    error: FieldError | undefined
    options: Array<Options>
    setValue: any
    value: any
    register: UseFormRegister<T>
}

export function Select({ ref, label, error, register, name, onChange, isRequired, options, setValue, value }: Props) {

    const [toggle, setToggle] = useState<boolean>(false);

    const onHandleToggle = () => {
        setToggle(() => !toggle)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label>{label}</label>
                {isRequired ? <span className={styles.isRequired}>*</span> : null}
            </div>
            <div className={styles.select}>
                <div className={error ? styles.selectError : styles.selectContainer} {...register(name)}>
                    <Text size="sm">
                        {options.find(option => option.value === value)?.label || `Please select a ${label.toLowerCase()}`}
                    </Text>


                    <button type="button" onClick={onHandleToggle}>
                        {toggle ? <TbCaretUpFilled size={23} /> : <TbCaretDownFilled size={23} />}
                    </button>
                </div>
                {toggle &&
                    <div className={error ? styles.optionContainerError : styles.optionContainer}>
                        <input
                            type="text"
                            onChange={onChange}
                            placeholder='Search here'
                            key={value}
                        />
                        <div className={styles.option}>
                            {options.map(({ label, value }) => (
                                <button
                                    value={value}
                                    key={value}
                                    type="button"
                                    className={styles.option}
                                    onClick={() => {
                                        setValue(name, value);
                                        setToggle(false);
                                    }}
                                >{label}</button>
                            ))}
                        </div>
                    </div>}
            </div>
            <div className={styles.errorBody}>
                <span className={styles.error}>{error?.message}</span>
            </div>
        </div >
    )
}
