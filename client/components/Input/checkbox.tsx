import React from "react";

import styles from "@/styles/components/Input/checkbox.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export default function Checkbox({ error, ...props }: Props) {
  return (
    <div className={styles.container}>
      <input type="checkbox" {...props} />

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
