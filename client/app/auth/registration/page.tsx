"use client";

import React, { useState } from "react";

import styles from "@/styles/lib/ui/auth/registration.module.scss";

import {
  TbUsersGroup,
  TbBuildingBank,
  TbBuilding,
  TbUserSearch,
  TbBuildingCommunity,
} from "react-icons/tb";

import Text from "@/components/Typography/Text/text";
import Grid from "@/components/Grid/grid";
import Button from "@/components/Button/button";
import Form from "@/components/Form/form";
import Title from "@/components/Typography/Title/title";
import TitleWrapper from "@/lib/ui/titleWrapper";
import Input from "@/components/Input/input";
import Checkbox from "@/components/Input/checkbox";

import useFormHook from "@/lib/hooks/useFormHook";
import useFormQuery from "@/lib/hooks/useQuery";

import { RegistrationSchema } from "@/lib/validations/auth.validation";
import { RolesAndPermissionResponse } from "@/lib/interface/roles-and-permissions/roles-and-permission";
import useFormMutation from "@/lib/hooks/useMutation";
import { SubmitHandler } from "react-hook-form";
import { RegistrationFormFields } from "@/lib/types/auth.type";
import da from "zod/v4/locales/da.cjs";
import { toastError, toastSuccess } from "@/lib/ui/toast";
import { z } from "zod";

