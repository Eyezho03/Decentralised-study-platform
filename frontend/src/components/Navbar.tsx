import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from '../contexts/NotificationContext';
import { BookOpen, User, LogOut, Coins, Flame, Menu, X, Video, Brain, Trophy, FileText, Smartphone } from 'lucide-react';

/**
 * Navigation bar component with authentication state and user info
 */
const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold gradient-text">Study Platform</span>
          </Link>

          {/* Desktop Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/groups"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/groups')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Study Groups</span>
              </Link>
              <Link
                to="/resources"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/resources')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Resources</span>
              </Link>
              <Link
                to="/sessions"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/sessions')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <Video className="h-4 w-4" />
                <span>Sessions</span>
              </Link>
              <Link
                to="/ai-recommendations"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/ai-recommendations')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <Brain className="h-4 w-4" />
                <span>AI Recommendations</span>
              </Link>
              <Link
                to="/gamification"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/gamification')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Gamification</span>
              </Link>
              <Link
                to="/documents"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/documents')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* User Stats */}
                <div className="hidden sm:flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-yellow-600">
                    <Coins className="h-4 w-4" />
                    <span className="font-medium">{user?.studyTokens?.toString() || '0'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-600">
                    <Flame className="h-4 w-4" />
                    <span className="font-medium">{user?.studyStreak || 0} days</span>
                  </div>
                </div>

                {/* Notification Bell */}
                <NotificationBell />

                {/* Mobile App Button */}
                <button
                  onClick={() => {
                    // This would trigger the mobile app modal
                    console.log('Mobile app clicked');
                  }}
                  className="p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  title="Mobile App"
                >
                  <Smartphone className="h-5 w-5" />
                </button>

                {/* Profile Dropdown */}
                <div className="flex items-center space-x-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:block">{user?.username}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="space-y-2">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/groups"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/groups')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Study Groups</span>
              </Link>
              <Link
                to="/resources"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/resources')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Resources</span>
              </Link>
              <Link
                to="/sessions"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/sessions')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <Video className="h-4 w-4" />
                <span>Sessions</span>
              </Link>
              <Link
                to="/ai-recommendations"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/ai-recommendations')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <Brain className="h-4 w-4" />
                <span>AI Recommendations</span>
              </Link>
              <Link
                to="/gamification"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/gamification')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <Trophy className="h-4 w-4" />
                <span>Gamification</span>
              </Link>
              <Link
                to="/documents"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/documents')
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
              >
                <FileText className="h-4 w-4" />
                <span>Documents</span>
              </Link>

              {/* Mobile User Stats */}
              <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 mt-4">
                <div className="flex items-center space-x-1 text-yellow-600">
                  <Coins className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.studyTokens?.toString() || '0'}</span>
                </div>
                <div className="flex items-center space-x-1 text-orange-600">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">{user?.studyStreak || 0} days</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
