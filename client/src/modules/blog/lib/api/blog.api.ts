import apiClient from '../../../../shared/config/apiClient';
import {
  BlogListResponse,
  BlogDetailResponse,
  DraftListResponse,
  CreateBlogResponse,
  UpdateBlogResponse,
  PublishResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
} from '../../types/blog.types';

export const getBlogs = async (params?: { authorId?: string; limit?: number; offset?: number }): Promise<BlogListResponse> => {
  const response = await apiClient.get<BlogListResponse>('/blogs', { params });
  return response.data;
};

export const getBlogById = async (id: string): Promise<BlogDetailResponse> => {
  const response = await apiClient.get<BlogDetailResponse>(`/blogs/${id}`);
  return response.data;
};

export const getMyDrafts = async (): Promise<DraftListResponse> => {
  const response = await apiClient.get<DraftListResponse>('/blogs/drafts');
  return response.data;
};

export const createBlog = async (data: CreateBlogPayload): Promise<CreateBlogResponse> => {
  const response = await apiClient.post<CreateBlogResponse>('/blogs', data);
  return response.data;
};

export const updateBlog = async (id: string, data: UpdateBlogPayload): Promise<UpdateBlogResponse> => {
  const response = await apiClient.put<UpdateBlogResponse>(`/blogs/${id}`, data);
  return response.data;
};

export const deleteBlog = async (id: string): Promise<void> => {
  await apiClient.delete(`/blogs/${id}`);
};

export const publishDraft = async (id: string): Promise<PublishResponse> => {
  const response = await apiClient.put<PublishResponse>(`/blogs/${id}/publish`);
  return response.data;
};
