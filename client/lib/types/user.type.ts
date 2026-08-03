import z from "zod";
import { CreateUserSchema, UserSchema } from "../validations/user.validation";

export type UserFormFields = z.infer<typeof CreateUserSchema>;
