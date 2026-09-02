"use client";

import { Dispatch, SetStateAction } from "react";

import Text from "@/components/Typography/Text/text";

import styles from "@/styles/components/Tabs/tabs.module.scss";

interface TabsProps<T extends string> {
    tabs: T[];
    activeTab: T;
    setActiveTab: Dispatch<SetStateAction<T>>;
}

export default function Tabs<T extends string>({
    tabs,
    activeTab,
    setActiveTab,
}: TabsProps<T>) {
    return (
        <div className={styles.tabs}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    className={
                        activeTab === tab
                            ? styles.active
                            : ""
                    }
                    onClick={() => setActiveTab(tab)}
                >
                    <Text size="sm">
                        {tab}
                    </Text>
                </button>
            ))}
        </div>
    );
}