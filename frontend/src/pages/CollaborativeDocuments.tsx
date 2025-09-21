import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CollaborativeEditor from '../components/CollaborativeEditor';
import FileSharing from '../components/FileSharing';
import {
  FileText,
  Upload,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Users,
  Calendar,
  Star,
  MoreVertical,
  Edit,
  Eye,
  Share2,
  Download,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Folder,
  File,
  Image,
  Video,
  Archive,
  Music,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'document' | 'spreadsheet' | 'presentation';
  owner: string;
  collaborators: string[];
  lastModified: Date;
  size: number;
  isPublic: boolean;
  permissions: {
    canEdit: string[];
    canView: string[];
    canComment: string[];
  };
  version: number;
  description: string;
  tags: string[];
  thumbnail?: string;
}

const CollaborativeDocuments: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'collaborators'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showFileSharing, setShowFileSharing] = useState(false);
  const [expandedDocument, setExpandedDocument] = useState<string | null>(null);

  // Mock documents data
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'doc1',
        title: 'React Advanced Patterns Study Guide',
        type: 'document',
        owner: 'alice_dev',
        collaborators: ['bob_react', 'carol_js', user?.id || 'demo_user'],
        lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000),
        size: 2.5 * 1024 * 1024,
        isPublic: false,
        permissions: {
          canEdit: ['alice_dev', 'bob_react'],
          canView: ['alice_dev', 'bob_react', 'carol_js', user?.id || 'demo_user'],
          canComment: ['alice_dev', 'bob_react', 'carol_js', user?.id || 'demo_user']
        },
        version: 12,
        description: 'Comprehensive study guide covering advanced React patterns and best practices',
        tags: ['React', 'JavaScript', 'Patterns', 'Study Guide']
      },
      {
        id: 'doc2',
        title: 'Mathematics Problem Solutions',
        type: 'document',
        owner: 'carol_js',
        collaborators: ['alice_dev', 'bob_react'],
        lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000),
        size: 1.8 * 1024 * 1024,
        isPublic: true,
        permissions: {
          canEdit: ['carol_js'],
          canView: ['alice_dev', 'bob_react', 'carol_js', user?.id || 'demo_user'],
          canComment: ['alice_dev', 'bob_react', 'carol_js', user?.id || 'demo_user']
        },
        version: 8,
        description: 'Step-by-step solutions to complex mathematics problems',
        tags: ['Mathematics', 'Solutions', 'Problems']
      },
      {
        id: 'doc3',
        title: 'Web Development Project Timeline',
        type: 'spreadsheet',
        owner: 'bob_react',
        collaborators: ['alice_dev', 'carol_js'],
        lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        size: 0.5 * 1024 * 1024,
        isPublic: false,
        permissions: {
          canEdit: ['bob_react', 'alice_dev'],
          canView: ['bob_react', 'alice_dev', 'carol_js'],
          canComment: ['bob_react', 'alice_dev', 'carol_js']
        },
        version: 5,
        description: 'Project timeline and task management for web development course',
        tags: ['Project', 'Timeline', 'Web Development']
      },
      {
        id: 'doc4',
        title: 'Study Group Presentation',
        type: 'presentation',
        owner: 'alice_dev',
        collaborators: ['bob_react', 'carol_js', user?.id || 'demo_user'],
        lastModified: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        size: 3.2 * 1024 * 1024,
        isPublic: true,
        permissions: {
          canEdit: ['alice_dev'],
          canView: ['alice_dev', 'bob_react', 'carol_js', user?.id || 'demo_user'],
          canComment: ['alice_dev', 'bob_react', 'carol_js', user?.id || 'demo_user']
        },
        version: 3,
        description: 'Presentation slides for study group meeting on advanced topics',
        tags: ['Presentation', 'Study Group', 'Slides']
      }
    ];
    setDocuments(mockDocuments);
  }, [user]);

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'spreadsheet':
        return <FileText className="h-8 w-8 text-green-500" />;
      case 'presentation':
        return <FileText className="h-8 w-8 text-purple-500" />;
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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === '' || doc.type === selectedType;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'date':
        comparison = a.lastModified.getTime() - b.lastModified.getTime();
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'collaborators':
        comparison = a.collaborators.length - b.collaborators.length;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const canEdit = (doc: Document) => doc.permissions.canEdit.includes(user?.id || '');
  const canView = (doc: Document) => doc.permissions.canView.includes(user?.id || '');

  const handleOpenDocument = (docId: string) => {
    if (canView(documents.find(d => d.id === docId)!)) {
      setSelectedDocument(docId);
      setShowEditor(true);
    } else {
      alert('You do not have permission to view this document');
    }
  };

  const handleCreateDocument = () => {
    setShowCreateModal(true);
  };

  const handleCreateNewDocument = (docData: { title: string; type: string; description: string }) => {
    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      title: docData.title,
      type: docData.type as any,
      owner: user?.id || 'demo_user',
      collaborators: [user?.id || 'demo_user'],
      lastModified: new Date(),
      size: 0,
      isPublic: false,
      permissions: {
        canEdit: [user?.id || 'demo_user'],
        canView: [user?.id || 'demo_user'],
        canComment: [user?.id || 'demo_user']
      },
      version: 1,
      description: docData.description,
      tags: []
    };
    setDocuments(prev => [newDoc, ...prev]);
    setShowCreateModal(false);
    setSelectedDocument(newDoc.id);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Collaborative Documents</h1>
              <p className="text-gray-600">Create, edit, and collaborate on documents in real-time</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFileSharing(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Folder className="h-5 w-5" />
              <span>File Sharing</span>
            </button>
            <button
              onClick={handleCreateDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>New Document</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="glass p-6 rounded-xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
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
                <option value="spreadsheet">Spreadsheets</option>
                <option value="presentation">Presentations</option>
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
                <option value="date-desc">Recently Modified</option>
                <option value="date-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="size-desc">Largest First</option>
                <option value="size-asc">Smallest First</option>
                <option value="collaborators-desc">Most Collaborators</option>
                <option value="collaborators-asc">Least Collaborators</option>
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

        {/* Documents Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="glass p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  {getDocumentIcon(doc.type)}
                  <div className="flex items-center space-x-2">
                    {doc.isPublic ? (
                      <Eye className="h-4 w-4 text-green-500"  />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-500"  />
                    )}
                    <span className="text-sm text-gray-500">v{doc.version}</span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatFileSize(doc.size)}</span>
                    <span>{doc.collaborators.length} collaborators</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Modified {doc.lastModified.toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{doc.tags.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {canView(doc) && (
                    <button
                      onClick={() => handleOpenDocument(doc.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Open</span>
                    </button>
                  )}
                  <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  {canEdit(doc) && (
                    <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="glass p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  {getDocumentIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                      {doc.isPublic ? (
                        <Eye className="h-4 w-4 text-green-500"  />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500"  />
                      )}
                      <span className="text-sm text-gray-500">v{doc.version}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{doc.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{doc.collaborators.length} collaborators</span>
                      <span>Modified {doc.lastModified.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {canView(doc) && (
                      <button
                        onClick={() => handleOpenDocument(doc.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Open</span>
                      </button>
                    )}
                    <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                    {canEdit(doc) && (
                      <button className="p-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType ? 'Try adjusting your search criteria.' : 'Create your first collaborative document!'}
            </p>
            <button
              onClick={handleCreateDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Create Document
            </button>
          </div>
        )}

        {/* Create Document Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Document</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateNewDocument({
                  title: formData.get('title') as string,
                  type: formData.get('type') as string,
                  description: formData.get('description') as string
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="document">Document</option>
                      <option value="spreadsheet">Spreadsheet</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Collaborative Editor */}
        {showEditor && selectedDocument && (
          <CollaborativeEditor
            documentId={selectedDocument}
            isOpen={showEditor}
            onClose={() => {
              setShowEditor(false);
              setSelectedDocument(null);
            }}
          />
        )}

        {/* File Sharing */}
        <FileSharing
          groupId="demo-group"
          isOpen={showFileSharing}
          onClose={() => setShowFileSharing(false)}
        />
      </div>
    </div>
  );
};

export default CollaborativeDocuments;
