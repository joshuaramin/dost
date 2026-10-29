"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSurveyResponseSchema = exports.SurveyAnswerSchema = exports.CreateSurveySchema = exports.SurveyQuestionFormSchema = exports.SurveyQuestionSchema = exports.QuestionOptionSchema = exports.SurveyTypeSchema = void 0;
const zod_1 = require("zod");
exports.SurveyTypeSchema = zod_1.z.enum([
    "SHORT_TEXT",
    "LONG_TEXT",
    "MULTIPLE_CHOICE",
    "CHECKBOX",
]);
exports.QuestionOptionSchema = zod_1.z.object({
    question_option_id: zod_1.z.string().optional(),
    label: zod_1.z
        .string()
        .trim()
        .min(1, "Option label is required")
        .max(300, "Option label cannot exceed 300 characters"),
    value: zod_1.z
        .string()
        .trim()
        .min(1, "Option value is required")
        .max(300, "Option value cannot exceed 300 characters"),
    order_index: zod_1.z.number().int().nonnegative().optional(),
});
exports.SurveyQuestionSchema = zod_1.z
    .object({
    survey_question_id: zod_1.z.string().optional(),
    text: zod_1.z.string().trim().max(300, "Question cannot exceed 300 characters"),
    type: exports.SurveyTypeSchema.default("SHORT_TEXT"),
    order_index: zod_1.z.number().int().nonnegative().optional(),
    options: zod_1.z.array(exports.QuestionOptionSchema).default([]),
})
    .superRefine((data, ctx) => {
    const requiresOptions = data.type === "MULTIPLE_CHOICE" || data.type === "CHECKBOX";
    if (requiresOptions && data.options.length === 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["options"],
            message: "At least one option is required.",
        });
    }
    if (!requiresOptions && data.options.length > 0) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["options"],
            message: "Text questions should not contain options.",
        });
    }
});
exports.SurveyQuestionFormSchema = zod_1.z.object({
    questions: zod_1.z
        .array(exports.SurveyQuestionSchema)
        .min(1, "At least one question is required."),
});
exports.CreateSurveySchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1, "Title is required").max(100),
    description: zod_1.z.string().trim().min(1, "Description is required").max(300),
});
exports.SurveyAnswerSchema = zod_1.z.object({
    survey_question_id: zod_1.z.string(),
    text: zod_1.z.string(),
});
exports.CreateSurveyResponseSchema = zod_1.z.object({
    answers: zod_1.z
        .array(exports.SurveyAnswerSchema)
        .min(1, "At least one answer is required."),
});
