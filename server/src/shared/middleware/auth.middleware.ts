import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Authentication required" });
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as { id: number; username: string };
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: "Token expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, env.jwtSecret) as { id: number; username: string };
        req.user = decoded;
    } catch {
        // Invalid token — proceed without user context
    }

    next();
};
