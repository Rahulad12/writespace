import { useState, useEffect, useCallback } from 'react';
import { BlogWithAuthor } from '../types/blog.types';
import { getBlogs } from '../lib/api';

interface UseBlogFeedState {
  blogs: BlogWithAuthor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlogFeed = (): UseBlogFeedState => {
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogs();
      setBlogs(response.blogs);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
};
