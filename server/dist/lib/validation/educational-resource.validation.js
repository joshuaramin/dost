"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEducationTagSchema = exports.CreateEducationTagSchema = exports.UpdateEducationCategorySchema = exports.CreateEducationCategorySchema = exports.UpdateEducationResourceSchema = exports.CreateEducationResourceSchema = exports.CreateEducationResourceBodySchema = exports.EducationResourceSchema = exports.EducationResourceTagSchema = exports.EducationAttachmentSchema = exports.EducationCategorySchema = exports.EducationTagSchema = exports.EducationStatus = exports.EducationResourceType = exports.AttachmentType = void 0;
const booleanParser_1 = require("../../utils/booleanParser.js");
const zod_1 = require("zod");
exports.AttachmentType = zod_1.z.enum([
    "IMAGE",
    "VIDEO",
    "PDF",
    "DOCUMENT",
    "AUDIO",
    "OTHER",
]);
exports.EducationResourceType = zod_1.z.enum([
    "ARTICLE",
    "VIDEO",
    "DOCUMENT",
    "CATALOGUE",
    "INFOGRAPHIC",
    "WEBINAR",
    "PODCAST",
    "EXTERNAL_LINK",
]);
exports.EducationStatus = zod_1.z.enum(["DRAFT", "PUBLISHED"]);
exports.EducationTagSchema = zod_1.z.object({
    education_tag_id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Tag name is required"),
    slug: zod_1.z.string().optional(),
});
exports.EducationCategorySchema = zod_1.z.object({
    education_category_id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1, "Category name is required"),
    slug: zod_1.z.string().optional(),
    description: zod_1.z
        .string()
        .max(300, "Description must not exceed 300 characters")
        .optional(),
    is_deleted: zod_1.z.boolean().default(false),
});
exports.EducationAttachmentSchema = zod_1.z.object({
    education_attachment_id: zod_1.z.string().optional(),
    type: exports.AttachmentType,
    file_name: zod_1.z.string().min(1, "File name is required").max(255),
    file_url: zod_1.z.string().min(1, "File URL is required").url("Invalid URL"),
    mime_type: zod_1.z.string().optional(),
    file_size: zod_1.z.number().nonnegative().optional(),
    order_index: zod_1.z.number().int().min(0).default(0),
});
exports.EducationResourceTagSchema = zod_1.z.object({
    education_tag_id: zod_1.z.string(),
});
exports.EducationResourceSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(255),
    summary: zod_1.z
        .string()
        .min(1, "Summary is required")
        .max(500, "Summary must not exceed 500 characters"),
    content: zod_1.z.string().optional(),
    external_link: zod_1.z.string().optional(),
    type: exports.EducationResourceType,
    status: exports.EducationStatus.default("DRAFT"),
    is_featured: booleanParser_1.booleanField.default(false),
    category_id: zod_1.z.string().min(1, "Category is required"),
    user_id: zod_1.z.string().optional(),
    published_at: zod_1.z.date().optional(),
    tags: zod_1.z.array(exports.EducationResourceTagSchema).default([]),
    attachments: zod_1.z.array(zod_1.z.file()).default([]),
});
/**
 * Schema for multipart/form-data request.body.
 *
 * Uploaded files are intentionally NOT included here.
 * Multer puts them into request.files.
 */
exports.CreateEducationResourceBodySchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(255),
    summary: zod_1.z
        .string()
        .min(1, "Summary is required")
        .max(500, "Summary must not exceed 500 characters"),
    content: zod_1.z.string().optional(),
    external_link: zod_1.z.string().optional(),
    type: exports.EducationResourceType,
    status: exports.EducationStatus.default("DRAFT"),
    category_id: zod_1.z.string().min(1, "Category is required"),
    user_id: zod_1.z.string().optional(),
    is_featured: booleanParser_1.booleanField.default(false),
    is_deleted: booleanParser_1.booleanField.default(false),
    tags: zod_1.z.string().optional(),
});
exports.CreateEducationResourceSchema = exports.EducationResourceSchema.superRefine((data, ctx) => {
    switch (data.type) {
        case "ARTICLE":
            if (!data.content?.trim()) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    path: ["content"],
                    message: "Content is required for an article.",
                });
            }
            break;
        case "EXTERNAL_LINK":
            if (!data.external_link?.trim()) {
                ctx.addIssue({
                    code: zod_1.z.ZodIssueCode.custom,
                    path: ["external_link"],
                    message: "External link is required.",
                });
            }
            break;
    }
});
exports.UpdateEducationResourceSchema = exports.EducationResourceSchema.partial();
exports.CreateEducationCategorySchema = exports.EducationCategorySchema;
exports.UpdateEducationCategorySchema = exports.EducationCategorySchema.partial();
exports.CreateEducationTagSchema = exports.EducationTagSchema;
exports.UpdateEducationTagSchema = exports.EducationTagSchema.partial();
