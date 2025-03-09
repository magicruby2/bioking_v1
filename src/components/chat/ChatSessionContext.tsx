import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, ChatHistory } from './types';

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  folderId?: string;
  messages?: Message[];
}

interface ChatSessionContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  addSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  deleteSession: (sessionId: string) => void;
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
        return parsedSessions
          .filter((session: any) => session.messages && session.messages.length > 1) // Only return sessions with user messages
          .map((session: any) => ({
            ...session,
            timestamp: new Date(session.timestamp),
            messages: session.messages ? session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })) : []
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
    // For temporary sessions, we don't need to save them until they have a user message
    // We'll keep them in memory only
    if (session.messages && session.messages.length > 1) {
      // Only save if there's more than the initial greeting message
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
    }
  },

  // Simulate updating a session in PostgreSQL
  updateSession: async (sessionId: string, updates: Partial<ChatSession>): Promise<void> => {
    console.log('Simulating PostgreSQL update...', { sessionId, updates });
    
    // Only save sessions with user messages
    if (!updates.messages || updates.messages.length <= 1) {
      return; // Don't persist sessions without user messages
    }
    
    const savedSessions = localStorage.getItem('chatSessions');
    
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        const sessionExists = sessions.some((s: any) => s.id === sessionId);
        
        if (sessionExists) {
          // Update existing session
          const updatedSessions = sessions.map((session: any) =>
            session.id === sessionId
              ? { ...session, ...updates, timestamp: new Date() }
              : session
          );
          localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
        } else {
          // Add as new session
          const newSession = {
            id: sessionId,
            title: updates.title || "New Conversation",
            preview: updates.preview || "",
            timestamp: new Date(),
            folderId: updates.folderId,
            messages: updates.messages || []
          };
          localStorage.setItem('chatSessions', JSON.stringify([newSession, ...sessions]));
        }
      } catch (error) {
        console.error('Error updating chat session:', error);
      }
    } else {
      // No existing sessions, create a new array with this session
      if (updates.messages && updates.messages.length > 1) {
        const newSession = {
          id: sessionId,
          title: updates.title || "New Conversation",
          preview: updates.preview || "",
          timestamp: new Date(),
          folderId: updates.folderId,
          messages: updates.messages
        };
        localStorage.setItem('chatSessions', JSON.stringify([newSession]));
      }
    }
  },

  // Simulate deleting a session in PostgreSQL
  deleteSession: async (sessionId: string): Promise<void> => {
    console.log('Simulating PostgreSQL delete...', sessionId);
    
    const savedSessions = localStorage.getItem('chatSessions');
    
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        const updatedSessions = sessions.filter((session: any) => session.id !== sessionId);
        localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      } catch (error) {
        console.error('Error deleting chat session:', error);
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
      // Initialize empty messages array if not provided
      const sessionWithMessages = {
        ...session,
        messages: session.messages || []
      };
      
      // Don't persist to storage yet, just keep in memory
      setSessions(prev => [sessionWithMessages, ...prev]);
      setCurrentSessionId(session.id);
      
      // Only persist if it has user messages (handled by PostgresService)
      if (sessionWithMessages.messages && sessionWithMessages.messages.length > 1) {
        await PostgresService.addSession(sessionWithMessages);
      }
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<ChatSession>) => {
    try {
      // Update in memory first
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates, timestamp: new Date() } 
            : session
        )
      );
      
      // Persist to storage (handled by PostgresService)
      await PostgresService.updateSession(sessionId, updates);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      // Remove from in-memory state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // If the deleted session is the current one, create a new session
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
      
      // Remove from storage
      await PostgresService.deleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
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
        deleteSession,
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
