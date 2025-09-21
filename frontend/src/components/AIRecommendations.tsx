import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Brain,
  Target,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  Clock,
  Zap,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Heart,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Award,
  Filter,
  Search
} from 'lucide-react';

interface StudyRecommendation {
  id: string;
  type: 'group' | 'resource' | 'session' | 'study_buddy' | 'learning_path';
  title: string;
  description: string;
  confidence: number; // 0-100
  reason: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  subject?: string;
  participants?: number;
  rating?: number;
  createdAt: Date;
}

interface StudyBuddy {
  id: string;
  username: string;
  avatar: string;
  subjects: string[];
  skillLevel: string;
  studyStreak: number;
  compatibility: number; // 0-100
  mutualInterests: string[];
  availability: string[];
  lastActive: Date;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  subjects: string[];
  difficulty: string;
  estimatedDuration: number; // in hours
  steps: Array<{
    id: string;
    title: string;
    description: string;
    type: 'resource' | 'session' | 'practice' | 'assessment';
    completed: boolean;
    estimatedTime: number;
  }>;
  progress: number; // 0-100
  prerequisites: string[];
}

const AIRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { studyGroups, resources, studySessions } = useData();
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([]);
  const [studyBuddies, setStudyBuddies] = useState<StudyBuddy[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'buddies' | 'paths'>('recommendations');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Generate AI recommendations based on user behavior
  useEffect(() => {
    generateRecommendations();
  }, [user, studyGroups, resources, studySessions]);

  const generateRecommendations = async () => {
    setIsAnalyzing(true);

    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const mockRecommendations: StudyRecommendation[] = [
      {
        id: 'rec1',
        type: 'group',
        title: 'Advanced React Patterns',
        description: 'Based on your interest in React and current skill level, this group focuses on advanced patterns and performance optimization.',
        confidence: 92,
        reason: 'Matches your React expertise and learning goals',
        tags: ['React', 'JavaScript', 'Frontend'],
        priority: 'high',
        estimatedTime: 120,
        difficulty: 'advanced',
        subject: 'Computer Science',
        participants: 6,
        rating: 4.8,
        createdAt: new Date()
      },
      {
        id: 'rec2',
        type: 'resource',
        title: 'WebAssembly Fundamentals',
        description: 'Comprehensive guide to WebAssembly for web developers. Perfect for expanding your technical skills.',
        confidence: 85,
        reason: 'Complements your web development knowledge',
        tags: ['WebAssembly', 'Performance', 'Web Development'],
        priority: 'medium',
        estimatedTime: 90,
        difficulty: 'intermediate',
        subject: 'Computer Science',
        rating: 4.6,
        createdAt: new Date()
      },
      {
        id: 'rec3',
        type: 'session',
        title: 'Mathematics Problem Solving Workshop',
        description: 'Interactive session focusing on calculus and linear algebra problem-solving techniques.',
        confidence: 78,
        reason: 'Aligns with your mathematics background',
        tags: ['Mathematics', 'Calculus', 'Problem Solving'],
        priority: 'medium',
        estimatedTime: 60,
        difficulty: 'intermediate',
        subject: 'Mathematics',
        participants: 8,
        createdAt: new Date()
      },
      {
        id: 'rec4',
        type: 'study_buddy',
        title: 'Connect with Alice',
        description: 'Alice shares your interest in React and has similar learning goals. Great match for collaborative study.',
        confidence: 88,
        reason: 'High compatibility based on interests and skill level',
        tags: ['React', 'JavaScript', 'Collaboration'],
        priority: 'high',
        subject: 'Computer Science',
        createdAt: new Date()
      },
      {
        id: 'rec5',
        type: 'learning_path',
        title: 'Full-Stack Web Development',
        description: 'Complete learning path from frontend to backend development, including modern frameworks and tools.',
        confidence: 95,
        reason: 'Perfect match for your career goals',
        tags: ['Web Development', 'Full-Stack', 'Career'],
        priority: 'high',
        estimatedTime: 120,
        difficulty: 'intermediate',
        subject: 'Computer Science',
        createdAt: new Date()
      }
    ];

    const mockStudyBuddies: StudyBuddy[] = [
      {
        id: 'buddy1',
        username: 'Alice',
        avatar: 'A',
        subjects: ['React', 'JavaScript', 'TypeScript'],
        skillLevel: 'advanced',
        studyStreak: 15,
        compatibility: 92,
        mutualInterests: ['React', 'Web Development', 'Performance'],
        availability: ['Weekdays 6-8 PM', 'Weekends'],
        lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'buddy2',
        username: 'Bob',
        avatar: 'B',
        subjects: ['Mathematics', 'Physics', 'Statistics'],
        skillLevel: 'intermediate',
        studyStreak: 8,
        compatibility: 78,
        mutualInterests: ['Mathematics', 'Problem Solving'],
        availability: ['Evenings', 'Weekends'],
        lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'buddy3',
        username: 'Carol',
        avatar: 'C',
        subjects: ['WebAssembly', 'Rust', 'Systems Programming'],
        skillLevel: 'advanced',
        studyStreak: 12,
        compatibility: 85,
        mutualInterests: ['Performance', 'Low-level Programming'],
        availability: ['Weekdays 7-9 PM'],
        lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ];

    const mockLearningPaths: LearningPath[] = [
      {
        id: 'path1',
        title: 'Full-Stack Web Development',
        description: 'Complete journey from frontend to backend development',
        subjects: ['React', 'Node.js', 'Database', 'DevOps'],
        difficulty: 'intermediate',
        estimatedDuration: 120,
        progress: 35,
        prerequisites: ['Basic JavaScript', 'HTML/CSS'],
        steps: [
          {
            id: 'step1',
            title: 'React Fundamentals',
            description: 'Learn React basics and component architecture',
            type: 'resource',
            completed: true,
            estimatedTime: 20
          },
          {
            id: 'step2',
            title: 'State Management',
            description: 'Master Redux and Context API',
            type: 'session',
            completed: true,
            estimatedTime: 15
          },
          {
            id: 'step3',
            title: 'Backend Development',
            description: 'Build REST APIs with Node.js',
            type: 'resource',
            completed: false,
            estimatedTime: 25
          },
          {
            id: 'step4',
            title: 'Database Integration',
            description: 'Connect to MongoDB and PostgreSQL',
            type: 'practice',
            completed: false,
            estimatedTime: 20
          },
          {
            id: 'step5',
            title: 'Deployment',
            description: 'Deploy your full-stack application',
            type: 'assessment',
            completed: false,
            estimatedTime: 15
          }
        ]
      },
      {
        id: 'path2',
        title: 'Advanced Mathematics',
        description: 'Deep dive into calculus, linear algebra, and statistics',
        subjects: ['Calculus', 'Linear Algebra', 'Statistics'],
        difficulty: 'advanced',
        estimatedDuration: 80,
        progress: 60,
        prerequisites: ['Basic Calculus', 'Algebra'],
        steps: [
          {
            id: 'step1',
            title: 'Multivariable Calculus',
            description: 'Master partial derivatives and multiple integrals',
            type: 'resource',
            completed: true,
            estimatedTime: 20
          },
          {
            id: 'step2',
            title: 'Linear Algebra',
            description: 'Vector spaces, matrices, and eigenvalues',
            type: 'session',
            completed: true,
            estimatedTime: 15
          },
          {
            id: 'step3',
            title: 'Statistical Analysis',
            description: 'Probability distributions and hypothesis testing',
            type: 'practice',
            completed: false,
            estimatedTime: 25
          }
        ]
      }
    ];

    setRecommendations(mockRecommendations);
    setStudyBuddies(mockStudyBuddies);
    setLearningPaths(mockLearningPaths);
    setIsAnalyzing(false);
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'all') return true;
    return rec.priority === filter;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'group':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'resource':
        return <BookOpen className="h-5 w-5 text-green-500" />;
      case 'session':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case 'study_buddy':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'learning_path':
        return <Target className="h-5 w-5 text-orange-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-gray-500" />;
    }
  };

  const acceptRecommendation = (recommendationId: string) => {
    console.log('Accepting recommendation:', recommendationId);
    // In real implementation, this would add to user's study plan
    alert('Recommendation accepted! Added to your study plan.');
  };

  const dismissRecommendation = (recommendationId: string) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <span>AI Study Recommendations</span>
          </h1>
          <p className="text-gray-600">Personalized learning suggestions powered by AI analysis</p>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isAnalyzing}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              <span>Refresh AI</span>
            </>
          )}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'recommendations'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-purple-600'
            }`}
        >
          <Lightbulb className="h-4 w-4 inline mr-2" />
          Recommendations
        </button>
        <button
          onClick={() => setActiveTab('buddies')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'buddies'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-purple-600'
            }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Study Buddies
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'paths'
              ? 'bg-white text-purple-700 shadow-sm'
              : 'text-gray-600 hover:text-purple-600'
            }`}
        >
          <Target className="h-4 w-4 inline mr-2" />
          Learning Paths
        </button>
      </div>

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <>
          {/* Filter */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by priority:</span>
            <div className="flex space-x-2">
              {['all', 'high', 'medium', 'low'].map((priority) => (
                <button
                  key={priority}
                  onClick={() => setFilter(priority as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === priority
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="glass p-6 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getTypeIcon(recommendation.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{recommendation.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                          {recommendation.priority.toUpperCase()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                            {recommendation.confidence}%
                          </span>
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{recommendation.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Lightbulb className="h-4 w-4" />
                          <span>{recommendation.reason}</span>
                        </div>
                        {recommendation.estimatedTime && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{recommendation.estimatedTime} min</span>
                          </div>
                        )}
                        {recommendation.difficulty && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4" />
                            <span className="capitalize">{recommendation.difficulty}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => acceptRecommendation(recommendation.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => dismissRecommendation(recommendation.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Study Buddies Tab */}
      {activeTab === 'buddies' && (
        <div className="space-y-4">
          {studyBuddies.map((buddy) => (
            <div key={buddy.id} className="glass p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                    {buddy.avatar}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{buddy.username}</h3>
                    <p className="text-gray-600">{buddy.subjects.join(', ')}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Compatibility: {buddy.compatibility}%</span>
                      <span>Streak: {buddy.studyStreak} days</span>
                      <span>Last active: {buddy.lastActive.toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Message</span>
                  </button>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>Connect</span>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Mutual Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {buddy.mutualInterests.map((interest, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Availability:</p>
                    <div className="text-sm text-gray-700">
                      {buddy.availability.map((time, index) => (
                        <div key={index}>{time}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Learning Paths Tab */}
      {activeTab === 'paths' && (
        <div className="space-y-4">
          {learningPaths.map((path) => (
            <div key={path.id} className="glass p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{path.title}</h3>
                  <p className="text-gray-600 mb-3">{path.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Duration: {path.estimatedDuration} hours</span>
                    <span>Difficulty: {path.difficulty}</span>
                    <span>Progress: {path.progress}%</span>
                  </div>
                </div>
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                  <ArrowRight className="h-4 w-4" />
                  <span>Continue</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${path.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Learning Steps:</h4>
                {path.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                      {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{step.title}</h5>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.estimatedTime} min
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
