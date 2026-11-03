"use client"

import React, { useCallback, useState } from "react"
import styles from "@/styles/components/Fileupload/file-upload.module.scss"
import { PrimaryFont, SecondaryFont } from "@/lib/typography"
import {
    TbFileUpload,
    TbImageInPicture,
    TbPdf,
    TbCsv,
    TbFile,
    TbPictureInPicture,
    TbTrash
} from "react-icons/tb"
import {
    FieldError,
    FieldValues,
    Path,
    UseFormRegister,
    UseFormSetValue
} from "react-hook-form"
import { useDropzone, FileRejection } from "react-dropzone"
import toast from "react-hot-toast"
import cn from "@/lib/utils/cn"

type AcceptedFile = {
    [key: string]: string[]
}

type UploadedFile = {
    name: string
    type: string
    file: File
}

interface Props<T extends FieldValues> {
    label: string
    name: Path<T>
    isRequired?: boolean
    error?: FieldError | undefined
    accepted?: AcceptedFile
    multiple?: boolean
    register: UseFormRegister<T>
    setValue: UseFormSetValue<T>
    value?: File | File[] | null
}

export default function FileUpload<T extends FieldValues>({
    label,
    name,
    isRequired = false,
    accepted,
    register,
    setValue,
    multiple = false,
    error
}: Props<T>) {
    const [files, setFiles] = useState<UploadedFile[]>([])


    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (multiple) {
                const uploaded = acceptedFiles.map((file) => ({
                    file,
                    name: file.name,
                    type: file.type
                }))

                setFiles((prev) => [...prev, ...uploaded])

                setValue(name, [...files.map((x) => x.file), ...acceptedFiles] as never, {
                    shouldValidate: true
                })
            } else {
                if (!acceptedFiles.length) return

                const file = acceptedFiles[0]
                
                console.log(file)
                setFiles([
                    {
                        file,
                        name: file.name,
                        type: file.type
                    }
                ])

                setValue(name, file as never, {
                    shouldValidate: true
                })
            }
        },
        [files, multiple, name, setValue]
    )

    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        fileRejections.forEach((rejection) => {
            rejection.errors.forEach((err) => {
                toast.error(err.message)
            })
        })
    }, [])

    const removeFile = (index: number) => {
        const updated = files.filter((_, i) => i !== index)

        setFiles(updated)

        if (multiple) {
            setValue(
                name,
                updated.map((x) => x.file) as never,
                {
                    shouldValidate: true
                }
            )
        } else {
            setValue(name, null as never, {
                shouldValidate: true
            })
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        multiple,
        accept: accepted,
        useFsAccessApi: false
    })

    const getIcon = (type: string, size= 23) => {
        if (type.startsWith("image")) return <TbPictureInPicture size={size} />
        if (type === "application/pdf") return <TbPdf  size={size}/>
        if (
            type.includes("csv") ||
            type.includes("excel") ||
            type.includes("spreadsheet")
        )
            return <TbCsv  size={size}/>

        return <TbFile  size={size}/>
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={PrimaryFont.className[500]}>
                    {label}
                </label>

                {isRequired && (
                    <span className={styles.isRequired}>*</span>
                )}
            </div>

            <div
                className={error ? cn(styles.body, styles.error) : styles.body}
                {...getRootProps()}
            >
                <input
                    {...register(name)}
                    {...getInputProps()}
                />

                <TbFileUpload size={28} />

                {isDragActive ? (
                    "Drop files here"
                ) : (
                    <span className={SecondaryFont.className}>
                        Drag & Drop or Click to Upload
                    </span>
                )}
            </div>

            {files.map((file, index) => (
                <div
                    key={`${file.name}-${index}`}
                    className={styles.fileCard}
                >
                    <div className={styles.col1}>
                        {getIcon(file.type)}
                        <span>{file.name}</span>
                    </div>

                    <button
                        type="button"
                        className={styles.close}
                        onClick={() => removeFile(index)}
                    >
                        <TbTrash size={22}/>
                    </button>
                </div>
            ))}
        </div>
    )
}