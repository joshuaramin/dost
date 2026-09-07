import z from "zod";

export const VerifyOTPSchema = z.object({
  email: z.string().optional(),
  code: z
    .string()
    .min(1, "Verification Code is required")
    .max(6, "The maximum length of code is 6"),
});

export const RegistrationSchema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email Address is required"),
  role_id: z.string().min(1, "Role is required"),
});
