import z from "zod";

export const RolesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

export const AddRolePermissionsSchema = z.object({
  permissions: z
    .array(z.string().min(1, "Add Permission is required"))
    .min(1, "Add Permission in Role at least one."),
});
