import { z } from "zod";
import { loginSchema, registerSchema } from "./auth.validation.schema";

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;

export interface UserRow {
    id: number;
    username: string;
    email: string;
    password: string;
}