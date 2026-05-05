import z from "zod";

export const registerSchema = z.object({
    username: z.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
    identifier: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
});
