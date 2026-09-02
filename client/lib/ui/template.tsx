/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import React, { ReactNode, useEffect, useState } from 'react'
import styles from '@/styles/lib/ui/template.module.scss'
import { usePathname, useRouter } from 'next/navigation';

//components
import ModalForm from '@/components/Modal/modal-form';
import Form from '@/components/Form/form';
import Text from '@/components/Typography/Text/text';
import Button from '@/components/Button/button';

//lib & hooks
import { hasAnyPermission } from '../utils/hasAnyPermission';


import {
    FieldValues,
    SubmitHandler,
    UseFormHandleSubmit
} from 'react-hook-form';
import Title from '@/components/Typography/Title/title';
import { TbCirclePlus, TbDownload } from 'react-icons/tb';

type Modal<T extends FieldValues = FieldValues> = {
    modalTitle?: string
    onHandleSubmit?: SubmitHandler<T>
    handleSubmit?: UseFormHandleSubmit<T>
}

interface Props<T extends FieldValues = FieldValues> {
    title: string;
    description?: string;
    children: ReactNode;
    onModalOpenToggle?: boolean;
    onHandleCloseToggle?: () => void | null |undefined;
    modal?: Modal<T>;
    modalChildren?: ReactNode
    create?: string
}

export default function Template<T extends FieldValues = FieldValues>({
    title,
    children,
    description,
    onModalOpenToggle,
    onHandleCloseToggle,
    modalChildren,
    create,
    modal = {},
}: Props<T>) {

    const router = useRouter();
    const {
        modalTitle,
        handleSubmit,
        onHandleSubmit
    } = modal;


    const [ width, setWidth ] = useState(0);

    useEffect(() => {
        const handleSize = () => {
            setWidth(window.innerWidth);
        };

        handleSize();

        window.addEventListener("resize", handleSize);

        return () => window.removeEventListener("resize", handleSize);
    }, []);


    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true)
    }, [width])

    const pathname = usePathname();

    const canCreate = hasAnyPermission(
        [
            "system-maintenance:create",
            "user-management:create",
            "roles-and-permissions:create",
            "organization-management:create",
            "education-resources:create",
            "survey:create",
            "treatment-hub-management:create"
        ],
        pathname,
        [
            "/dashboard/products",
            "/dashboard/booking",
            "/dashboard/engagement/educational-resources",
            "/dashboard/system-maintenance/user-management",
            "/dashboard/system-maintenance/roles-and-permissions",
            "/dashboard/system-maintenance/organization-management",
            "/dashboard/system-maintenance/survey-management",
            "/dashboard/system-maintenance/treatment-hub-management"
            
        ]
    )

    const canExport = hasAnyPermission([
        "system-maintenance:export",
        "user-management:export",
        "roles-and-permissions:export",
        "organization-management:create",
        "education-resources:create",
        "survey:export",
        "generate-reports:export",
        "treatment-hub-management:export"
    ], pathname, [  
        "/dashboard/products",
        "/dashboard/booking",  
        "/dashboard/engagement/educational-resources",
        "/dashboard/system-maintenance/user-management",
        "/dashboard/system-maintenance/roles-and-permissions",
        "/dashboard/system-maintenance/organization",
        "/dashboard/system-maintenance/organization-management",
        "/dashboard/system-maintenance/survey",
        "/dashboard/insights/generate-reports",
        "/dashboard/system-maintenance/treatment-hub-management"
    ])

    if (!mounted) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.header_col1}>
                <Title size="lg">{title}</Title>
                    <Text size="md" style={{color: "#7a7e96", marginTop: 15}}>{description}</Text>
                </div>

                <div className={styles.btns}>
                    {mounted && canCreate && (
                    <div className={styles.header_col2}>
                        <Button
                            onClick={() => {
                                onHandleCloseToggle?.();

                                if (create) {
                                    router.push(create);
                                }
                            }}
                            size={width <= 1990 ? "sm" : "md"}
                            variant="primary"
                            type="button"
                        >
                            {width <= 1190 ? (
                                <TbCirclePlus size={23} />
                            ) : (
                                <Text size="sm">Add New</Text>
                            )}
                        </Button>
                    </div>
                )}

                {mounted && canExport && (
                    <div className={styles.header_col3}>
                        <Button size={width <= 1990 ? "sm" : "md"} variant="secondary" type="button">
                            {width <= 1190 ? <TbDownload size={23} /> : <Text size="sm">Export</Text>}
                        </Button>
                    </div>
                )}
                </div>
            </div>

            <div className={styles.body}>
                {children}
            </div>

            {onModalOpenToggle && (
                <ModalForm
                    title={modalTitle ?? ""}
                    onHandleCloseToggle={
                        onHandleCloseToggle ?? (() => {})
                    }
                >
                    <Form
                        onSubmit={handleSubmit?.(
                            onHandleSubmit ?? (() => {})
                        )}
                    >
                        {modalChildren}

                        <div className={styles.modal_footer}>
                            <Button onClick={  onHandleCloseToggle ?? (() => {})} size="md" variant="disabled" types="outline">
                                <Text size="md">Cancel</Text>
                            </Button>
                            <Button size="md" variant="primary">
                                <Text size="md">Submit</Text>
                            </Button>
                        </div>
                    </Form>
                </ModalForm>
            )}
        </div>
    )
}