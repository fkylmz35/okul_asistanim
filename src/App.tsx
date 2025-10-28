import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import DocumentGeneratorPage from './pages/DocumentGeneratorPage';
import ProfilePage from './pages/ProfilePage';
import LGSPage from './pages/LGSPage';
import YKSPage from './pages/YKSPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ChatPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/documents" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DocumentsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/documents/generator" element={
                <ProtectedRoute>
                  <MainLayout>
                    <DocumentGeneratorPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/lgs" element={
                <ProtectedRoute>
                  <MainLayout>
                    <LGSPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/yks" element={
                <ProtectedRoute>
                  <MainLayout>
                    <YKSPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;