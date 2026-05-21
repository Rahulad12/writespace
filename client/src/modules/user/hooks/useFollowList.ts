import { useState, useEffect, useCallback } from 'react';
import { FollowWithProfile } from '../types/user.types';
import { getFollowers, getFollowing } from '../lib/api';

interface UseFollowListState {
  users: FollowWithProfile[];
  loading: boolean;
  error: string | null;
}

type FollowListType = 'followers' | 'following';

export const useFollowList = (userId: string, type: FollowListType): UseFollowListState => {
  const [users, setUsers] = useState<FollowWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = type === 'followers'
        ? await getFollowers(userId)
        : await getFollowing(userId);
      const key = type === 'followers' ? 'followers' : 'following';
      setUsers(response[key!] ?? []);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? `Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  }, [userId, type]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { users, loading, error };
};
