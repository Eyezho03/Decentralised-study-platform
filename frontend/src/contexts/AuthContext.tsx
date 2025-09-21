import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, UserProfile } from '../types';
import { AuthClient } from '@dfinity/auth-client';
const { Principal } = require('@dfinity/principal');

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication context provider for managing user authentication state
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [principal, setPrincipal] = useState<any | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize Internet Identity AuthClient
        const client = await AuthClient.create();
        setAuthClient(client);

        // Check if user is already authenticated
        const isAuthenticated = await client.isAuthenticated();
        if (isAuthenticated) {
          const identity = client.getIdentity();
          const userPrincipal = identity.getPrincipal();
          setPrincipal(userPrincipal);

          // Try to get user profile from localStorage or create a basic one
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
          } else {
            // Create a basic user profile for authenticated users
            const basicUser: UserProfile = {
              id: userPrincipal.toString(),
              username: `User_${userPrincipal.toString().slice(0, 8)}`,
              email: `${userPrincipal.toString().slice(0, 8)}@internet-identity.com`,
              subjects: ['Mathematics', 'Computer Science'],
              skillLevel: 'intermediate',
              studyTokens: BigInt(100),
              studyStreak: 0,
              achievements: [],
              createdAt: BigInt(Date.now()),
              lastActiveAt: BigInt(Date.now())
            };
            setUser(basicUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(basicUser));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);

      if (!authClient) {
        throw new Error('Auth client not initialized');
      }

      // For local development, use a mock authentication
      // In production, this would use Internet Identity
      const isLocalDev = process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost';

      if (isLocalDev) {
        // Mock authentication for local development
        const mockPrincipal = Principal.anonymous();
        setPrincipal(mockPrincipal);

        const mockUser: UserProfile = {
          id: mockPrincipal.toString(),
          username: 'Demo User',
          email: 'demo@example.com',
          subjects: ['Mathematics', 'Computer Science', 'Physics'],
          skillLevel: 'intermediate',
          studyTokens: BigInt(1000),
          studyStreak: 7,
          achievements: ['First Group', 'Resource Uploader', 'Study Streak'],
          createdAt: BigInt(Date.now()),
          lastActiveAt: BigInt(Date.now())
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(mockUser));
      } else {
        // Real Internet Identity authentication for production
        await authClient.login({
          identityProvider: 'https://identity.ic0.app',
          onSuccess: () => {
            const identity = authClient.getIdentity();
            const userPrincipal = identity.getPrincipal();
            setPrincipal(userPrincipal);

            const realUser: UserProfile = {
              id: userPrincipal.toString(),
              username: `User_${userPrincipal.toString().slice(0, 8)}`,
              email: `${userPrincipal.toString().slice(0, 8)}@internet-identity.com`,
              subjects: ['Mathematics', 'Computer Science'],
              skillLevel: 'intermediate',
              studyTokens: BigInt(100),
              studyStreak: 0,
              achievements: [],
              createdAt: BigInt(Date.now()),
              lastActiveAt: BigInt(Date.now())
            };

            setUser(realUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(realUser));
          }
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (authClient) {
        await authClient.logout();
      }
      setUser(null);
      setIsAuthenticated(false);
      setPrincipal(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      logout,
      principal,
      authClient
    }}>
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
