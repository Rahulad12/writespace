import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import BlogFeed from './components/BlogFeed';
import BlogDetailView from './components/BlogDetailView';
import BlogForm from './components/BlogForm';
import { useBlogDetail } from './hooks/useBlogDetail';

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
  const navigate = useNavigate();
  const { blog, loading } = useBlogDetail(id ?? '');

  if (loading) return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  if (!blog) {
    navigate('/');
    return <div />;
  }

  return <BlogForm mode="edit" initialData={blog} />;
};

export { BlogDraftsPage } from './components/DraftList';
