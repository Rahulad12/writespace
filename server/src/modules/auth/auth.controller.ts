import { Request, Response } from "express";
import { LoginBody, RegisterBody, UserRow } from "./auth.types";
import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { username, email, password } = req.body as RegisterBody;
    try {
        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query<UserRow>(`
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email
        `, [username, email, hashedPassword]);

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
    const { email, password } = req.body as LoginBody;
    try {
        const existingUser = await pool.query<UserRow>(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
        const user = existingUser.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        res.status(200).json({
            message: "User logged in successfully",
            user:{
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}