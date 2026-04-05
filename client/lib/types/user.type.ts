import z from "zod";
import { UserSchema } from "../validations/user.validation";

export type UserFormFields = z.infer<typeof UserSchema>;
