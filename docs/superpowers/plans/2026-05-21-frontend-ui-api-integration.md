# Frontend UI & API Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build all remaining frontend UI pages and components, wire them to existing server API endpoints, and follow the module-structure.md conventions strictly.

**Architecture:** Feature-based modular architecture under `client/src/modules/`. Each module has a barrel (`index.ts`), page exports, types, Zod schemas, API services under `lib/api/`, hooks under `hooks/`, and components under `components/`. Shared code lives in `src/shared/`. No cross-module imports. Forms use `react-hook-form` + `zodResolver`.

**Tech Stack:** React 19 + TypeScript + antd 6 + react-hook-form + Zod + Zustand + axios + react-router-dom v7

---
## File Structure Overview

```
client/src/
├── shared/
│   ├── components/
│   │   ├── AppLayout.tsx          ← Navbar + content + footer layout wrapper
│   │   └── Navbar.tsx             ← Top navigation bar with auth state
│   ├── constants/
│   │   └── routes.ts              ← Route path constants
│   └── hooks/
│       └── useAuth.ts             ← Enhanced: loadUser on mount
├── modules/
│   ├── blog/                      ← Blog CRUD, feed, detail, drafts
│   │   ├── index.ts               ← barrel
│   │   ├── page.tsx               ← BlogFeedPage, BlogDetailPage, BlogCreatePage, BlogEditPage, BlogDraftsPage
│   │   ├── types/
│   │   │   └── blog.types.ts      ← Blog, BlogWithAuthor, CreateBlogPayload, UpdateBlogPayload
│   │   ├── schemas/
│   │   │   └── blog.schema.ts     ← createBlogSchema, updateBlogSchema
│   │   ├── lib/
│   │   │   └── api/
│   │   │       ├── blog.api.ts    ← getBlogs, getBlogById, createBlog, updateBlog, deleteBlog, publishDraft, getMyDrafts
│   │   │       └── index.ts       ← barrel
│   │   ├── hooks/
│   │   │   ├── useBlogFeed.ts     ← fetch published blogs
│   │   │   ├── useBlogDetail.ts   ← fetch single blog
│   │   │   └── useBlogMutations.ts ← create, update, delete, publish
│   │   └── components/
│   │       ├── BlogCard.tsx       ← Feed card (title, snippet, author, date)
│   │       ├── BlogFeed.tsx       ← Feed list with loading/empty states
│   │       ├── BlogDetailView.tsx ← Full blog content with actions
│   │       ├── BlogForm.tsx       ← Create/edit form (react-hook-form + zod)
│   │       └── DraftList.tsx      ← Draft list with publish action
│   └── user/                      ← User profiles, edit, follow/unfollow
│       ├── index.ts               ← barrel
│       ├── page.tsx               ← UserProfilePage, EditProfilePage, UserFollowersPage, UserFollowingPage
│       ├── types/
│       │   └── user.types.ts      ← UserProfile, UserProfileWithFollow, UpdateProfilePayload, FollowWithProfile
│       ├── schemas/
│       │   └── user.schema.ts     ← updateProfileSchema
│       ├── lib/
│       │   └── api/
│       │       ├── user.api.ts    ← getUserProfile, getCurrentUser, updateProfile, followUser, unfollowUser, getFollowers, getFollowing, getFollowStatus
│       │       └── index.ts       ← barrel
│       ├── hooks/
│       │   ├── useUserProfile.ts  ← fetch user profile + follow status
│       │   ├── useEditProfile.ts  ← update profile mutation
│       │   ├── useFollowAction.ts ← follow/unfollow toggle
│       │   └── useFollowList.ts   ← fetch followers/following
│       └── components/
│           ├── ProfileCard.tsx    ← Profile display (username, bio, blog count, dates)
│           ├── FollowButton.tsx   ← Follow/unfollow toggle button
│           ├── ProfileEditForm.tsx ← Edit profile form (react-hook-form + zod)
│           ├── FollowersList.tsx  ← List of followers with user links
│           └── FollowingList.tsx  ← List of followed users with user links
```

---

## Server API Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/blogs | No | Published blogs (query: authorId, limit, offset) |
| GET | /api/blogs/drafts | Yes | Own drafts |
| GET | /api/blogs/:id | No | Single blog |
| POST | /api/blogs | Yes | Create blog |
| PUT | /api/blogs/:id | Yes | Update blog |
| DELETE | /api/blogs/:id | Yes | Delete blog |
| PUT | /api/blogs/:id/publish | Yes | Publish draft |
| GET | /api/users/:userId | No | Public profile |
| GET | /api/users/me | Yes | Own profile |
| PUT | /api/users/profile | Yes | Update profile |
| POST | /api/follows/:userId | Yes | Follow user |
| DELETE | /api/follows/:userId | Yes | Unfollow user |
| GET | /api/users/:userId/followers | No | Get followers |
| GET | /api/users/:userId/following | No | Get following |
| GET | /api/users/:userId/follow-status | Yes | Check follow status |
| POST | /api/bookmarks/:blogId | Yes | Add bookmark |
| DELETE | /api/bookmarks/:blogId | Yes | Remove bookmark |
| GET | /api/bookmarks | Yes | My bookmarks |
| GET | /api/bookmarks/:blogId/check | Yes | Check bookmark status |

