import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import VideoConference from './VideoConference';
import {
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Target
} from 'lucide-react';

interface StudySession {
  id: string;
  title: string;
  description: string;
  groupId: string;
  groupName: string;
  scheduledAt: Date;
  duration: number; // in minutes
  participants: string[];
  maxParticipants: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  resources: string[];
  meetingLink?: string;
  createdAt: Date;
}

const StudySessionScheduler: React.FC = () => {
  const { user } = useAuth();
  const { studyGroups } = useData();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVideoConference, setShowVideoConference] = useState(false);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed'>('all');

  // Mock sessions data
  useEffect(() => {
    const mockSessions: StudySession[] = [
      {
        id: 'session1',
        title: 'React Hooks Deep Dive',
        description: 'Comprehensive discussion on React hooks patterns and best practices',
        groupId: 'group1',
        groupName: 'Advanced React Development',
        scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        duration: 90,
        participants: ['user1', 'user2', 'user3'],
        maxParticipants: 8,
        status: 'scheduled',
        resources: ['resource1', 'resource2'],
        meetingLink: 'https://meet.example.com/session1',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'session2',
        title: 'Mathematics Problem Solving',
        description: 'Working through advanced calculus problems together',
        groupId: 'group2',
        groupName: 'Mathematics Fundamentals',
        scheduledAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        duration: 60,
        participants: ['user4', 'user5', 'user6'],
        maxParticipants: 6,
        status: 'active',
        resources: ['resource3'],
        meetingLink: 'https://meet.example.com/session2',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'session3',
        title: 'WebAssembly Introduction',
        description: 'Introduction to WebAssembly and its applications',
        groupId: 'group1',
        groupName: 'Advanced React Development',
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        duration: 120,
        participants: ['user1', 'user2', 'user7', 'user8'],
        maxParticipants: 8,
        status: 'completed',
        resources: ['resource4', 'resource5'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    switch (filter) {
      case 'upcoming':
        return session.status === 'scheduled' && session.scheduledAt > new Date();
      case 'active':
        return session.status === 'active';
      case 'completed':
        return session.status === 'completed';
      default:
        return true;
    }
  });

  const joinSession = (session: StudySession) => {
    setActiveSession(session);
    setShowVideoConference(true);
  };

  const startSession = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, status: 'active' as const }
        : session
    ));
  };

  const endSession = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, status: 'completed' as const }
        : session
    ));
  };

  const cancelSession = (sessionId: string) => {
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, status: 'cancelled' as const }
        : session
    ));
  };

  const getStatusColor = (status: StudySession['status']) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: StudySession['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <Play className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Sessions</h1>
          <p className="text-gray-600">Schedule and manage your study sessions with video conferencing</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'all', label: 'All Sessions' },
          { key: 'upcoming', label: 'Upcoming' },
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === tab.key
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-gray-600 hover:text-indigo-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600 mb-4">
              {filter === 'all'
                ? 'No study sessions have been scheduled yet.'
                : `No ${filter} sessions found.`
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Schedule Your First Session
            </button>
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session.id} className="glass p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{session.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                      {getStatusIcon(session.status)}
                      <span className="capitalize">{session.status}</span>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{session.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{session.scheduledAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{session.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{session.participants.length}/{session.maxParticipants}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{session.resources.length} resources</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {session.status === 'scheduled' && (
                    <button
                      onClick={() => startSession(session.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </button>
                  )}
                  {session.status === 'active' && (
                    <>
                      <button
                        onClick={() => joinSession(session)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Video className="h-4 w-4" />
                        <span>Join</span>
                      </button>
                      <button
                        onClick={() => endSession(session.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Pause className="h-4 w-4" />
                        <span>End</span>
                      </button>
                    </>
                  )}
                  {session.status === 'scheduled' && (
                    <button
                      onClick={() => cancelSession(session.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Session Details */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Group:</span>
                      <span className="ml-1 font-medium text-gray-900">{session.groupName}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1 font-medium text-gray-900">{session.duration} minutes</span>
                    </div>
                  </div>
                  {session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Meeting Link →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Video Conference Modal */}
      {showVideoConference && activeSession && (
        <VideoConference
          sessionId={activeSession.id}
          sessionName={activeSession.title}
          isOpen={showVideoConference}
          onClose={() => {
            setShowVideoConference(false);
            setActiveSession(null);
          }}
          onJoinSession={(sessionId) => {
            console.log('Joining session:', sessionId);
          }}
        />
      )}

      {/* Create Session Modal (Placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-6 border w-full max-w-md shadow-lg rounded-xl bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule New Session</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Session Scheduler</h4>
              <p className="text-gray-600 mb-4">
                This feature will allow you to create and schedule study sessions with integrated video conferencing.
              </p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessionScheduler;
