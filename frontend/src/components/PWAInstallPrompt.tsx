import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';

interface PWAInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      // Check if running in standalone mode
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(standalone);

      // Check if app is installed
      if (standalone || (window.navigator as any).standalone) {
        setIsInstalled(true);
      }
    };

    checkInstallStatus();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
      onClose();
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  };

  const getInstallButtonText = () => {
    if (isInstalled) return 'Already Installed';
    if (deferredPrompt) return 'Install App';
    return 'Install Not Available';
  };

  const getInstallButtonIcon = () => {
    if (isInstalled) return <Monitor className="h-5 w-5" />;
    if (deferredPrompt) return <Download className="h-5 w-5" />;
    return <Smartphone className="h-5 w-5" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Install App</h3>
              <p className="text-sm text-gray-600">Get the full mobile experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {isInstalled ? 'App Already Installed!' : 'Install Study Platform'}
            </h4>
            <p className="text-gray-600 text-sm">
              {isInstalled
                ? 'You already have the app installed and can access it from your home screen.'
                : 'Install our app for a better mobile experience with offline capabilities.'
              }
            </p>
          </div>

          {/* Features */}
          {!isInstalled && (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <WifiOff className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Offline Access</div>
                  <div className="text-sm text-blue-700">Use the app without internet</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Mobile Optimized</div>
                  <div className="text-sm text-green-700">Designed for mobile devices</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <Download className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">Fast Loading</div>
                  <div className="text-sm text-purple-700">Quick access from home screen</div>
                </div>
              </div>
            </div>
          )}

          {/* Installation Instructions */}
          {!isInstalled && !deferredPrompt && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Manual Installation:</h5>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Chrome/Edge:</strong> Click the install button in the address bar</p>
                <p><strong>Safari:</strong> Tap Share → Add to Home Screen</p>
                <p><strong>Firefox:</strong> Tap the menu → Install</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isInstalled ? 'Close' : 'Maybe Later'}
          </button>

          {!isInstalled && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {getInstallButtonIcon()}
              <span>Install</span>
            </button>
          )}
        </div>

        {/* Status */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            {isInstalled ? (
              <>
                <Monitor className="h-4 w-4 text-green-500" />
                <span>App is installed and ready to use</span>
              </>
            ) : (
              <>
                <Smartphone className="h-4 w-4 text-gray-400" />
                <span>Install for better mobile experience</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
