import z from "zod";
import { CreateUserSchema } from "../validations/user.validation";

export type UserFormFields = z.infer<typeof CreateUserSchema>;
