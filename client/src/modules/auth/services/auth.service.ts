import apiClient from '../../../shared/config/apiClient';
import { LoginPayload, RegisterPayload, AuthResponse, UserProfileResponse } from '../types';

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserProfileResponse> => {
  const response = await apiClient.get<UserProfileResponse>('/users/me');
  return response.data;
};
