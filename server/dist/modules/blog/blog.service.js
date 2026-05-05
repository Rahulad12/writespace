"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogs = exports.getBlogById = exports.createBlog = void 0;
const db_1 = require("../../config/db");
const createBlog = async (authorId, data) => {
    const { title, content, status } = data;
    const publishedAt = status === "published" ? "NOW()" : null;
    const result = await db_1.pool.query(`INSERT INTO blogs (author_id, title, content, status, published_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`, [authorId, title, content, status, publishedAt]);
    return result.rows[0];
};
exports.createBlog = createBlog;
const getBlogById = async (id) => {
    const result = await db_1.pool.query(`SELECT b.*, u.username as author_username, u.email as author_email
     FROM blogs b
     JOIN users u ON b.author_id = u.id
     WHERE b.id = $1`, [id]);
    return result.rows[0] || null;
};
exports.getBlogById = getBlogById;
const getBlogs = async (options) => {
    const { authorId, status, limit = 10, offset = 0 } = options || {};
    let query = `
    SELECT b.*, u.username as author_username, u.email as author_email
    FROM blogs b
    JOIN users u ON b.author_id = u.id
    WHERE 1=1
  `;
    const params = [];
    if (authorId) {
        params.push(authorId);
        query += ` AND b.author_id = $${params.length}`;
    }
    if (status) {
        params.push(status);
        query += ` AND b.status = $${params.length}`;
    }
    query += ` ORDER BY b.created_at DESC`;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await db_1.pool.query(query, params);
    return result.rows;
};
exports.getBlogs = getBlogs;
const updateBlog = async (id, authorId, data) => {
    const existing = await db_1.pool.query("SELECT * FROM blogs WHERE id = $1 AND author_id = $2", [id, authorId]);
    if (existing.rows.length === 0) {
        return null;
    }
    const updates = [];
    const params = [];
    let paramCount = 0;
    if (data.title !== undefined) {
        paramCount++;
        updates.push(`title = $${paramCount}`);
        params.push(data.title);
    }
    if (data.content !== undefined) {
        paramCount++;
        updates.push(`content = $${paramCount}`);
        params.push(data.content);
    }
    if (data.status !== undefined) {
        paramCount++;
        updates.push(`status = $${paramCount}`);
        params.push(data.status);
        if (data.status === "published" && !existing.rows[0].published_at) {
            updates.push(`published_at = NOW()`);
        }
    }
    paramCount++;
    updates.push(`updated_at = NOW()`);
    params.push(id);
    params.push(authorId);
    const result = await db_1.pool.query(`UPDATE blogs SET ${updates.join(", ")} WHERE id = $${paramCount + 1} AND author_id = $${paramCount + 2} RETURNING *`, params);
    return result.rows[0] || null;
};
exports.updateBlog = updateBlog;
const deleteBlog = async (id, authorId) => {
    const result = await db_1.pool.query("DELETE FROM blogs WHERE id = $1 AND author_id = $2", [id, authorId]);
    return result.rowCount !== null && result.rowCount > 0;
};
exports.deleteBlog = deleteBlog;
