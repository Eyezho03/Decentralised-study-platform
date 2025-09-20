import React, { createContext, useContext, useState, useEffect } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { CanisterContextType } from '../types';

const CanisterContext = createContext<CanisterContextType | undefined>(undefined);

/**
 * Canister context provider for managing ICP canister connections
 */
export const CanisterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canister, setCanister] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = async () => {
    try {
      // Create HTTP agent for local development
      const agent = new HttpAgent({ 
        host: process.env.REACT_APP_IC_HOST || 'http://localhost:8000' 
      });

      // For local development, we need to fetch the root key
      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      // Get canister ID from environment or use default
      const canisterId = process.env.REACT_APP_CANISTER_ID || 'rrkah-fqaaa-aaaah-qcujq-cai';
      
      // Create actor (this would be generated from your canister's Candid interface)
      // For now, we'll create a mock actor
      const actor = Actor.createActor(
        // This would be your actual canister interface
        {} as any,
        {
          agent,
          canisterId: Principal.fromText(canisterId)
        }
      );

      setCanister(actor);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to canister:', error);
      setIsConnected(false);
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
