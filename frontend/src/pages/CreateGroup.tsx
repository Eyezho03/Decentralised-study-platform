import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, Users, Target, Save } from 'lucide-react';

/**
 * Create Group page for creating new study groups
 */
const CreateGroup: React.FC = () => {
  const { user } = useAuth();
  const { createStudyGroup } = useData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    skillLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    maxMembers: 10
  });

  const subjects = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Economics', 'Psychology', 'Literature', 'History', 'Art', 'Music'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value) || 10 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create the study group using real data context
      const groupId = await createStudyGroup({
        name: formData.name,
        description: formData.description,
        subject: formData.subject,
        skillLevel: formData.skillLevel,
        maxMembers: formData.maxMembers,
        creator: user?.id || 'demo-user'
      });

      console.log('Group created successfully with ID:', groupId);

      // Navigate to the newly created group
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Study Group</h1>
        <p className="text-gray-600">
          Start a new study group and invite others to join your learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-8 rounded-xl">
          {/* Group Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <BookOpen className="h-4 w-4 inline mr-2" />
              Group Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a descriptive name for your study group"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe what your study group will focus on, meeting schedule, and goals..."
            />
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4 inline mr-2" />
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              value={formData.subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Skill Level */}
          <div className="mb-6">
            <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Skill Level
            </label>
            <select
              id="skillLevel"
              name="skillLevel"
              required
              value={formData.skillLevel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Max Members */}
          <div className="mb-6">
            <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="h-4 w-4 inline mr-2" />
              Maximum Members
            </label>
            <input
              id="maxMembers"
              name="maxMembers"
              type="number"
              min="2"
              max="50"
              required
              value={formData.maxMembers}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Recommended: 4-12 members for optimal collaboration
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Group
                </>
              )}
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits of Creating a Group</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Earn 50 study tokens for creating a group</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Access to group management tools</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Schedule study sessions and track progress</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Share resources and collaborate effectively</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGroup;
