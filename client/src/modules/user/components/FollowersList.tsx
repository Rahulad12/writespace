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
