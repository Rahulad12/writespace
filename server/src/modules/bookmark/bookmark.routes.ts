import { Router } from "express";
import { addBookmark, removeBookmark, getMyBookmarks, checkBookmark } from "./bookmark.controller";
import { authenticateToken } from "../../shared/middleware/auth.middleware";

const bookmarkRouter = Router();

bookmarkRouter.post("/:blogId", authenticateToken, addBookmark);
bookmarkRouter.delete("/:blogId", authenticateToken, removeBookmark);
bookmarkRouter.get("/", authenticateToken, getMyBookmarks);
bookmarkRouter.get("/:blogId/check", authenticateToken, checkBookmark);

export default bookmarkRouter;
