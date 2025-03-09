
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
}

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export const useChatSessions = () => {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error('useChatSessions must be used within a ChatSessionProvider');
  }
  return context;
};

export const ChatSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentId = localStorage.getItem('chatSessionId');
    
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        // Convert string timestamps back to Date objects
        const sessionsWithDates = parsedSessions.map((session: any) => ({
          ...session,
          timestamp: new Date(session.timestamp)
        }));
        setSessions(sessionsWithDates);
      } catch (error) {
        console.error('Error parsing saved chat sessions:', error);
      }
    }
    
    if (savedCurrentId) {
      setCurrentSessionId(savedCurrentId);
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save current session ID to localStorage whenever it changes
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('chatSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  const addSession = (session: ChatSession) => {
    setSessions(prev => [session, ...prev]);
  };

  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates, timestamp: new Date() } 
          : session
      )
    );
  };

  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem('chatSessions');
    localStorage.removeItem('chatSessionId');
  };

  return (
    <ChatSessionContext.Provider 
      value={{ 
        sessions, 
        currentSessionId, 
        addSession, 
        updateSession, 
        setCurrentSessionId,
        clearAllSessions
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};
