import { z } from "zod";
import {
  CreateSurveySchema,
  SurveyQuestionSchema,
} from "@/lib/validations/survey-management.validation";

export type CreateSurveyFormField = z.infer<typeof CreateSurveySchema>;
export type SurveyQuestionField = z.infer<typeof SurveyQuestionSchema>;
