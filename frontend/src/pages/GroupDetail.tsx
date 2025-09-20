import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Download, 
  Star,
  Clock,
  Target,
  MessageSquare,
  Plus
} from 'lucide-react';

/**
 * Group Detail page showing specific study group information
 */
const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would be fetched from canister
  const group = {
    id: id || '1',
    name: 'Advanced React Development',
    description: 'Deep dive into React hooks, context, and performance optimization. We meet twice a week to work through advanced concepts and build real-world projects together.',
    subject: 'Computer Science',
    skillLevel: 'advanced',
    maxMembers: 8,
    currentMembers: 5,
    members: [
      { id: '1', username: 'alice_dev', avatar: 'A' },
      { id: '2', username: 'bob_react', avatar: 'B' },
      { id: '3', username: 'carol_js', avatar: 'C' },
      { id: '4', username: 'dave_ui', avatar: 'D' },
      { id: '5', username: 'eve_ux', avatar: 'E' }
    ],
    creator: 'alice_dev',
    resources: [
      {
        id: '1',
        title: 'React Hooks Deep Dive',
        description: 'Comprehensive guide to React hooks',
        type: 'document',
        uploader: 'alice_dev',
        uploadDate: BigInt(Date.now() - 86400000),
        downloads: 12,
        rating: 4.8
      },
      {
        id: '2',
        title: 'Performance Optimization Techniques',
        description: 'Best practices for React performance',
        type: 'video',
        uploader: 'bob_react',
        uploadDate: BigInt(Date.now() - 172800000),
        downloads: 8,
        rating: 4.6
      }
    ],
    studySessions: [
      {
        id: '1',
        title: 'Context API Workshop',
        description: 'Understanding React Context and when to use it',
        scheduledAt: BigInt(Date.now() + 86400000),
        duration: 120,
        participants: ['alice_dev', 'bob_react', 'carol_js'],
        completed: false
      },
      {
        id: '2',
        title: 'Performance Optimization',
        description: 'Code review and optimization techniques',
        scheduledAt: BigInt(Date.now() + 259200000),
        duration: 90,
        participants: ['alice_dev', 'dave_ui', 'eve_ux'],
        completed: false
      }
    ],
    createdAt: BigInt(Date.now() - 86400000),
    isActive: true
  };

  const isMember = group.members.some(member => member.id === user?.id);
  const isCreator = group.creator === user?.id;

  const joinGroup = () => {
    // In real app, call canister method
    console.log('Joining group...');
  };

  const leaveGroup = () => {
    // In real app, call canister method
    console.log('Leaving group...');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'resources', label: 'Resources', icon: <Download className="h-4 w-4" /> },
    { id: 'sessions', label: 'Sessions', icon: <Calendar className="h-4 w-4" /> },
    { id: 'members', label: 'Members', icon: <Users className="h-4 w-4" /> }
  ];

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(group.skillLevel)}`}>
                {group.skillLevel}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{group.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{group.subject}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{group.currentMembers}/{group.maxMembers} members</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Created {new Date(Number(group.createdAt) / 1000000).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {isMember ? (
              <button
                onClick={leaveGroup}
                className="border border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Leave Group
              </button>
            ) : (
              <button
                onClick={joinGroup}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Join Group
              </button>
            )}
            {isCreator && (
              <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
                Manage Group
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">New resource uploaded</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">New member joined</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Study session completed</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resources Shared</span>
                  <span className="font-medium">{group.resources.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Study Sessions</span>
                  <span className="font-medium">{group.studySessions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Members</span>
                  <span className="font-medium">{group.currentMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Group Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Group Resources</h3>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Upload Resource
              </button>
            </div>
            <div className="grid gap-4">
              {group.resources.map((resource) => (
                <div key={resource.id} className="glass p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>By {resource.uploader}</span>
                        <span>{resource.downloads} downloads</span>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-400 mr-1" />
                          <span>{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Study Sessions</h3>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </button>
            </div>
            <div className="grid gap-4">
              {group.studySessions.map((session) => (
                <div key={session.id} className="glass p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{session.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{session.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(Number(session.scheduledAt) / 1000000).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{session.duration} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{session.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Join Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Group Members</h3>
            <div className="grid gap-4">
              {group.members.map((member) => (
                <div key={member.id} className="glass p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium">
                      {member.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{member.username}</h4>
                      <p className="text-sm text-gray-600">Active member</p>
                    </div>
                    {member.id === group.creator && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        Creator
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
