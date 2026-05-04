import { Request, Response } from "express";
import { LoginBody, RegisterBody, UserRow } from "./auth.types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../config/db";
import { env } from "../../config/env";

const generateToken = (user: { id: number; username: string }): string => {
    return jwt.sign(
        { id: user.id, username: user.username },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
    );
};

export const register = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
    const { username, email, password } = req.body as RegisterBody;
    try {
        const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query<UserRow>(`
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email
        `, [username, email, hashedPassword]);

        const user = result.rows[0];
        const token = generateToken(user);

        res.status(201).json({
            message: "User created successfully",
            user: { id: user.id, username: user.username, email: user.email },
            token
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
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const user = existingUser.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, username: user.username, email: user.email },
            token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}