import { z } from "zod";
import {
  RegistrationSchema,
  VerifyOTPSchema,
} from "../validations/auth.validation";

export type VerifyOTPFormFields = z.infer<typeof VerifyOTPSchema>;
export type RegistrationFormFields = z.infer<typeof RegistrationSchema>;
