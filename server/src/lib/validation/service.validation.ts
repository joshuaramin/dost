import z from "zod";

export const ServiceSchema = z.object({
  name: z.string().min(1, "Service Name is required"),
  description: z.string().optional(),
});
