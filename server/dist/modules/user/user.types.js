"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required").max(50, "Username must be 50 characters or less").optional(),
    bio: zod_1.z.string().max(500, "Bio must be 500 characters or less").optional(),
});
