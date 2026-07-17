import { z } from "zod";
import { EducationResourceSchema } from "@/lib/validations/education.validation";

export type EducationResourceFormField = z.infer<
  typeof EducationResourceSchema
>;
