import z from "zod";

export const FormSchema = z.object({
  type: z.string().min(1, "Type is required"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional(),
  user_id: z.string().min(1, "User ID is required"),
});
