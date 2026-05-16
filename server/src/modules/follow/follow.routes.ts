import { Router } from "express";
import { followUser, unfollowUser } from "./follow.controller";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const followRouter = Router();

followRouter.post("/:userId", authenticateToken, followUser);
followRouter.delete("/:userId", authenticateToken, unfollowUser);

export default followRouter;
