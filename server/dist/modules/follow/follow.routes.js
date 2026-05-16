"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const follow_controller_1 = require("./follow.controller");
const auth_middleware_1 = require("../../shared/middleware/auth.middleware");
const followRouter = (0, express_1.Router)();
followRouter.post("/:userId", auth_middleware_1.authenticateToken, follow_controller_1.followUser);
followRouter.delete("/:userId", auth_middleware_1.authenticateToken, follow_controller_1.unfollowUser);
exports.default = followRouter;
