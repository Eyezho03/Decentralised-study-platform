import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Trophy,
  Medal,
  Star,
  Crown,
  Target,
  Zap,
  Flame,
  BookOpen,
  Users,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Lock,
  Gift,
  Sparkles,
  Rocket,
  Shield,
  Sword,
  Heart,
  Brain,
  Lightbulb,
  Coffee,
  Moon,
  Sun,
  Mountain,
  Diamond
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'study' | 'social' | 'achievement' | 'streak' | 'special';
  points: number;
  unlockedAt?: Date;
  progress?: number; // 0-100 for locked badges
  requirement?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  progress: number; // 0-100
  target: number;
  current: number;
  deadline?: Date;
  reward: {
    points: number;
    badge?: string;
    tokens?: number;
  };
  isCompleted: boolean;
  isActive: boolean;
}

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  points: number;
  rank: number;
  badges: number;
  studyStreak: number;
  level: number;
  isCurrentUser: boolean;
}

interface UserLevel {
  level: number;
  points: number;
  nextLevelPoints: number;
  progress: number; // 0-100
  title: string;
  benefits: string[];
}

const Gamification: React.FC = () => {
  const { user } = useAuth();
  const { studyGroups, resources, studySessions } = useData();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [activeTab, setActiveTab] = useState<'badges' | 'challenges' | 'leaderboard' | 'level'>('badges');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    generateGamificationData();
  }, [user, studyGroups, resources, studySessions]);

  const generateGamificationData = () => {
    // Generate badges
    const mockBadges: Badge[] = [
      {
        id: 'badge1',
        name: 'First Steps',
        description: 'Complete your first study session',
        icon: <Star className="h-6 w-6" />,
        rarity: 'common',
        category: 'study',
        points: 10,
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'badge2',
        name: 'Group Creator',
        description: 'Create your first study group',
        icon: <Users className="h-6 w-6" />,
        rarity: 'rare',
        category: 'social',
        points: 25,
        unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'badge3',
        name: 'Streak Master',
        description: 'Maintain a 7-day study streak',
        icon: <Flame className="h-6 w-6" />,
        rarity: 'epic',
        category: 'streak',
        points: 50,
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'badge4',
        name: 'Resource Provider',
        description: 'Upload 5 study resources',
        icon: <BookOpen className="h-6 w-6" />,
        rarity: 'rare',
        category: 'achievement',
        points: 30,
        unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'badge5',
        name: 'Night Owl',
        description: 'Study after 10 PM',
        icon: <Moon className="h-6 w-6" />,
        rarity: 'common',
        category: 'special',
        points: 15,
        unlockedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'badge6',
        name: 'Early Bird',
        description: 'Study before 6 AM',
        icon: <Sun className="h-6 w-6" />,
        rarity: 'common',
        category: 'special',
        points: 15,
        progress: 60,
        requirement: 'Study before 6 AM'
      },
      {
        id: 'badge7',
        name: 'Social Butterfly',
        description: 'Join 10 study groups',
        icon: <Heart className="h-6 w-6" />,
        rarity: 'epic',
        category: 'social',
        points: 75,
        progress: 30,
        requirement: 'Join 10 study groups'
      },
      {
        id: 'badge8',
        name: 'Legendary Scholar',
        description: 'Earn 1000 study points',
        icon: <Crown className="h-6 w-6" />,
        rarity: 'legendary',
        category: 'achievement',
        points: 200,
        progress: 45,
        requirement: 'Earn 1000 study points'
      }
    ];

    // Generate challenges
    const mockChallenges: Challenge[] = [
      {
        id: 'challenge1',
        title: 'Daily Study Goal',
        description: 'Study for at least 2 hours today',
        type: 'daily',
        difficulty: 'easy',
        points: 20,
        progress: 75,
        target: 120, // minutes
        current: 90,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reward: { points: 20, tokens: 10 },
        isCompleted: false,
        isActive: true
      },
      {
        id: 'challenge2',
        title: 'Weekly Group Participation',
        description: 'Participate in 3 study sessions this week',
        type: 'weekly',
        difficulty: 'medium',
        points: 50,
        progress: 66,
        target: 3,
        current: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reward: { points: 50, badge: 'Group Participant', tokens: 25 },
        isCompleted: false,
        isActive: true
      },
      {
        id: 'challenge3',
        title: 'Resource Master',
        description: 'Upload 3 high-quality resources this month',
        type: 'monthly',
        difficulty: 'hard',
        points: 100,
        progress: 33,
        target: 3,
        current: 1,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        reward: { points: 100, badge: 'Resource Master', tokens: 50 },
        isCompleted: false,
        isActive: true
      },
      {
        id: 'challenge4',
        title: 'Perfect Week',
        description: 'Maintain study streak for 7 consecutive days',
        type: 'special',
        difficulty: 'hard',
        points: 150,
        progress: 100,
        target: 7,
        current: 7,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
        reward: { points: 150, badge: 'Streak Master', tokens: 75 },
        isCompleted: true,
        isActive: false
      }
    ];

    // Generate leaderboard
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: 'user1',
        username: 'Alice',
        avatar: 'A',
        points: 1250,
        rank: 1,
        badges: 12,
        studyStreak: 15,
        level: 8,
        isCurrentUser: false
      },
      {
        id: 'user2',
        username: 'Bob',
        avatar: 'B',
        points: 1180,
        rank: 2,
        badges: 10,
        studyStreak: 12,
        level: 7,
        isCurrentUser: false
      },
      {
        id: 'current_user',
        username: user?.username || 'You',
        avatar: user?.username?.[0]?.toUpperCase() || 'U',
        points: 950,
        rank: 3,
        badges: 8,
        studyStreak: 7,
        level: 6,
        isCurrentUser: true
      },
      {
        id: 'user4',
        username: 'Carol',
        avatar: 'C',
        points: 890,
        rank: 4,
        badges: 7,
        studyStreak: 9,
        level: 6,
        isCurrentUser: false
      },
      {
        id: 'user5',
        username: 'Dave',
        avatar: 'D',
        points: 750,
        rank: 5,
        badges: 6,
        studyStreak: 5,
        level: 5,
        isCurrentUser: false
      }
    ];

    // Generate user level
    const mockUserLevel: UserLevel = {
      level: 6,
      points: 950,
      nextLevelPoints: 1200,
      progress: 62,
      title: 'Dedicated Scholar',
      benefits: [
        'Access to premium study groups',
        'Priority support',
        'Exclusive badges',
        'Advanced analytics'
      ]
    };

    setBadges(mockBadges);
    setChallenges(mockChallenges);
    setLeaderboard(mockLeaderboard);
    setUserLevel(mockUserLevel);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100';
      case 'rare':
        return 'text-blue-600 bg-blue-100';
      case 'epic':
        return 'text-purple-600 bg-purple-100';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'study':
        return <BookOpen className="h-4 w-4" />;
      case 'social':
        return <Users className="h-4 w-4" />;
      case 'achievement':
        return <Trophy className="h-4 w-4" />;
      case 'streak':
        return <Flame className="h-4 w-4" />;
      case 'special':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const claimReward = (challengeId: string) => {
    console.log('Claiming reward for challenge:', challengeId);
    // In real implementation, this would claim the reward
    alert('Reward claimed! Check your badges and tokens.');
  };

  const filteredBadges = badges.filter(badge => 
    selectedCategory === 'all' || badge.category === selectedCategory
  );

  const unlockedBadges = badges.filter(badge => badge.unlockedAt);
  const lockedBadges = badges.filter(badge => !badge.unlockedAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <span>Gamification Center</span>
          </h1>
          <p className="text-gray-600">Earn badges, complete challenges, and climb the leaderboard!</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{userLevel?.points || 0}</div>
            <div className="text-sm text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{unlockedBadges.length}</div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user?.studyStreak || 0}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'badges'
              ? 'bg-white text-yellow-700 shadow-sm'
              : 'text-gray-600 hover:text-yellow-600'
          }`}
        >
          <Medal className="h-4 w-4 inline mr-2" />
          Badges
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'challenges'
              ? 'bg-white text-yellow-700 shadow-sm'
              : 'text-gray-600 hover:text-yellow-600'
          }`}
        >
          <Target className="h-4 w-4 inline mr-2" />
          Challenges
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-white text-yellow-700 shadow-sm'
              : 'text-gray-600 hover:text-yellow-600'
          }`}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('level')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'level'
              ? 'bg-white text-yellow-700 shadow-sm'
              : 'text-gray-600 hover:text-yellow-600'
          }`}
        >
          <Crown className="h-4 w-4 inline mr-2" />
          Level
        </button>
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <>
          {/* Category Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by category:</span>
            <div className="flex space-x-2">
              {['all', 'study', 'social', 'achievement', 'streak', 'special'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Unlocked Badges */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unlocked Badges ({unlockedBadges.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedBadges.map((badge) => (
                <div key={badge.id} className="glass p-4 rounded-xl">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">+{badge.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locked Badges */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Locked Badges ({lockedBadges.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedBadges.map((badge) => (
                <div key={badge.id} className="glass p-4 rounded-xl opacity-60">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-2xl text-gray-400">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{badge.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${badge.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                      {badge.rarity.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">+{badge.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="glass p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{challenge.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {challenge.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{challenge.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Reward: {challenge.reward.points} points</span>
                    {challenge.reward.tokens && <span>{challenge.reward.tokens} tokens</span>}
                    {challenge.reward.badge && <span>Badge: {challenge.reward.badge}</span>}
                    {challenge.deadline && (
                      <span>Deadline: {challenge.deadline.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-600">{challenge.points}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{challenge.current}/{challenge.target}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      challenge.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                {challenge.isCompleted ? (
                  <button
                    onClick={() => claimReward(challenge.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Gift className="h-4 w-4" />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed flex items-center space-x-1"
                  >
                    <Lock className="h-4 w-4" />
                    <span>In Progress</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`glass p-4 rounded-xl ${
                entry.isCurrentUser ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {entry.rank <= 3 ? (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500' :
                      entry.rank === 2 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {entry.rank === 1 ? <Crown className="h-5 w-5" /> :
                       entry.rank === 2 ? <Medal className="h-5 w-5" /> :
                       entry.rank === 3 ? <Trophy className="h-5 w-5" /> :
                       entry.rank}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                      {entry.rank}
                    </div>
                  )}
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {entry.username}
                    {entry.isCurrentUser && <span className="text-yellow-600 ml-2">(You)</span>}
                  </h4>
                  <p className="text-sm text-gray-600">Level {entry.level} • {entry.badges} badges</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-600">{entry.points}</div>
                  <div className="text-sm text-gray-600">points</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-orange-600">
                    <Flame className="h-4 w-4 mr-1" />
                    <span className="font-medium">{entry.studyStreak}</span>
                  </div>
                  <div className="text-sm text-gray-600">day streak</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Level Tab */}
      {activeTab === 'level' && userLevel && (
        <div className="space-y-6">
          {/* Current Level */}
          <div className="glass p-6 rounded-xl text-center">
            <div className="text-6xl font-bold text-yellow-600 mb-2">{userLevel.level}</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{userLevel.title}</h3>
            <p className="text-gray-600 mb-4">Keep studying to reach the next level!</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>{userLevel.points} points</span>
                <span>{userLevel.nextLevelPoints} points needed</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${userLevel.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Level Benefits */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Level Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userLevel.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Level Preview */}
          <div className="glass p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Level Preview</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400 mb-2">{userLevel.level + 1}</div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Advanced Scholar</h4>
              <p className="text-gray-600 mb-4">Unlock exclusive features and rewards!</p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>• Premium study groups</span>
                <span>• Advanced analytics</span>
                <span>• Priority support</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gamification;
