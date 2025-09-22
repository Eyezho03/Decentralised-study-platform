import React, { createContext, useContext, useState, useEffect } from 'react';
import { CanisterContextType } from '../types';
const Agent = require('@dfinity/agent');
const Principal = require('@dfinity/principal');

const CanisterContext = createContext<CanisterContextType | undefined>(undefined);

/**
 * Create actor for the real ICP backend canister
 */
const createCanisterActor = async (canisterId: string) => {
  const agent = new Agent.HttpAgent({
    host: process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://127.0.0.1:8000'
  });

  // In production, we don't need to fetch the root key
  if (process.env.NODE_ENV !== 'production') {
    await agent.fetchRootKey();
  }

  const actor = Agent.Actor.createActor(
    // We'll define the interface here based on our backend
    {
      registerUser: Agent.Actor.query([], Agent.Actor.text),
      getUserProfile: Agent.Actor.query([Principal.Principal], Agent.Actor.Opt(Agent.Actor.Record({
        id: Principal.Principal,
        username: Agent.Actor.text,
        email: Agent.Actor.text,
        subjects: Agent.Actor.Vec(Agent.Actor.text),
        skillLevel: Agent.Actor.text,
        studyTokens: Agent.Actor.nat64,
        studyStreak: Agent.Actor.nat32,
        achievements: Agent.Actor.Vec(Agent.Actor.text),
        createdAt: Agent.Actor.nat64,
        lastActiveAt: Agent.Actor.nat64
      }))),
      updateUserProfile: Agent.Actor.update([Agent.Actor.text, Agent.Actor.Vec(Agent.Actor.text), Agent.Actor.text], Agent.Actor.text),
      createStudyGroup: Agent.Actor.update([Agent.Actor.text, Agent.Actor.text, Agent.Actor.text, Agent.Actor.text, Agent.Actor.nat32], Agent.Actor.text),
      joinStudyGroup: Agent.Actor.update([Agent.Actor.text], Agent.Actor.text),
      getAllStudyGroups: Agent.Actor.query([], Agent.Actor.Vec(Agent.Actor.Record({
        id: Agent.Actor.text,
        name: Agent.Actor.text,
        description: Agent.Actor.text,
        subject: Agent.Actor.text,
        skillLevel: Agent.Actor.text,
        maxMembers: Agent.Actor.nat32,
        currentMembers: Agent.Actor.nat32,
        members: Agent.Actor.Vec(Principal.Principal),
        creator: Principal.Principal,
        resources: Agent.Actor.Vec(Agent.Actor.Record({
          id: Agent.Actor.text,
          title: Agent.Actor.text,
          description: Agent.Actor.text,
          type: Agent.Actor.text,
          ipfsHash: Agent.Actor.text,
          uploader: Principal.Principal,
          uploadDate: Agent.Actor.nat64,
          downloads: Agent.Actor.nat32,
          rating: Agent.Actor.nat32
        })),
        studySessions: Agent.Actor.Vec(Agent.Actor.Record({
          id: Agent.Actor.text,
          groupId: Agent.Actor.text,
          title: Agent.Actor.text,
          description: Agent.Actor.text,
          scheduledAt: Agent.Actor.nat64,
          duration: Agent.Actor.nat32,
          participants: Agent.Actor.Vec(Principal.Principal),
          resources: Agent.Actor.Vec(Agent.Actor.text),
          completed: Agent.Actor.bool,
          notes: Agent.Actor.text
        })),
        createdAt: Agent.Actor.nat64,
        isActive: Agent.Actor.bool
      }))),
      getUserStudyGroups: Agent.Actor.query([Principal.Principal], Agent.Actor.Vec(Agent.Actor.Record({
        id: Agent.Actor.text,
        name: Agent.Actor.text,
        description: Agent.Actor.text,
        subject: Agent.Actor.text,
        skillLevel: Agent.Actor.text,
        maxMembers: Agent.Actor.nat32,
        currentMembers: Agent.Actor.nat32,
        members: Agent.Actor.Vec(Principal.Principal),
        creator: Principal.Principal,
        resources: Agent.Actor.Vec(Agent.Actor.Record({
          id: Agent.Actor.text,
          title: Agent.Actor.text,
          description: Agent.Actor.text,
          type: Agent.Actor.text,
          ipfsHash: Agent.Actor.text,
          uploader: Principal.Principal,
          uploadDate: Agent.Actor.nat64,
          downloads: Agent.Actor.nat32,
          rating: Agent.Actor.nat32
        })),
        studySessions: Agent.Actor.Vec(Agent.Actor.Record({
          id: Agent.Actor.text,
          groupId: Agent.Actor.text,
          title: Agent.Actor.text,
          description: Agent.Actor.text,
          scheduledAt: Agent.Actor.nat64,
          duration: Agent.Actor.nat32,
          participants: Agent.Actor.Vec(Principal.Principal),
          resources: Agent.Actor.Vec(Agent.Actor.text),
          completed: Agent.Actor.bool,
          notes: Agent.Actor.text
        })),
        createdAt: Agent.Actor.nat64,
        isActive: Agent.Actor.bool
      }))),
      uploadResource: Agent.Actor.update([Agent.Actor.text, Agent.Actor.text, Agent.Actor.text, Agent.Actor.text], Agent.Actor.text),
      getAllResources: Agent.Actor.query([], Agent.Actor.Vec(Agent.Actor.Record({
        id: Agent.Actor.text,
        title: Agent.Actor.text,
        description: Agent.Actor.text,
        type: Agent.Actor.text,
        ipfsHash: Agent.Actor.text,
        uploader: Principal.Principal,
        uploadDate: Agent.Actor.nat64,
        downloads: Agent.Actor.nat32,
        rating: Agent.Actor.nat32
      }))),
      downloadResource: Agent.Actor.update([Agent.Actor.text], Agent.Actor.text),
      getUserTokens: Agent.Actor.query([Principal.Principal], Agent.Actor.nat64),
      transferTokens: Agent.Actor.update([Principal.Principal, Agent.Actor.nat64], Agent.Actor.text),
      updateStudyStreak: Agent.Actor.update([Principal.Principal], Agent.Actor.text),
      getPlatformStats: Agent.Actor.query([], Agent.Actor.Record({
        totalUsers: Agent.Actor.nat32,
        totalGroups: Agent.Actor.nat32,
        totalResources: Agent.Actor.nat32,
        totalSessions: Agent.Actor.nat32,
        totalTokensDistributed: Agent.Actor.nat64
      })),
      getUserStats: Agent.Actor.query([Principal.Principal], Agent.Actor.Record({
        studyTokens: Agent.Actor.nat64,
        studyStreak: Agent.Actor.nat32,
        groupsJoined: Agent.Actor.nat32,
        resourcesUploaded: Agent.Actor.nat32,
        sessionsParticipated: Agent.Actor.nat32,
        achievements: Agent.Actor.nat32
      }))
    },
    {
      agent,
      canisterId: Principal.Principal.fromText(canisterId)
    }
  );

  return actor;
};

