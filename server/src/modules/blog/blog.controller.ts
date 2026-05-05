import { Request, Response } from "express";
import * as blogService from "./blog.service";
import { CreateBlogBody, UpdateBlogBody } from "./blog.types";

export const createBlog = async (
  req: Request<{}, {}, CreateBlogBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blog = await blogService.createBlog(userId, req.body);
    res.status(201).json({
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { authorId, status, limit, offset } = req.query;

    const blogs = await blogService.getBlogs({
      authorId: authorId ? parseInt(authorId as string) : undefined,
      status: status as "draft" | "published" | undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
    });

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Get blogs error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyDrafts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const drafts = await blogService.getMyDrafts(userId);

    res.status(200).json({ drafts });
  } catch (error) {
    console.error("Get my drafts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBlogById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const blogId = parseInt(req.params.id);
    const blog = await blogService.getBlogById(blogId);

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
      return;
    }

    // Only allow viewing drafts if user is the author
    if (blog.status === "draft") {
      const userId = req.user?.id;
      if (!userId || userId !== blog.author_id) {
        res.status(404).json({ message: "Blog not found" });
        return;
      }
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error("Get blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const publishDraft = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blogId = parseInt(req.params.id);
    const blog = await blogService.publishDraft(blogId, userId);

    if (!blog) {
      res.status(404).json({ message: "Draft not found or unauthorized" });
      return;
    }

    res.status(200).json({
      message: "Blog published successfully",
      blog,
    });
  } catch (error) {
    console.error("Publish draft error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBlog = async (
  req: Request<{ id: string }, {}, UpdateBlogBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blogId = parseInt(req.params.id);
    const blog = await blogService.updateBlog(blogId, userId, req.body);

    if (!blog) {
      res.status(404).json({ message: "Blog not found or unauthorized" });
      return;
    }

    res.status(200).json({
      message: "Blog updated successfully",
      blog,
    });
  } catch (error) {
    console.error("Update blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBlog = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blogId = parseInt(req.params.id);
    const deleted = await blogService.deleteBlog(blogId, userId);

    if (!deleted) {
      res.status(404).json({ message: "Blog not found or unauthorized" });
      return;
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
