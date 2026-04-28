import z from "zod";

export const ResourceSchema = z.array(
  z.object({
    name: z.string().trim().min(1),
    order: z.number().positive().optional(),
    children: z
      .array(
        z.object({
          name: z.string().trim().min(1),
        }),
      )
      .optional(),
  }),
);
