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
