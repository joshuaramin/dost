import { z } from "zod";
import { AddRolePermissionsSchema } from "@/lib/validations/role.validation";

export type RolesAndPermissionsFormField = z.infer<
  typeof AddRolePermissionsSchema
>;
