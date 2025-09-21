import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  Users,
  Settings,
  Share2,
  MessageCircle,
  ScreenShare,
  ScreenShareOff,
  Volume2,
  VolumeX,
  Camera,
  CameraOff
} from 'lucide-react';

interface Participant {
  id: string;
  username: string;
  avatar: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isScreenSharing: boolean;
  isHost: boolean;
}

interface VideoConferenceProps {
  sessionId: string;
  sessionName: string;
  isOpen: boolean;
  onClose: () => void;
  onJoinSession?: (sessionId: string) => void;
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  sessionId,
  sessionName,
  isOpen,
  onClose,
  onJoinSession
}) => {
  const { user } = useAuth();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
  }>>([]);
  const [newMessage, setNewMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Mock participants for demonstration
  useEffect(() => {
    if (isOpen) {
      const mockParticipants: Participant[] = [
        {
          id: user?.id || 'current_user',
          username: user?.username || 'You',
          avatar: user?.username?.[0]?.toUpperCase() || 'U',
          isVideoOn: true,
          isAudioOn: true,
          isScreenSharing: false,
          isHost: true
        },
        {
          id: 'user2',
          username: 'Alice',
          avatar: 'A',
          isVideoOn: true,
          isAudioOn: true,
          isScreenSharing: false,
          isHost: false
        },
        {
          id: 'user3',
          username: 'Bob',
          avatar: 'B',
          isVideoOn: false,
          isAudioOn: true,
          isScreenSharing: false,
          isHost: false
        },
        {
          id: 'user4',
          username: 'Carol',
          avatar: 'C',
          isVideoOn: true,
          isAudioOn: false,
          isScreenSharing: true,
          isHost: false
        }
      ];
      setParticipants(mockParticipants);

      // Mock chat messages
      setChatMessages([
        {
          id: 'msg1',
          sender: 'Alice',
          message: 'Great to see everyone! Ready to start?',
          timestamp: '10:00 AM'
        },
        {
          id: 'msg2',
          sender: 'Bob',
          message: 'Yes, let\'s begin with the React hooks discussion',
          timestamp: '10:01 AM'
        }
      ]);
    }
  }, [isOpen, user]);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In real implementation, this would control actual camera
    console.log('Video toggled:', !isVideoOn);
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    setIsMuted(!isMuted);
    // In real implementation, this would control actual microphone
    console.log('Audio toggled:', !isAudioOn);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    // In real implementation, this would start/stop screen sharing
    console.log('Screen sharing toggled:', !isScreenSharing);
  };

  const leaveSession = () => {
    // In real implementation, this would disconnect from the video call
    console.log('Leaving session:', sessionId);
    onClose();
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      id: `msg_${Date.now()}`,
      sender: user?.username || 'You',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const inviteParticipants = () => {
    // In real implementation, this would send invites
    console.log('Inviting participants to session:', sessionId);
    alert('Invite link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Video className="h-6 w-6 text-green-500" />
          <div>
            <h2 className="text-lg font-semibold">{sessionName}</h2>
            <p className="text-sm text-gray-300">{participants.length} participants</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowChat(!showChat)}
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
          </button>
          <button
            onClick={leaveSession}
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Phone className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 h-full">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className={`relative bg-gray-800 rounded-lg overflow-hidden ${participant.isScreenSharing ? 'col-span-2 row-span-2' : ''
                    }`}
                >
                  {/* Video Placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    {participant.isVideoOn ? (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <CameraOff className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Participant Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                          {participant.avatar}
                        </div>
                        <span className="text-white text-sm font-medium">
                          {participant.username}
                          {participant.isHost && <span className="text-yellow-400 ml-1">👑</span>}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {!participant.isAudioOn && (
                          <MicOff className="h-4 w-4 text-red-400" />
                        )}
                        {participant.isScreenSharing && (
                          <ScreenShare className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800 p-4">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-full transition-colors ${isAudioOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {isAudioOn ? <Mic className="h-6 w-6 text-white" /> : <MicOff className="h-6 w-6 text-white" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full transition-colors ${isVideoOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {isVideoOn ? <Video className="h-6 w-6 text-white" /> : <VideoOff className="h-6 w-6 text-white" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition-colors ${isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
              >
                {isScreenSharing ? <ScreenShareOff className="h-6 w-6 text-white" /> : <ScreenShare className="h-6 w-6 text-white" />}
              </button>

              <button
                onClick={inviteParticipants}
                className="p-3 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors"
              >
                <Share2 className="h-6 w-6 text-white" />
              </button>

              <button
                onClick={leaveSession}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                <Phone className="h-6 w-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Chat */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-white font-semibold">Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-blue-400">{msg.sender}</span>
                    <span className="text-gray-400 text-xs">{msg.timestamp}</span>
                  </div>
                  <p className="text-gray-200">{msg.message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
            <h3 className="text-white font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Camera</label>
                <select className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Default Camera</option>
                  <option>External Camera</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Microphone</label>
                <select className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Default Microphone</option>
                  <option>External Microphone</option>
                </select>
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Speaker</label>
                <select className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Default Speaker</option>
                  <option>External Speaker</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Noise Cancellation</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">Echo Cancellation</span>
                <input type="checkbox" className="rounded" defaultChecked />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoConference;
