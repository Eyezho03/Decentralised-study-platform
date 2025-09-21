import React, { useState } from 'react';
import { Upload, X, FileText, Video, Link as LinkIcon, HelpCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: any) => Promise<void>;
  isUploading: boolean;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload, isUploading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'document',
    ipfsHash: ''
  });

  const resourceTypes = [
    { value: 'document', label: 'Document', icon: <FileText className="h-4 w-4" /> },
    { value: 'video', label: 'Video', icon: <Video className="h-4 w-4" /> },
    { value: 'link', label: 'Link', icon: <LinkIcon className="h-4 w-4" /> },
    { value: 'quiz', label: 'Quiz', icon: <HelpCircle className="h-4 w-4" /> }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpload(formData);
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'document',
      ipfsHash: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upload Resource</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Resource Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Resource Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a descriptive title for your resource"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Describe what this resource contains and how it can help learners..."
              />
            </div>

            {/* Resource Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {resourceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* IPFS Hash (for demo purposes) */}
            <div>
              <label htmlFor="ipfsHash" className="block text-sm font-medium text-gray-700 mb-2">
                IPFS Hash (Optional)
              </label>
              <input
                id="ipfsHash"
                name="ipfsHash"
                type="text"
                value={formData.ipfsHash}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter IPFS hash if you have one (will be generated automatically if empty)"
              />
              <p className="text-sm text-gray-500 mt-1">
                In production, files would be uploaded to IPFS automatically
              </p>
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">File Upload Coming Soon</p>
              <p className="text-sm text-gray-500">
                For now, you can upload metadata. File upload functionality will be added in the next update.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resource
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
