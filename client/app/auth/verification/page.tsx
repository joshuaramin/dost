"use client"

import React, { useRef } from "react"
import styles from '@/styles/lib/ui/auth/verification.module.scss'
import { useRouter } from "next/navigation"


import TitleWrapper from '@/lib/ui/titleWrapper'
import Title from '@/lib/ui/title'
import Button from "@/components/button"

export default function Page() {

    const router = useRouter();
    const inputsRef = useRef<Array<HTMLInputElement | null>>([])

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return

        if (inputsRef.current[index]) {
            inputsRef.current[index]!.value = value
        }

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!inputsRef.current[index]?.value && index > 0) {
                inputsRef.current[index - 1]?.focus()
            }
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

        paste.split("").forEach((char, i) => {
            if (inputsRef.current[i]) {
                inputsRef.current[i]!.value = char
            }
        })

        const nextIndex = paste.length < 6 ? paste.length : 5
        inputsRef.current[nextIndex]?.focus()
    }

    const onHandleBackRoute = () => {
        router.push("/auth/login")
    }

    const onHandleDashboard = () => {
        router.push("/dashboard/main/overview")
    }
    return (
        <div className={styles.container}>
            <TitleWrapper title='Verification' />

            <div>
                <Title title='Enter your One-Time Password' />
                <p>A one-time verification code was sent to your email address. It expires in 10 minutes.</p>
            </div>

            <div className={styles.grid}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        ref={(el) => (inputsRef.current[index] = el)}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className={styles.input}
                    />
                ))}
            </div>
            <Button onClick={onHandleDashboard} full={true} variant='primary'>
                <span>SEND VERIFICATION CODE</span>
            </Button>
            <div className={styles.reminder}>
                <p>This code is <b>single-use</b> and expires automatically. Advocaid will never ask for your code via phone, chat, or email.</p>
            </div>
            <div className={styles.divider}>
                <hr />
                <span>OR</span>
                <hr />
            </div>
            <Button onClick={onHandleBackRoute} full={true} variant='secondary'>
                <span>USE ANOTHER EMAIL ADDRESS</span>
            </Button>
        </div>
    )
}