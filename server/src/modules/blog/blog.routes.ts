import { Router } from "express";
import { createBlog, getBlogs, getMyDrafts, getBlogById, publishDraft, updateBlog, deleteBlog } from "./blog.controller";
import { validate } from "../../shared/middleware/validator";
import { authenticateToken } from "../../shared/middleware/auth.middleware";
import { createBlogSchema, updateBlogSchema } from "./blog.types";

const blogRouter = Router();

blogRouter.post("/", authenticateToken, validate(createBlogSchema), createBlog);
blogRouter.get("/", getBlogs);
blogRouter.get("/drafts", authenticateToken, getMyDrafts);
blogRouter.get("/:id", getBlogById);
blogRouter.put("/:id/publish", authenticateToken, publishDraft);
blogRouter.put("/:id", authenticateToken, validate(updateBlogSchema), updateBlog);
blogRouter.delete("/:id", authenticateToken, deleteBlog);

export default blogRouter;
