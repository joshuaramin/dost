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

export const AddSubResourceSchema = z.object({
  resource_id: z.string().min(1, "Resource ID is required"),
  name: z.string().min(1, "Sub Resource name is required"),
});
