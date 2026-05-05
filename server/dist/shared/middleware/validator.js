"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    message: "Validation failed",
                    errors: error.issues.map((e) => ({
                        path: e.path.join("."),
                        message: e.message,
                    })),
                });
            }
            else {
                res.status(400).json({ message: "Invalid request body" });
            }
        }
    };
};
exports.validate = validate;
