import { z } from "zod";
import { VerifyOTPSchema } from "../validations/auth.validation";

export type VerifyOTPFormFields = z.infer<typeof VerifyOTPSchema>;