---

### Task 1: Install Dependencies & Create Shared Infrastructure

**Files:**
- Modify: `client/package.json` (add react-hook-form, @hookform/resolvers)
- Create: `client/src/shared/constants/routes.ts`
- Create: `client/src/shared/components/Navbar.tsx`
- Create: `client/src/shared/components/AppLayout.tsx`
- Modify: `client/src/shared/hooks/useAuth.ts` (add `loadUser`)

- [ ] **Step 1: Install dependencies**

```bash
cd client && npm install react-hook-form @hookform/resolvers
```

Expected: Packages added to node_modules and package.json

- [ ] **Step 2: Create route constants**

Create `client/src/shared/constants/routes.ts`:

```typescript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  BLOGS: '/blogs',
  BLOG_NEW: '/blogs/new',
  BLOG_DETAIL: '/blogs/:id',
  BLOG_EDIT: '/blogs/:id/edit',
  BLOG_DRAFTS: '/blogs/drafts',
  USER_PROFILE: '/users/:userId',
  USER_FOLLOWERS: '/users/:userId/followers',
  USER_FOLLOWING: '/users/:userId/following',
  EDIT_PROFILE: '/profile/edit',
} as const;
```

- [ ] **Step 3: Enhance useAuth with loadUser**

Modify `client/src/shared/hooks/useAuth.ts`:

```typescript
import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initialize: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isInitialized: false,
  login: (token: string, user: User) => {
    localStorage.setItem('token', token);
    set({ token, user, isAuthenticated: true, isInitialized: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false, isInitialized: true });
  },
  setUser: (user: User) => set({ user }),
  initialize: () => set({ isInitialized: true }),
}));

export const loadUser = async (): Promise<void> => {
  const { token, initialize } = useAuth.getState();
  if (!token) {
    initialize();
    return;
  }
  try {
    const { default: apiClient } = await import('../config/apiClient');
    const response = await apiClient.get<{ profile: User }>('/users/me');
    useAuth.getState().setUser(response.data.profile);
  } catch {
    useAuth.getState().logout();
  } finally {
    useAuth.getState().initialize();
  }
};
```

Note: `loadUser` is a named function exported separately, not a method on the store. It's called once in `App.tsx` on mount.

- [ ] **Step 4: Create Navbar component**

Create `client/src/shared/components/Navbar.tsx`:

```typescript
import React from 'react';
import { Layout, Menu, Button, Space, Dropdown } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, BookOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const { Header } = Layout;

const Navbar: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems = [
    { key: ROUTES.HOME, label: 'Home', icon: <FileTextOutlined /> },
  ];

  if (isAuthenticated) {
    menuItems.push(
      { key: ROUTES.BLOG_NEW, label: 'Write', icon: <EditOutlined /> },
      { key: ROUTES.BLOG_DRAFTS, label: 'Drafts', icon: <BookOutlined /> },
    );
  }

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const currentKey = '/' + location.pathname.split('/').filter(Boolean)[0] || ROUTES.HOME;

  return (
    <Header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate(ROUTES.HOME)}>
        WriteSpace
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[currentKey === '/blogs/drafts' ? ROUTES.BLOG_DRAFTS : currentKey]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, minWidth: 0 }}
      />
      <Space>
        {isAuthenticated ? (
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: 'My Profile', icon: <UserOutlined /> },
                { key: 'edit-profile', label: 'Edit Profile', icon: <UserOutlined /> },
                { type: 'divider' },
                { key: 'logout', label: 'Logout', danger: true },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') handleLogout();
                else if (key === 'profile') navigate(ROUTES.USER_PROFILE.replace(':userId', user?.id ?? ''));
                else if (key === 'edit-profile') navigate(ROUTES.EDIT_PROFILE);
              },
            }}
          >
            <Button type="text" style={{ color: '#fff' }}>
              <UserOutlined /> {user?.username}
            </Button>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" style={{ color: '#fff' }} onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </Button>
            <Button ghost onClick={() => navigate(ROUTES.REGISTER)}>
              Register
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 24,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default Navbar;
```

- [ ] **Step 5: Create AppLayout component**

Create `client/src/shared/components/AppLayout.tsx`:

```typescript
import React, { useEffect } from 'react';
import { Layout, Spin } from 'antd';
import Navbar from './Navbar';
import { useAuth, loadUser } from '../hooks/useAuth';

const { Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }): React.ReactElement => {
  const { isInitialized, isAuthenticated, token } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  if (!isInitialized && !!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '24px', maxWidth: 960, width: '100%', margin: '0 auto' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        WriteSpace &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default AppLayout;
```

- [ ] **Step 6: Commit Task 1**

```bash
git add client/package.json client/package-lock.json client/src/shared/constants/ client/src/shared/components/Navbar.tsx client/src/shared/components/AppLayout.tsx client/src/shared/hooks/useAuth.ts
git commit -m "feat: add shared layout, navbar, and enhanced useAuth"
```

Build check: `cd client && npm run build` — must pass with zero errors.

---

### Task 2: Blog Module — Types, Schema, API Service

