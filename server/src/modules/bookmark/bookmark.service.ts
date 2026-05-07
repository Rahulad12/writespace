import { pool } from "../../config/db";
import { BookmarkRow, BookmarkedBlog } from "./bookmark.types";

export const addBookmark = async (userId: string, blogId: string): Promise<BookmarkRow> => {
  const blog = await pool.query("SELECT status FROM blogs WHERE id = $1", [blogId]);

  if (blog.rows.length === 0) {
    throw new Error("Blog not found");
  }

  if (blog.rows[0].status === "draft") {
    throw new Error("Cannot bookmark a draft blog");
  }

  const result = await pool.query<BookmarkRow>(
    `INSERT INTO bookmarks (user_id, blog_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, blogId]
  );

  return result.rows[0];
};

export const removeBookmark = async (userId: string, blogId: string): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM bookmarks WHERE user_id = $1 AND blog_id = $2",
    [userId, blogId]
  );

  return result.rowCount !== null && result.rowCount > 0;
};

export const getMyBookmarks = async (userId: string): Promise<BookmarkedBlog[]> => {
  const result = await pool.query<BookmarkedBlog>(
    `SELECT b.id, b.user_id, b.blog_id, b.created_at,
            bl.title, bl.content, bl.status, bl.published_at,
            u.username as author_username, u.email as author_email
     FROM bookmarks b
     JOIN blogs bl ON b.blog_id = bl.id
     JOIN users u ON bl.author_id = u.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );

  return result.rows;
};

export const isBookmarked = async (userId: string, blogId: string): Promise<boolean> => {
  const result = await pool.query(
    "SELECT 1 FROM bookmarks WHERE user_id = $1 AND blog_id = $2",
    [userId, blogId]
  );

  return result.rows.length > 0;
};
