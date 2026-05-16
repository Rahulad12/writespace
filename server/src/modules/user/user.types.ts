import { z } from "zod";

export interface UserProfileRow {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  created_at: Date;
  published_blog_count: number;
}

export interface UserProfileWithFollow {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  created_at: Date;
  published_blog_count: number;
  is_following: boolean;
}

export const updateProfileSchema = z.object({
  username: z.string().min(1, "Username is required").max(50, "Username must be 50 characters or less").optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
