import z from "zod";

export const UserSchema = z.object({
  email: z.string().min(1, "Email Address is required"),
});
