"use client";

import React from "react";
import {
    Control,
    FieldValues,
    Path,
    UseFormSetValue,
    useWatch,
} from "react-hook-form";

import Text from "@/components/Typography/Text/text";
import styles from "@/styles/components/Toggle/buttonToggle.module.scss";


interface ButtonToggleProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    setValue: UseFormSetValue<T>;
    trueName: string
    falseName: string
    label: string
}

export default function ButtonToggle<T extends FieldValues>({
    name,
    control,
    setValue,
    trueName,
    falseName,
    label
}: ButtonToggleProps<T>) {
    const status = useWatch({
        control,
        name,
    });

    const isTruth = status === trueName

    return (
        <div className={styles.statusContainer}>
          <label>{label}</label>
            <div className={styles.col2}>
              <button
                  type="button"
                  className={`${styles.statusToggle} ${
                      isTruth ? styles.active : ""
                  }`}
                  onClick={() =>
                      setValue(
                          name,
                          (isTruth ? falseName: trueName) as T[Path<T>],
                          {
                              shouldDirty: true,
                              shouldValidate: true,
                          }
                      )
                  }
              >
                  <span className={styles.thumb} />
              </button>

              <Text size="sm">
                  {isTruth ?  trueName : falseName}
              </Text>
            </div>
        </div>
    );
}