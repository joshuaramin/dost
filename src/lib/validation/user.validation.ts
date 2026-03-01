import z from "zod";

export const UserSchema = z.object({
  email: z.string().min(1, "Email address is required"),
  password: z.string().min(1, "Password is required"),
});
