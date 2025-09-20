import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  BookOpen, 
  Star,
  Clock,
  Target
} from 'lucide-react';

/**
 * Study Groups page showing all available study groups
 */
const StudyGroups: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [studyGroups, setStudyGroups] = useState([
    {
      id: '1',
      name: 'Advanced React Development',
      description: 'Deep dive into React hooks, context, and performance optimization',
      subject: 'Computer Science',
      skillLevel: 'advanced',
      maxMembers: 8,
      currentMembers: 5,
      members: ['user1', 'user2', 'user3', 'user4', 'user5'],
      creator: 'user1',
      resources: [],
      studySessions: [],
      createdAt: BigInt(Date.now() - 86400000),
      isActive: true
    },
    {
      id: '2',
      name: 'Mathematics Study Group',
      description: 'Calculus and linear algebra problem solving sessions',
      subject: 'Mathematics',
      skillLevel: 'intermediate',
      maxMembers: 12,
      currentMembers: 8,
      members: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8'],
      creator: 'user2',
      resources: [],
      studySessions: [],
      createdAt: BigInt(Date.now() - 172800000),
      isActive: true
    },
    {
      id: '3',
      name: 'Physics Fundamentals',
      description: 'Basic physics concepts and problem solving',
      subject: 'Physics',
      skillLevel: 'beginner',
      maxMembers: 10,
      currentMembers: 3,
      members: ['user1', 'user2', 'user3'],
      creator: 'user3',
      resources: [],
      studySessions: [],
      createdAt: BigInt(Date.now() - 259200000),
      isActive: true
    }
  ]);

  const subjects = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const skillLevels = ['All', 'beginner', 'intermediate', 'advanced'];

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === '' || selectedSubject === 'All' || group.subject === selectedSubject;
    const matchesSkillLevel = selectedSkillLevel === '' || selectedSkillLevel === 'All' || group.skillLevel === selectedSkillLevel;
    
    return matchesSearch && matchesSubject && matchesSkillLevel;
  });

  const joinGroup = (groupId: string) => {
    // In a real app, this would call the canister
    console.log(`Joining group ${groupId}`);
    // Update local state for demo
    setStudyGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, currentMembers: group.currentMembers + 1, members: [...group.members, user?.id || 'current-user'] }
        : group
    ));
  };

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Groups</h1>
          <p className="text-gray-600 mt-2">Find and join study groups that match your interests</p>
        </div>
        <Link
          to="/groups/create"
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Group
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="glass p-6 rounded-xl">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div className="md:w-48">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject === 'All' ? '' : subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Level Filter */}
          <div className="md:w-48">
            <select
              value={selectedSkillLevel}
              onChange={(e) => setSelectedSkillLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {skillLevels.map(level => (
                <option key={level} value={level === 'All' ? '' : level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Study Groups Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <div key={group.id} className="glass p-6 rounded-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{group.description}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(group.skillLevel)}`}>
                {group.skillLevel}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{group.subject}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{group.currentMembers}/{group.maxMembers} members</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>Created {new Date(Number(group.createdAt) / 1000000).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 3).map((member, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    >
                      {member.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {group.members.length > 3 && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium">
                      +{group.members.length - 3}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Link
                  to={`/groups/${group.id}`}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  View Details
                </Link>
                <button
                  onClick={() => joinGroup(group.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Join Group
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No study groups found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or create a new group.</p>
          <Link
            to="/groups/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Group
          </Link>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
