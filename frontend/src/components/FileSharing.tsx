import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Upload,
  Download,
  Share2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  File,
  Copy,
  Link,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Users,
  Calendar,
  MoreVertical,
  Trash2,
  Edit,
  Star,
  Search,
  Filter,
  Grid,
  List,
  X,
  Plus,
  Folder,
  FolderOpen
} from 'lucide-react';

interface SharedFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size: number;
  uploader: string;
  uploadDate: Date;
  isPublic: boolean;
  permissions: {
    canView: string[];
    canEdit: string[];
    canDownload: string[];
  };
  downloadCount: number;
  rating: number;
  tags: string[];
  description: string;
  thumbnail?: string;
}

interface FileSharingProps {
  groupId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const FileSharing: React.FC<FileSharingProps> = ({ groupId, isOpen, onClose }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'downloads'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock files data
  useEffect(() => {
    if (isOpen) {
      const mockFiles: SharedFile[] = [
        {
          id: 'file1',
          name: 'React Hooks Guide.pdf',
          type: 'document',
          size: 2.5 * 1024 * 1024, // 2.5 MB
          uploader: 'alice_dev',
          uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isPublic: true,
          permissions: {
            canView: ['alice_dev', 'bob_react', 'carol_js'],
            canEdit: ['alice_dev'],
            canDownload: ['alice_dev', 'bob_react', 'carol_js']
          },
          downloadCount: 45,
          rating: 4.8,
          tags: ['React', 'JavaScript', 'Hooks'],
          description: 'Comprehensive guide to React hooks with examples'
        },
        {
          id: 'file2',
          name: 'TypeScript Patterns.mp4',
          type: 'video',
          size: 45.2 * 1024 * 1024, // 45.2 MB
          uploader: 'bob_react',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isPublic: false,
          permissions: {
            canView: ['alice_dev', 'bob_react', 'carol_js'],
            canEdit: ['bob_react'],
            canDownload: ['alice_dev', 'bob_react', 'carol_js']
          },
          downloadCount: 23,
          rating: 4.9,
          tags: ['TypeScript', 'Patterns', 'Advanced'],
          description: 'Video tutorial on advanced TypeScript patterns'
        },
        {
          id: 'file3',
          name: 'Math Problems.png',
          type: 'image',
          size: 1.8 * 1024 * 1024, // 1.8 MB
          uploader: 'carol_js',
          uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isPublic: true,
          permissions: {
            canView: ['alice_dev', 'bob_react', 'carol_js'],
            canEdit: ['carol_js'],
            canDownload: ['alice_dev', 'bob_react', 'carol_js']
          },
          downloadCount: 67,
          rating: 4.6,
          tags: ['Mathematics', 'Problems', 'Visual'],
          description: 'Visual representation of complex math problems'
        },
        {
          id: 'file4',
          name: 'Study Notes.zip',
          type: 'archive',
          size: 12.3 * 1024 * 1024, // 12.3 MB
          uploader: 'alice_dev',
          uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          isPublic: false,
          permissions: {
            canView: ['alice_dev', 'bob_react'],
            canEdit: ['alice_dev'],
            canDownload: ['alice_dev', 'bob_react']
          },
          downloadCount: 12,
          rating: 4.7,
          tags: ['Notes', 'Study', 'Archive'],
          description: 'Compiled study notes and resources'
        }
      ];
      setFiles(mockFiles);
    }
  }, [isOpen]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'image':
        return <Image className="h-8 w-8 text-green-500" />;
      case 'video':
        return <Video className="h-8 w-8 text-red-500" />;
      case 'audio':
        return <Music className="h-8 w-8 text-purple-500" />;
      case 'archive':
        return <Archive className="h-8 w-8 text-orange-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === '' || file.type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'downloads':
        comparison = a.downloadCount - b.downloadCount;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleDownload = (file: SharedFile) => {
    if (file.permissions.canDownload.includes(user?.id || '')) {
      console.log(`Downloading ${file.name}`);
      // In real app, this would trigger actual download
      alert(`Downloading ${file.name}...`);
    } else {
      alert('You do not have permission to download this file');
    }
  };

  const handleShare = (file: SharedFile) => {
    setShowShareModal(true);
    // In real app, this would open share modal
  };

  const canEdit = (file: SharedFile) => file.permissions.canEdit.includes(user?.id || '');
  const canDownload = (file: SharedFile) => file.permissions.canDownload.includes(user?.id || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex flex-col">
      <div className="bg-white rounded-lg shadow-xl m-4 flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Folder className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">File Sharing</h2>
                <p className="text-gray-600">Share and collaborate on files with your study group</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Upload</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="document">Documents</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="archive">Archives</option>
              </select>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy as any);
                  setSortOrder(newSortOrder as any);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Largest First</option>
                <option value="size-asc">Smallest First</option>
                <option value="downloads-desc">Most Downloaded</option>
                <option value="downloads-asc">Least Downloaded</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {viewMode === 'grid' ? <List className="h-5 w-5" /> : <Grid className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    {getFileIcon(file.type)}
                    <div className="flex items-center space-x-1">
                      {file.isPublic ? (
                        <Eye className="h-4 w-4 text-green-500"  />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500"  />
                      )}
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4" />
                        <span className="text-sm font-medium ml-1">{file.rating}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-2 truncate" title={file.name}>
                    {file.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {file.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.downloadCount} downloads</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      By {file.uploader} • {file.uploadDate.toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {file.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{file.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {canDownload(file) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(file);
                      }}
                      className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                    {canEdit(file) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit file
                        }}
                        className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer ${selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                      {file.isPublic ? (
                        <Eye className="h-4 w-4 text-green-500"  />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500"  />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{file.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.downloadCount} downloads</span>
                      <span>By {file.uploader}</span>
                      <span>{file.uploadDate.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium ml-1">{file.rating}</span>
                    </div>
                    {canDownload(file) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(file);
                      }}
                      className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredFiles.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedType ? 'Try adjusting your search criteria.' : 'Upload your first file to get started!'}
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Upload File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileSharing;
