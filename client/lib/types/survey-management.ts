import { z } from "zod";

import {
  CreateSurveySchema,
  SurveyQuestionFormSchema,
  CreateSurveyResponseSchema,
  QuestionOptionSchema,
  SurveyAnswerSchema,
  SurveyQuestionSchema,
} from "@/lib/validations/survey-management.validation";

export type CreateSurveyFormField = z.infer<typeof CreateSurveySchema>;

export type SurveyQuestionFormField = z.infer<typeof SurveyQuestionFormSchema>;

export type SurveyQuestionField = SurveyQuestionFormField["questions"][number];

export type QuestionOptionField = SurveyQuestionField["options"][number];

export type SurveyResponseField = z.infer<typeof CreateSurveyResponseSchema>;
