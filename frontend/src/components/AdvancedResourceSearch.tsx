import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Download,
  Star,
  Eye,
  Clock,
  Tag,
  BookOpen,
  FileText,
  Video,
  Image,
  Music,
  Archive,
  X,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  SlidersHorizontal,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

interface SearchFilters {
  query: string;
  type: string[];
  subject: string[];
  difficulty: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  rating: number | null;
  uploader: string[];
  sortBy: 'relevance' | 'date' | 'rating' | 'downloads' | 'title';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'image' | 'audio' | 'archive';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  uploader: string;
  uploadDate: Date;
  downloads: number;
  rating: number;
  tags: string[];
  size: number; // in MB
  format: string;
  thumbnail?: string;
}

const AdvancedResourceSearch: React.FC = () => {
  const { user } = useAuth();
  const { resources } = useData();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    type: [],
    subject: [],
    difficulty: [],
    dateRange: { start: null, end: null },
    rating: null,
    uploader: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
    viewMode: 'grid'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);

  // Mock resources data
  const mockResources: Resource[] = [
    {
      id: 'res1',
      title: 'React Hooks Complete Guide',
      description: 'Comprehensive guide covering all React hooks with examples and best practices',
      type: 'document',
      subject: 'Computer Science',
      difficulty: 'intermediate',
      uploader: 'Alice',
      uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      downloads: 245,
      rating: 4.8,
      tags: ['React', 'JavaScript', 'Hooks', 'Frontend'],
      size: 2.5,
      format: 'PDF'
    },
    {
      id: 'res2',
      title: 'Advanced TypeScript Patterns',
      description: 'Deep dive into advanced TypeScript patterns and techniques',
      type: 'video',
      subject: 'Computer Science',
      difficulty: 'advanced',
      uploader: 'Bob',
      uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      downloads: 189,
      rating: 4.9,
      tags: ['TypeScript', 'JavaScript', 'Patterns', 'Advanced'],
      size: 45.2,
      format: 'MP4'
    },
    {
      id: 'res3',
      title: 'Mathematics Problem Solving',
      description: 'Collection of solved mathematics problems with step-by-step solutions',
      type: 'document',
      subject: 'Mathematics',
      difficulty: 'beginner',
      uploader: 'Carol',
      uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      downloads: 156,
      rating: 4.6,
      tags: ['Mathematics', 'Problem Solving', 'Algebra', 'Calculus'],
      size: 1.8,
      format: 'PDF'
    },
    {
      id: 'res4',
      title: 'WebAssembly Fundamentals',
      description: 'Introduction to WebAssembly and its applications in web development',
      type: 'video',
      subject: 'Computer Science',
      difficulty: 'intermediate',
      uploader: 'Dave',
      uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      downloads: 98,
      rating: 4.7,
      tags: ['WebAssembly', 'Web Development', 'Performance', 'C++'],
      size: 38.7,
      format: 'MP4'
    },
    {
      id: 'res5',
      title: 'Physics Lab Experiments',
      description: 'Interactive physics experiments with visual demonstrations',
      type: 'image',
      subject: 'Physics',
      difficulty: 'intermediate',
      uploader: 'Eve',
      uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      downloads: 134,
      rating: 4.5,
      tags: ['Physics', 'Experiments', 'Laboratory', 'Visual'],
      size: 12.3,
      format: 'PNG'
    }
  ];

  // Initialize data
  useEffect(() => {
    setPopularTags(['React', 'JavaScript', 'TypeScript', 'Mathematics', 'Physics', 'Web Development', 'Advanced', 'Beginner']);
    setRecentSearches(['React hooks', 'TypeScript patterns', 'Mathematics problems']);
  }, []);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = mockResources;

    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (searchFilters.type.length > 0) {
      filtered = filtered.filter(resource => searchFilters.type.includes(resource.type));
    }

    // Subject filter
    if (searchFilters.subject.length > 0) {
      filtered = filtered.filter(resource => searchFilters.subject.includes(resource.subject));
    }

    // Difficulty filter
    if (searchFilters.difficulty.length > 0) {
      filtered = filtered.filter(resource => searchFilters.difficulty.includes(resource.difficulty));
    }

    // Date range filter
    if (searchFilters.dateRange.start) {
      filtered = filtered.filter(resource => resource.uploadDate >= searchFilters.dateRange.start!);
    }
    if (searchFilters.dateRange.end) {
      filtered = filtered.filter(resource => resource.uploadDate <= searchFilters.dateRange.end!);
    }

    // Rating filter
    if (searchFilters.rating) {
      filtered = filtered.filter(resource => resource.rating >= searchFilters.rating!);
    }

    // Uploader filter
    if (searchFilters.uploader.length > 0) {
      filtered = filtered.filter(resource => searchFilters.uploader.includes(resource.uploader));
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (searchFilters.sortBy) {
        case 'date':
          comparison = a.uploadDate.getTime() - b.uploadDate.getTime();
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'downloads':
          comparison = a.downloads - b.downloads;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'relevance':
        default:
          // For relevance, we could implement more sophisticated scoring
          comparison = b.downloads - a.downloads; // Simple relevance by popularity
          break;
      }
      return searchFilters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchFilters, mockResources]);

  const handleSearch = (query: string) => {
    setSearchFilters(prev => ({ ...prev, query }));
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchFilters({
      query: '',
      type: [],
      subject: [],
      difficulty: [],
      dateRange: { start: null, end: null },
      rating: null,
      uploader: [],
      sortBy: 'relevance',
      sortOrder: 'desc',
      viewMode: 'grid'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-500" />;
      case 'audio':
        return <Music className="h-5 w-5 text-purple-500" />;
      case 'archive':
        return <Archive className="h-5 w-5 text-orange-500" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`;
    }
    return `${sizeInMB.toFixed(1)} MB`;
  };

  const getUniqueValues = (key: keyof Resource) => {
    return Array.from(new Set(mockResources.map(resource => String(resource[key]))));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <Search className="h-8 w-8 text-blue-600" />
            <span>Advanced Resource Search</span>
          </h1>
          <p className="text-gray-600">Find the perfect study materials with powerful search and filtering</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <SlidersHorizontal className="h-4 w-4 inline mr-2" />
            Filters
          </button>
          <button
            onClick={() => setSearchFilters(prev => ({ ...prev, viewMode: prev.viewMode === 'grid' ? 'list' : 'grid' }))}
            className="px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            {searchFilters.viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass p-4 rounded-xl">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources by title, description, or tags..."
              value={searchFilters.query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={searchFilters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date</option>
              <option value="rating">Rating</option>
              <option value="downloads">Downloads</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => handleFilterChange('sortOrder', searchFilters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {searchFilters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Recent searches:</span>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="glass p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
              <div className="space-y-2">
                {['document', 'video', 'image', 'audio', 'archive'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchFilters.type.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('type', [...searchFilters.type, type]);
                        } else {
                          handleFilterChange('type', searchFilters.type.filter(t => t !== type));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <div className="space-y-2">
                {getUniqueValues('subject').map((subject) => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchFilters.subject.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('subject', [...searchFilters.subject, subject]);
                        } else {
                          handleFilterChange('subject', searchFilters.subject.filter(s => s !== subject));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <div className="space-y-2">
                {['beginner', 'intermediate', 'advanced'].map((difficulty) => (
                  <label key={difficulty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={searchFilters.difficulty.includes(difficulty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('difficulty', [...searchFilters.difficulty, difficulty]);
                        } else {
                          handleFilterChange('difficulty', searchFilters.difficulty.filter(d => d !== difficulty));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{difficulty}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
              <select
                value={searchFilters.rating || ''}
                onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
                <option value="3.0">3.0+ Stars</option>
              </select>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Popular Tags</label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleSearch(tag)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {filteredResources.length} resources found
        </h3>
        <div className="text-sm text-gray-600">
          {searchFilters.query && `Searching for "${searchFilters.query}"`}
        </div>
      </div>

      {/* Resource Grid/List */}
      <div className={searchFilters.viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredResources.map((resource) => (
          <div key={resource.id} className="glass p-6 rounded-xl hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getTypeIcon(resource.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{resource.uploader}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{resource.uploadDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{resource.downloads}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">{resource.rating}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatFileSize(resource.size)}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      +{resource.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find what you're looking for.
          </p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedResourceSearch;
