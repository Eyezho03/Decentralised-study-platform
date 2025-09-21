import React from 'react';
import Gamification from '../components/Gamification';

/**
 * Gamification page for badges, challenges, leaderboards, and levels
 */
const GamificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Gamification />
      </div>
    </div>
  );
};

export default GamificationPage;
