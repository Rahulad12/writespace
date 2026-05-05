import { pool } from "../../config/db";
import { BlogRow, BlogWithAuthor, CreateBlogBody, UpdateBlogBody } from "./blog.types";

export const createBlog = async (
  authorId: number,
  data: CreateBlogBody
): Promise<BlogRow> => {
  const { title, content, status } = data;
  const publishedAt = status === "published" ? "NOW()" : null;

  const result = await pool.query<BlogRow>(
    `INSERT INTO blogs (author_id, title, content, status, published_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [authorId, title, content, status, publishedAt]
  );

  return result.rows[0];
};

export const getBlogById = async (id: number): Promise<BlogWithAuthor | null> => {
  const result = await pool.query<BlogWithAuthor>(
    `SELECT b.*, u.username as author_username, u.email as author_email
     FROM blogs b
     JOIN users u ON b.author_id = u.id
     WHERE b.id = $1`,
    [id]
  );

  return result.rows[0] || null;
};

export const getBlogs = async (options?: {
  authorId?: number;
  status?: "draft" | "published";
  limit?: number;
  offset?: number;
}): Promise<BlogWithAuthor[]> => {
  const { authorId, status, limit = 10, offset = 0 } = options || {};

  let query = `
    SELECT b.*, u.username as author_username, u.email as author_email
    FROM blogs b
    JOIN users u ON b.author_id = u.id
    WHERE 1=1
  `;
  const params: (number | string)[] = [];

  if (authorId) {
    params.push(authorId);
    query += ` AND b.author_id = $${params.length}`;
  }

  if (status) {
    params.push(status);
    query += ` AND b.status = $${params.length}`;
  } else {
    // By default, only show published blogs in public feed
    query += ` AND b.status = 'published'`;
  }

  query += ` ORDER BY b.created_at DESC`;
  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await pool.query<BlogWithAuthor>(query, params);
  return result.rows;
};

export const getMyDrafts = async (authorId: number): Promise<BlogRow[]> => {
  const result = await pool.query<BlogRow>(
    `SELECT * FROM blogs
     WHERE author_id = $1 AND status = 'draft'
     ORDER BY created_at DESC`,
    [authorId]
  );

  return result.rows;
};

export const publishDraft = async (id: number, authorId: number): Promise<BlogRow | null> => {
  const existing = await pool.query<BlogRow>(
    "SELECT * FROM blogs WHERE id = $1 AND author_id = $2",
    [id, authorId]
  );

  if (existing.rows.length === 0) {
    return null;
  }

  const result = await pool.query<BlogRow>(
    `UPDATE blogs
     SET status = 'published', published_at = NOW(), updated_at = NOW()
     WHERE id = $1 AND author_id = $2
     RETURNING *`,
    [id, authorId]
  );

  return result.rows[0] || null;
};

export const updateBlog = async (
  id: number,
  authorId: number,
  data: UpdateBlogBody
): Promise<BlogRow | null> => {
  const existing = await pool.query<BlogRow>("SELECT * FROM blogs WHERE id = $1 AND author_id = $2", [id, authorId]);

  if (existing.rows.length === 0) {
    return null;
  }

  const updates: string[] = [];
  const params: (string | number)[] = [];
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

  const result = await pool.query<BlogRow>(
    `UPDATE blogs SET ${updates.join(", ")} WHERE id = $${paramCount + 1} AND author_id = $${paramCount + 2} RETURNING *`,
    params
  );

  return result.rows[0] || null;
};

export const deleteBlog = async (id: number, authorId: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM blogs WHERE id = $1 AND author_id = $2",
    [id, authorId]
  );

  return result.rowCount !== null && result.rowCount > 0;
};
