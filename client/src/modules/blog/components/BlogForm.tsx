import React from 'react';
import { Form, Input, Button, Select, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Blog, CreateBlogPayload, UpdateBlogPayload } from '../types/blog.types';
import { useBlogMutations } from '../hooks/useBlogMutations';

const { Title } = Typography;
const { TextArea } = Input;

interface BlogFormProps {
  mode: 'create' | 'edit';
  initialData?: Blog;
}

interface BlogFormValues {
  title: string;
  content: string;
  status: 'draft' | 'published';
}

const BlogForm: React.FC<BlogFormProps> = ({ mode, initialData }): React.ReactElement => {
  const navigate = useNavigate();
  const { creating, updating, create, update, error } = useBlogMutations();
  const [form] = Form.useForm<BlogFormValues>();

  const onFinish = async (values: BlogFormValues): Promise<void> => {
    if (mode === 'create') {
      const payload: CreateBlogPayload = {
        title: values.title,
        content: values.content,
        status: values.status,
      };
      const blog = await create(payload);
      if (blog) {
        navigate(`/blogs/${blog.id}`);
      }
    } else if (initialData) {
      const payload: UpdateBlogPayload = {
        title: values.title,
        content: values.content,
        status: values.status,
      };
      const blog = await update(initialData.id, payload);
      if (blog) {
        navigate(`/blogs/${blog.id}`);
      }
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Title level={2}>{mode === 'create' ? 'Write a new blog' : 'Edit blog'}</Title>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      <Form<BlogFormValues>
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={
          initialData
            ? { title: initialData.title, content: initialData.content, status: initialData.status }
            : { status: 'draft' }
        }
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Title is required' },
            { max: 255, message: 'Title must be 255 characters or less' },
          ]}
        >
          <Input size="large" placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: 'Content is required' }]}
        >
          <TextArea rows={12} placeholder="Write your blog content here..." />
        </Form.Item>

        <Form.Item name="status" label="Status">
          <Select>
            <Select.Option value="draft">Save as Draft</Select.Option>
            <Select.Option value="published">Publish</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={mode === 'create' ? creating : updating}
            size="large"
          >
            {mode === 'create' ? 'Create Blog' : 'Save Changes'}
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            onClick={() => navigate(-1)}
            size="large"
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BlogForm;
