import { Router } from "express";
import { addBookmark, removeBookmark, getMyBookmarks, checkBookmark } from "./bookmark.controller";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const bookmarkRouter = Router();

/**
 * @openapi
 * /bookmarks/{blogId}:
 *   post:
 *     tags: [Bookmarks]
 *     summary: Add a bookmark for a blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       201:
 *         description: Blog bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 bookmark:
 *                   $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Cannot bookmark a draft blog
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Blog not found
 *       409:
 *         description: Blog already bookmarked
 */
bookmarkRouter.post("/:blogId", authenticateToken, addBookmark);

/**
 * @openapi
 * /bookmarks/{blogId}:
 *   delete:
 *     tags: [Bookmarks]
 *     summary: Remove a bookmark
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       204:
 *         description: Bookmark removed successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Bookmark not found
 */
bookmarkRouter.delete("/:blogId", authenticateToken, removeBookmark);

/**
 * @openapi
 * /bookmarks:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Get all bookmarks for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookmarks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookmarkedBlog'
 *       401:
 *         description: Authentication required
 */
bookmarkRouter.get("/", authenticateToken, getMyBookmarks);

/**
 * @openapi
 * /bookmarks/{blogId}/check:
 *   get:
 *     tags: [Bookmarks]
 *     summary: Check if a blog is bookmarked
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Bookmark status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookmarked:
 *                   type: boolean
 *       401:
 *         description: Authentication required
 */
bookmarkRouter.get("/:blogId/check", authenticateToken, checkBookmark);

export default bookmarkRouter;
