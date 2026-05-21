import React from 'react';
import { Layout, Menu, Button, Space, Dropdown } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, BookOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

const { Header } = Layout;

const Navbar: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const menuItems: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: ROUTES.HOME, label: 'Home', icon: <FileTextOutlined /> },
  ];

  if (isAuthenticated) {
    menuItems.push(
      { key: ROUTES.BLOG_NEW, label: 'Write', icon: <EditOutlined /> },
      { key: ROUTES.BLOG_DRAFTS, label: 'Drafts', icon: <BookOutlined /> },
    );
  }

  const handleLogout = (): void => {
    logout();
    navigate(ROUTES.HOME);
  };

  const pathPrefix = '/' + location.pathname.split('/').filter(Boolean)[0];
  const selectedKey = (pathPrefix === '/blogs' && location.pathname.includes('/drafts'))
    ? ROUTES.BLOG_DRAFTS
    : (pathPrefix || ROUTES.HOME);

  return (
    <Header style={styles.header}>
      <div style={styles.logo} onClick={() => navigate(ROUTES.HOME)}>
        WriteSpace
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey] as string[]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ flex: 1, minWidth: 0 }}
      />
      <Space>
        {isAuthenticated ? (
          <Dropdown
            menu={{
              items: [
                { key: 'profile', label: 'My Profile', icon: <UserOutlined /> },
                { key: 'edit-profile', label: 'Edit Profile', icon: <UserOutlined /> },
                { type: 'divider' },
                { key: 'logout', label: 'Logout', danger: true },
              ],
              onClick: ({ key }) => {
                if (key === 'logout') handleLogout();
                else if (key === 'profile') navigate(ROUTES.USER_PROFILE.replace(':userId', user?.id ?? ''));
                else if (key === 'edit-profile') navigate(ROUTES.EDIT_PROFILE);
              },
            }}
          >
            <Button type="text" style={{ color: '#fff' }}>
              <UserOutlined /> {user?.username}
            </Button>
          </Dropdown>
        ) : (
          <Space>
            <Button type="text" style={{ color: '#fff' }} onClick={() => navigate(ROUTES.LOGIN)}>
              Login
            </Button>
            <Button ghost onClick={() => navigate(ROUTES.REGISTER)}>
              Register
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  );
};

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 24,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};

export default Navbar;
