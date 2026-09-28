"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/lib/ui/auth/verification.module.scss";
import { SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import store2 from "store2";
import cookies from "cookies-next/client";

import Button from "@/components/Button/button";
import Form from "@/components/Form/form";

import TitleWrapper from "@/lib/ui/titleWrapper";
import Title from "@/lib/ui/title";
import formatTimer from "@/lib/utils/timer";
import useFormHook from "@/lib/hooks/useFormHook";
import { VerifyOTPSchema } from "@/lib/validations/auth.validation";
import { VerifyOTPFormFields } from "@/lib/types/auth.type";
import useFormMutation from "@/lib/hooks/useMutation";
import { VerifyResponse } from "@/lib/interface/auth/verify.interface";
import { toastError, toastSuccess } from "@/lib/ui/toast";
import Text from "@/components/Typography/Text/text";

export default function Page() {
  const router = useRouter();
  const store = store2;

  const INITIAL_SECOND = 180;

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState(INITIAL_SECOND);

  const params = useSearchParams();
  const emailAddress = params.get("email");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const { handleSubmit, errors, isLoading, setValue } = useFormHook({
    schema: VerifyOTPSchema,
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const mutation = useFormMutation<VerifyOTPFormFields, VerifyResponse>({
    key: ["Verification", emailAddress],
    method: "POST",
    url: `auth/verification?email=${emailAddress}`,
    params: {},
  });

  const resendMutation = useFormMutation({
    key: ["ResendOTP", emailAddress],
    method: "POST",
    url: `auth/resend-otp?email=${emailAddress}`,
  });

  const activityMutation = useFormMutation({
    key: ["CreateActivityLogs"],
    method: "POST",
    url: "maintenance/activity-logs",
  });

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    const fullCode = newOtp.join("");

    setValue("code", fullCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    const paddedOtp = [...paste.split(""), ...Array(6 - paste.length).fill("")];

    setOtp(paddedOtp);

    setValue("code", paddedOtp.join(""));

    const nextIndex = paste.length < 6 ? paste.length : 5;

    inputsRef.current[nextIndex]?.focus();
  };

  const onHandleResendOTP = () => {
    // if (resendMutation.isPending || countdown > 0) {
    //   return;
    // }

    resendMutation.mutate(null, {
      onSuccess: () => {
        setCountdown(INITIAL_SECOND);

        setOtp(Array(6).fill(""));
        setValue("code", "");

        inputsRef.current[0]?.focus();

        toastSuccess({
          title: "One-Time Password Sent",
          body: "A new verification code has been sent to your email.",
        });
      },
      onError: () => {
        toastError({
          title: "Failed to Resend OTP",
          body: "We couldn't send a new verification code. Please try again.",
        });
      },
    });
  };

  const onHandleSubmit: SubmitHandler<VerifyOTPFormFields> = (data) => {
    mutation.mutateAsync(
      {
        code: data.code,
      },
      {
        onSuccess: (data) => {
          const res = data.data;

          cookies.setCookie("token", res.token);

          try {
            const payload = JSON.parse(atob(res.token.split(".")[1]));

            console.log("JWT PAYLOAD");
            console.log(payload);
          } catch {
            console.log("Unable to decode JWT payload.");
          }

          const permission: string[] = [];

          res.user?.role.rolePermissions.forEach(({ Permission: { name } }) => {
            permission.push(name);
          });

          store.set("data_sessions", {
            token: res.token,
            data: {
              user_id: res.user.user_id,
              email: res.user.email,
              Profile: {
                first_name: res.user.Profile.first_name,
                last_name: res.user.Profile.last_name,
              },
              Role: {
                name: res.user.role.name,
                permission,
              },
              Organization: res.user.organization
                ? {
                    name: res.user.organization.name,
                  }
                : null,
            },
          });

          activityMutation.mutate(
            {
              type: "LOGIN",
              description: "User successfully logged into the system.",
              user_id: res.user.user_id,
            },
            {
              onSuccess: (activityData) => {
                console.log("Activity Log created", activityData);
              },
            },
          );

          toastSuccess({
            title: "Login Successfully",
            body: "You have successfully signed in. Redirecting to your dashboard...",
          });

          setTimeout(() => {
            router.push("/dashboard/main/overview");
          }, 800);
        },
      },
    );
  };

  const onHandleBackRoute = () => {
    router.push("/auth/login");
  };

  return (
    <div className={styles.container}>
      <TitleWrapper title="Verification" />

      <div>
        <Title title="Enter your One-Time Password" />

        <p>
          A one-time verification code was sent to your email address. It
          expires in 10 minutes.
        </p>
      </div>

      <Form
        onSubmit={handleSubmit(onHandleSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              value={otp[index]}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={styles.input}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {errors?.code?.message && (
          <div className={styles.errors}>
            <span>{errors.code.message}</span>
          </div>
        )}

        <Button disabled={isLoading} size="lg" full={true} variant="primary">
          <Text size="md">
            {isLoading ? "Verifying Code" : "SEND VERIFICATION CODE"}
          </Text>
        </Button>
      </Form>

      <Button
        size="md"
        types={"outline"}
        variant={countdown > 0 ? "disabled" : "secondary"}
        className={styles.resend}
        disabled={countdown > 0 || resendMutation.isPending}
        onClick={onHandleResendOTP}
      >
        {resendMutation.isPending ? (
          <Text size="md">Sending Code...</Text>
        ) : countdown > 0 ? (
          <Text size="md">Resend Code {formatTimer(countdown)}</Text>
        ) : (
          <Text size="md">Resend Code</Text>
        )}
      </Button>

      <div className={styles.reminder}>
        <p>
          This code is <b>single-use</b> and expires automatically. Advocaid
          will never ask for your code via phone, chat, or email.
        </p>
      </div>

      <div className={styles.divider}>
        <hr />
        <Text size="sm">OR</Text>
        <hr />
      </div>

      <Button
        types="filled"
        size="lg"
        onClick={onHandleBackRoute}
        full={true}
        variant="secondary"
      >
        <Text size="md">USE ANOTHER EMAIL ADDRESS</Text>
      </Button>
    </div>
  );
}
