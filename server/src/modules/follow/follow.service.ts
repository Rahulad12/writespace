import { pool } from "../../config/db";
import { FollowRow, FollowWithProfile } from "./follow.types";

export const followUser = async (followerId: string, followingId: string): Promise<FollowRow> => {
  if (followerId === followingId) {
    throw new Error("Cannot follow yourself");
  }

  const userExists = await pool.query("SELECT 1 FROM users WHERE id = $1", [followingId]);
  if (userExists.rows.length === 0) {
    throw new Error("User not found");
  }

  const result = await pool.query<FollowRow>(
    `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     RETURNING *`,
    [followerId, followingId]
  );

  return result.rows[0];
};

export const unfollowUser = async (followerId: string, followingId: string): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId]
  );

  return result.rowCount !== null && result.rowCount > 0;
};

export const getFollowers = async (userId: string): Promise<FollowWithProfile[]> => {
  const result = await pool.query<FollowWithProfile>(
    `SELECT f.id, u.id as user_id, u.username, u.bio, f.created_at
     FROM follows f
     JOIN users u ON f.follower_id = u.id
     WHERE f.following_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return result.rows;
};

export const getFollowing = async (userId: string): Promise<FollowWithProfile[]> => {
  const result = await pool.query<FollowWithProfile>(
    `SELECT f.id, u.id as user_id, u.username, u.bio, f.created_at
     FROM follows f
     JOIN users u ON f.following_id = u.id
     WHERE f.follower_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );

  return result.rows;
};

export const isFollowing = async (followerId: string, followingId: string): Promise<boolean> => {
  const result = await pool.query(
    "SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2",
    [followerId, followingId]
  );

  return result.rows.length > 0;
};
