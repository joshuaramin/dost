import { z } from "zod";

export const EducationResourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  category: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
});
