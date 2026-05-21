export interface BlogAuthor {
  id: string;
  username: string;
  email: string;
}

export interface Blog {
  id: string;
  author_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface BlogWithAuthor extends Blog {
  author_username: string;
  author_email: string;
}

export interface CreateBlogPayload {
  title: string;
  content: string;
  status?: 'draft' | 'published';
}

export interface UpdateBlogPayload {
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
}

export interface BlogListResponse {
  blogs: BlogWithAuthor[];
}

export interface BlogDetailResponse {
  blog: BlogWithAuthor;
}

export interface DraftListResponse {
  drafts: Blog[];
}

export interface CreateBlogResponse {
  message: string;
  blog: Blog;
}

export interface UpdateBlogResponse {
  message: string;
  blog: Blog;
}

export interface PublishResponse {
  message: string;
  blog: Blog;
}