**Files:**
- Create: `client/src/modules/blog/types/blog.types.ts`
- Create: `client/src/modules/blog/schemas/blog.schema.ts`
- Create: `client/src/modules/blog/lib/api/blog.api.ts`
- Create: `client/src/modules/blog/lib/api/index.ts`

- [ ] **Step 1: Create blog types**

Create `client/src/modules/blog/types/blog.types.ts`:

```typescript
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
```

- [ ] **Step 2: Create blog schemas**

Create `client/src/modules/blog/schemas/blog.schema.ts`:

```typescript
import { z } from 'zod';

export const createBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export type CreateBlogFormData = z.infer<typeof createBlogSchema>;
export type UpdateBlogFormData = z.infer<typeof updateBlogSchema>;
```

- [ ] **Step 3: Create blog API service**

Create `client/src/modules/blog/lib/api/blog.api.ts`:

```typescript
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
```

- [ ] **Step 4: Create API barrel**

Create `client/src/modules/blog/lib/api/index.ts`:

```typescript
export {
  getBlogs,
  getBlogById,
  getMyDrafts,
  createBlog,
  updateBlog,
  deleteBlog,
  publishDraft,
} from './blog.api';
```

- [ ] **Step 5: Commit Task 2**

```bash
git add client/src/modules/blog/types/ client/src/modules/blog/schemas/ client/src/modules/blog/lib/
git commit -m "feat(blog): add blog types, schemas, and API service"
```

Build check: `cd client && npm run build` — must pass.

---

### Task 3: Blog Module — Feed Page (List)

**Files:**
- Create: `client/src/modules/blog/hooks/useBlogFeed.ts`
- Create: `client/src/modules/blog/components/BlogCard.tsx`
- Create: `client/src/modules/blog/components/BlogFeed.tsx`
- Create: `client/src/modules/blog/page.tsx` (BlogFeedPage)
- Create: `client/src/modules/blog/index.ts` (barrel)

- [ ] **Step 1: Create useBlogFeed hook**

Create `client/src/modules/blog/hooks/useBlogFeed.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { BlogWithAuthor } from '../types/blog.types';
import { getBlogs } from '../lib/api';

interface UseBlogFeedState {
  blogs: BlogWithAuthor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlogFeed = (): UseBlogFeedState => {
  const [blogs, setBlogs] = useState<BlogWithAuthor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogs();
      setBlogs(response.blogs);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refetch: fetchBlogs };
};
```

- [ ] **Step 2: Create BlogCard component**

Create `client/src/modules/blog/components/BlogCard.tsx`:

```typescript
import React from 'react';
import { Card, Typography, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BlogWithAuthor } from '../types/blog.types';

const { Text, Paragraph } = Typography;

interface BlogCardProps {
  blog: BlogWithAuthor;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }): React.ReactElement => {
  const navigate = useNavigate();

  const contentSnippet = blog.content.length > 200
    ? blog.content.substring(0, 200) + '...'
    : blog.content;

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      onClick={() => navigate(`/blogs/${blog.id}`)}
    >
      <Card.Meta
        title={blog.title}
        description={
          <>
            <Text type="secondary">
              By {blog.author_username} &middot; {formattedDate}
            </Text>
            {blog.status === 'draft' && (
              <Tag color="orange" style={{ marginLeft: 8 }}>Draft</Tag>
            )}
            <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
              {contentSnippet}
            </Paragraph>
          </>
        }
      />
    </Card>
  );
};

export default BlogCard;
```

- [ ] **Step 3: Create BlogFeed component**

Create `client/src/modules/blog/components/BlogFeed.tsx`:

```typescript
import React from 'react';
import { Spin, Empty, Alert, Typography } from 'antd';
import BlogCard from './BlogCard';
import { useBlogFeed } from '../hooks/useBlogFeed';

const { Title } = Typography;

const BlogFeed: React.FC = (): React.ReactElement => {
  const { blogs, loading, error } = useBlogFeed();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (blogs.length === 0) {
    return (
      <Empty description="No blogs yet. Be the first to write!" />
    );
  }

  return (
    <div>
      <Title level={2}>Latest Blogs</Title>
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogFeed;
```

- [ ] **Step 4: Create blog page exports**

Create `client/src/modules/blog/page.tsx`:

```typescript
import React from 'react';
import BlogFeed from './components/BlogFeed';

export const BlogFeedPage: React.FC = (): React.ReactElement => (
  <BlogFeed />
);
```

- [ ] **Step 5: Create blog barrel**

Create `client/src/modules/blog/index.ts`:

```typescript
export { BlogFeedPage } from './page';
```

- [ ] **Step 6: Commit Task 3**

```bash
git add client/src/modules/blog/hooks/useBlogFeed.ts client/src/modules/blog/components/BlogCard.tsx client/src/modules/blog/components/BlogFeed.tsx client/src/modules/blog/page.tsx client/src/modules/blog/index.ts
git commit -m "feat(blog): add blog feed page with card components"
```

---

### Task 4: Blog Module — Detail Page

**Files:**
- Create: `client/src/modules/blog/hooks/useBlogDetail.ts`
- Create: `client/src/modules/blog/components/BlogDetailView.tsx`
- Modify: `client/src/modules/blog/page.tsx` (add BlogDetailPage)
- Modify: `client/src/modules/blog/index.ts` (add BlogDetailPage export)

