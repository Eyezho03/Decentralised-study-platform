import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import UploadModal from '../components/UploadModal';
import {
  Search,
  Filter,
  Upload,
  Download,
  Star,
  FileText,
  Video,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';

/**
 * Resources page for browsing and uploading study materials
 */
const Resources: React.FC = () => {
  const { user } = useAuth();
  const { resources, uploadResource, refreshData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const resourceTypes = [
    { value: '', label: 'All Types' },
    { value: 'document', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { value: 'video', label: 'Videos', icon: <Video className="h-4 w-4" /> },
    { value: 'link', label: 'Links', icon: <LinkIcon className="h-4 w-4" /> },
    { value: 'quiz', label: 'Quizzes', icon: <HelpCircle className="h-4 w-4" /> }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === '' || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'video': return <Video className="h-5 w-5 text-red-500" />;
      case 'link': return <LinkIcon className="h-5 w-5 text-green-500" />;
      case 'quiz': return <HelpCircle className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800';
      case 'video': return 'bg-red-100 text-red-800';
      case 'link': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadResource = async (resourceId: string) => {
    try {
      // In a real app, this would call the canister method
      console.log(`Downloading resource ${resourceId}`);
      // For now, we'll just show a success message
      alert('Download started! (This would download the actual file in production)');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleUpload = async (formData: any) => {
    setIsUploading(true);
    try {
      const resourceId = await uploadResource({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        ipfsHash: formData.ipfsHash || 'mock-hash-' + Date.now(),
        uploader: user?.id || 'demo-user'
      });

      console.log('Resource uploaded successfully with ID:', resourceId);
      await refreshData();
      setShowUploadModal(false);
      alert('Resource uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Resources</h1>
          <p className="text-gray-600 mt-2">Browse and share study materials with the community</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
        >
          <Upload className="h-5 w-5 mr-2" />
          Upload Resource
        </button>
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
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="md:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="glass p-6 rounded-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getTypeIcon(resource.type)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                  {resource.type}
                </span>
              </div>
              <div className="flex items-center text-yellow-500">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{resource.rating}</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <span>By {resource.uploader}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Download className="h-4 w-4 mr-1" />
                <span>{resource.downloads} downloads</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>{new Date(Number(resource.uploadDate) / 1000000).toLocaleDateString()}</span>
              </div>
            </div>

            <button
              onClick={() => downloadResource(resource.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or upload a new resource.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Your First Resource
          </button>
        </div>
      )}

      {/* Upload Guidelines */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Accepted Formats</h4>
            <ul className="space-y-1">
              <li>• Documents: PDF, DOC, TXT, MD</li>
              <li>• Videos: MP4, WebM, MOV</li>
              <li>• Images: JPG, PNG, GIF</li>
              <li>• Code: ZIP, TAR, GZ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Best Practices</h4>
            <ul className="space-y-1">
              <li>• Use descriptive titles and descriptions</li>
              <li>• Tag resources appropriately</li>
              <li>• Ensure content is educational</li>
              <li>• Respect copyright and licensing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
};

export default Resources;
