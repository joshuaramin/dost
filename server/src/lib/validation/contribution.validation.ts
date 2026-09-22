import { z } from "zod";

export const ContributionClassification = z.enum([
  "PENDING",
  "MISINFORMATION",
  "FACTUAL",
]);

export const ContributionStatus = z.enum(["PENDING", "APPROVED", "DECLINED"]);

export const ClassificationMethod = z.enum(["MANUAL", "AI"]);

export const ContributionSentiment = z.enum([
  "POSTIIVE",
  "NEGATIVE",
  "NEUTRAL",
]);

export const ContributionValidation = z.object({
  content: z.string().trim().min(1, "Content is required"),
  type: z.string().trim().min(1, "Type is required"),
  classification: ContributionClassification.default("PENDING"),
  classification_method: ClassificationMethod.optional(),
  status: ContributionStatus.default("PENDING"),
  barangay: z.string().optional(),
  municipality: z.string().optional(),
  province: z.string().optional(),
  region: z.string().optional(),
  sentimemt: ContributionSentiment.optional(),
  image_url: z.string().url("Invalid image URL").optional(),
  source_url: z.string().url("Invalid source URL").optional(),
  confidence_score: z
    .number()
    .min(0, "Confidence score cannot be less than 0")
    .max(100, "Confidence score cannot exceed 100")
    .optional(),
});

export const CreateContributionSchema = ContributionValidation.extend({
  user_id: z.string().trim().min(1, "User ID is required"),
});

export const UpdateContributionSchema = z
  .object({
    status: z.string().min(1, "Status is required"),
    contribution_id: z.string().min(1, "Contribution ID is required"),
    user_id: z.string().min(1, "Review By is required"),
    language: z.string().min(1, "Language is required"),
    sentiment: z.string().min(1, "Sentiment is required"),
    review_reason: z
      .string()
      .trim()
      .max(1000, "Reason cannot exceed 1000 characters")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "DECLINED" && !data.review_reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["reason"],
        message: "Reason is required when declining a contribution",
      });
    }
  });
