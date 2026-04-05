import z from "zod";

export const UserSchema = z.object({
  email: z.string().min(1, "Email address is required"),
});

export const ProfileSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
});

export const CreateUserSchema = UserSchema.extend({
  ...ProfileSchema.shape,
});
