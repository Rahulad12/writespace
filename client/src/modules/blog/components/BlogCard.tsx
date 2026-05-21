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
