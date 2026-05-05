"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(50).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[0-9]/, "Password must contain at least one number"),
});
exports.loginSchema = zod_1.default.object({
    identifier: zod_1.default.string().min(1, "Email or username is required"),
    password: zod_1.default.string().min(1, "Password is required"),
});
