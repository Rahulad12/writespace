import { Request, Response } from "express";
import * as followService from "./follow.service";

export const followUser = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const followingId = req.params.userId;

    try {
      const follow = await followService.followUser(followerId, followingId);
      res.status(201).json({
        message: "User followed successfully",
        follow,
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message === "Cannot follow yourself") {
        res.status(400).json({ message: "Cannot follow yourself" });
        return;
      }
      if (message === "User not found") {
        res.status(404).json({ message: "User not found" });
        return;
      }
      if ((error as any).code === "23505") {
        res.status(409).json({ message: "Already following this user" });
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error("Follow user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollowUser = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const followingId = req.params.userId;
    const removed = await followService.unfollowUser(followerId, followingId);

    if (!removed) {
      res.status(404).json({ message: "Follow relationship not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Unfollow user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowers = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    const followers = await followService.getFollowers(userId);

    res.status(200).json({ followers });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowing = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    const following = await followService.getFollowing(userId);

    res.status(200).json({ following });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFollowStatus = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const followerId = req.user?.id;
    if (!followerId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const followingId = req.params.userId;
    const following = await followService.isFollowing(followerId, followingId);

    res.status(200).json({ following });
  } catch (error) {
    console.error("Get follow status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
