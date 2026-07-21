import { z } from "zod";
import {
  EducationResourceSchema,
  EducationResourceType,
} from "@/lib/validations/education.validation";

export type EducationResourceFormField = z.infer<
  typeof EducationResourceSchema
>;

export type EducationResourceTypeField = z.infer<typeof EducationResourceType>;
