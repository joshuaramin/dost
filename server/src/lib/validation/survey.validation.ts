import { z } from "zod";

export const SurveyTypeSchema = z.enum([
  "SHORT_TEXT",
  "LONG_TEXT",
  "MULTIPLE_CHOICE",
  "CHECKBOX",
]);

export const QuestionOptionSchema = z.object({
  label: z.string().trim().min(1, "Option label is required"),

  value: z.string().trim().min(1, "Option value is required"),

  order_index: z.number().int().nonnegative().optional(),
});

export const SurveyQuestionSchema = z
  .object({
    text: z.string().trim().min(1, "Question is required"),

    type: SurveyTypeSchema,

    is_required: z.boolean().optional(),

    order_index: z.number().int().nonnegative().optional(),

    options: z.array(QuestionOptionSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "MULTIPLE_CHOICE" || data.type === "CHECKBOX") {
      const result = z
        .array(QuestionOptionSchema)
        .min(1, {
          message: "At least one options are required.",
        })
        .safeParse(data.options ?? []);

      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "At least one options are required.",
        });
      }
    }

    if (
      (data.type === "SHORT_TEXT" || data.type === "LONG_TEXT") &&
      data.options
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["options"],
        message: "Text questions should not contain options.",
      });
    }
  });

export const CreateSurveySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().max(300),
});

export const SurveyAnswerSchema = z.object({
  question_id: z.string().min(1, "Question ID is required"),
  text: z.string().optional(),
  option_id: z.string().optional(),
  option_ids: z.array(z.string()).optional(),
});

export const CreateSurveyResponseSchema = z.object({
  survey_id: z.string().min(1, "Survey ID is required"),

  answers: z
    .array(SurveyAnswerSchema)
    .min(1, "At least one answer is required."),
});
