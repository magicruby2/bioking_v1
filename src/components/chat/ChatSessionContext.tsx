import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
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
          session.messages.some(msg => msg.role === 'user')
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
    setSessions(prevSessions => [...prevSessions, session]);
  };

  const saveSession = useCallback((session: ChatSession) => {
    setSessions(prevSessions => {
      // Check if the session has at least one user message
      const hasUserMessage = session.messages.some(msg => msg.role === 'user');
      
      // Update or add the session
      const updatedSessions = prevSessions.map(s => 
        s.id === session.id ? session : s
      );
      
      // If the session wasn't found and it has user messages, add it
      if (!updatedSessions.includes(session) && hasUserMessage) {
        updatedSessions.push(session);
      } else if (!updatedSessions.includes(session) && !hasUserMessage) {
        // If it doesn't have user messages yet, don't add it to the displayed sessions
        // but still save it in localStorage for persistence
        const allStoredSessions = [...prevSessions, session];
        localStorage.setItem('chatSessions', JSON.stringify(allStoredSessions));
        return prevSessions; // Return unchanged visible sessions
      }
      
      // Save all sessions to localStorage
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    });
  }, []);

  const deleteSession = (sessionId: string) => {
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.filter(session => session.id !== sessionId);
      localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
      return updatedSessions;
    });
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
