import { Router } from "express";
import { createBlog, getBlogs, getMyDrafts, getBlogById, publishDraft, updateBlog, deleteBlog } from "./blog.controller";
import { validate } from "../../shared/middleware/validator";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { createBlogSchema, updateBlogSchema } from "./blog.types";

const blogRouter = Router();

/**
 * @openapi
 * /blogs:
 *   post:
 *     tags: [Blogs]
 *     summary: Create a new blog post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlogInput'
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 blog:
 *                   $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Authentication required
 */
blogRouter.post("/", authenticateToken, validate(createBlogSchema), createBlog);

/**
 * @openapi
 * /blogs:
 *   get:
 *     tags: [Blogs]
 *     summary: Get all published blogs
 *     parameters:
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Filter by author ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of blogs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of blogs to skip
 *     responses:
 *       200:
 *         description: List of blogs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blogs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogWithAuthor'
 */
blogRouter.get("/", getBlogs);

/**
 * @openapi
 * /blogs/drafts:
 *   get:
 *     tags: [Blogs]
 *     summary: Get current user's drafts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of drafts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 drafts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Authentication required
 */
blogRouter.get("/drafts", authenticateToken, getMyDrafts);

/**
 * @openapi
 * /blogs/{id}:
 *   get:
 *     tags: [Blogs]
 *     summary: Get a blog by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blog:
 *                   $ref: '#/components/schemas/BlogWithAuthor'
 *       404:
 *         description: Blog not found
 */
blogRouter.get("/:id", getBlogById);

/**
 * @openapi
 * /blogs/{id}/publish:
 *   put:
 *     tags: [Blogs]
 *     summary: Publish a draft blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog published successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Draft not found or unauthorized
 */
blogRouter.put("/:id/publish", authenticateToken, publishDraft);

/**
 * @openapi
 * /blogs/{id}:
 *   put:
 *     tags: [Blogs]
 *     summary: Update a blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBlogInput'
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Blog not found or unauthorized
 */
blogRouter.put("/:id", authenticateToken, validate(updateBlogSchema), updateBlog);

/**
 * @openapi
 * /blogs/{id}:
 *   delete:
 *     tags: [Blogs]
 *     summary: Delete a blog
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Blog not found or unauthorized
 */
blogRouter.delete("/:id", authenticateToken, deleteBlog);

export default blogRouter;
