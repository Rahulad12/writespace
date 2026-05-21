import React, { useEffect } from 'react';
import { Layout, Spin } from 'antd';
import Navbar from './Navbar';
import { useAuth, loadUser } from '../hooks/useAuth';

const { Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }): React.ReactElement => {
  const { isInitialized, token } = useAuth();

  useEffect(() => {
    loadUser();
  }, []);

  if (!isInitialized && !!token) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Content style={{ padding: '24px', maxWidth: 960, width: '100%', margin: '0 auto' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        WriteSpace &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default AppLayout;
