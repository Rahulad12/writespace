"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./auth.controller");
const auth_validation_schema_1 = require("./auth.validation.schema");
const validator_1 = require("../../shared/middleware/validator");
const express_1 = __importDefault(require("express"));
const authRouter = express_1.default.Router();
authRouter.post("/register", (0, validator_1.validate)(auth_validation_schema_1.registerSchema), auth_controller_1.register);
authRouter.post("/login", (0, validator_1.validate)(auth_validation_schema_1.loginSchema), auth_controller_1.login);
exports.default = authRouter;
