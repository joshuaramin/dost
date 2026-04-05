import z from "zod";

export const RoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Role Description is required"),   
});
