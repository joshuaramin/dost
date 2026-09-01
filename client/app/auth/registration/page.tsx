"use client"


import React, { useState } from 'react'
import styles from '@/styles/lib/ui/auth/registration.module.scss'



//components



//lib & hooks
import TitleWrapper from '@/lib/ui/titleWrapper';





export default function Page() {

    const [ step, setStep ] = useState<number>(1)
    return (
        <div className={styles.container}>
            <TitleWrapper title="Account Registration"/>
            
        </div>
    )
}
