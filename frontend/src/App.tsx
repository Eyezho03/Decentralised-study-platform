import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CanisterProvider } from './contexts/CanisterContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudyGroups from './pages/StudyGroups';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import CreateGroup from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * Main App component with routing and authentication
 */
function App() {
  return (
    <CanisterProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
                <Route path="/groups/create" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
                <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
                <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </CanisterProvider>
  );
}

/**
 * Protected route component that requires authentication
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;
