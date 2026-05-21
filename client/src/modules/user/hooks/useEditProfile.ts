import { useState, useEffect } from 'react';
import { UserProfile, UpdateProfilePayload } from '../types/user.types';
import { getCurrentUser, updateProfile } from '../lib/api';

interface UseEditProfileState {
  profile: UserProfile | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  save: (data: UpdateProfilePayload) => Promise<boolean>;
}

export const useEditProfile = (): UseEditProfileState => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser();
        setProfile(response.profile);
      } catch (err: unknown) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const save = async (data: UpdateProfilePayload): Promise<boolean> => {
    setSaving(true);
    setError(null);
    try {
      const response = await updateProfile(data);
      setProfile(response.profile);
      return true;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to update profile');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, error, save };
};
