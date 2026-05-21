import { useState, useEffect, useCallback } from 'react';
import { BlogWithAuthor } from '../types/blog.types';
import { getBlogById } from '../lib/api';

interface UseBlogDetailState {
  blog: BlogWithAuthor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlogDetail = (id: string): UseBlogDetailState => {
  const [blog, setBlog] = useState<BlogWithAuthor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogById(id);
      setBlog(response.blog);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return { blog, loading, error, refetch: fetchBlog };
};
