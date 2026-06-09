import React from 'react'
import styles from '@/styles/components/Search/search.module.scss'
import { TbSearch, TbX } from 'react-icons/tb'

interface Props {
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    onClear?: () => void
}

export default function Search({ value, onChange, onClear }: Props) {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                <TbSearch size={23} />
            </div>


            <div className={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={value}
                    onChange={onChange}
                />
            </div>

            {
                value && (
               

            <div className={styles.btn}>
                <button
                type="button"
                onClick={onClear}
                disabled={!value}
                aria-label="Clear search"
                >
                            <TbX size={23} />
                </button>
            </div>
                )
            }
        </div>
    )
}