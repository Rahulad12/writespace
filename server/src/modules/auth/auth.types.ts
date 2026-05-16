import { z } from "zod";
import { loginSchema, registerSchema } from "./auth.validation.schema";

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;

export interface UserRow {
    id: string;
    username: string;
    email: string;
    password_hash: string;
    bio?: string;
    created_at?: Date;
    updated_at?: Date;
}