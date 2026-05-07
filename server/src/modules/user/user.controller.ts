import { Request, Response } from "express";
import * as userService from "./user.service";
import { UpdateProfileBody } from "./user.types";

export const getUserProfile = async (
  req: Request<{ userId: string }>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId;

    const profile = await userService.getUserProfile(userId, req.user?.id);

    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCurrentUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const profile = await userService.getCurrentUserProfile(userId);

    if (!profile) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Get current user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (
  req: Request<{}, {}, UpdateProfileBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const result = await userService.updateUserProfile(userId, req.body);

    if (!result.success) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: result.profile,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
