import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less").optional(),
  content: z.string().min(1, "Content is required").optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export type CreateBlogBody = z.infer<typeof createBlogSchema>;
export type UpdateBlogBody = z.infer<typeof updateBlogSchema>;

export interface BlogRow {
  id: number;
  author_id: number;
  title: string;
  content: string;
  status: "draft" | "published";
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

export interface BlogWithAuthor extends BlogRow {
  author_username: string;
  author_email: string;
}
