import z from "zod";

export const ResoucreSchema = z.object({
  name: z.string().min(1, "Module name is required"),
  order: z.number().positive(),
  children: z.array(z.object({ name: z.string() })),
});