- [ ] **Step 1: Create useBlogDetail hook**

Create `client/src/modules/blog/hooks/useBlogDetail.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { BlogWithAuthor } from '../types/blog.types';
import { getBlogById } from '../lib/api';

interface UseBlogDetailState {
  blog: BlogWithAuthor | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBlogDetail = (id: string): UseBlogDetailState => {
  const [blog, setBlog] = useState<BlogWithAuthor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBlogById(id);
      setBlog(response.blog);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message ?? 'Failed to load blog');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return { blog, loading, error, refetch: fetchBlog };
};
```

- [ ] **Step 2: Create BlogDetailView component**

Create `client/src/modules/blog/components/BlogDetailView.tsx`:

```typescript
import React from 'react';
import { Typography, Spin, Alert, Button, Space, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useBlogDetail } from '../hooks/useBlogDetail';
import { deleteBlog } from '../lib/api';
import { useAuth } from '../../../shared/hooks/useAuth';

const { Title, Text, Paragraph } = Typography;

interface BlogDetailViewProps {
  blogId: string;
}

const BlogDetailView: React.FC<BlogDetailViewProps> = ({ blogId }): React.ReactElement => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { blog, loading, error, refetch } = useBlogDetail(blogId);

  const isAuthor = user?.id === blog?.author_id;

  const handleDelete = async (): Promise<void> => {
    try {
      await deleteBlog(blogId);
      navigate('/');
    } catch {
      // error handled by interceptor
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !blog) {
    return <Alert type="error" message={error ?? 'Blog not found'} />;
  }

  const formattedDate = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Text type="secondary">
          By <a href={`/users/${blog.author_id}`}>{blog.author_username}</a>
          &middot; {formattedDate}
        </Text>
      </Space>
      <Title>{blog.title}</Title>
      {isAuthor && (
        <Space style={{ marginBottom: 16 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/blogs/${blog.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this blog?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Delete"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      )}
      <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: 1.8 }}>
        {blog.content}
      </Paragraph>
    </div>
  );
};

export default BlogDetailView;
```

- [ ] **Step 3: Update blog page.tsx**

Modify `client/src/modules/blog/page.tsx` — add BlogDetailPage:

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import BlogFeed from './components/BlogFeed';
import BlogDetailView from './components/BlogDetailView';

export const BlogFeedPage: React.FC = (): React.ReactElement => (
  <BlogFeed />
);

export const BlogDetailPage: React.FC = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Blog ID is required</div>;
  return <BlogDetailView blogId={id} />;
};
```

- [ ] **Step 4: Update blog barrel**

Modify `client/src/modules/blog/index.ts`:

```typescript
export { BlogFeedPage, BlogDetailPage } from './page';
```

- [ ] **Step 5: Commit Task 4**

```bash
git add client/src/modules/blog/hooks/useBlogDetail.ts client/src/modules/blog/components/BlogDetailView.tsx client/src/modules/blog/page.tsx client/src/modules/blog/index.ts
git commit -m "feat(blog): add blog detail page with author actions"
```

---

### Task 5: Blog Module — Create & Edit Pages

**Files:**
- Create: `client/src/modules/blog/hooks/useBlogMutations.ts`
- Create: `client/src/modules/blog/components/BlogForm.tsx`
- Modify: `client/src/modules/blog/page.tsx` (add BlogCreatePage, BlogEditPage)
- Modify: `client/src/modules/blog/index.ts` (add exports)

- [ ] **Step 1: Create useBlogMutations hook**

Create `client/src/modules/blog/hooks/useBlogMutations.ts`:

```typescript
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
```

- [ ] **Step 2: Create BlogForm component**

Create `client/src/modules/blog/components/BlogForm.tsx`:

```typescript
import React from 'react';
import { Form, Input, Button, Select, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Blog, CreateBlogPayload, UpdateBlogPayload } from '../types/blog.types';
import { useBlogMutations } from '../hooks/useBlogMutations';

const { Title } = Typography;
const { TextArea } = Input;

interface BlogFormProps {
  mode: 'create' | 'edit';
  initialData?: Blog;
}

interface BlogFormValues {
  title: string;
  content: string;
  status: 'draft' | 'published';
}

const BlogForm: React.FC<BlogFormProps> = ({ mode, initialData }): React.ReactElement => {
  const navigate = useNavigate();
  const { creating, updating, create, update, error } = useBlogMutations();
  const [form] = Form.useForm<BlogFormValues>();

  const onFinish = async (values: BlogFormValues): Promise<void> => {
    if (mode === 'create') {
      const payload: CreateBlogPayload = {
        title: values.title,
        content: values.content,
        status: values.status,
      };
      const blog = await create(payload);
      if (blog) {
        navigate(`/blogs/${blog.id}`);
      }
    } else if (initialData) {
      const payload: UpdateBlogPayload = {
        title: values.title,
        content: values.content,
        status: values.status,
      };
      const blog = await update(initialData.id, payload);
      if (blog) {
        navigate(`/blogs/${blog.id}`);
      }
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Title level={2}>{mode === 'create' ? 'Write a new blog' : 'Edit blog'}</Title>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Form<BlogFormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={
          initialData
            ? { title: initialData.title, content: initialData.content, status: initialData.status }
            : { status: 'draft' }
        }
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Title is required' },
            { max: 255, message: 'Title must be 255 characters or less' },
          ]}
        >
          <Input size="large" placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Content is required' }]}
        >
          <TextArea rows={12} placeholder="Write your blog content here..." />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="draft">Save as Draft</Select.Option>
            <Select.Option value="published">Publish</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mode === 'create' ? creating : updating}
            size="large"
          >
            {mode === 'create' ? 'Create Blog' : 'Save Changes'}
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(-1)}
            size="large"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlogForm;
