
import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  id?: string; // Add id to make it compatible with Message type
};

export type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  preview: string;
  folderId?: string | null;
};

type ChatSessionContextType = {
  sessions: ChatSession[];
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string | null) => void;
  addSession: (session: ChatSession) => void;
  saveSession: (session: ChatSession) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  isLoading: boolean;
};

const ChatSessionContext = createContext<ChatSessionContextType | undefined>(undefined);

export const useChatSessions = () => {
  const context = useContext(ChatSessionContext);
  if (!context) {
    throw new Error('useChatSessions must be used within a ChatSessionProvider');
  }
  return context;
};

export const ChatSessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const storedSessions = localStorage.getItem('chatSessions');
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions) as ChatSession[];
        
        // Only show sessions that have at least one user message
        const sessionsWithUserMessages = parsedSessions.filter(session => 
          session.messages && session.messages.some(msg => msg.role === 'user')
        );
        
        setSessions(sessionsWithUserMessages);
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const addSession = (session: ChatSession) => {
    // Ensure the session has a valid ID and createdAt property
    const sessionWithCreatedAt = {
      ...session,
      id: session.id || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: session.createdAt || new Date().toISOString()
    };
    
    // Check if the session contains a user message
    const hasUserMessage = sessionWithCreatedAt.messages.some(msg => msg.role === 'user');
    
    // Only add to visible sessions if it has a user message
    if (hasUserMessage) {
      setSessions(prevSessions => [...prevSessions, sessionWithCreatedAt]);
    }
    
    // Always save to localStorage
    const storedSessions = localStorage.getItem('chatSessions');
    const parsedSessions = storedSessions ? JSON.parse(storedSessions) as ChatSession[] : [];
    localStorage.setItem('chatSessions', JSON.stringify([...parsedSessions, sessionWithCreatedAt]));
    
    // Return the session ID in case it was generated
    return sessionWithCreatedAt.id;
  };

  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    // Get current sessions from localStorage
    const storedSessions = localStorage.getItem('chatSessions');
    const allStoredSessions = storedSessions ? JSON.parse(storedSessions) as ChatSession[] : [];
    
    // Find the session to update
    const sessionToUpdate = allStoredSessions.find(s => s.id === sessionId);
    
    if (sessionToUpdate) {
      // Update the session
      const updatedSession = { ...sessionToUpdate, ...updates };
      
      // Update in localStorage
      const updatedStoredSessions = allStoredSessions.map(session =>
        session.id === sessionId ? updatedSession : session
      );
      localStorage.setItem('chatSessions', JSON.stringify(updatedStoredSessions));
      
      // Check if the updated session has a user message
      const hasUserMessage = updatedSession.messages.some(msg => msg.role === 'user');
      
      // Update in-memory sessions
      setSessions(prevSessions => {
        const alreadyExists = prevSessions.some(s => s.id === sessionId);
        
        if (alreadyExists) {
          // Update existing session
          return prevSessions.map(session => 
            session.id === sessionId ? updatedSession : session
          );
        } else if (hasUserMessage) {
          // Add as new session if it has user messages
          return [...prevSessions, updatedSession];
        }
        
        // No change needed
        return prevSessions;
      });
    } else {
      console.error(`Session with ID ${sessionId} not found for update`);
    }
  }, []);

  const saveSession = useCallback((session: ChatSession) => {
    // Check if the session has at least one user message
    const hasUserMessage = session.messages.some(msg => msg.role === 'user');
    
    // Get current sessions from localStorage
    const storedSessions = localStorage.getItem('chatSessions');
    const allStoredSessions = storedSessions ? JSON.parse(storedSessions) as ChatSession[] : [];
    
    // Check if session already exists in localStorage
    const existingSessionIndex = allStoredSessions.findIndex(s => s.id === session.id);
    
    if (existingSessionIndex !== -1) {
      // Update existing session in localStorage
      allStoredSessions[existingSessionIndex] = session;
    } else {
      // Add new session to localStorage
      allStoredSessions.push(session);
    }
    
    // Save to localStorage
    localStorage.setItem('chatSessions', JSON.stringify(allStoredSessions));
    
    // Update in-memory sessions based on user messages
    setSessions(prevSessions => {
      // Find if session already exists in memory
      const existingIndex = prevSessions.findIndex(s => s.id === session.id);
      
      if (existingIndex !== -1) {
        // Update existing session
        return prevSessions.map(s => s.id === session.id ? session : s);
      } else if (hasUserMessage) {
        // Add as new session if it has user messages
        return [...prevSessions, session];
      }
      
      // No change needed
      return prevSessions;
    });
    
    // If session has user messages, trigger a fetch to update the sidebar
    if (hasUserMessage) {
      fetchSessions();
    }
  }, []);

  const deleteSession = (sessionId: string) => {
    // Remove from in-memory sessions
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.filter(session => session.id !== sessionId);
      return updatedSessions;
    });
    
    // Also remove from localStorage
    const storedSessions = localStorage.getItem('chatSessions');
    if (storedSessions) {
      const allStoredSessions = JSON.parse(storedSessions) as ChatSession[];
      const updatedStoredSessions = allStoredSessions.filter(session => session.id !== sessionId);
      localStorage.setItem('chatSessions', JSON.stringify(updatedStoredSessions));
    }
    
    // If the deleted session was the current one, clear the current session
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  };

  const clearAllSessions = async () => {
    localStorage.removeItem('chatSessions');
    setSessions([]);
    setCurrentSessionId(null);
  };

  const contextValue: ChatSessionContextType = {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    addSession,
    saveSession,
    updateSession,
    deleteSession,
    clearAllSessions,
    fetchSessions,
    isLoading,
  };

  return (
    <ChatSessionContext.Provider value={contextValue}>
      {children}
    </ChatSessionContext.Provider>
  );
};
