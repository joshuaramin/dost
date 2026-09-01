import { z } from "zod";
import { OrganizationSchema } from "../validations/organization";

export type OrganizationFormField = z.infer<typeof OrganizationSchema>;
