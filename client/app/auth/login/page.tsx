/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation';
import styles from '@/styles/lib/ui/auth/login.module.scss';
import store2 from 'store2'
import { SubmitHandler } from 'react-hook-form';

//components
import Form from '@/components/Form/form';
import Button from '@/components/Button/button';
import Input from '@/components/Input/input'

//lib and hooks
import TitleWrapper from '@/lib/ui/titleWrapper';
import Title from '@/lib/ui/title';
import useFormHook from '@/lib/hooks/useFormHook';
import { UserSchema } from '@/lib/validations/user.validation';
import { UserLoginFields } from '@/lib/types/user.type';

import useFormMutation from '@/lib/hooks/useMutation';
import { toastError, toastSuccess } from '@/lib/ui/toast';
import Text from '@/components/Typography/Text/text';

export default function Page() {

    const store = store2
    const router = useRouter();

    const { register, errors, handleSubmit, reset } = useFormHook({
        schema: UserSchema,
        defaultValues: {
            email: "",
        }
    })

    const mutation = useFormMutation<UserLoginFields>({
        url: "auth/login",
        key: ["Login"],
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const onHandleSubmit: SubmitHandler<UserLoginFields> = (data) => {
        mutation.mutate({ email: data.email }, {
            onSuccess: (res: any) => {


                toastSuccess({
                    title: "Verification Sent",
                    body: "Check your email for the 6-digit code.",
                })

                store.set("email", res.data.email);

                reset({
                    email: "",
                })

                setTimeout(() => {
                    router.push(`/auth/verification?email=${res.data.email}`)
                }, 800)
            },
            onError: (error: any) => {
                toastError({
                    title: "Login Failed",
                    body:
                        error?.response?.data?.data?.message ||
                        error?.message ||
                        "Something went wrong",
                });
            },
        })
    }
    return (
        <div className={styles.container}>
            <TitleWrapper title='ADVOCAID RESEARCH PORTAL' />
            <div>
                <Title title='Sign in to your Account' />
                <p>We{"'"}ll send a one-time 6-digit code to your institutional</p>
            </div>
            <Form onSubmit={handleSubmit(onHandleSubmit)}>
                <Input
                    name={'email'} label={'Email Address'}
                    isRequired={true}
                    register={register}
                    error={errors.email}
                    autoFocus={false}
                    autoComplete='additional-name'
                />
                <Button size="lg" full={true} variant='primary'>
                    <Text size="md">SEND VERIFICATION CODE</Text>
                </Button>
            </Form>
            <div className={styles.reminder}>
                <p><b>Passwordless & secure</b>. A 6-digit code will be sent to your inbox, valid for 10 minutes. Compliant with <b>RA 10173 — Data Privacy Act.</b></p>
            </div>
            <hr />
            <div className={styles.contact}>
                <span> Having Trouble? <Link style={{
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
    )
}
