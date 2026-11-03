import React from 'react'
import styles from '@/styles/lib/ui/cards/device-session-card.module.scss'
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import { TbBrandApple, TbBrandWindows } from 'react-icons/tb';
import Text from '@/components/Typography/Text/text';

interface Props {
    device_sessions_id: string
    os: string
    device_name: string
    ip_address: string
    user_agent: string
    device_type: string
    browser: string
}

export default function DeviceSessionCard({ device_name, browser,  device_sessions_id, device_type, ip_address, os, user_agent }: Props) {
    return (
            <div key={device_sessions_id} className={styles.session_item}>
                <div className={styles.session_icon}>
                    {os === "macOS" ? <TbBrandApple size="23" /> : <TbBrandWindows size={23} />}
                </div>
                <div className={styles.session_information}>
                    <div className={styles.session_header}>
                        <Text size="md">
                            {browser} · {device_type}
                        </Text>
                    </div>

                    <Paragraph>{device_name}</Paragraph>
                    <Paragraph>{ip_address}</Paragraph>
                    {/* <Paragraph>{user_agent}</Paragraph> */}
                </div>

                {/* <button
                    type="button"
                    className={styles.revoke_button}
                >
                    Revoke session
                </button> */}
            </div>
    )
}