```

- [ ] **Step 3: Update blog page.tsx**

Modify `client/src/modules/blog/page.tsx` — add BlogCreatePage and BlogEditPage:

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import BlogFeed from './components/BlogFeed';
import BlogDetailView from './components/BlogDetailView';
import BlogForm from './components/BlogForm';
import { useBlogDetail } from './hooks/useBlogDetail';
import { Spin } from 'antd';

export const BlogFeedPage: React.FC = (): React.ReactElement => (
  <BlogFeed />
);

export const BlogDetailPage: React.FC = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div>Blog ID is required</div>;
  return <BlogDetailView blogId={id} />;
};

export const BlogCreatePage: React.FC = (): React.ReactElement => (
  <BlogForm mode="create" />
);

export const BlogEditPage: React.FC = (): React.ReactElement => {
  const { id } = useParams<{ id: string }>();
  const { blog, loading } = useBlogDetail(id ?? '');

  if (loading) return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  if (!blog) return <div>Blog not found</div>;

  return <BlogForm mode="edit" initialData={blog} />;
};
```

Note: BlogEditPage reuses the `useBlogDetail` hook from Task 4. `BlogDraftsPage` will be added in Task 6.

- [ ] **Step 4: Update blog barrel**

Modify `client/src/modules/blog/index.ts`:

```typescript
export { BlogFeedPage, BlogDetailPage, BlogCreatePage, BlogEditPage } from './page';
```

- [ ] **Step 5: Commit Task 5**

```bash
git add client/src/modules/blog/hooks/useBlogMutations.ts client/src/modules/blog/components/BlogForm.tsx client/src/modules/blog/page.tsx client/src/modules/blog/index.ts
git commit -m "feat(blog): add create and edit blog pages with form"
```

---

### Task 6: Blog Module — Drafts List Page

**Files:**
- Create: `client/src/modules/blog/hooks/useDraftList.ts`
- Create: `client/src/modules/blog/components/DraftCard.tsx`
- Create: `client/src/modules/blog/components/DraftList.tsx`

- [ ] **Step 1: Create useDraftList hook**

Create `client/src/modules/blog/hooks/useDraftList.ts`:

```typescript
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
```

- [ ] **Step 2: Create DraftCard component**

Create `client/src/modules/blog/components/DraftCard.tsx`:

```typescript
import React from 'react';
import { Card, Typography, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types/blog.types';
import { deleteBlog, publishDraft } from '../lib/api';

const { Text, Paragraph } = Typography;

interface DraftCardProps {
  draft: Blog;
  onAction: () => void;
}

const DraftCard: React.FC<DraftCardProps> = ({ draft, onAction }): React.ReactElement => {
  const navigate = useNavigate();

  const handlePublish = async (): Promise<void> => {
    await publishDraft(draft.id);
    onAction();
  };

  const handleDelete = async (): Promise<void> => {
    await deleteBlog(draft.id);
    onAction();
  };

  const contentSnippet = draft.content.length > 150
    ? draft.content.substring(0, 150) + '...'
    : draft.content;

  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Meta
        title={draft.title}
        description={
          <>
            <Text type="secondary">
              Last updated: {new Date(draft.updated_at).toLocaleDateString()}
            </Text>
            <Paragraph style={{ marginTop: 8, marginBottom: 0 }}>
              {contentSnippet}
            </Paragraph>
          </>
        }
      />
      <Space style={{ marginTop: 12 }}>
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => navigate(`/blogs/${draft.id}/edit`)}
        >
          Edit
        </Button>
        <Button
          size="small"
          type="primary"
          icon={<SendOutlined />}
          onClick={handlePublish}
        >
          Publish
        </Button>
        <Popconfirm title="Delete this draft?" onConfirm={handleDelete}>
          <Button size="small" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      </Space>
    </Card>
  );
};

export default DraftCard;
```

- [ ] **Step 3: Create DraftList component (also acts as DraftListPage)**

Create `client/src/modules/blog/components/DraftList.tsx`:

```typescript
import React from 'react';
import { Typography, Spin, Empty, Alert } from 'antd';
import DraftCard from './DraftCard';
import { useDraftList } from '../hooks/useDraftList';

const { Title } = Typography;

export const BlogDraftsPage: React.FC = (): React.ReactElement => {
  const { drafts, loading, error, refetch } = useDraftList();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  if (drafts.length === 0) {
    return <Empty description="No drafts yet" />;
  }

  return (
    <div>
      <Title level={2}>My Drafts</Title>
      {drafts.map((draft) => (
        <DraftCard key={draft.id} draft={draft} onAction={refetch} />
      ))}
    </div>
  );
};
```

Note: `BlogDraftsPage` is exported directly from this file and re-exported via `page.tsx` and `index.ts` barrels.

