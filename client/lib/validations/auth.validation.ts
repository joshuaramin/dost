import z from "zod";

export const VerifyOTPSchema = z.object({
  email: z.string().optional(),
  code: z
    .string()
    .min(1, "Verification Code is required")
    .max(6, "The maximum length of code is 6"),
});
