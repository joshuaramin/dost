"use client";

import React from "react";
import styles from "@/styles/lib/ui/auth/verified.module.scss";
import TitleWrapper from "@/lib/ui/titleWrapper";
import { TbCircleCheckFilled } from "react-icons/tb";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <TitleWrapper title="Verification" />

      <div className={styles.verification_container}>
        <TbCircleCheckFilled size={70} />
        <Title size="lg">Account Verified</Title>
        <Paragraph>
          You're all set. This account is confirmed and ready to use — sign in
          whenever you'd like to get started.
        </Paragraph>
        <Button
          onClick={() => router.push("/auth/login")}
          size="md"
          variant="primary"
          style={{ color: "White" }}
        >
          Go Back
        </Button>
        <Text size="sm" style={{ display: "flex", gap: 5 }}>
          {" "}
          Wasn{"t"} you?
          <Link href={"/"}>Contact support</Link> right away.
        </Text>
      </div>
    </div>
  );
}
