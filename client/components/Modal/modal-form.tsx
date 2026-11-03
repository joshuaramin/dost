"use client";

import React, { ReactNode, useEffect, useRef } from "react";

import styles from "@/styles/components/Modal/modal-form.module.scss";

import { TbX } from "react-icons/tb";

import Title from "@/components/Typography/Title/title";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  height?: number;
  width?: number;
  title: string;
  onHandleCloseToggle: () => void;
}

export default function ModalForm({
  children,
  title,
  width,
  height,
  onHandleCloseToggle,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onHandleCloseToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onHandleCloseToggle]);

  return (
    <div className={styles.container}>
      <div
        ref={containerRef}
        className={styles.sub_container}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
        }}
      >
        <div className={styles.sub_container_header}>
          <Title size="md">{title}</Title>

          <button type="button" onClick={onHandleCloseToggle}>
            <TbX size={18} />
          </button>
        </div>

        <div className={styles.sub_container_body}>{children}</div>
      </div>
    </div>
  );
}
