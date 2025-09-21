import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CanisterProvider } from './contexts/CanisterContext';
import { DataProvider } from './contexts/DataContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudyGroups from './pages/StudyGroups';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import CreateGroup from './pages/CreateGroup';
import GroupDetail from './pages/GroupDetail';
import Sessions from './pages/Sessions';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import GamificationPage from './pages/GamificationPage';
import CollaborativeDocuments from './pages/CollaborativeDocuments';
import OfflinePage from './pages/OfflinePage';
import MobileApp from './components/MobileApp';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * Main App component with routing and authentication
 */
function App() {
  const [showMobileApp, setShowMobileApp] = useState(false);
  const [showPWAInstall, setShowPWAInstall] = useState(false);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Check for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setShowPWAInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <CanisterProvider>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <Navbar />
                <main className="container mx-auto px-4 py-4 md:py-8">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/groups" element={<ProtectedRoute><StudyGroups /></ProtectedRoute>} />
                    <Route path="/groups/create" element={<ProtectedRoute><CreateGroup /></ProtectedRoute>} />
                    <Route path="/groups/:id" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
                    <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
                    <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
                    <Route path="/ai-recommendations" element={<ProtectedRoute><AIRecommendationsPage /></ProtectedRoute>} />
                    <Route path="/gamification" element={<ProtectedRoute><GamificationPage /></ProtectedRoute>} />
                    <Route path="/documents" element={<ProtectedRoute><CollaborativeDocuments /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/offline" element={<OfflinePage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </Router>

            {/* Mobile App Modal */}
            <MobileApp
              isOpen={showMobileApp}
              onClose={() => setShowMobileApp(false)}
            />

            {/* PWA Install Prompt */}
            <PWAInstallPrompt
              isOpen={showPWAInstall}
              onClose={() => setShowPWAInstall(false)}
            />
          </NotificationProvider>
        </DataProvider>
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
