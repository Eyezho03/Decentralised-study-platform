import React from 'react';
import AIRecommendations from '../components/AIRecommendations';

/**
 * AI Recommendations page for personalized learning suggestions
 */
const AIRecommendationsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <AIRecommendations />
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
