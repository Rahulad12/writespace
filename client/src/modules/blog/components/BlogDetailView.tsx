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
  const { blog, loading, error } = useBlogDetail(blogId);

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
