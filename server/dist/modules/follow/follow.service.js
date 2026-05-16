"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFollowing = exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const db_1 = require("../../config/db");
const followUser = async (followerId, followingId) => {
    if (followerId === followingId) {
        throw new Error("Cannot follow yourself");
    }
    const userExists = await db_1.pool.query("SELECT 1 FROM users WHERE id = $1", [followingId]);
    if (userExists.rows.length === 0) {
        throw new Error("User not found");
    }
    const result = await db_1.pool.query(`INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     RETURNING *`, [followerId, followingId]);
    return result.rows[0];
};
exports.followUser = followUser;
const unfollowUser = async (followerId, followingId) => {
    const result = await db_1.pool.query("DELETE FROM follows WHERE follower_id = $1 AND following_id = $2", [followerId, followingId]);
    return result.rowCount !== null && result.rowCount > 0;
};
exports.unfollowUser = unfollowUser;
const getFollowers = async (userId) => {
    const result = await db_1.pool.query(`SELECT f.id, u.id as user_id, u.username, u.bio, f.created_at
     FROM follows f
     JOIN users u ON f.follower_id = u.id
     WHERE f.following_id = $1
     ORDER BY f.created_at DESC`, [userId]);
    return result.rows;
};
exports.getFollowers = getFollowers;
const getFollowing = async (userId) => {
    const result = await db_1.pool.query(`SELECT f.id, u.id as user_id, u.username, u.bio, f.created_at
     FROM follows f
     JOIN users u ON f.following_id = u.id
     WHERE f.follower_id = $1
     ORDER BY f.created_at DESC`, [userId]);
    return result.rows;
};
exports.getFollowing = getFollowing;
const isFollowing = async (followerId, followingId) => {
    const result = await db_1.pool.query("SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2", [followerId, followingId]);
    return result.rows.length > 0;
};
exports.isFollowing = isFollowing;
