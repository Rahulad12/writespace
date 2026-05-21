import { useState, useCallback } from 'react';
import { followUser, unfollowUser, getFollowStatus } from '../lib/api';

interface UseFollowActionState {
  isFollowing: boolean;
  loading: boolean;
  toggleFollow: () => Promise<void>;
  checkStatus: () => Promise<void>;
}

export const useFollowAction = (userId: string): UseFollowActionState => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkStatus = useCallback(async () => {
    try {
      const response = await getFollowStatus(userId);
      setIsFollowing(response.following);
    } catch {
      // not authenticated or error — leave as false
    }
  }, [userId]);

  const toggleFollow = useCallback(async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
      }
    } catch {
      // error handled by interceptor
    } finally {
      setLoading(false);
    }
  }, [userId, isFollowing]);

  return { isFollowing, loading, toggleFollow, checkStatus };
};
