import { Request, Response } from "express";
import * as bookmarkService from "./bookmark.service";

export const addBookmark = async (
  req: Request<{ blogId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blogId = req.params.blogId;

    try {
      const bookmark = await bookmarkService.addBookmark(userId, blogId);
      res.status(201).json({
        message: "Blog bookmarked successfully",
        bookmark,
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message === "Blog not found") {
        res.status(404).json({ message: "Blog not found" });
        return;
      }
      if (message === "Cannot bookmark a draft blog") {
        res.status(400).json({ message: "Cannot bookmark a draft blog" });
        return;
      }
      if ((error as any).code === "23505") {
        res.status(409).json({ message: "Blog already bookmarked" });
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error("Add bookmark error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeBookmark = async (
  req: Request<{ blogId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blogId = req.params.blogId;
    const removed = await bookmarkService.removeBookmark(userId, blogId);

    if (!removed) {
      res.status(404).json({ message: "Bookmark not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyBookmarks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const bookmarks = await bookmarkService.getMyBookmarks(userId);

    res.status(200).json({ bookmarks });
  } catch (error) {
    console.error("Get bookmarks error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkBookmark = async (
  req: Request<{ blogId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const blogId = req.params.blogId;
    const bookmarked = await bookmarkService.isBookmarked(userId, blogId);

    res.status(200).json({ bookmarked });
  } catch (error) {
    console.error("Check bookmark error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
