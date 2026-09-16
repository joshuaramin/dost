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

//components
import Text from "@/components/Typography/Text/text";
import Grid from "@/components/Grid/grid";
import Button from "@/components/Button/button";
import Form from "@/components/Form/form";
import Title from "@/components/Typography/Title/title";

//lib & hooks
import TitleWrapper from "@/lib/ui/titleWrapper";
import Input from "@/components/Input/input";
import useFormHook from "@/lib/hooks/useFormHook";
import { RegistrationSchema } from "@/lib/validations/auth.validation";
import useFormQuery from "@/lib/hooks/useQuery";
import { RolesAndPermissionResponse } from "@/lib/interface/roles-and-permissions/roles-and-permission";

export default function Page() {
  const [step, setStep] = useState<number>(1);

  const { register, errors, handleSubmit, watch, trigger } = useFormHook({
    schema: RegistrationSchema,
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      role_id: "",
    },
  });

  const { data: RoleData } = useFormQuery<RolesAndPermissionResponse>({
    key: ["Roles"],
    url: "maintenance/roles",
    params: {
      orderBy: "created_at",
      sortBy: "desc",
    },
  });

  const selectedRoleId = watch("role_id");

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

  const onSubmit = (data: any) => {
    console.log("Registration Data:", data);
  };

  const handleNext = async () => {
    let fields: string[] = [];

    if (step === 1) {
      fields = ["role_id"];
    }

    if (step === 2) {
      fields = ["email", "first_name", "last_name"];
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

  return (
    <div className={styles.container}>
      <TitleWrapper title="Account Registration" />

      <Title size="md">Step {step} out of 2</Title>

      <Form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className={styles.container_role}>
            <Grid max={0} min={250} gap={20}>
              {RoleData?.data.edges
                .filter(
                  (r) =>
                    r.node.name !== "Super Administrator" &&
                    r.node.name !== "Developer",
                )
                .map(({ node: { name, role_id } }) => (
                  <label
                    className={`${styles.role_card} ${
                      selectedRoleId === role_id
                        ? styles.role_card_selected
                        : ""
                    }`}
                    key={role_id}
                    htmlFor={`role-${role_id}`}
                  >
                    <div className={styles.role_content}>
                      {getRoleIcon(name)}

                      <Text size="lg">{name}</Text>
                    </div>

                    <input
                      id={`role-${role_id}`}
                      type="radio"
                      value={role_id}
                      {...register("role_id")}
                    />
                  </label>
                ))}
            </Grid>

            {errors.role_id && (
              <Text size="sm" style={{ color: "red" }}>
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
                error={errors.email}
              />
            </div>

            <div className={styles.row_2}>
              <Input
                register={register}
                name="first_name"
                label="First Name"
                error={errors.first_name}
              />

              <Input
                register={register}
                name="last_name"
                label="Last Name"
                error={errors.last_name}
              />
            </div>
          </>
        )}

        {step === 3 && (
          <div className={styles.review}>
            <Title size="md">Review Registration</Title>

            <div className={styles.review_item}>
              <Text size="sm">Role</Text>
              <Text size="md">{selectedRole?.name || "No role selected"}</Text>
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

          {step < 2 && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
            >
              <Text size="md">Next</Text>
            </Button>
          )}

          {step === 2 && (
            <Button type="submit" variant="primary" size="md">
              <Text size="md">Create Account</Text>
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
