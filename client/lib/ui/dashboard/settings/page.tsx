"use client"

import React, { useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'

import Template from "../../template"
import styles from "@/styles/lib/ui/dashboard/settings/settings.module.scss"


//components
import Tabs from "@/components/Tabs/tab"

//UI
import GeneralSettings from "@/lib/ui/dashboard/settings/general-settings/general-settings"
import DeviceSessions from "@//lib/ui/dashboard/settings//device-session/device-session";
import AuditLog from "@/lib/ui/dashboard/settings//audit-log/audit-log";
import Language from "@/lib/ui/dashboard/settings/language/laungauge";

const tabs = [
    "General Settings",
    "Language",
    "Audit Logs",
    "Device Sessions"
]

type SettingsTab = (typeof tabs)[number]

export default function SettingsPage() {

    const router= useRouter();
    const searchParams  = useSearchParams();


    const activeTabParam = searchParams.get("activeTab");

    
    const [activeTab, setActiveTab] = useState<SettingsTab>(
        tabs.includes(activeTabParam as SettingsTab)
            ? activeTabParam as SettingsTab
            : "General Settings"
    )

    const handleTabChange: React.Dispatch<React.SetStateAction<string>> = (value) => {
        const nextTab = typeof value === "function" ? value(activeTab) : value;

        if (!tabs.includes(nextTab as SettingsTab)) {
            return;
        }

        setActiveTab(nextTab as SettingsTab);

        router.push(
            `/dashboard/settings?activeTab=${encodeURIComponent(nextTab)}`,
            { scroll: false }
        )
    }


    const renderContent = () => {
        switch (activeTab) {
            case "Language":
                return (
                   <Language />
                )

            case "Audit Logs":
                return (
                    <AuditLog />
                )

            case "Device Sessions":
    return (
        <DeviceSessions />
    )
        break;
        case "General Settings":
    default:
        return (
            <GeneralSettings />
        )
            }
        }

    return (
        <Template
            title="Settings"
            description="Manage your application preferences and review system activity."
        >
            <div className={styles.container}>
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={handleTabChange}
                    tabs={tabs}
                />

                <div
                    className={styles.content}
                    role="tabpanel"
                >
                    {renderContent()}
                </div>
            </div>
        </Template>
    )
}