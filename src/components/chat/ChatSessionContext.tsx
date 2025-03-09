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
  fetchSessions: async (): Promise<ChatSession[]> => {
    console.log('Simulating PostgreSQL fetch...');
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        return parsedSessions
          .filter((session: any) => session.messages && session.messages.length > 1)
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

  addSession: async (session: ChatSession): Promise<void> => {
    console.log('Simulating PostgreSQL insert...', session);
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

  updateSession: async (sessionId: string, updates: Partial<ChatSession>): Promise<void> => {
    console.log('Simulating PostgreSQL update...', { sessionId, updates });
    
    const savedSessions = localStorage.getItem('chatSessions');
    let sessions = [];
    
    if (savedSessions) {
      try {
        sessions = JSON.parse(savedSessions);
        const sessionExists = sessions.some((s: any) => s.id === sessionId);
        
        if (sessionExists) {
          const updatedSessions = sessions.map((session: any) =>
            session.id === sessionId
              ? { ...session, ...updates, timestamp: new Date() }
              : session
          );
          localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
        } else {
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
      const newSession = {
        id: sessionId,
        title: updates.title || "New Conversation",
        preview: updates.preview || "",
        timestamp: new Date(),
        folderId: updates.folderId,
        messages: updates.messages || []
      };
      localStorage.setItem('chatSessions', JSON.stringify([newSession]));
    }
  },

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

  clearAllSessions: async (): Promise<void> => {
    console.log('Simulating PostgreSQL delete all...');
    localStorage.removeItem('chatSessions');
    localStorage.removeItem('chatSessionId');
  }
};

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      if (savedSessions) {
        try {
          const parsedSessions = JSON.parse(savedSessions);
          const sessions = parsedSessions.map((session: any) => ({
            ...session,
            timestamp: new Date(session.timestamp),
            messages: session.messages ? session.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })) : []
          }));
          setSessions(sessions);
        } catch (error) {
          console.error('Error parsing saved chat sessions:', error);
          setSessions([]);
        }
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedCurrentId = localStorage.getItem('chatSessionId');
    if (savedCurrentId) {
      setCurrentSessionId(savedCurrentId);
    }
    
    fetchSessions();
  }, []);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('chatSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  const addSession = async (session: ChatSession) => {
    try {
      const sessionWithMessages = {
        ...session,
        messages: session.messages || []
      };
      
      setSessions(prev => [sessionWithMessages, ...prev]);
      setCurrentSessionId(session.id);
      
      await PostgresService.addSession(sessionWithMessages);
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const updateSession = async (sessionId: string, updates: Partial<ChatSession>) => {
    try {
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, ...updates, timestamp: new Date() } 
            : session
        )
      );
      
      await PostgresService.updateSession(sessionId, updates);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
      
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
