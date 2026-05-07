"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.registerSchema = zod_1.default.object({
    username: zod_1.default.string().min(3, "Username must be at least 3 characters").max(50, "Username cannot exceed 50 characters"),
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email format"),
    password: zod_1.default.string().min(1, "Password is required"),
});
