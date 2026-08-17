import { z } from "zod";

import {
  CreateSurveySchema,
  SurveyQuestionFormSchema,
} from "@/lib/validations/survey-management.validation";

export type CreateSurveyFormField = z.infer<typeof CreateSurveySchema>;

export type SurveyQuestionFormField = z.infer<typeof SurveyQuestionFormSchema>;

export type SurveyQuestionField =
  SurveyQuestionFormField["questionnaire"][number];

export type QuestionOptionField = SurveyQuestionField["options"][number];
