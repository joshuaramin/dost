import { z } from "zod";
import {
  CreateContributionSchema,
  UpdateContributionSchema,
} from "@/lib/validations/contribution.validation";

export type UpdateContributionFormField = z.infer<
  typeof UpdateContributionSchema
>;
