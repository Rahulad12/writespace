import React from 'react';
import { Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';

const { Title, Paragraph } = Typography;

const HomePage: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div style={styles.container}>
      <Title>Welcome to WriteSpace</Title>
      <Paragraph>
        A platform for writers to share their thoughts and connect with others.
      </Paragraph>

      {isAuthenticated ? (
        <Space>
          <Paragraph>
            Logged in as <strong>{user?.username}</strong>
          </Paragraph>
          <Button onClick={logout}>Logout</Button>
        </Space>
      ) : (
        <Space>
          <Button type="primary" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button onClick={() => navigate('/register')}>
            Register
          </Button>
        </Space>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 800,
    margin: '0 auto',
    padding: '48px 24px',
  },
};

export default HomePage;
