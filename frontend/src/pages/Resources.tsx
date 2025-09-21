import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import AdvancedResourceSearch from '../components/AdvancedResourceSearch';
import UploadModal from '../components/UploadModal';
import {
  Upload,
  Plus,
  BookOpen
} from 'lucide-react';

/**
 * Resources page with advanced search and filtering capabilities
 */
const Resources: React.FC = () => {
  const { user } = useAuth();
  const { uploadResource, refreshData } = useData();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (resourceData: {
    title: string;
    description: string;
    type: string;
    ipfsHash: string;
  }) => {
    try {
      setIsUploading(true);
      await uploadResource({
        ...resourceData,
        uploader: user?.id || 'demo_user',
        type: resourceData.type as 'document' | 'video' | 'link' | 'quiz'
      });
      await refreshData();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Upload Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Study Resources</h1>
              <p className="text-gray-600">Discover and share educational materials</p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Upload Resource</span>
          </button>
        </div>

        {/* Advanced Search Component */}
        <AdvancedResourceSearch />

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={handleUpload}
            isUploading={isUploading}
          />
        )}
      </div>
    </div>
  );
};

export default Resources;