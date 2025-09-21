import React from 'react';
import StudySessionScheduler from '../components/StudySessionScheduler';

/**
 * Sessions page for managing study sessions and video conferencing
 */
const Sessions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <StudySessionScheduler />
      </div>
    </div>
  );
};

export default Sessions;
