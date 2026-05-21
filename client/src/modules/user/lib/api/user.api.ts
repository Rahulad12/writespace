import apiClient from '../../../../shared/config/apiClient';
import {
  UserProfileResponse,
  UserProfileWithFollowResponse,
  FollowListResponse,
  FollowStatusResponse,
  UpdateProfileResponse,
  UpdateProfilePayload,
} from '../../types/user.types';

export const getUserProfile = async (userId: string): Promise<UserProfileWithFollowResponse> => {
  const response = await apiClient.get<UserProfileWithFollowResponse>(`/users/${userId}`);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>('/users/me');
  return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload): Promise<UpdateProfileResponse> => {
  const response = await apiClient.put<UpdateProfileResponse>('/users/profile', data);
  return response.data;
};

export const followUser = async (userId: string): Promise<void> => {
  await apiClient.post(`/follows/${userId}`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/follows/${userId}`);
};

export const getFollowers = async (userId: string): Promise<FollowListResponse> => {
  const response = await apiClient.get<FollowListResponse>(`/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId: string): Promise<FollowListResponse> => {
  const response = await apiClient.get<FollowListResponse>(`/users/${userId}/following`);
  return response.data;
};

export const getFollowStatus = async (userId: string): Promise<FollowStatusResponse> => {
  const response = await apiClient.get<FollowStatusResponse>(`/users/${userId}/follow-status`);
  return response.data;
};
