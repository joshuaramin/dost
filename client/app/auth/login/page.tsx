"use client"

import React from 'react'
import styles from '@/styles/lib/ui/auth/login.module.scss';
import { SubmitHandler } from 'react-hook-form';


//components
import Form from '@/components/form';
import Button from '@/components/button';

//lib and hooks
import Header from '@/lib/ui/header';
import TitleWrapper from '@/lib/ui/titleWrapper';
import Title from '@/lib/ui/title';
import Input from '@/components/input'
import useFormHook from '@/lib/hooks/useFormHook';
import { UserSchema } from '@/lib/validations/user.validation';
import { UserFormFields } from '@/lib/types/user.type';

import Link from 'next/link'
import Footer from '@/lib/ui/footer';

export default function Page() {

    const { register, errors, handleSubmit } = useFormHook({
        schema: UserSchema,
        defaultValues: {
            email: ""
        }
    })

    const onHandleSubmit: SubmitHandler<UserFormFields> = (data) => { }
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <TitleWrapper title='ADVOCAID RESEARCH PORTAL' />
                <div>
                    <Title title='Sign in to your Account' />
                    <p>We{"'"}ll send a one-time 6-digit code to your institutional</p>
                </div>
                <Form onSubmit={handleSubmit(onHandleSubmit)}>
                    <Input
                        name={'email'} label={'Institutional Email Address'}
                        isRequired={true}
                        register={register}
                        error={errors.email}
                    />
                    <Button full={true} variant='secondary'>
                        <span>Send Verification Code</span>
                    </Button>
                </Form>
                <div className={styles.reminder}>
                    <p><b>Passwordless & secure</b>. A 6-digit code will be sent to your inbox, valid for 10 minutes. Compliant with <b>RA 10173 — Data Privacy Act.</b></p>
                </div>
                <hr />
                <div className={styles.contact}>
                    <span> Having Trouble <Link style={{
                        color: "#1B4264",
                        fontWeight: "bold",
                        textDecoration: "none"
                    }} href="mailto:raminjoshua05@gmail.com">Contact Avocaid Team</Link></span>
                    <Link
                        style={{
                            color: "#1B4264",
                            fontWeight: "bold",
                            textDecoration: "none"
                        }}
                        href="/">RETURN TO HOME</Link>
                </div>
            </div>
            <Footer />
        </div>
    )
}