- [ ] **Step 4: Update page.tsx and barrel with BlogDraftsPage**

Modify `client/src/modules/blog/page.tsx` — append `BlogDraftsPage` re-export at the end:

```typescript
// (existing content stays unchanged)
export { BlogDraftsPage } from './components/DraftList';
```

Modify `client/src/modules/blog/index.ts` — add `BlogDraftsPage` to the export:

```typescript
export { BlogFeedPage, BlogDetailPage, BlogCreatePage, BlogEditPage, BlogDraftsPage } from './page';
```

- [ ] **Step 5: Commit Task 6**

```bash
git add client/src/modules/blog/hooks/useDraftList.ts client/src/modules/blog/components/DraftCard.tsx client/src/modules/blog/components/DraftList.tsx client/src/modules/blog/page.tsx client/src/modules/blog/index.ts
git commit -m "feat(blog): add drafts list page with publish/delete actions"
```

---

### Task 7: User Module — Types, Schema, API Service

**Files:**
- Create: `client/src/modules/user/types/user.types.ts`
- Create: `client/src/modules/user/schemas/user.schema.ts`
- Create: `client/src/modules/user/lib/api/user.api.ts`
- Create: `client/src/modules/user/lib/api/index.ts`
- Create: `client/src/modules/user/index.ts`

- [ ] **Step 1: Create user types**

Create `client/src/modules/user/types/user.types.ts`:

```typescript
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  created_at: string;
  published_blog_count: number;
}

export interface UserProfileWithFollow extends UserProfile {
  is_following: boolean;
}

export interface UpdateProfilePayload {
  username?: string;
  bio?: string;
}

export interface FollowWithProfile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  created_at: string;
}

export interface UserProfileResponse {
  profile: UserProfile;
}

export interface UserProfileWithFollowResponse {
  profile: UserProfileWithFollow;
}

export interface FollowListResponse {
  followers?: FollowWithProfile[];
  following?: FollowWithProfile[];
}

export interface FollowStatusResponse {
  following: boolean;
}

export interface UpdateProfileResponse {
  message: string;
  profile: UserProfile;
}
```

- [ ] **Step 2: Create user schemas**

Create `client/src/modules/user/schemas/user.schema.ts`:

```typescript
import { z } from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username must be 50 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
```

- [ ] **Step 3: Create user API service**

Create `client/src/modules/user/lib/api/user.api.ts`:

```typescript
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
```

- [ ] **Step 4: Create API barrel**

Create `client/src/modules/user/lib/api/index.ts`:

```typescript
export {
  getUserProfile,
  getCurrentUser,
  updateProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getFollowStatus,
} from './user.api';
```

- [ ] **Step 5: Create user barrel**

Create `client/src/modules/user/index.ts`:

```typescript
export { UserProfilePage, EditProfilePage, UserFollowersPage, UserFollowingPage } from './page';
```

- [ ] **Step 6: Commit Task 7**

```bash
git add client/src/modules/user/types/ client/src/modules/user/schemas/ client/src/modules/user/lib/ client/src/modules/user/index.ts
git commit -m "feat(user): add user types, schemas, and API service"
```

Build check: `cd client && npm run build` — must pass.

---

### Task 8: User Module — Profile Page with Follow

**Files:**
- Create: `client/src/modules/user/hooks/useUserProfile.ts`
- Create: `client/src/modules/user/hooks/useFollowAction.ts`
- Create: `client/src/modules/user/components/ProfileCard.tsx`
- Create: `client/src/modules/user/components/FollowButton.tsx`
- Create: `client/src/modules/user/page.tsx` (UserProfilePage)

- [ ] **Step 1: Create useUserProfile hook**

Create `client/src/modules/user/hooks/useUserProfile.ts`:

```typescript
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
```

- [ ] **Step 2: Create useFollowAction hook**

Create `client/src/modules/user/hooks/useFollowAction.ts`:

```typescript
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
```

- [ ] **Step 3: Create ProfileCard component**

Create `client/src/modules/user/components/ProfileCard.tsx`:

```typescript
import React from 'react';
import { Card, Typography, Descriptions, Button } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { UserProfileWithFollow } from '../types/user.types';
import FollowButton from './FollowButton';

const { Title, Paragraph } = Typography;

interface ProfileCardProps {
  profile: UserProfileWithFollow;
  onFollowChange: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onFollowChange }): React.ReactElement => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwnProfile = user?.id === profile.id;

  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            <UserOutlined />
          </div>
          <Title level={3} style={{ marginBottom: 4 }}>{profile.username}</Title>
          {profile.bio && (
            <Paragraph type="secondary" style={{ marginBottom: 8 }}>
              {profile.bio}
            </Paragraph>
          )}
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="Joined">{joinDate}</Descriptions.Item>
            <Descriptions.Item label="Blogs published">
              {profile.published_blog_count}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <div>
          {isOwnProfile ? (
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate('/profile/edit')}
            >
              Edit Profile
            </Button>
          ) : (
            <FollowButton
              userId={profile.id}
              onFollowChange={onFollowChange}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProfileCard;
```

- [ ] **Step 4: Create FollowButton component**

Create `client/src/modules/user/components/FollowButton.tsx`:

