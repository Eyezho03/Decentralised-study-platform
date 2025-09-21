/**
 * TypeScript type definitions for the Decentralized Study Platform
 */

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  subjects: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  studyTokens: bigint;
  studyStreak: number;
  achievements: string[];
  createdAt: bigint;
  lastActiveAt: bigint;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  maxMembers: number;
  currentMembers: number;
  members: string[];
  creator: string;
  resources: Resource[];
  studySessions: StudySession[];
  createdAt: bigint;
  isActive: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'quiz';
  ipfsHash: string;
  uploader: string;
  uploadDate: bigint;
  downloads: number;
  rating: number;
}

export interface StudySession {
  id: string;
  groupId: string;
  title: string;
  description: string;
  scheduledAt: bigint;
  duration: number;
  participants: string[];
  resources: string[];
  completed: boolean;
  notes: string;
}

export interface StudyMatch {
  userId: string;
  groupId: string;
  compatibilityScore: number;
  reasons: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirements: string[];
}

export interface PlatformStats {
  totalUsers: number;
  totalGroups: number;
  totalResources: number;
  totalSessions: number;
  totalTokensDistributed: bigint;
}

export interface UserStats {
  studyTokens: bigint;
  studyStreak: number;
  groupsJoined: number;
  resourcesUploaded: number;
  sessionsParticipated: number;
  achievements: number;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  principal: any | null;
  authClient: any | null;
}

export interface CanisterContextType {
  canister: any;
  isConnected: boolean;
  connect: () => Promise<void>;
}
