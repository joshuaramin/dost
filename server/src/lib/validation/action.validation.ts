import z from "zod";

export const ActionValidation = z.object({
  name: z.string().min(1, "Action name is required"),
});
