import React from 'react';
import { Form, Input, Button, Typography, Alert, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEditProfile } from '../hooks/useEditProfile';

const { Title } = Typography;
const { TextArea } = Input;

interface ProfileEditFormValues {
  username: string;
  bio: string;
}

const ProfileEditForm: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { profile, loading, saving, error, save } = useEditProfile();
  const [form] = Form.useForm<ProfileEditFormValues>();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>;
  }

  const onFinish = async (values: ProfileEditFormValues): Promise<void> => {
    const payload = {
      ...(values.username !== profile?.username ? { username: values.username } : {}),
      ...(values.bio !== (profile?.bio ?? '') ? { bio: values.bio } : {}),
    };
    if (Object.keys(payload).length === 0) {
      navigate(-1);
      return;
    }
    const success = await save(payload);
    if (success) {
      navigate(-1);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <Title level={2}>Edit Profile</Title>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Form<ProfileEditFormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          username: profile?.username ?? '',
          bio: profile?.bio ?? '',
        }}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 1, message: 'Username is required' },
            { max: 50, message: 'Username must be 50 characters or less' },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          name="bio"
          label="Bio"
          rules={[{ max: 500, message: 'Bio must be 500 characters or less' }]}
        >
          <TextArea rows={4} placeholder="Tell us about yourself..." />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={saving} size="large">
            Save Changes
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(-1)} size="large">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfileEditForm;
