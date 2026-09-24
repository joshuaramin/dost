import { z } from "zod";
import {
  OrganizationSchema,
  UpdateOrganizationSchema,
} from "../validations/organization";

export type OrganizationFormField = z.infer<typeof OrganizationSchema>;

export type OrganizationUpdatFormField = z.infer<
  typeof UpdateOrganizationSchema
>;
