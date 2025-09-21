import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Bell, X, CheckCircle, AlertCircle, Info, Star } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      } else {
        // Add some demo notifications
        const demoNotifications: Notification[] = [
          {
            id: 'demo_1',
            type: 'achievement',
            title: 'Welcome to the Platform!',
            message: 'You\'ve earned your first achievement: "New Learner"',
            timestamp: Date.now() - 3600000,
            read: false,
            actionUrl: '/profile',
            actionText: 'View Profile'
          },
          {
            id: 'demo_2',
            type: 'info',
            title: 'Study Group Invitation',
            message: 'You\'ve been invited to join "Advanced React Development"',
            timestamp: Date.now() - 7200000,
            read: false,
            actionUrl: '/groups',
            actionText: 'View Groups'
          },
          {
            id: 'demo_3',
            type: 'success',
            title: 'Resource Uploaded',
            message: 'Your resource "React Hooks Guide" has been successfully uploaded',
            timestamp: Date.now() - 10800000,
            read: true
          }
        ];
        setNotifications(demoNotifications);
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(demoNotifications));
      }
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      );
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notif => ({ ...notif, read: true }));
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(notif => notif.id !== id);
      if (user) {
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    if (user) {
      localStorage.removeItem(`notifications_${user.id}`);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Notification Bell Component
export const NotificationBell: React.FC = () => {
  const { unreadCount, notifications, removeNotification, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'achievement': return <Star className="h-4 w-4 text-purple-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                    }`}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.actionUrl && notification.actionText && (
                        <a
                          href={notification.actionUrl}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1 inline-block"
                        >
                          {notification.actionText} →
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => removeNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
