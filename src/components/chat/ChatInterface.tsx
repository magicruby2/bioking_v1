import { useState, useEffect } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from './types';
import { extractResponseText } from './chatUtils';
import { useChatSessions, ChatMessage } from './ChatSessionContext';

const convertToChatMessage = (message: Message): ChatMessage => {
  return {
    id: message.id,
    role: message.sender === 'user' ? 'user' : 'assistant',
    content: message.content,
    timestamp: message.timestamp.toISOString()
  };
};

const convertToMessage = (chatMessage: ChatMessage): Message => {
  return {
    id: chatMessage.id || Date.now().toString(),
    content: chatMessage.content,
    sender: chatMessage.role === 'user' ? 'user' : 'assistant',
    timestamp: new Date(chatMessage.timestamp || new Date())
  };
};

export function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [previousSessionId, setPreviousSessionId] = useState<string | null>(null);
  
  const { 
    currentSessionId, 
    addSession,
    setCurrentSessionId,
    updateSession,
    sessions,
    saveSession,
    fetchSessions
  } = useChatSessions();
  
  useEffect(() => {
    if (!currentSessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCurrentSessionId(newSessionId);
      console.log("Created new session ID:", newSessionId);
    }
  }, [currentSessionId, setCurrentSessionId]);
  
  useEffect(() => {
    if (currentSessionId !== previousSessionId) {
      setPreviousSessionId(currentSessionId);
      setMessages([]);
      setIsSessionInitialized(false);
    }
    
    if (!currentSessionId) return;
    
    const currentSession = sessions.find(session => session.id === currentSessionId);
    
    if (currentSession) {
      if (currentSession.messages && currentSession.messages.length > 0) {
        console.log("Loading messages from session:", currentSession.messages);
        const convertedMessages = currentSession.messages.map(convertToMessage);
        setMessages(convertedMessages);
        setIsSessionInitialized(true);
      } else {
        const initialMessage: Message = {
          id: '1',
          content: "Hello! I'm your AI assistant integrated with n8n. How can I help you today?",
          sender: 'assistant' as const,
          timestamp: new Date()
        };
        
        setMessages([initialMessage]);
        setIsSessionInitialized(false);
        
        updateSession(currentSessionId, {
          messages: [convertToChatMessage(initialMessage)],
          createdAt: new Date().toISOString()
        });
      }
    } else {
      console.log("Session not found:", currentSessionId);
    }
  }, [currentSessionId, sessions, updateSession]);
  
  useEffect(() => {
    if (messages.length > 0) return;
    
    const initialMessage: Message = {
      id: '1',
      content: "Hello! I'm your AI assistant integrated with n8n. How can I help you today?",
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
    
    if (!currentSessionId) {
      const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log("Creating new session with ID:", newId);
      
      addSession({
        id: newId,
        title: "New Conversation",
        preview: initialMessage.content,
        createdAt: new Date().toISOString(),
        messages: [convertToChatMessage(initialMessage)]
      });
      
      setCurrentSessionId(newId);
    } else if (!isSessionInitialized) {
      updateSession(currentSessionId, {
        messages: [convertToChatMessage(initialMessage)],
        createdAt: new Date().toISOString()
      });
    }
  }, [currentSessionId, addSession, messages.length, isSessionInitialized, updateSession, setCurrentSessionId]);
  
  const handleSendMessage = async (inputValue: string, mode: 'research' | 'report' | null) => {
    if (!inputValue.trim() || isLoading) return;
    
    if (!currentSessionId) {
      const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCurrentSessionId(newId);
      console.log("Created new session ID before sending message:", newId);
    }
    
    const displayMessagePrefix = mode ? `[${mode.toUpperCase()}] ` : '';
    const displayMessageContent = `${displayMessagePrefix}${inputValue}`;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: displayMessageContent,
      sender: 'user',
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    const waitingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: waitingMessageId,
      content: "",
      sender: 'assistant',
      timestamp: new Date()
    }]);
    
    try {
      if (!isSessionInitialized && currentSessionId) {
        setIsSessionInitialized(true);
        const chatMessages = updatedMessages.map(convertToChatMessage);
        const sessionToUpdate = {
          id: currentSessionId,
          title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
          preview: inputValue,
          createdAt: new Date().toISOString(),
          messages: chatMessages
        };
        saveSession(sessionToUpdate);
        await fetchSessions();
      }
      
      console.log(`Sending ${mode || 'regular'} message with session ID:`, currentSessionId);
      
      let response;
      if (mode === 'research') {
        response = await N8nService.sendResearchRequest(inputValue, currentSessionId);
      } else if (mode === 'report') {
        response = await N8nService.sendReportRequest(inputValue, currentSessionId);
      } else {
        response = await N8nService.sendChatMessage(inputValue, currentSessionId);
      }
      
      setMessages(prev => prev.filter(msg => msg.id !== waitingMessageId));
      
      if (response.success) {
        const responseText = extractResponseText(response.data);
        
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: responseText,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        const finalMessages = [...messages.filter(msg => msg.id !== waitingMessageId), userMessage, assistantMessage];
        setMessages(finalMessages);
        
        if (currentSessionId) {
          const chatMessages = finalMessages.map(convertToChatMessage);
          const sessionToUpdate = {
            id: currentSessionId,
            title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
            preview: responseText,
            createdAt: new Date().toISOString(),
            messages: chatMessages
          };
          saveSession(sessionToUpdate);
          await fetchSessions();
        }
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      setMessages(prev => prev.filter(msg => msg.id !== waitingMessageId));
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      const fallbackMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I'm having trouble connecting to the n8n workflow. This is a simulated response until the connection is restored. How else can I assist you?",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      const finalMessages = [...messages.filter(msg => msg.id !== waitingMessageId), userMessage, fallbackMessage];
      setMessages(finalMessages);
      
      if (currentSessionId && isSessionInitialized) {
        const chatMessages = finalMessages.map(convertToChatMessage);
        saveSession({
          id: currentSessionId,
          title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
          preview: fallbackMessage.content,
          createdAt: new Date().toISOString(),
          messages: chatMessages
        });
        await fetchSessions();
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatInterface;
