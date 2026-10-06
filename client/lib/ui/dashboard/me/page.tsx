import React from "react";
import Template from "@/lib/ui/template";
import styles from "@/styles/lib/ui/dashboard/me/page.module.scss";

interface Props {
  id: string;
}

export default function ProfilePage({ id }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}></div>
    </div>
  );
}
