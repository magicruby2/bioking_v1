
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  folderId?: string;
}

interface ChatSessionContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  addSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  setCurrentSessionId: (id: string | null) => void;
  clearAllSessions: () => void;
  fetchSessions: () => Promise<void>;
  isLoading: boolean;
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export const useChatSessions = () => {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error('useChatSessions must be used within a ChatSessionProvider');
  }
  return context;
};

// Simulated PostgreSQL service
const PostgresService = {
  // Simulate fetching sessions from PostgreSQL
  fetchSessions: async (): Promise<ChatSession[]> => {
    console.log('Simulating PostgreSQL fetch...');
    // In a real implementation, this would be a database call
    // For now, we'll fall back to localStorage
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert string timestamps back to Date objects
        return parsedSessions.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }));
      } catch (error) {
        console.error('Error parsing saved chat sessions:', error);
        return [];
      }
    }
    return [];
  },

  // Simulate adding a session to PostgreSQL
  addSession: async (session: ChatSession): Promise<void> => {
    console.log('Simulating PostgreSQL insert...', session);
    // In a real implementation, this would be a database insert
    // For now, we'll also save to localStorage for persistence
    const savedSessions = localStorage.getItem('chatSessions');
    let sessions = [];
    
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions);
      } catch (error) {
        console.error('Error parsing saved chat sessions:', error);
      }
    }
    
    localStorage.setItem('chatSessions', JSON.stringify([session, ...sessions]));
  },

  // Simulate updating a session in PostgreSQL
  updateSession: async (sessionId: string, updates: Partial<ChatSession>): Promise<void> => {
    console.log('Simulating PostgreSQL update...', { sessionId, updates });
    // In a real implementation, this would be a database update
    // For now, we'll also update localStorage for persistence
    const savedSessions = localStorage.getItem('chatSessions');
    
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        const updatedSessions = sessions.map((session: any) =>
          session.id === sessionId
            ? { ...session, ...updates, timestamp: new Date() }
            : session
        );
        localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      } catch (error) {
        console.error('Error updating chat session:', error);
      }
    }
  },

  // Simulate clearing all sessions in PostgreSQL
  clearAllSessions: async (): Promise<void> => {
    console.log('Simulating PostgreSQL delete all...');
    // In a real implementation, this would delete all records
    // For now, we'll clear localStorage
    localStorage.removeItem('chatSessions');
    localStorage.removeItem('chatSessionId');
  }
};

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch sessions from "PostgreSQL" on component mount
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const fetchedSessions = await PostgresService.fetchSessions();
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load current session ID from localStorage
    const savedCurrentId = localStorage.getItem('chatSessionId');
    if (savedCurrentId) {
      setCurrentSessionId(savedCurrentId);
    }
    
    // Fetch sessions on load
    fetchSessions();
  }, []);

  // Save current session ID to localStorage whenever it changes
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('chatSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  const addSession = async (session: ChatSession) => {
    try {
      await PostgresService.addSession(session);
      setSessions(prev => [session, ...prev]);
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<ChatSession>) => {
    try {
      await PostgresService.updateSession(sessionId, updates);
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates, timestamp: new Date() } 
            : session
        )
      );
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const clearAllSessions = async () => {
    try {
      setIsLoading(true);
      await PostgresService.clearAllSessions();
      setSessions([]);
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error clearing sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatSessionContext.Provider 
      value={{ 
        sessions, 
        currentSessionId, 
        addSession, 
        updateSession, 
        setCurrentSessionId,
        clearAllSessions,
        fetchSessions,
        isLoading
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};
