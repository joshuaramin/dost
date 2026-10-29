"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateContributionSchema = exports.CreateContributionSchema = exports.ContributionValidation = exports.ContributionSentiment = exports.ClassificationMethod = exports.ContributionStatus = exports.ContributionClassification = void 0;
const zod_1 = require("zod");
exports.ContributionClassification = zod_1.z.enum([
    "PENDING",
    "MISINFORMATION",
    "FACTUAL",
]);
exports.ContributionStatus = zod_1.z.enum(["PENDING", "APPROVED", "DECLINED"]);
exports.ClassificationMethod = zod_1.z.enum(["MANUAL", "AI"]);
exports.ContributionSentiment = zod_1.z.enum([
    "POSTIIVE",
    "NEGATIVE",
    "NEUTRAL",
]);
exports.ContributionValidation = zod_1.z.object({
    content: zod_1.z.string().trim().min(1, "Content is required"),
    type: zod_1.z.string().trim().min(1, "Type is required"),
    classification: exports.ContributionClassification.default("PENDING"),
    classification_method: exports.ClassificationMethod.optional(),
    status: exports.ContributionStatus.default("PENDING"),
    barangay: zod_1.z.string().trim().optional(),
    municipality: zod_1.z.string().trim().optional(),
    province: zod_1.z.string().trim().optional(),
    region: zod_1.z.string().trim().optional(),
    sentimemt: exports.ContributionSentiment.optional(),
    image_url: zod_1.z.string().url("Invalid image URL").optional(),
    source_url: zod_1.z.string().url("Invalid source URL").optional(),
    confidence_score: zod_1.z
        .number()
        .min(0, "Confidence score cannot be less than 0")
        .max(100, "Confidence score cannot exceed 100")
        .optional(),
});
exports.CreateContributionSchema = exports.ContributionValidation.extend({
    user_id: zod_1.z.string().trim().min(1, "User ID is required"),
});
exports.UpdateContributionSchema = zod_1.z
    .object({
    status: zod_1.z.string().min(1, "Status is required"),
    contribution_id: zod_1.z.string().min(1, "Contribution ID is required"),
    user_id: zod_1.z.string().min(1, "Review By is required"),
    language: zod_1.z.string().min(1, "Language is required"),
    sentiment: zod_1.z.string().min(1, "Sentiment is required"),
    review_reason: zod_1.z
        .string()
        .trim()
        .max(1000, "Reason cannot exceed 1000 characters")
        .optional(),
})
    .superRefine((data, ctx) => {
    if (data.status === "DECLINED" && !data.review_reason) {
        ctx.addIssue({
            code: zod_1.z.ZodIssueCode.custom,
            path: ["reason"],
            message: "Reason is required when declining a contribution",
        });
    }
});
