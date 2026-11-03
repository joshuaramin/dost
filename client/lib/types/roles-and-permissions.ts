import { z } from "zod";
import {
  AddRolePermissionsSchema,
  RolesSchema,
  UpdateRoleSchema,
} from "@/lib/validations/role.validation";

export type RolesAndPermissionsFormField = z.infer<
  typeof AddRolePermissionsSchema
>;

export type RolesSchemaFormField = z.infer<typeof RolesSchema>;
export type RolesUpdateFormField = z.infer<typeof UpdateRoleSchema>;
