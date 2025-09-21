import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Download,
  Cloud,
  CloudOff,
  RefreshCw,
  Battery,
  Signal,
  Moon,
  Sun,
  Settings,
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  FileText,
  Trophy,
  Brain,
  Video,
  Bell,
  User,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Calendar,
  Star,
  Download as DownloadIcon,
  Upload,
  Trash2,
  Edit,
  Share2,
  Heart,
  Bookmark,
  Eye,
  EyeOff
} from 'lucide-react';

interface OfflineData {
  studyGroups: any[];
  resources: any[];
  documents: any[];
  userProfile: any;
  lastSync: Date | null;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
}

interface MobileAppProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileApp: React.FC<MobileAppProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { studyGroups, resources, refreshData } = useData();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    studyGroups: [],
    resources: [],
    documents: [],
    userProfile: null,
    lastSync: null,
    syncStatus: 'offline'
  });
  const [activeTab, setActiveTab] = useState('home');
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [signalStrength, setSignalStrength] = useState(4);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline data from localStorage
  useEffect(() => {
    const loadOfflineData = () => {
      try {
        const savedData = localStorage.getItem('offlineData');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setOfflineData({
            ...parsed,
            lastSync: parsed.lastSync ? new Date(parsed.lastSync) : null
          });
        }
      } catch (error) {
        console.error('Error loading offline data:', error);
      }
    };

    loadOfflineData();
  }, []);

  // Save data for offline use
  const saveOfflineData = () => {
    try {
      const dataToSave: OfflineData = {
        studyGroups,
        resources,
        documents: [], // Mock documents
        userProfile: user,
        lastSync: new Date(),
        syncStatus: 'synced'
      };
      localStorage.setItem('offlineData', JSON.stringify(dataToSave));
      setOfflineData(dataToSave);
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  };

  // Sync data when online
  const syncData = async () => {
    if (!isOnline) return;

    setIsSyncing(true);
    try {
      await refreshData();
      saveOfflineData();
      setOfflineData(prev => ({ ...prev, syncStatus: 'synced' }));
    } catch (error) {
      console.error('Sync failed:', error);
      setOfflineData(prev => ({ ...prev, syncStatus: 'error' }));
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && offlineData.syncStatus !== 'synced') {
      syncData();
    }
  }, [isOnline]);

  // Mock battery and signal data
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2));
      setSignalStrength(prev => Math.max(1, prev + (Math.random() - 0.5) * 2));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getSyncStatusIcon = () => {
    switch (offlineData.syncStatus) {
      case 'synced':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'syncing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSyncStatusText = () => {
    switch (offlineData.syncStatus) {
      case 'synced':
        return 'Synced';
      case 'syncing':
        return 'Syncing...';
      case 'error':
        return 'Sync Error';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const mobileTabs = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { id: 'groups', label: 'Groups', icon: <Users className="h-5 w-5" /> },
    { id: 'resources', label: 'Resources', icon: <BookOpen className="h-5 w-5" /> },
    { id: 'documents', label: 'Docs', icon: <FileText className="h-5 w-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-5 w-5" /> }
  ];

  const renderHomeTab = () => (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Status</h3>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-600">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Sync Status</span>
            <div className="flex items-center space-x-2">
              {getSyncStatusIcon()}
              <span className="text-sm text-gray-900">{getSyncStatusText()}</span>
            </div>
          </div>

          {offlineData.lastSync && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm text-gray-900">
                {offlineData.lastSync.toLocaleTimeString()}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Offline Data</span>
            <span className="text-sm text-gray-900">
              {offlineData.studyGroups.length + offlineData.resources.length} items
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Plus className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">New Group</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Upload className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Upload</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">New Doc</span>
          </button>
          <button className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Achievements</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Joined React Study Group</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Uploaded Study Notes</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Trophy className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Earned "First Group" Badge</p>
              <p className="text-xs text-gray-500">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGroupsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Study Groups</h3>
        <button className="p-2 bg-blue-600 text-white rounded-lg">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {offlineData.studyGroups.slice(0, 5).map((group, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{group.name || `Group ${index + 1}`}</h4>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">{group.members?.length || 5}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {group.description || 'Study group description'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {group.subject || 'Computer Science'}
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-blue-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 text-green-600">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResourcesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
        <button className="p-2 bg-green-600 text-white rounded-lg">
          <Upload className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {offlineData.resources.slice(0, 5).map((resource, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{resource.title || `Resource ${index + 1}`}</h4>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-500">{resource.rating || '4.5'}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {resource.description || 'Resource description'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {resource.type || 'Document'}
              </span>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-blue-600">
                  <DownloadIcon className="h-4 w-4" />
                </button>
                <button className="p-1 text-red-600">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
        <button className="p-2 bg-purple-600 text-white rounded-lg">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {[
          { title: 'React Study Notes', type: 'Document', modified: '2 hours ago' },
          { title: 'Math Problems', type: 'Spreadsheet', modified: '1 day ago' },
          { title: 'Project Timeline', type: 'Presentation', modified: '3 days ago' }
        ].map((doc, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">{doc.title}</h4>
              <span className="text-xs text-gray-500">{doc.type}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Modified {doc.modified}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Collaborative</span>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-blue-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1 text-green-600">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {user?.username?.[0] || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user?.username || 'Demo User'}</h3>
            <p className="text-sm text-gray-600">{user?.email || 'demo@example.com'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{user?.studyTokens?.toString() || '1000'}</div>
            <div className="text-sm text-gray-600">Study Tokens</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{user?.studyStreak || 7}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Settings</h4>
        <div className="space-y-3">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="h-5 w-5 text-gray-600" /> : <Sun className="h-5 w-5 text-gray-600" />}
              <span className="text-sm font-medium text-gray-900">Dark Mode</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`} />
            </div>
          </button>

          <button
            onClick={() => setShowOfflineModal(true)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Offline Mode</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>

          <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">Notifications</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeTab();
      case 'groups':
        return renderGroupsTab();
      case 'resources':
        return renderResourcesTab();
      case 'documents':
        return renderDocumentsTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderHomeTab();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm h-[600px] flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Study Platform</h2>
              <div className="flex items-center space-x-2 text-xs">
                {isOnline ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Signal className="h-3 w-3" />
              <span className="text-xs">{signalStrength}/4</span>
            </div>
            <div className="flex items-center space-x-1">
              <Battery className="h-3 w-3" />
              <span className="text-xs">{Math.round(batteryLevel)}%</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderTabContent()}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-50 border-t border-gray-200 p-2">
          <div className="flex items-center justify-around">
            {mobileTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.icon}
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Offline Modal */}
        {showOfflineModal && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Offline Mode</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Download for Offline</span>
                  <button
                    onClick={saveOfflineData}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                  >
                    Download
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sync Data</span>
                  <button
                    onClick={syncData}
                    disabled={!isOnline || isSyncing}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                  >
                    {isSyncing ? 'Syncing...' : 'Sync'}
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  {isOnline ? 'You are online. Data will sync automatically.' : 'You are offline. Some features may be limited.'}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowOfflineModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileApp;