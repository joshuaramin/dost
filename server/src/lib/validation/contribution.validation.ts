import z from "zod";

export const ContributionClassification = z.enum([
  "PENDING",
  "MISINFORMATION",
  "FACTUAL",
]);

export const ContributionStatus = z.enum(["PENDING", "APPROVED", "DECLINED"]);

export const ClassificationMethod = z.enum(["MANUAL", "AI"]);

export const ContributionValidation = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.string().min(1, "Type is required"),
  classification: ContributionClassification.default("PENDING"),
  classification_method: ClassificationMethod.default("MANUAL"),
  status: ContributionStatus.default("PENDING"),
  image_url: z.string().url("Invalid image URL").optional(),
  source_url: z.string().url("Invalid source URL").optional(),
  confidence_score: z.number().min(0).max(100).optional(),
});

export const CreateContributionSchema = ContributionValidation.extend({
  user_id: z.string().min(1, "User ID is required"),
});


