import { Router } from "express";
import { getUserProfile, getCurrentUserProfile, updateUserProfile } from "./user.controller";
import { getFollowers, getFollowing, getFollowStatus } from "../follow/follow.controller";
import { validate } from "../../shared/middleware/validator";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { updateProfileSchema } from "./user.types";

const userRouter = Router();

userRouter.get("/me", authenticateToken, getCurrentUserProfile);
userRouter.put("/profile", authenticateToken, validate(updateProfileSchema), updateUserProfile);
userRouter.get("/:userId", getUserProfile);
userRouter.get("/:userId/followers", getFollowers);
userRouter.get("/:userId/following", getFollowing);
userRouter.get("/:userId/follow-status", authenticateToken, getFollowStatus);

export default userRouter;
