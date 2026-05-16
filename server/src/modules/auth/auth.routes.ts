import { login, register } from "./auth.controller";
import { registerSchema, loginSchema } from "./auth.validation.schema";
import { validate } from "../../shared/middleware/validator";
import express from "express";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
export default authRouter;