/**
 * Mock backend canister for development fallback
 */
const createMockCanister = () => {
  return {
    registerUser: async (username: string, email: string, subjects: string[], skillLevel: string) => {
      console.log('Mock: Registering user', { username, email, subjects, skillLevel });
      return `User ${username} registered successfully with 100 study tokens!`;
    },
    getUserProfile: async (userId: string) => {
      console.log('Mock: Getting user profile for', userId);
      return {
        id: userId,
        username: 'Demo User',
        email: 'demo@example.com',
        subjects: ['Mathematics', 'Computer Science'],
        skillLevel: 'intermediate',
        studyTokens: BigInt(1000),
        studyStreak: 7,
        achievements: ['First Group', 'Resource Uploader'],
        createdAt: BigInt(Date.now()),
        lastActiveAt: BigInt(Date.now())
      };
    },
    updateUserProfile: async (username: string, subjects: string[], skillLevel: string) => {
      console.log('Mock: Updating user profile', { username, subjects, skillLevel });
      return `Profile updated successfully for ${username}`;
    },
    createStudyGroup: async (name: string, description: string, subject: string, skillLevel: string, maxMembers: number) => {
      console.log('Mock: Creating study group', { name, description, subject, skillLevel, maxMembers });
      return `Study group "${name}" created successfully! You earned 50 study tokens.`;
    },
    joinStudyGroup: async (groupId: string) => {
      console.log('Mock: Joining study group', groupId);
      return `Successfully joined study group! You earned 25 study tokens.`;
    },
    getAllStudyGroups: async () => {
      console.log('Mock: Getting all study groups');
      return [];
    },
    getUserStudyGroups: async (userId: string) => {
      console.log('Mock: Getting user study groups for', userId);
      return [];
    },
    uploadResource: async (title: string, description: string, type: string, ipfsHash: string) => {
      console.log('Mock: Uploading resource', { title, description, type, ipfsHash });
      return `Resource "${title}" uploaded successfully! You earned 30 study tokens.`;
    },
    getAllResources: async () => {
      console.log('Mock: Getting all resources');
      return [];
    },
    downloadResource: async (resourceId: string) => {
      console.log('Mock: Downloading resource', resourceId);
      return `Resource downloaded successfully!`;
    },
    getUserTokens: async (userId: string) => {
      console.log('Mock: Getting user tokens for', userId);
      return BigInt(1000);
    },
    transferTokens: async (recipient: string, amount: bigint) => {
      console.log('Mock: Transferring tokens', { recipient, amount });
      return `Transferred ${amount} study tokens successfully!`;
    },
    updateStudyStreak: async (userId: string) => {
      console.log('Mock: Updating study streak for', userId);
      return `Study streak updated to 7 days!`;
    },
    getPlatformStats: async () => {
      console.log('Mock: Getting platform stats');
      return {
        totalUsers: 150,
        totalGroups: 25,
        totalResources: 180,
        totalSessions: 45,
        totalTokensDistributed: BigInt(50000)
      };
    },
    getUserStats: async (userId: string) => {
      console.log('Mock: Getting user stats for', userId);
      return {
        studyTokens: BigInt(1000),
        studyStreak: 7,
        groupsJoined: 3,
        resourcesUploaded: 5,
        sessionsParticipated: 12,
        achievements: 4
      };
    },
    isMock: true
  };
};

/**
 * Canister context provider for managing ICP canister connections
 */
export const CanisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canister, setCanister] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // Get canister ID from environment or use default
      const canisterId = process.env.REACT_APP_CANISTER_ID || 'rrkah-fqaaa-aaaah-qcaiq-cai';

      console.log('Connecting to ICP canister:', canisterId);

      // Create real canister actor
      const canisterActor = await createCanisterActor(canisterId);
      setCanister(canisterActor);
      setIsConnected(true);

      console.log('Successfully connected to ICP canister');
    } catch (error) {
      console.error('Failed to connect to canister:', error);
      setIsConnected(false);

      // Fallback to mock canister for development
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock canister for development');
        const mockCanister = createMockCanister();
        setCanister(mockCanister);
        setIsConnected(true);
      }
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <CanisterContext.Provider value={{ canister, isConnected, connect }}>
      {children}
    </CanisterContext.Provider>
  );
};

export const useCanister = () => {
  const context = useContext(CanisterContext);
  if (context === undefined) {
    throw new Error('useCanister must be used within a CanisterProvider');
  }
  return context;
};
