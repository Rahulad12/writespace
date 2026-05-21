import { useState, useEffect, useCallback } from 'react';
import { UserProfileWithFollow } from '../types/user.types';
import { getUserProfile } from '../lib/api';

interface UseUserProfileState {
  profile: UserProfileWithFollow | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (userId: string): UseUserProfileState => {
  const [profile, setProfile] = useState<UserProfileWithFollow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserProfile(userId);
      setProfile(response.profile);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
};
