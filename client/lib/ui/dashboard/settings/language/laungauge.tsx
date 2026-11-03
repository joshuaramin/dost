import React from "react";
import styles from "@/styles/lib/ui/dashboard/settings/settings.module.scss";

import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Title from "@/components/Typography/Title/title";
import Text from "@/components/Typography/Text/text";

export default function Language() {
  return (
    <div className={styles.tab_content}>
      <div className={styles.section_header}>
        <Title size="md">Language</Title>
        <Paragraph>
          Select the preferred language for the application.
        </Paragraph>
      </div>
      <div className={styles.setting_item}>
        <div className={styles.setting_information}>
          <Text size="md">Application Language</Text>
          <Paragraph>Choose the language used throughout the system.</Paragraph>
        </div>
        <select className={styles.select} defaultValue="en">
          {[
            "English",
            "Tagalog",
            "Hiligaynon",
            "Bisaya",
            "Chavacano",
            "Ilonggo",
            "Pangasinan",
            "Cebuano",
          ].map((node, index) => (
            <option key={index} value={node}>
              {node}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
