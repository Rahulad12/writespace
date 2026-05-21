import { Router } from "express";
import { getUserProfile, getCurrentUserProfile, updateUserProfile } from "./user.controller";
import { getFollowers, getFollowing, getFollowStatus } from "../follow/follow.controller";
import { validate } from "../../shared/middleware/validator";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { updateProfileSchema } from "./user.types";

const userRouter = Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Authentication required
 */
userRouter.get("/me", authenticateToken, getCurrentUserProfile);

/**
 * @openapi
 * /users/profile:
 *   put:
 *     tags: [Users]
 *     summary: Update current user profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 */
userRouter.put("/profile", authenticateToken, validate(updateProfileSchema), updateUserProfile);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user's public profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   $ref: '#/components/schemas/UserProfileWithFollow'
 *       404:
 *         description: User not found
 */
userRouter.get("/:userId", getUserProfile);

/**
 * @openapi
 * /users/{userId}/followers:
 *   get:
 *     tags: [Users]
 *     summary: Get followers of a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FollowWithProfile'
 */
userRouter.get("/:userId/followers", getFollowers);

/**
 * @openapi
 * /users/{userId}/following:
 *   get:
 *     tags: [Users]
 *     summary: Get users that a user is following
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of followed users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 following:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FollowWithProfile'
 */
userRouter.get("/:userId/following", getFollowing);

/**
 * @openapi
 * /users/{userId}/follow-status:
 *   get:
 *     tags: [Users]
 *     summary: Check if current user follows another user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to check follow status for
 *     responses:
 *       200:
 *         description: Follow status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 following:
 *                   type: boolean
 *       401:
 *         description: Authentication required
 */
userRouter.get("/:userId/follow-status", authenticateToken, getFollowStatus);

export default userRouter;
