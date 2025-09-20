import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Users, Coins, Target, ArrowRight, Star, Zap, Shield } from 'lucide-react';

/**
 * Home page component showcasing the platform features
 */
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: 'Study Groups',
      description: 'Join or create study groups with like-minded learners. Collaborate on projects and share knowledge.',
    },
    {
      icon: <Coins className="h-8 w-8 text-yellow-600" />,
      title: 'Token Rewards',
      description: 'Earn study tokens for participation, helping others, and maintaining study streaks.',
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: 'Smart Matching',
      description: 'AI-powered matching system connects you with the perfect study partners based on your interests.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: 'Resource Sharing',
      description: 'Upload and share study materials, documents, and resources with the community.',
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-600" />,
      title: 'Progress Tracking',
      description: 'Track your learning progress, study streaks, and achievements on the blockchain.',
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: 'Decentralized',
      description: 'Built on Internet Computer for true decentralization, security, and data ownership.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '1,234', icon: <Users className="h-5 w-5" /> },
    { label: 'Study Groups', value: '456', icon: <BookOpen className="h-5 w-5" /> },
    { label: 'Resources Shared', value: '2,890', icon: <Target className="h-5 w-5" /> },
    { label: 'Tokens Earned', value: '50K+', icon: <Coins className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Learn Together,
            <span className="gradient-text block">Earn Together</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the decentralized study platform where students collaborate, share resources, 
            and earn tokens for their learning journey. Built on Internet Computer for true decentralization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
            <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of collaborative learning with blockchain-powered incentives and decentralized architecture.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass p-6 rounded-xl card-hover"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who are already earning while learning. 
            Create your profile and start earning study tokens today!
          </p>
          {!isAuthenticated && (
            <Link
              to="/login"
              className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-indigo-400 mr-2" />
            <span className="text-2xl font-bold">Study Platform</span>
          </div>
          <p className="text-gray-400 mb-4">
            Decentralized learning platform built on Internet Computer
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <span>© 2024 Study Platform</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
