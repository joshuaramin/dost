import { booleanField } from "@/utils/booleanParser";
import { z } from "zod";
export const AttachmentType = z.enum([
  "IMAGE",
  "VIDEO",
  "PDF",
  "DOCUMENT",
  "AUDIO",
  "OTHER",
]);

export const EducationResourceType = z.enum([
  "ARTICLE",
  "VIDEO",
  "DOCUMENT",
  "CATALOGUE",
  "INFOGRAPHIC",
  "WEBINAR",
  "PODCAST",
  "EXTERNAL_LINK",
]);

export const EducationStatus = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const EducationTagSchema = z.object({
  education_tag_id: z.string().optional(),
  name: z.string().min(1, "Tag name is required"),
  slug: z.string().optional(),
});

export const EducationCategorySchema = z.object({
  education_category_id: z.string().optional(),
  name: z.string().min(1, "Category name is required"),
  slug: z.string().optional(),
  description: z
    .string()
    .max(300, "Description must not exceed 300 characters")
    .optional(),
  is_deleted: z.boolean().default(false),
});

export const EducationAttachmentSchema = z.object({
  education_attachment_id: z.string().optional(),

  type: AttachmentType,

  file_name: z.string().min(1, "File name is required").max(255),

  file_url: z.string().min(1, "File URL is required").url("Invalid URL"),

  mime_type: z.string().optional(),

  file_size: z.number().nonnegative().optional(),

  order_index: z.number().int().min(0).default(0),
});

export const EducationResourceTagSchema = z.object({
  education_tag_id: z.string(),
});

export const EducationResourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),

  summary: z
    .string()
    .min(1, "Summary is required")
    .max(500, "Summary must not exceed 500 characters"),

  content: z.string().optional(),

  external_link: z.string().optional(),

  type: EducationResourceType,

  status: EducationStatus.default("DRAFT"),

  thumbnail: z.file().optional(),

  is_featured: booleanField.default(false),

  category_id: z.string().min(1, "Category is required"),

  user_id: z.string().optional(),

  published_at: z.date().optional(),

  tags: z.array(EducationResourceTagSchema).default([]),

  attachments: z.array(z.file()).default([]),

  is_deleted: booleanField.default(false),
});

export const CreateEducationResourceSchema =
  EducationResourceSchema.superRefine((data, ctx) => {
    switch (data.type) {
      case "ARTICLE":
        if (!data.content?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["content"],
            message: "Content is required for an article.",
          });
        }
        break;

      case "EXTERNAL_LINK":
        if (!data.external_link?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["external_link"],
            message: "External link is required.",
          });
        }
        break;

      case "VIDEO":
      case "DOCUMENT":
      case "CATALOGUE":
      case "INFOGRAPHIC":
      case "WEBINAR":
      case "PODCAST":
        if (data.attachments.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["attachments"],
            message: "Please upload at least one attachment.",
          });
        }
        break;
    }
  });

export const UpdateEducationResourceSchema = EducationResourceSchema.partial();

export const CreateEducationCategorySchema = EducationCategorySchema;

export const UpdateEducationCategorySchema = EducationCategorySchema.partial();

export const CreateEducationTagSchema = EducationTagSchema;

export const UpdateEducationTagSchema = EducationTagSchema.partial();

export type CreateEducationResource = z.infer<
  typeof CreateEducationResourceSchema
>;

export type UpdateEducationResource = z.infer<
  typeof UpdateEducationResourceSchema
>;

export type EducationCategory = z.infer<typeof EducationCategorySchema>;

export type EducationTag = z.infer<typeof EducationTagSchema>;

export type EducationAttachment = z.infer<typeof EducationAttachmentSchema>;
