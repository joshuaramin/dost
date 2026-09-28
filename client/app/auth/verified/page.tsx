"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/lib/ui/auth/verified.module.scss";
import TitleWrapper from "@/lib/ui/titleWrapper";
import { TbCircleCheckFilled } from "react-icons/tb";
import Title from "@/components/Typography/Title/title";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import Button from "@/components/Button/button";
import Text from "@/components/Typography/Text/text";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useFormMutation from "@/lib/hooks/useMutation";

export default function Page() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");

  const hasVerified = useRef(false);

  const [verified, setVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  const mutation = useFormMutation({
    key: ["UserVerifiedAccount", token],
    method: "POST",
    url: "auth/verified",
  });

  useEffect(() => {
    if (!token || hasVerified.current) {
      return;
    }

    hasVerified.current = true;

    mutation.mutate(
      {
        token,
      },
      {
        onSuccess: () => {
          setVerified(true);
          setVerificationError(false);
        },
        onError: () => {
          setVerified(false);
          setVerificationError(true);
        },
      },
    );
  }, [token, mutation]);

  if (!token) {
    return (
      <div className={styles.container}>
        <TitleWrapper title="Verification" />

        <div className={styles.verification_container}>
          <Title size="lg">Invalid Verification Link</Title>

          <Paragraph>
            This verification link is missing the required verification token.
            Please use the verification link provided in your email.
          </Paragraph>

          <Button
            onClick={() => router.push("/auth/login")}
            size="md"
            variant="primary"
            style={{ color: "White" }}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (mutation.isPending) {
    return (
      <div className={styles.container}>
        <TitleWrapper title="Verification" />

        <div className={styles.verification_container}>
          <Title size="lg">Verifying Account</Title>

          <Paragraph>
            Please wait while we confirm your email address and activate your
            account.
          </Paragraph>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className={styles.container}>
        <TitleWrapper title="Verification" />

        <div className={styles.verification_container}>
          <Title size="lg">Verification Failed</Title>

          <Paragraph>
            We couldn't verify your account using this verification link. The
            link may be invalid or may have already been used.
          </Paragraph>

          <Button
            onClick={() => router.push("/auth/login")}
            size="md"
            variant="primary"
            style={{ color: "White" }}
          >
            Go to Login
          </Button>

          <Text size="sm" style={{ display: "flex", gap: 5 }}>
            Need help?
            <Link href="mailto:niceradvocaid@gmai.com">Contact support</Link>
          </Text>
        </div>
      </div>
    );
  }

  if (!verified) {
    return null;
  }

  return (
    <div className={styles.container}>
      <TitleWrapper title="Verification" />

      <div className={styles.verification_container}>
        <TbCircleCheckFilled size={70} />

        <Title size="lg">Account Verified</Title>

        <Paragraph>
          Your email address has been successfully verified. Your account is now
          active and ready to use.
        </Paragraph>

        <Button
          onClick={() => router.push("/auth/login")}
          size="md"
          variant="primary"
          style={{ color: "White" }}
        >
          Go to Login
        </Button>

        <Text size="sm" style={{ display: "flex", gap: 5 }}>
          Wasn{"'"}t you?
          <Link href="mailto:niceradvocaid@gmai.com">Contact support</Link>{" "}
          right away.
        </Text>
      </div>
    </div>
  );
}
