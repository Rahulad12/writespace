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
