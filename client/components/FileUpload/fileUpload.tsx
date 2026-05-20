"use client"

import React, { useRef, useState } from "react"
import {
  Controller,
  Control,
  FieldValues,
  Path
} from "react-hook-form"

type FileUploadProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  multiple?: boolean
  accept?: string
}

export default function FileUpload<T extends FieldValues>({
  name,
  control,
  multiple = false,
  accept
}: FileUploadProps<T>) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={multiple ? ([] as File[]) : (null as unknown as File | null)}
      render={({ field }) => {
        const value = field.value as File | File[] | null

        const files: File[] = Array.isArray(value)
          ? value
          : value
            ? [value]
            : []

        const handleFiles = (fileList: FileList | null) => {
          if (!fileList) return

          const incoming = Array.from(fileList)

          if (multiple) {
            const current = Array.isArray(field.value) ? field.value : []
            field.onChange([...current, ...incoming])
          } else {
            field.onChange(incoming[0] ?? null)
          }
        }

        return (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              handleFiles(e.dataTransfer.files)
            }}
            style={{
              border: dragActive ? "2px solid #2563eb" : "2px dashed #999",
              padding: 20,
              borderRadius: 8,
              cursor: "pointer",
              transition: "0.2s ease"
            }}
          >
            <input
              ref={inputRef}
              type="file"
              multiple={multiple}
              accept={accept}
              style={{ display: "none" }}
              onChange={(e) => handleFiles(e.target.files)}
            />

            {files.length === 0 ? (
              <div>Drop files here or click to upload</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {files.map((file, i) => (
                  <li key={i}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        )
      }}
    />
  )
}