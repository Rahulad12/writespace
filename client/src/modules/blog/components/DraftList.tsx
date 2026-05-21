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
