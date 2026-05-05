"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogSchema = exports.createBlogSchema = void 0;
const zod_1 = require("zod");
exports.createBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
    content: zod_1.z.string().min(1, "Content is required"),
    status: zod_1.z.enum(["draft", "published"]).default("draft"),
});
exports.updateBlogSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less").optional(),
    content: zod_1.z.string().min(1, "Content is required").optional(),
    status: zod_1.z.enum(["draft", "published"]).optional(),
});
