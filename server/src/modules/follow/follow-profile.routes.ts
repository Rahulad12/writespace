import { Router } from "express";
import { getFollowers, getFollowing, getFollowStatus } from "./follow.controller";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const userFollowRouter = Router();

userFollowRouter.get("/:userId/followers", getFollowers);
userFollowRouter.get("/:userId/following", getFollowing);
userFollowRouter.get("/:userId/follow-status", authenticateToken, getFollowStatus);

export default userFollowRouter;
