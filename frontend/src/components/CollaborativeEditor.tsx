import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Save,
  Download,
  Share2,
  Users,
  Clock,
  FileText,
  Edit3,
  Eye,
  EyeOff,
  MoreVertical,
  Copy,
  Trash2,
  History,
  Lock,
  Unlock,
  UserPlus,
  MessageSquare,
  Palette,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  Code,
  Undo,
  Redo,
  Search,
  Replace,
  Settings,
  X
} from 'lucide-react';

interface CollaborativeDocument {
  id: string;
  title: string;
  content: string;
  owner: string;
  collaborators: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  permissions: {
    canEdit: string[];
    canView: string[];
    canComment: string[];
  };
}

interface User {
  id: string;
  username: string;
  avatar: string;
  color: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  position: { start: number; end: number };
  timestamp: Date;
  resolved: boolean;
}

interface CollaborativeEditorProps {
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ documentId, isOpen, onClose }) => {
  const { user } = useAuth();
  const [document, setDocument] = useState<CollaborativeDocument | null>(null);
  const [content, setContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock document data
  useEffect(() => {
    if (isOpen && documentId) {
      const mockDocument: CollaborativeDocument = {
        id: documentId,
        title: 'Study Notes: React Advanced Patterns',
        content: `# React Advanced Patterns

## Introduction
This document covers advanced React patterns and techniques for building scalable applications.

## Higher-Order Components (HOCs)
HOCs are functions that take a component and return a new component with additional functionality.

\`\`\`javascript
const withLoading = (WrappedComponent) => {
  return class extends React.Component {
    render() {
      if (this.props.isLoading) {
        return <div>Loading...</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  };
};
\`\`\`

## Render Props
Render props is a technique for sharing code between React components using a prop whose value is a function.

\`\`\`javascript
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)} />
\`\`\`

## Custom Hooks
Custom hooks allow you to extract component logic into reusable functions.

\`\`\`javascript
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  
  return { count, increment, decrement };
}
\`\`\`

## Context API Best Practices
The Context API is great for sharing data across components without prop drilling.

### When to Use Context
- Theme data
- User authentication
- Language preferences
- Global state that doesn't change often

### Performance Considerations
- Split contexts by concern
- Use multiple contexts instead of one large context
- Consider using useMemo for context values`,
        owner: 'alice_dev',
        collaborators: ['bob_react', 'carol_js', user?.id || 'demo_user'],
        isPublic: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        version: 12,
        permissions: {
          canEdit: ['alice_dev', 'bob_react', 'carol_js'],
          canView: ['alice_dev', 'bob_react', 'carol_js', 'demo_user'],
          canComment: ['alice_dev', 'bob_react', 'carol_js', 'demo_user']
        }
      };

      const mockCollaborators: User[] = [
        { id: 'alice_dev', username: 'Alice', avatar: 'A', color: '#3B82F6' },
        { id: 'bob_react', username: 'Bob', avatar: 'B', color: '#10B981' },
        { id: 'carol_js', username: 'Carol', avatar: 'C', color: '#F59E0B' },
        { id: user?.id || 'demo_user', username: user?.username || 'You', avatar: user?.username?.[0] || 'U', color: '#EF4444' }
      ];

      const mockComments: Comment[] = [
        {
          id: 'comment1',
          userId: 'bob_react',
          username: 'Bob',
          content: 'Great explanation of HOCs! Should we add more examples?',
          position: { start: 200, end: 250 },
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          resolved: false
        },
        {
          id: 'comment2',
          userId: 'carol_js',
          username: 'Carol',
          content: 'The custom hooks example is very helpful. Thanks!',
          position: { start: 800, end: 850 },
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          resolved: true
        }
      ];

      setDocument(mockDocument);
      setContent(mockDocument.content);
      setCollaborators(mockCollaborators);
      setComments(mockComments);
    }
  }, [isOpen, documentId, user]);

  // Auto-save functionality
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newContent);
    }, 2000); // Auto-save after 2 seconds of inactivity
  }, []);

  const saveDocument = async (contentToSave: string) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setDocument(prev => prev ? {
        ...prev,
        content: contentToSave,
        updatedAt: new Date(),
        version: prev.version + 1
      } : null);

      setLastSaved(new Date());
      console.log('Document saved successfully');
    } catch (error) {
      console.error('Failed to save document:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveDocument(content);
  };

  const canEdit = document?.permissions.canEdit.includes(user?.id || '') || false;
  const canComment = document?.permissions.canComment.includes(user?.id || '') || false;

  const formatToolbarButton = (command: string, icon: React.ReactNode, title: string) => (
    <button
      onClick={() => {
        if (typeof window !== 'undefined' && window.document && window.document.execCommand) {
          window.document.execCommand(command, false);
        }
      }}
      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      title={title}
    >
      {icon}
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{document?.title}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Version {document?.version}</span>
                <span>•</span>
                <span>Last updated {document?.updatedAt.toLocaleString()}</span>
                {lastSaved && (
                  <>
                    <span>•</span>
                    <span className="text-green-600">Saved {lastSaved.toLocaleTimeString()}</span>
                  </>
                )}
                {isSaving && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600">Saving...</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Collaborators */}
            <button
              onClick={() => setShowCollaborators(!showCollaborators)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">{collaborators.length}</span>
            </button>

            {/* Comments */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">{comments.filter(c => !c.resolved).length}</span>
            </button>

            {/* Share */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="flex items-center space-x-1">
              {/* Formatting */}
              <div className="flex items-center space-x-1 border-r border-gray-300 pr-4">
                {formatToolbarButton('bold', <Bold className="h-4 w-4" />, 'Bold')}
                {formatToolbarButton('italic', <Italic className="h-4 w-4" />, 'Italic')}
                {formatToolbarButton('underline', <Underline className="h-4 w-4" />, 'Underline')}
              </div>

              {/* Lists */}
              <div className="flex items-center space-x-1 border-r border-gray-300 pr-4">
                {formatToolbarButton('insertUnorderedList', <List className="h-4 w-4" />, 'Bullet List')}
                {formatToolbarButton('insertOrderedList', <ListOrdered className="h-4 w-4" />, 'Numbered List')}
              </div>

              {/* Insert */}
              <div className="flex items-center space-x-1 border-r border-gray-300 pr-4">
                {formatToolbarButton('createLink', <Link className="h-4 w-4" />, 'Insert Link')}
                {formatToolbarButton('insertImage', <Image className="h-4 w-4" />, 'Insert Image')}
                {formatToolbarButton('insertTable', <Table className="h-4 w-4" />, 'Insert Table')}
              </div>

              {/* Code */}
              <div className="flex items-center space-x-1 border-r border-gray-300 pr-4">
                {formatToolbarButton('formatCode', <Code className="h-4 w-4" />, 'Code Block')}
                {formatToolbarButton('formatBlockquote', <Quote className="h-4 w-4" />, 'Quote')}
              </div>

              {/* History */}
              <div className="flex items-center space-x-1">
                {formatToolbarButton('undo', <Undo className="h-4 w-4" />, 'Undo')}
                {formatToolbarButton('redo', <Redo className="h-4 w-4" />, 'Redo')}
              </div>

              <div className="flex-1" />

              {/* Actions */}
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span className="text-sm font-medium">Save</span>
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-6">
            <div
              ref={editorRef}
              contentEditable={canEdit}
              onInput={(e) => handleContentChange(e.currentTarget.innerHTML)}
              className="w-full h-full p-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent prose max-w-none"
              style={{ minHeight: '500px' }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>

        {/* Sidebar */}
        {(showCollaborators || showComments) && (
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            {/* Collaborators Panel */}
            {showCollaborators && (
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborators</h3>
                <div className="space-y-3">
                  {collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{collaborator.username}</div>
                        <div className="text-xs text-gray-500">
                          {document?.permissions.canEdit.includes(collaborator.id) ? 'Can edit' : 'Can view'}
                        </div>
                      </div>
                      {collaborator.id === user?.id && (
                        <span className="text-xs text-blue-600 font-medium">You</span>
                      )}
                    </div>
                  ))}
                </div>

                <button className="w-full mt-4 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  <UserPlus className="h-4 w-4 inline mr-2" />
                  Invite Collaborators
                </button>
              </div>
            )}

            {/* Comments Panel */}
            {showComments && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                            {comment.username[0]}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{comment.username}</span>
                        </div>
                        <span className="text-xs text-gray-500">{comment.timestamp.toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-2">
                        <button className="text-xs text-blue-600 hover:text-blue-700">Reply</button>
                        {!comment.resolved && (
                          <button className="text-xs text-green-600 hover:text-green-700">Resolve</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {canComment && (
                  <div className="mt-4">
                    <textarea
                      placeholder="Add a comment..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows={3}
                    />
                    <button className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                      Add Comment
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeEditor;
