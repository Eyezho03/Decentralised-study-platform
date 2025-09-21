import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudyGroup, Resource, StudySession } from '../types';
import { useCanister } from './CanisterContext';

interface DataContextType {
  studyGroups: StudyGroup[];
  resources: Resource[];
  studySessions: StudySession[];
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'createdAt' | 'currentMembers' | 'members' | 'resources' | 'studySessions' | 'isActive'>) => Promise<string>;
  joinStudyGroup: (groupId: string) => Promise<boolean>;
  uploadResource: (resource: Omit<Resource, 'id' | 'uploadDate' | 'downloads' | 'rating'>) => Promise<string>;
  createStudySession: (session: Omit<StudySession, 'id' | 'participants' | 'completed'>) => Promise<string>;
  joinStudySession: (sessionId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  isUsingMockBackend: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Data context provider for managing real study platform data
 * Integrates with both mock canister and localStorage for seamless functionality
 */
export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { canister, isConnected } = useCanister();
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);

  const isUsingMockBackend = canister?.isMock === true;

  // Load initial data from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const savedGroups = localStorage.getItem('studyGroups');
      const savedResources = localStorage.getItem('resources');
      const savedSessions = localStorage.getItem('studySessions');

      if (savedGroups) {
        setStudyGroups(JSON.parse(savedGroups));
      }
      if (savedResources) {
        setResources(JSON.parse(savedResources));
      }
      if (savedSessions) {
        setStudySessions(JSON.parse(savedSessions));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = () => {
    try {
      localStorage.setItem('studyGroups', JSON.stringify(studyGroups));
      localStorage.setItem('resources', JSON.stringify(resources));
      localStorage.setItem('studySessions', JSON.stringify(studySessions));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const createStudyGroup = async (groupData: Omit<StudyGroup, 'id' | 'createdAt' | 'currentMembers' | 'members' | 'resources' | 'studySessions' | 'isActive'>): Promise<string> => {
    const newGroup: StudyGroup = {
      ...groupData,
      id: `group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: BigInt(Date.now()),
      currentMembers: 1,
      members: ['demo-user'], // In real app, this would be the authenticated user's principal
      resources: [],
      studySessions: [],
      isActive: true
    };

    setStudyGroups(prev => [...prev, newGroup]);
    saveData();
    return newGroup.id;
  };

  const joinStudyGroup = async (groupId: string): Promise<boolean> => {
    const group = studyGroups.find(g => g.id === groupId);
    if (!group || group.currentMembers >= group.maxMembers) {
      return false;
    }

    setStudyGroups(prev => prev.map(g =>
      g.id === groupId
        ? {
          ...g,
          currentMembers: g.currentMembers + 1,
          members: [...g.members, 'demo-user'] // In real app, this would be the authenticated user's principal
        }
        : g
    ));
    saveData();
    return true;
  };

  const uploadResource = async (resourceData: Omit<Resource, 'id' | 'uploadDate' | 'downloads' | 'rating'>): Promise<string> => {
    const newResource: Resource = {
      ...resourceData,
      id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadDate: BigInt(Date.now()),
      downloads: 0,
      rating: 0
    };

    setResources(prev => [...prev, newResource]);
    saveData();
    return newResource.id;
  };

  const createStudySession = async (sessionData: Omit<StudySession, 'id' | 'participants' | 'completed'>): Promise<string> => {
    const newSession: StudySession = {
      ...sessionData,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: ['demo-user'], // In real app, this would be the authenticated user's principal
      completed: false
    };

    setStudySessions(prev => [...prev, newSession]);

    // Also add to the group's sessions
    setStudyGroups(prev => prev.map(g =>
      g.id === sessionData.groupId
        ? { ...g, studySessions: [...g.studySessions, newSession] }
        : g
    ));

    saveData();
    return newSession.id;
  };

  const joinStudySession = async (sessionId: string): Promise<boolean> => {
    const session = studySessions.find(s => s.id === sessionId);
    if (!session || session.participants.includes('demo-user')) {
      return false;
    }

    setStudySessions(prev => prev.map(s =>
      s.id === sessionId
        ? { ...s, participants: [...s.participants, 'demo-user'] }
        : s
    ));
    saveData();
    return true;
  };

  const refreshData = async () => {
    if (isConnected && canister) {
      try {
        // Try to get data from canister first
        const [canisterGroups, canisterResources] = await Promise.all([
          canister.getAllStudyGroups(),
          canister.getAllResources()
        ]);

        // Convert canister data to our format and merge with localStorage data
        const convertedGroups = canisterGroups.map((group: any) => ({
          ...group,
          createdAt: BigInt(group.createdAt),
          members: group.members || [],
          resources: group.resources || [],
          studySessions: group.studySessions || []
        }));

        const convertedResources = canisterResources.map((resource: any) => ({
          ...resource,
          uploadDate: BigInt(resource.uploadDate)
        }));

        setStudyGroups(convertedGroups);
        setResources(convertedResources);

        // Also save to localStorage for offline access
        localStorage.setItem('studyGroups', JSON.stringify(convertedGroups));
        localStorage.setItem('resources', JSON.stringify(convertedResources));
      } catch (error) {
        console.error('Error fetching data from canister:', error);
        // Fallback to localStorage
        loadData();
      }
    } else {
      // Fallback to localStorage when canister is not available
      loadData();
    }
  };

  return (
    <DataContext.Provider value={{
      studyGroups,
      resources,
      studySessions,
      createStudyGroup,
      joinStudyGroup,
      uploadResource,
      createStudySession,
      joinStudySession,
      refreshData,
      isUsingMockBackend
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
