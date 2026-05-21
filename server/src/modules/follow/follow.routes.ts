import { Router } from "express";
import { followUser, unfollowUser } from "./follow.controller";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const followRouter = Router();

/**
 * @openapi
 * /follows/{userId}:
 *   post:
 *     tags: [Follows]
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow
 *     responses:
 *       201:
 *         description: User followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 follow:
 *                   $ref: '#/components/schemas/Follow'
 *       400:
 *         description: Cannot follow yourself
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       409:
 *         description: Already following this user
 */
followRouter.post("/:userId", authenticateToken, followUser);

/**
 * @openapi
 * /follows/{userId}:
 *   delete:
 *     tags: [Follows]
 *     summary: Unfollow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to unfollow
 *     responses:
 *       204:
 *         description: Unfollowed successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Follow relationship not found
 */
followRouter.delete("/:userId", authenticateToken, unfollowUser);

export default followRouter;
