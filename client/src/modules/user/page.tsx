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
