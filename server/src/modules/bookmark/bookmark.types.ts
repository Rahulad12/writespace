import { z } from "zod";

export interface BookmarkRow {
  id: string;
  user_id: string;
  blog_id: string;
  created_at: Date;
}

export interface BookmarkedBlog extends BookmarkRow {
  title: string;
  content: string;
  status: "draft" | "published";
  author_username: string;
  author_email: string;
  published_at: Date | null;
}