```typescript
import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useFollowAction } from '../hooks/useFollowAction';

interface FollowButtonProps {
  userId: string;
  onFollowChange?: () => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, onFollowChange }): React.ReactElement => {
  const { isAuthenticated } = useAuth();
  const { isFollowing, loading, toggleFollow, checkStatus } = useFollowAction(userId);

  useEffect(() => {
    if (isAuthenticated) {
      checkStatus();
    }
  }, [isAuthenticated, checkStatus]);

  if (!isAuthenticated) return null;

  const handleClick = async (): Promise<void> => {
    await toggleFollow();
    onFollowChange?.();
  };

  return (
    <Button
      type={isFollowing ? 'default' : 'primary'}
      loading={loading}
      onClick={handleClick}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
```

- [ ] **Step 5: Create user page exports**

Create `client/src/modules/user/page.tsx`:

```typescript
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useUserProfile } from './hooks/useUserProfile';
import ProfileCard from './components/ProfileCard';

const { Title } = Typography;

export const UserProfilePage: React.FC = (): React.ReactElement => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { profile, loading, error, refetch } = useUserProfile(userId ?? '');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  }

  if (error || !profile) {
    return <Alert type="error" message={error ?? 'User not found'} />;
  }

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>
      <ProfileCard profile={profile} onFollowChange={refetch} />
      <div style={{ marginTop: 24 }}>
        <Title level={4}>Published Blogs</Title>
        <p>Blog list for this user will go here.</p>
      </div>
    </div>
  );
};

// Placeholder exports — full implementation in Task 9
export const EditProfilePage: React.FC = (): React.ReactElement => <div>Edit profile coming soon</div>;
export const UserFollowersPage: React.FC = (): React.ReactElement => <div>Followers coming soon</div>;
export const UserFollowingPage: React.FC = (): React.ReactElement => <div>Following coming soon</div>;
```

- [ ] **Step 6: Commit Task 8**

```bash
git add client/src/modules/user/hooks/useUserProfile.ts client/src/modules/user/hooks/useFollowAction.ts client/src/modules/user/components/ProfileCard.tsx client/src/modules/user/components/FollowButton.tsx client/src/modules/user/page.tsx
git commit -m "feat(user): add user profile page with follow button"
```

---

### Task 9: User Module — Edit Profile & Followers/Following

**Files:**
- Create: `client/src/modules/user/hooks/useEditProfile.ts`
- Create: `client/src/modules/user/hooks/useFollowList.ts`
- Create: `client/src/modules/user/components/ProfileEditForm.tsx`
- Create: `client/src/modules/user/components/FollowersList.tsx`
- Create: `client/src/modules/user/components/FollowingList.tsx`
- Modify: `client/src/modules/user/page.tsx` (replace placeholders)

- [ ] **Step 1: Create useEditProfile hook**

Create `client/src/modules/user/hooks/useEditProfile.ts`:

```typescript
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
```

- [ ] **Step 2: Create useFollowList hook**

Create `client/src/modules/user/hooks/useFollowList.ts`:

```typescript
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
```

- [ ] **Step 3: Create ProfileEditForm component**

Create `client/src/modules/user/components/ProfileEditForm.tsx`:

```typescript
import React from 'react';
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEditProfile } from '../hooks/useEditProfile';

const { Title } = Typography;
const { TextArea } = Input;

interface ProfileEditFormValues {
  username: string;
  bio: string;
}

const ProfileEditForm: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { profile, loading, saving, error, save } = useEditProfile();
  const [form] = Form.useForm<ProfileEditFormValues>();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  }

  const onFinish = async (values: ProfileEditFormValues): Promise<void> => {
    const payload = {
      ...(values.username !== profile?.username ? { username: values.username } : {}),
      ...(values.bio !== (profile?.bio ?? '') ? { bio: values.bio } : {}),
    };
    if (Object.keys(payload).length === 0) {
      navigate(-1);
      return;
    }
    const success = await save(payload);
    if (success) {
      navigate(-1);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <Title level={2}>Edit Profile</Title>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Form<ProfileEditFormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          username: profile?.username ?? '',
          bio: profile?.bio ?? '',
        }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 1, message: 'Username is required' },
            { max: 50, message: 'Username must be 50 characters or less' },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="bio"
          label="Bio"
          rules={[{ max: 500, message: 'Bio must be 500 characters or less' }]}
        >
          <TextArea rows={4} placeholder="Tell us about yourself..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} size="large">
            Save Changes
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)} size="large">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
```

- [ ] **Step 4: Create FollowersList and FollowingList components**

Create `client/src/modules/user/components/FollowersList.tsx`:

```typescript
import React from 'react';
import { List, Avatar, Typography, Spin, Empty, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useFollowList } from '../hooks/useFollowList';

const { Title } = Typography;

export const UserFollowersPage: React.FC = (): React.ReactElement => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, loading, error } = useFollowList(userId ?? '', 'followers');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div>
      <Title level={3}>Followers</Title>
      {users.length === 0 ? (
        <Empty description="No followers yet" />
      ) : (
        <List
          dataSource={users}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/users/${item.user_id}`)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.username}
                description={item.bio}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
