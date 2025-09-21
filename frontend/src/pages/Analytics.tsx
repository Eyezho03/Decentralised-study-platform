import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Target,
  Award,
  Zap,
  Brain
} from 'lucide-react';

interface AnalyticsData {
  studyTime: number;
  groupsJoined: number;
  resourcesUploaded: number;
  sessionsCompleted: number;
  tokensEarned: number;
  streakDays: number;
  weeklyProgress: Array<{
    day: string;
    hours: number;
    activities: number;
  }>;
  subjectBreakdown: Array<{
    subject: string;
    hours: number;
    percentage: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: string;
    points: number;
  }>;
  learningGoals: Array<{
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string;
    status: 'on-track' | 'behind' | 'completed';
  }>;
}

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { studyGroups, resources, studySessions } = useData();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    // Generate mock analytics data based on user activity
    const generateAnalyticsData = (): AnalyticsData => {
      const now = Date.now();

      // Calculate study time (mock data)
      const studyTime = Math.floor(Math.random() * 40) + 20; // 20-60 hours

      // Calculate weekly progress
      const weeklyProgress = [
        { day: 'Mon', hours: Math.floor(Math.random() * 8) + 2, activities: Math.floor(Math.random() * 5) + 1 },
        { day: 'Tue', hours: Math.floor(Math.random() * 8) + 2, activities: Math.floor(Math.random() * 5) + 1 },
        { day: 'Wed', hours: Math.floor(Math.random() * 8) + 2, activities: Math.floor(Math.random() * 5) + 1 },
        { day: 'Thu', hours: Math.floor(Math.random() * 8) + 2, activities: Math.floor(Math.random() * 5) + 1 },
        { day: 'Fri', hours: Math.floor(Math.random() * 8) + 2, activities: Math.floor(Math.random() * 5) + 1 },
        { day: 'Sat', hours: Math.floor(Math.random() * 6) + 1, activities: Math.floor(Math.random() * 3) + 1 },
        { day: 'Sun', hours: Math.floor(Math.random() * 6) + 1, activities: Math.floor(Math.random() * 3) + 1 }
      ];

      // Subject breakdown
      const subjects = ['Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology'];
      const subjectBreakdown = subjects.map(subject => ({
        subject,
        hours: Math.floor(Math.random() * 15) + 5,
        percentage: Math.floor(Math.random() * 30) + 10
      }));

      // Achievements
      const achievements = [
        {
          id: '1',
          name: 'Study Streak Master',
          description: 'Maintained a 7-day study streak',
          icon: '🔥',
          earnedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
          points: 100
        },
        {
          id: '2',
          name: 'Group Collaborator',
          description: 'Joined 5 study groups',
          icon: '👥',
          earnedAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
          points: 75
        },
        {
          id: '3',
          name: 'Resource Contributor',
          description: 'Uploaded 10 study resources',
          icon: '📚',
          earnedAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
          points: 50
        }
      ];

      // Learning goals
      const learningGoals = [
        {
          id: '1',
          title: 'Complete React Advanced Course',
          target: 40,
          current: 28,
          deadline: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'on-track' as const
        },
        {
          id: '2',
          title: 'Master JavaScript Algorithms',
          target: 20,
          current: 15,
          deadline: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'on-track' as const
        },
        {
          id: '3',
          title: 'Learn Machine Learning Basics',
          target: 30,
          current: 8,
          deadline: new Date(now + 21 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'behind' as const
        }
      ];

      return {
        studyTime,
        groupsJoined: studyGroups.length,
        resourcesUploaded: resources.length,
        sessionsCompleted: studySessions.length,
        tokensEarned: Number(user?.studyTokens || 0),
        streakDays: user?.studyStreak || 0,
        weeklyProgress,
        subjectBreakdown,
        achievements,
        learningGoals
      };
    };

    setAnalyticsData(generateAnalyticsData());
  }, [studyGroups, resources, studySessions, user]);

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'text-green-600 bg-green-100';
      case 'behind': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return '✅';
      case 'behind': return '⚠️';
      case 'completed': return '🎉';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning Analytics</h1>
          <p className="text-gray-600 mt-2">Track your progress and optimize your learning journey</p>
        </div>
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${timeRange === range
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.studyTime}h</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12% from last month
              </p>
            </div>
            <Clock className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Groups Joined</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.groupsJoined}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <Users className="h-4 w-4 mr-1" />
                Active member
              </p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resources Shared</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.resourcesUploaded}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <BookOpen className="h-4 w-4 mr-1" />
                Contributing
              </p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.streakDays} days</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Zap className="h-4 w-4 mr-1" />
                Keep it up!
              </p>
            </div>
            <Zap className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-indigo-600" />
          Weekly Study Activity
        </h3>
        <div className="space-y-4">
          {analyticsData.weeklyProgress.map((day, index) => (
            <div key={day.day} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(day.hours / 8) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{day.hours}h</span>
                </div>
                <div className="text-xs text-gray-500">{day.activities} activities</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Breakdown */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-600" />
          Subject Focus
        </h3>
        <div className="space-y-4">
          {analyticsData.subjectBreakdown.map((subject, index) => (
            <div key={subject.subject} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                <span className="font-medium text-gray-900">{subject.subject}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${subject.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-12 text-right">
                  {subject.hours}h
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Goals */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Target className="h-6 w-6 mr-2 text-green-600" />
          Learning Goals
        </h3>
        <div className="space-y-4">
          {analyticsData.learningGoals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                  {getStatusIcon(goal.status)} {goal.status.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {goal.current}/{goal.target} hours
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Award className="h-6 w-6 mr-2 text-yellow-600" />
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.achievements.map((achievement) => (
            <div key={achievement.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </span>
                <span className="text-sm font-medium text-yellow-600">
                  +{achievement.points} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
