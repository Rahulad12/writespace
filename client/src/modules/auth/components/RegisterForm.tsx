import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { register as registerApi } from '../services/auth.service';
import { useAuth } from '../../../shared/hooks/useAuth';
import { useAuthForm } from '../hooks/useAuthForm';
import { RegisterPayload } from '../types';

interface RegisterFormProps {
  onSuccess?: () => void;
}

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }): React.ReactElement => {
  const { login: authLogin } = useAuth();
  const { loading, setLoading, handleError } = useAuthForm();

  const onFinish = async (values: RegisterFormValues): Promise<void> => {
    setLoading(true);
    try {
      const registerData: RegisterPayload = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      const { token, user } = await registerApi(registerData);
      authLogin(token, user);
      onSuccess?.();
    } catch (err: unknown) {
      handleError(err, 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<RegisterFormValues>
      name="register"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Please enter a username' },
          { min: 3, message: 'Username must be at least 3 characters' },
          { max: 50, message: 'Username must be 50 characters or less' },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder="Username"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email address' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please enter a password' },
          { min: 8, message: 'Password must be at least 8 characters' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Password"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_: unknown, value: string): Promise<void> {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm password"
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          block
        >
          Create account
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
