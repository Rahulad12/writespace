"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const env_1 = require("../../config/env");
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
};
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await db_1.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await db_1.pool.query(`
            INSERT INTO users (username, email, password_hash)
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
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await db_1.pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const user = existingUser.rows[0];
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, username: user.username, email: user.email },
            token
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.login = login;
