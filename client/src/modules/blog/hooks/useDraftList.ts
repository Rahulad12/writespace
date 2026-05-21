import { useState, useEffect, useCallback } from 'react';
import { Blog } from '../types/blog.types';
import { getMyDrafts } from '../lib/api';

interface UseDraftListState {
  drafts: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useDraftList = (): UseDraftListState => {
  const [drafts, setDrafts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyDrafts();
      setDrafts(response.drafts);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to load drafts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  return { drafts, loading, error, refetch: fetchDrafts };
};
