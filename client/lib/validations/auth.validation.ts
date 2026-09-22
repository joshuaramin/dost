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

  location: z.string().min(1, "Location is required"),

  email: z
    .string()
    .min(1, "Email Address is required")
    .email("Please enter a valid email address"),

  role_id: z.string().min(1, "Role is required"),

  terms_and_conditions: z
    .literal(true, {
      error: "You must agree to the Terms and Conditions.",
    })
    .default(true),

  privacy_policy: z.literal(true, {
    error: "You must acknowledge the Privacy Policy.",
  }),

  medical_disclaimer: z.literal(true, {
    error: "You must acknowledge the medical information disclaimer.",
  }),
});
