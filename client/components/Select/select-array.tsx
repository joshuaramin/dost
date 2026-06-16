"use client"

import React, { useState } from 'react'
import styles from '@/styles/components/Select/select-array.module.scss';
import Text from '../Typography/Text/text';
import { TbCaretDownFilled, TbCaretUpFilled } from 'react-icons/tb';


type Options = {
    value: string
    label: string
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement>  {
    label: string
    name: string
    options?: Options[]
    value: string
}

export default function SelectArray({ label, name, options, value}: Props) {

  const [ toggle, setToggle ] = useState<boolean>(false);

  const onHandleToggle = () => {
    setToggle(prev => !prev)
  }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <label>{label}</label>
        </div>
        <div className={styles.select}>
            <div className={styles.selectContainer}>
                <Text size="sm">
                    {options?.find((option) => option.value === value)?.label || `Please select a ${label.toLowerCase()}`}
                </Text>
                <button type="button" onClick={onHandleToggle}>
                    {toggle ? <TbCaretUpFilled size={23} /> : <TbCaretDownFilled size={23} />}
                </button>
            </div>
            {toggle && (
                <div className={styles.optionContainer}>
                    {options?.map(({label, value}) => (
                        <button
                        value={value}
                        type="button"
                        className={styles.option}
                        key={value}>
                            <Text size="sm">{label}</Text>
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

