import React from 'react';
import { Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const { Title, Text } = Typography;

interface AuthPageProps {
  mode: 'login' | 'register';
}

const AuthPage: React.FC<AuthPageProps> = ({ mode }): React.ReactElement => {
  const navigate = useNavigate();

  const handleSuccess = (): void => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        {mode === 'login' ? (
          <>
            <Title level={2} style={styles.title}>
              Welcome back
            </Title>
            <Text type="secondary">Sign in to your WriteSpace account</Text>
            <LoginForm onSuccess={handleSuccess} />
            <Text>
              Don&apos;t have an account?{' '}
              <Link to="/register">Sign up</Link>
            </Text>
          </>
        ) : (
          <>
            <Title level={2} style={styles.title}>
              Create an account
            </Title>
            <Text type="secondary">Join WriteSpace to start writing</Text>
            <RegisterForm onSuccess={handleSuccess} />
            <Text>
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </Text>
          </>
        )}
      </Card>
    </div>
  );
};

export const LoginPage: React.FC = (): React.ReactElement => (
  <AuthPage mode="login" />
);

export const RegisterPage: React.FC = (): React.ReactElement => (
  <AuthPage mode="register" />
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
};
