import { z } from "zod";

export interface FollowRow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: Date;
}

export interface FollowWithProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  created_at: Date;
}

export const followUserSchema = z.object({});
