import { useState } from 'react';
import { CreateBlogPayload, UpdateBlogPayload, Blog } from '../types/blog.types';
import { createBlog, updateBlog, publishDraft } from '../lib/api';

interface UseBlogMutationsState {
  creating: boolean;
  updating: boolean;
  publishing: boolean;
  create: (data: CreateBlogPayload) => Promise<Blog | null>;
  update: (id: string, data: UpdateBlogPayload) => Promise<Blog | null>;
  publish: (id: string) => Promise<Blog | null>;
  error: string | null;
}

export const useBlogMutations = (): UseBlogMutationsState => {
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateBlogPayload): Promise<Blog | null> => {
    setCreating(true);
    setError(null);
    try {
      const response = await createBlog(data);
      return response.blog;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to create blog');
      return null;
    } finally {
      setCreating(false);
    }
  };

  const update = async (id: string, data: UpdateBlogPayload): Promise<Blog | null> => {
    setUpdating(true);
    setError(null);
    try {
      const response = await updateBlog(id, data);
      return response.blog;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to update blog');
      return null;
    } finally {
      setUpdating(false);
    }
  };

  const publish = async (id: string): Promise<Blog | null> => {
    setPublishing(true);
    setError(null);
    try {
      const response = await publishDraft(id);
      return response.blog;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to publish blog');
      return null;
    } finally {
      setPublishing(false);
    }
  };

  return { creating, updating, publishing, create, update, publish, error };
};
