import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Analytics from './Analytics';
import TokenManager from '../components/TokenManager';
import {
  BookOpen,
  Users,
  Coins,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Plus,
  ArrowRight,
  Info,
  FileText
} from 'lucide-react';

/**
 * Dashboard page showing user overview and quick actions
 */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { isUsingMockBackend } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState({
    groupsJoined: 3,
    resourcesUploaded: 7,
    sessionsParticipated: 12,
    achievements: 5
  });

  const recentActivities = [
    {
      type: 'group',
      title: 'Joined "Advanced React Development"',
      time: '2 hours ago',
      icon: <Users className="h-4 w-4 text-blue-500" />
    },
    {
      type: 'resource',
      title: 'Uploaded "TypeScript Best Practices"',
      time: '1 day ago',
      icon: <BookOpen className="h-4 w-4 text-green-500" />
    },
    {
      type: 'session',
      title: 'Completed "Data Structures Study Session"',
      time: '2 days ago',
      icon: <Target className="h-4 w-4 text-purple-500" />
    },
    {
      type: 'achievement',
      title: 'Earned "Study Streak Master" badge',
      time: '3 days ago',
      icon: <Award className="h-4 w-4 text-yellow-500" />
    }
  ];

  const quickActions = [
    {
      title: 'Create Study Group',
      description: 'Start a new study group',
      icon: <Plus className="h-6 w-6" />,
      link: '/groups/create',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Browse Groups',
      description: 'Find study groups to join',
      icon: <Users className="h-6 w-6" />,
      link: '/groups',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Upload Resource',
      description: 'Share study materials',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/resources',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Gamification',
      description: 'Earn badges and climb leaderboards',
      icon: <Award className="h-6 w-6" />,
      link: '/gamification',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      title: 'Collaborative Documents',
      description: 'Create and edit documents together',
      icon: <FileText className="h-6 w-6" />,
      link: '/documents',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center space-x-1 text-yellow-600">
                <Coins className="h-5 w-5" />
                <span className="text-2xl font-bold">{user?.studyTokens?.toString() || '0'}</span>
              </div>
              <p className="text-sm text-gray-600">Study Tokens</p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-1 text-orange-600">
                <Flame className="h-5 w-5" />
                <span className="text-2xl font-bold">{user?.studyStreak || 0}</span>
              </div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Backend Indicator */}
      {isUsingMockBackend && (
        <div className="glass p-4 rounded-xl border-l-4 border-yellow-500 bg-yellow-50">
          <div className="flex items-center space-x-3">
            <Info className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
              <p className="text-sm text-yellow-700">
                Currently using mock backend for demonstration. All data is stored locally and will be lost on page refresh.
                The real ICP backend is being deployed and will be available soon.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="glass p-2 rounded-xl">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tokens'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
          >
            Tokens & Blockchain
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics'
              ? 'bg-indigo-100 text-indigo-700'
              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Quick Actions */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} text-white p-6 rounded-xl card-hover`}
                >
                  <div className="flex items-center justify-between mb-4">
                    {action.icon}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-xl text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.groupsJoined}</div>
                <div className="text-gray-600">Groups Joined</div>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.resourcesUploaded}</div>
                <div className="text-gray-600">Resources Uploaded</div>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.sessionsParticipated}</div>
                <div className="text-gray-600">Sessions Completed</div>
              </div>
              <div className="glass p-6 rounded-xl text-center">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{stats.achievements}</div>
                <div className="text-gray-600">Achievements</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="glass p-6 rounded-xl">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-shrink-0">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link
                  to="/groups"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View all activity →
                </Link>
              </div>
            </div>
          </div>

          {/* Study Recommendations */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Study Matches</h3>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-gray-600 mb-4">
                  We found 3 study groups that match your interests and skill level.
                </p>
                <Link
                  to="/groups"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View matches →
                </Link>
              </div>
              <div className="glass p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-gray-600 mb-4">
                  You have 2 study sessions scheduled for this week.
                </p>
                <Link
                  to="/groups"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View schedule →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'tokens' && (
        <TokenManager />
      )}

      {activeTab === 'analytics' && (
        <Analytics />
      )}
    </div>
  );
};

export default Dashboard;
