import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, UserProfile } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication context provider for managing user authentication state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      
      // In a real application, this would connect to Internet Identity
      // For demo purposes, we'll simulate a login
      const mockUser: UserProfile = {
        id: 'mock-user-id',
        username: 'Demo User',
        email: 'demo@example.com',
        subjects: ['Mathematics', 'Computer Science', 'Physics'],
        skillLevel: 'intermediate',
        studyTokens: 1000n,
        studyStreak: 7,
        achievements: ['First Group', 'Resource Uploader', 'Study Streak'],
        createdAt: BigInt(Date.now()),
        lastActiveAt: BigInt(Date.now())
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
