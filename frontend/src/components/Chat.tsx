import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Send, Users, Clock, Paperclip } from 'lucide-react';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  type: 'text' | 'system' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface ChatProps {
  groupId: string;
  groupName: string;
  isOpen: boolean;
  onClose: () => void;
}

const Chat: React.FC<ChatProps> = ({ groupId, groupName, isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock real-time functionality (in production, this would use WebSockets or similar)
  useEffect(() => {
    if (isOpen) {
      // Load existing messages from localStorage
      const savedMessages = localStorage.getItem(`chat_${groupId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: `welcome_${Date.now()}`,
          userId: 'system',
          username: 'System',
          message: `Welcome to ${groupName}! Start chatting with your study group.`,
          timestamp: Date.now(),
          type: 'system'
        };
        setMessages([welcomeMessage]);
      }
    }
  }, [isOpen, groupId, groupName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      message: newMessage.trim(),
      timestamp: Date.now(),
      type: 'text'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    // Save to localStorage
    localStorage.setItem(`chat_${groupId}`, JSON.stringify(updatedMessages));

    setNewMessage('');
    setIsTyping(false);

    // Simulate other users typing (for demo)
    setTimeout(() => {
      const demoUsers = ['Alice', 'Bob', 'Charlie'];
      const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      setTypingUsers([randomUser]);

      setTimeout(() => {
        setTypingUsers([]);
      }, 2000);
    }, 1000);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
    } else if (isTyping && e.target.value.length === 0) {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Simulate file upload
    const fileMessage: ChatMessage = {
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      message: `Shared a file: ${file.name}`,
      timestamp: Date.now(),
      type: 'file',
      fileName: file.name,
      fileUrl: URL.createObjectURL(file)
    };

    const updatedMessages = [...messages, fileMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`chat_${groupId}`, JSON.stringify(updatedMessages));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-indigo-50 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-6 w-6 text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{groupName} Chat</h3>
              <p className="text-sm text-gray-600">Study group discussion</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600">12 members</span>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.type === 'system'
                  ? 'bg-gray-100 text-gray-600 text-center mx-auto'
                  : message.userId === user?.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-900'
                  }`}
              >
                {message.type !== 'system' && (
                  <div className="text-xs font-medium mb-1 opacity-75">
                    {message.username}
                  </div>
                )}
                <div className="text-sm">{message.message}</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs opacity-75 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(message.timestamp)}
                  </div>
                  {message.type === 'file' && (
                    <a
                      href={message.fileUrl}
                      download={message.fileName}
                      className="text-xs underline hover:no-underline"
                    >
                      Download
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm">
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="ml-2">
                    {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <label className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
            </label>

            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
