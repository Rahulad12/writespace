import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be 50 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
