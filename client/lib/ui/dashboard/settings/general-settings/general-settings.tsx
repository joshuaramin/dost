"use client"


import React from 'react'
import styles from "@/styles/lib/ui/dashboard/settings/settings.module.scss"

import Text from '@/components/Typography/Text/text'
import Title from '@/components/Typography/Title/title'
import Paragraph from '@/components/Typography/Paragraph/paragraph'
import Button from '@/components/Button/button';
import useFormMutation from '@/lib/hooks/useMutation';
import { sessionStore } from '@/lib/utils/sessions';
import { toastSuccess } from '@/lib/ui/toast';
import Cookies from 'cookies-next'
import { useRouter } from 'next/navigation';
export default function GeneralSettings() {

    const router = useRouter()
    const session = sessionStore.get();
    const cookie = Cookies

    const mutation = useFormMutation({
        key: ["Logout"],
        method: "POST",
        url: `auth/logout/${session?.data.user_id}`
    })


    const onHandleSubmit = () => {
        mutation.mutate(null, {
            onSuccess: () => {
                toastSuccess({
                    title: "Logged Out",
                    body: "You have been successfully logged out of your account.",
                })
                cookie.deleteCookie("token")
                sessionStore.clear();
                router.push("/")
            },
            onError: (err) => {
                console.error(err)
            }
        })
    }


    return (
        <div className={styles.tab_content}>
            <div className={styles.section_header}>
                <Title size="md">
                    General Settings
                </Title>

                <Paragraph>
                    Manage general preferences and configuration for Advocaid PH.
                </Paragraph>
            </div>

            <div className={styles.settings_group}>
                <div className={styles.group_header}>
                    <Text size="md">
                        Application
                    </Text>

                    <Paragraph>
                        Configure general application preferences.
                    </Paragraph>
                </div>
                <div className={styles.setting_item}>
                    <div className={styles.setting_information}>
                        <Text size="md">
                            Default Language
                        </Text>

                        <Paragraph>
                            Set the default language used by the application.
                        </Paragraph>
                    </div>

                    <select
                        className={styles.select}
                        defaultValue="en"
                    >
                        <option value="en">
                            English
                        </option>

                        <option value="fil">
                            Filipino
                        </option>
                    </select>
                </div>

            </div>

            <div className={styles.settings_group}>
                <div className={styles.group_header}>
                    <Text size="md">
                        Notifications
                    </Text>

                    <Paragraph>
                        Manage system and application notifications.
                    </Paragraph>
                </div>

                <div className={styles.setting_item}>
                    <div className={styles.setting_information}>
                        <Text size="md">
                            Email Notifications
                        </Text>

                        <Paragraph>
                            Receive important system notifications and updates through email.
                        </Paragraph>
                    </div>

                    <input
                        type="checkbox"
                        defaultChecked
                    />
                </div>
            </div>
            <div className={styles.settings_group}>
                <div className={styles.group_header}>
                    <Text size="md">
                        System Information
                    </Text>

                    <Paragraph>
                        View information about the current Advocaid PH installation.
                    </Paragraph>
                </div>

                <div className={styles.setting_item}>
                    <div className={styles.setting_information}>
                        <Text size="md">
                            Application Version
                        </Text>

                        <Paragraph>
                            Current version of the Advocaid PH platform.
                        </Paragraph>
                    </div>

                    <Text size="md">
                        v1.0.0
                    </Text>
                </div>

                <div className={styles.setting_item}>
                    <div className={styles.setting_information}>
                        <Text size="md">
                            System Status
                        </Text>

                        <Paragraph>
                            Current availability status of the platform.
                        </Paragraph>
                    </div>

                    <Text size="md">
                        Operational
                    </Text>
                </div>
            </div>
            <div className={styles.settings_group}>
    <div className={styles.group_header}>
        <Text size="md">
            Account
        </Text>

        <Paragraph>
            Manage your account session.
        </Paragraph>
    </div>

    <div className={styles.setting_item}>
        <div className={styles.setting_information}>
            <Text size="md">
                        Sign out
                    </Text>

                    <Paragraph>
                        Sign out of your Advocaid PH account on this device.
                    </Paragraph>
                </div>

                <Button
                    size="md"
                    variant="danger"
                    onClick={onHandleSubmit}
                >
                    <Text size="sm" style={{ fontWeight: 700 }}>Logout</Text>
                </Button>
                </div>
            </div>
        </div>
    )
}