export default function Page() {
  const [step, setStep] = useState<number>(1);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  const { register, errors, handleSubmit, watch, trigger } = useFormHook({
    schema: RegistrationSchema,
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      location: "",
      role_id: "",
      medical_disclaimer: true,
      privacy_policy: true,
      terms_and_conditions: true,
    },
    shouldUnregister: false,  
  });

  console.log("Error: ", errors);
  const { data: RoleData } = useFormQuery<RolesAndPermissionResponse>({
    key: ["Roles"],
    url: "maintenance/roles",
    params: {
      orderBy: "created_at",
      sortBy: "desc",
    },
  });

  const mutation = useFormMutation({
    key: ["CreateNewAccount"],
    method: "POST",
    url: "auth/registration",
  });

  const roleField = register("role_id");

  const selectedRole = RoleData?.data.edges.find(
    ({ node }) => node.role_id === selectedRoleId,
  )?.node;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Institution Agencies":
        return <TbBuilding size={40} />;

      case "Government Agencies":
        return <TbBuildingBank size={40} />;

      case "Researcher":
        return <TbUserSearch size={40} />;

      case "General Public":
        return <TbUsersGroup size={40} />;

      case "NGO Agencies":
        return <TbBuildingCommunity size={40} />;

      default:
        return <TbUsersGroup size={40} />;
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSelectedRoleId(value);
    roleField.onChange(event);
  };

  const handleNext = async () => {
    let fields: (keyof RegistrationFormFields)[] = [];

    if (step === 1) {
      fields = ["role_id"];
    }

    if (step === 2) {
      fields = ["email", "first_name", "last_name", "location"];
    }

    if (step === 3) {
      fields = ["terms_and_conditions", "privacy_policy", "medical_disclaimer"];
    }

    const isValid = await trigger(fields);

    if (!isValid) {
      return;
    }

    setStep((current) => Math.min(current + 1, 3));
  };

  const handleBack = () => {
    setStep((current) => Math.max(current - 1, 1));
  };

  const onHandleSubmit: SubmitHandler<RegistrationFormFields> = (data) => {
    mutation.mutate(
      {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        role_id: data.role_id,
        location: data.location,
      },
      {
        onSuccess: () => {
          toastSuccess({
            title: "User created",
            body: "The user account has been successfully created.",
          });
        },

        onError: () => {
          toastError({
            title: "Failed to create user",
            body: "Something went wrong while creating the user account. Please try again.",
          });
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <TitleWrapper title="Account Registration" />

      <Title size="md">Step {step} out of 3</Title>

      <Form onSubmit={handleSubmit(onHandleSubmit)}>
        {step === 1 && (
          <div className={styles.container_role}>
            <Grid max={0} min={250} gap={20}>
              {RoleData?.data.edges
                .filter(
                  (r) =>
                    r.node.name !== "Super Administrator" &&
                    r.node.name !== "Developer",
                )
                .map(({ node }) => {
                  const { name, role_id } = node;

                  const isSelected = selectedRoleId === role_id;

                  return (
                    <label
                      key={role_id}
                      htmlFor={`role-${role_id}`}
                      className={`${styles.role_card} ${
                        isSelected ? styles.role_card_selected : ""
                      }`}
                    >
                      <div className={styles.role_content}>
                        {getRoleIcon(name)}

                        <Text size="lg">{name}</Text>
                      </div>

                      <input
                        id={`role-${role_id}`}
                        name={roleField.name}
                        ref={roleField.ref}
                        type="radio"
                        value={role_id}
                        checked={isSelected}
                        onChange={handleRoleChange}
                        onBlur={roleField.onBlur}
                      />
                    </label>
                  );
                })}
            </Grid>

            {errors.role_id && (
              <Text
                size="sm"
                style={{
                  color: "red",
                }}
              >
                {errors.role_id.message}
              </Text>
            )}
          </div>
        )}

        {step === 2 && (
          <>
            <div className={styles.div}>
              <Input
                register={register}
                name="email"
                label="Email Address"
                isRequired={true}
                error={errors.email}
              />
            </div>

            <div className={styles.row_2}>
              <Input
                register={register}
                name="first_name"
                label="First Name"
                isRequired={true}
                error={errors.first_name}
              />

              <Input
                register={register}
                name="last_name"
                label="Last Name"
                isRequired={true}
                error={errors.last_name}
              />
            </div>

            <Input
              register={register}
              name="location"
              label="Location"
              isRequired={true}
              error={errors.location}
            />
          </>
        )}

        {step === 3 && (
          <div className={styles.step_3_container}>
            <div className={styles.review}>
              <Title size="md">Review Registration</Title>

              <div className={styles.review_item}>
                <Text size="sm">Role</Text>

                <Text size="md">
                  {selectedRole?.name || "No role selected"}
                </Text>
              </div>

              <div className={styles.review_item}>
                <Text size="sm">Email Address</Text>

                <Text size="md">{watch("email")}</Text>
              </div>

              <div className={styles.review_item}>
                <Text size="sm">First Name</Text>

                <Text size="md">{watch("first_name")}</Text>
              </div>

              <div className={styles.review_item}>
                <Text size="sm">Last Name</Text>

                <Text size="md">{watch("last_name")}</Text>
              </div>

              <div className={styles.review_item}>
                <Text size="sm">Location</Text>

                <Text size="md">{watch("location")}</Text>
              </div>
            </div>

            <div className={styles.taa}>
              <div className={styles.taa_item}>
                <Checkbox
                  id="terms-and-conditions"
                  {...register("terms_and_conditions")}
                />

                <label htmlFor="terms-and-conditions">
                  I have read and agree to the AdvocAid PH Terms and Conditions
                  and User Agreement.
                </label>
              </div>

              {errors.terms_and_conditions && (
                <Text
                  size="sm"
                  style={{
                    color: "red",
                  }}
                >
                  {errors.terms_and_conditions.message}
                </Text>
              )}

              <div className={styles.taa_item}>
                <Checkbox id="privacy-policy" {...register("privacy_policy")} />

                <label htmlFor="privacy-policy">
                  I acknowledge the AdvocAid PH Privacy Policy.
                </label>
              </div>

              {errors.privacy_policy && (
                <Text
                  size="sm"
                  style={{
                    color: "red",
                  }}
                >
                  {errors.privacy_policy.message}
                </Text>
              )}

              <div className={styles.taa_item}>
                <Checkbox
                  id="medical-disclaimer"
                  {...register("medical_disclaimer")}
                />

                <label htmlFor="medical-disclaimer">
                  I understand that AdvocAid PH provides public health,
                  research, educational, and analytical information and is not a
                  substitute for professional medical advice.
                </label>
              </div>

              {errors.medical_disclaimer && (
                <Text
                  size="sm"
                  style={{
                    color: "red",
                  }}
                >
                  {errors.medical_disclaimer.message}
                </Text>
              )}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleBack}
            >
              <Text size="md">Back</Text>
            </Button>
          )}

          {step < 3 && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
            >
              <Text size="md">Next</Text>
            </Button>
          )}

          {step === 3 && (
            <Button type="submit" variant="primary" size="md">
              <Text size="md">Create Account</Text>
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
