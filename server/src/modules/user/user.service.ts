import { pool } from "../../config/db";
import { UserProfileRow, UpdateProfileBody, UserProfileResponse, UserProfileWithFollow } from "./user.types";

export const getUserProfile = async (userId: string, requesterId?: string): Promise<UserProfileResponse | UserProfileWithFollow | null> => {
  const result = await pool.query<UserProfileRow>(
    `SELECT id, username, email, bio, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM blogs WHERE author_id = $1 AND status = 'published'",
    [userId]
  );

  const profile: UserProfileResponse = {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    created_at: user.created_at,
    published_blog_count: parseInt(countResult.rows[0].count),
  };

  if (requesterId && requesterId !== userId) {
    const followResult = await pool.query(
      "SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2",
      [requesterId, userId]
    );

    return {
      ...profile,
      is_following: followResult.rows.length > 0,
    } as UserProfileWithFollow;
  }

  return profile;
};

export const getCurrentUserProfile = async (userId: string): Promise<UserProfileResponse | null> => {
  const result = await pool.query<UserProfileRow>(
    `SELECT id, username, email, bio, created_at, updated_at
     FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM blogs WHERE author_id = $1 AND status = 'published'",
    [userId]
  );

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    created_at: user.created_at,
    published_blog_count: parseInt(countResult.rows[0].count),
  };
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileBody
): Promise<{ success: boolean; error?: string; profile?: UserProfileResponse }> => {
  const updates: string[] = [];
  const params: (string | number)[] = [];
  let paramCount = 0;

  if (data.username !== undefined) {
    paramCount++;
    updates.push(`username = $${paramCount}`);
    params.push(data.username);

    const existing = await pool.query(
      "SELECT 1 FROM users WHERE username = $1 AND id != $2",
      [data.username, userId]
    );

    if (existing.rows.length > 0) {
      return { success: false, error: "Username already taken" };
    }
  }

  if (data.bio !== undefined) {
    paramCount++;
    updates.push(`bio = $${paramCount}`);
    params.push(data.bio);
  }

  if (updates.length === 0) {
    return await getCurrentUserProfile(userId).then(p => ({
      success: true,
      profile: p ?? undefined,
    }));
  }

  paramCount++;
  updates.push(`updated_at = NOW()`);

  params.push(userId);

  const result = await pool.query<UserProfileRow>(
    `UPDATE users SET ${updates.join(", ")} WHERE id = $${paramCount + 1} RETURNING *`,
    params
  );

  if (result.rows.length === 0) {
    return { success: false, error: "User not found" };
  }

  const user = result.rows[0];

  const countResult = await pool.query<{ count: string }>(
    "SELECT COUNT(*) FROM blogs WHERE author_id = $1 AND status = 'published'",
    [userId]
  );

  return {
    success: true,
    profile: {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      created_at: user.created_at,
      published_blog_count: parseInt(countResult.rows[0].count),
    },
  };
};
