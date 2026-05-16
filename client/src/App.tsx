import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { LoginPage, RegisterPage } from './modules/auth';
import { HomePage } from './modules/home';
import ProtectedRoute from './shared/components/ProtectedRoute';

const App: React.FC = (): React.ReactElement => (
  <ConfigProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page</div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
