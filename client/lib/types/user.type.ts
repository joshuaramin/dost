import z from "zod";
import { CreateUserSchema, UserLogin } from "../validations/user.validation";

export type UserFormFields = z.infer<typeof CreateUserSchema>;
export type UserLoginFields = z.infer<typeof UserLogin>;
