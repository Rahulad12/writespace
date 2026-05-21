import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { LoginPage, RegisterPage } from './modules/auth';
import { BlogFeedPage, BlogDetailPage, BlogCreatePage, BlogEditPage, BlogDraftsPage } from './modules/blog';
import { UserProfilePage, EditProfilePage, UserFollowersPage, UserFollowingPage } from './modules/user';
import AppLayout from './shared/components/AppLayout';
import ProtectedRoute from './shared/components/ProtectedRoute';

const App: React.FC = (): React.ReactElement => (
  <ConfigProvider>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<BlogFeedPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Blog routes */}
          <Route path="/blogs" element={<BlogFeedPage />} />
          <Route path="/blogs/new" element={
            <ProtectedRoute><BlogCreatePage /></ProtectedRoute>
          } />
          <Route path="/blogs/drafts" element={
            <ProtectedRoute><BlogDraftsPage /></ProtectedRoute>
          } />
          <Route path="/blogs/:id" element={<BlogDetailPage />} />
          <Route path="/blogs/:id/edit" element={
            <ProtectedRoute><BlogEditPage /></ProtectedRoute>
          } />

          {/* User routes */}
          <Route path="/users/:userId" element={<UserProfilePage />} />
          <Route path="/users/:userId/followers" element={<UserFollowersPage />} />
          <Route path="/users/:userId/following" element={<UserFollowingPage />} />
          <Route path="/profile/edit" element={
            <ProtectedRoute><EditProfilePage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
