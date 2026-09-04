import { z } from "zod";

export const SurveyTypeSchema = z.enum([
  "SHORT_TEXT",
  "LONG_TEXT",
  "MULTIPLE_CHOICE",
  "CHECKBOX",
]);

export const QuestionOptionSchema = z.object({
  question_option_id: z.string().optional(),

  label: z
    .string()
    .trim()
    .min(1, "Option label is required")
    .max(300, "Option label cannot exceed 300 characters"),

  value: z
    .string()
    .trim()
    .min(1, "Option value is required")
    .max(300, "Option value cannot exceed 300 characters"),

  order_index: z.number().int().nonnegative().optional(),
});

export const SurveyQuestionSchema = z
  .object({
    survey_question_id: z.string().optional(),

    text: z.string().trim().max(300, "Question cannot exceed 300 characters"),
    type: SurveyTypeSchema.default("SHORT_TEXT"),
    order_index: z.number().int().nonnegative().optional(),
    options: z.array(QuestionOptionSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const requiresOptions =
      data.type === "MULTIPLE_CHOICE" || data.type === "CHECKBOX";

    if (requiresOptions && data.options.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "At least one option is required.",
      });
    }

    if (!requiresOptions && data.options.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Text questions should not contain options.",
      });
    }
  });

export const SurveyQuestionFormSchema = z.object({
  questions: z
    .array(SurveyQuestionSchema)
    .min(1, "At least one question is required."),
});

export const CreateSurveySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),

  description: z.string().trim().min(1, "Description is required").max(300),
});

export const SurveyAnswerSchema = z.object({
  question_id: z.string().min(1, "Question ID is required"),

  text: z.string().optional(),

  option_id: z.string().optional(),

  option_ids: z.array(z.string()).optional(),
});

export const CreateSurveyResponseSchema = z.object({
  answers: z
    .array(SurveyAnswerSchema)
    .min(1, "At least one answer is required."),
});
