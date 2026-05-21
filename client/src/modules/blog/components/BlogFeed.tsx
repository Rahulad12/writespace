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
