import React from 'react';
import { WifiOff, RefreshCw, Home, BookOpen, Users } from 'lucide-react';

const OfflinePage: React.FC = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You're Offline</h1>
          <p className="text-gray-600">
            It looks like you've lost your internet connection. Don't worry, you can still access some features offline.
          </p>
        </div>

        {/* Offline Features */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Offline</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900">Study Resources</div>
                <div className="text-sm text-green-700">Access downloaded materials</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900">Study Groups</div>
                <div className="text-sm text-blue-700">View cached group information</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <div className="font-medium text-purple-900">Documents</div>
                <div className="text-sm text-purple-700">Edit offline documents</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go to Home</span>
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 text-sm text-gray-500">
          <p className="mb-2">💡 <strong>Tip:</strong> Some features work offline!</p>
          <p>Your data will sync automatically when you're back online.</p>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;
