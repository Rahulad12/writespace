import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export type CreateBlogFormData = z.infer<typeof createBlogSchema>;
export type UpdateBlogFormData = z.infer<typeof updateBlogSchema>;
