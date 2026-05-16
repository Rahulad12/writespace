"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBookmarked = exports.getMyBookmarks = exports.removeBookmark = exports.addBookmark = void 0;
const db_1 = require("../../config/db");
const addBookmark = async (userId, blogId) => {
    const blog = await db_1.pool.query("SELECT status FROM blogs WHERE id = $1", [blogId]);
    if (blog.rows.length === 0) {
        throw new Error("Blog not found");
    }
    if (blog.rows[0].status === "draft") {
        throw new Error("Cannot bookmark a draft blog");
    }
    const result = await db_1.pool.query(`INSERT INTO bookmarks (user_id, blog_id)
     VALUES ($1, $2)
     RETURNING *`, [userId, blogId]);
    return result.rows[0];
};
exports.addBookmark = addBookmark;
const removeBookmark = async (userId, blogId) => {
    const result = await db_1.pool.query("DELETE FROM bookmarks WHERE user_id = $1 AND blog_id = $2", [userId, blogId]);
    return result.rowCount !== null && result.rowCount > 0;
};
exports.removeBookmark = removeBookmark;
const getMyBookmarks = async (userId) => {
    const result = await db_1.pool.query(`SELECT b.id, b.user_id, b.blog_id, b.created_at,
            bl.title, bl.content, bl.status, bl.published_at,
            u.username as author_username, u.email as author_email
     FROM bookmarks b
     JOIN blogs bl ON b.blog_id = bl.id
     JOIN users u ON bl.author_id = u.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`, [userId]);
    return result.rows;
};
exports.getMyBookmarks = getMyBookmarks;
const isBookmarked = async (userId, blogId) => {
    const result = await db_1.pool.query("SELECT 1 FROM bookmarks WHERE user_id = $1 AND blog_id = $2", [userId, blogId]);
    return result.rows.length > 0;
};
exports.isBookmarked = isBookmarked;