```

Create `client/src/modules/user/components/FollowingList.tsx`:

```typescript
import React from 'react';
import { List, Avatar, Typography, Spin, Empty, Alert } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useFollowList } from '../hooks/useFollowList';

const { Title } = Typography;

export const UserFollowingPage: React.FC = (): React.ReactElement => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { users, loading, error } = useFollowList(userId ?? '', 'following');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div>
      <Title level={3}>Following</Title>
      {users.length === 0 ? (
        <Empty description="Not following anyone yet" />
      ) : (
        <List
          dataSource={users}
          renderItem={(item) => (
            <List.Item
              onClick={() => navigate(`/users/${item.user_id}`)}
              style={{ cursor: 'pointer' }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={item.username}
                description={item.bio}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};
```

- [ ] **Step 5: Update user page.tsx with real implementations**

Modify `client/src/modules/user/page.tsx` (replace the placeholder exports):

```typescript
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Alert, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useUserProfile } from './hooks/useUserProfile';
import ProfileCard from './components/ProfileCard';
import ProfileEditForm from './components/ProfileEditForm';

const { Title } = Typography;

export const UserProfilePage: React.FC = (): React.ReactElement => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { profile, loading, error, refetch } = useUserProfile(userId ?? '');

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  }

  if (error || !profile) {
    return <Alert type="error" message={error ?? 'User not found'} />;
  }

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Back
      </Button>
      <ProfileCard profile={profile} onFollowChange={refetch} />
      <div style={{ marginTop: 24 }}>
        <Title level={4}>Published Blogs</Title>
        <p>Blog list for this user will go here.</p>
      </div>
    </div>
  );
};

export const EditProfilePage: React.FC = (): React.ReactElement => (
  <ProfileEditForm />
);

export { UserFollowersPage } from './components/FollowersList';
export { UserFollowingPage } from './components/FollowingList';
```

- [ ] **Step 6: Commit Task 9**

```bash
git add client/src/modules/user/hooks/useEditProfile.ts client/src/modules/user/hooks/useFollowList.ts client/src/modules/user/components/ProfileEditForm.tsx client/src/modules/user/components/FollowersList.tsx client/src/modules/user/components/FollowingList.tsx client/src/modules/user/page.tsx
git commit -m "feat(user): add edit profile, followers, and following pages"
```

---

### Task 10: Wire Everything in App.tsx

**Files:**
- Modify: `client/src/App.tsx`
- Modify: `client/src/modules/home/page.tsx` (enhanced landing)

- [ ] **Step 1: Update App.tsx with all routes**

Replace `client/src/App.tsx`:

```typescript
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { LoginPage, RegisterPage } from './modules/auth';
import { BlogFeedPage, BlogDetailPage, BlogCreatePage, BlogEditPage, BlogDraftsPage } from './modules/blog';
import { UserProfilePage, EditProfilePage, UserFollowersPage, UserFollowingPage } from './modules/user';
import AppLayout from './shared/components/AppLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';

const App: React.FC = (): React.ReactElement => (
  <ConfigProvider>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<BlogFeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Blog routes */}
          <Route path="/blogs" element={<BlogFeedPage />} />
          <Route path="/blogs/new" element={
            <ProtectedRoute><BlogCreatePage /></ProtectedRoute>
          } />
          <Route path="/blogs/drafts" element={
            <ProtectedRoute><BlogDraftsPage /></ProtectedRoute>
          } />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/blogs/:id/edit" element={
            <ProtectedRoute><BlogEditPage /></ProtectedRoute>
          } />

          {/* User routes */}
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/users/:userId/followers" element={<UserFollowersPage />} />
          <Route path="/users/:userId/following" element={<UserFollowingPage />} />
          <Route path="/profile/edit" element={
            <ProtectedRoute><EditProfilePage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
```

- [ ] **Step 2: Update home page (optional — redirect or simplify)**

Modify `client/src/modules/home/page.tsx` to be a simple splash/hero or remove it. Since the root `/` now shows `BlogFeedPage` in App.tsx, the home page is no longer used. Consider removing the home module or keeping it for future use.

No change needed — the home module stays but is no longer rendered at `/`. It can be removed in a cleanup task.

- [ ] **Step 3: Build and verify**

```bash
cd client && npm run build
```

Expected: TypeScript compiles with zero errors. Vite builds successfully.

- [ ] **Step 4: Commit Task 10**

```bash
git add client/src/App.tsx
git commit -m "feat: wire all modules into App.tsx with routing"
```

---

## Verification

After all tasks, run:

```bash
# Full build check
cd client && npm run build

# Full server test check (ensure nothing broke)
cd server && npm run test

# Lint check
cd client && npm run lint
```

All must pass with zero errors.

## Future Considerations (not in scope)

- **Bookmarks** — Bookmark toggle on BlogCard and BlogDetailView, plus a `/bookmarks` page. Since bookmark API requires auth, this needs a new module or can be added to the blog module.
- **User's published blogs on profile page** — Can use `getBlogs({ authorId })` and display in a tab on the profile page.
- **react-hook-form migration** — Existing auth forms use antd Form. A future task should migrate them to react-hook-form + zodResolver to match module-structure.md rules.
- **Home module cleanup** — After routing is finalized, the home module can be removed if no longer needed.
