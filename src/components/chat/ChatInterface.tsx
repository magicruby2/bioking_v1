
import { useState, useEffect } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from './types';
import { extractResponseText } from './chatUtils';
import { useChatSessions, ChatMessage } from './ChatSessionContext';

// Helper function to convert between Message and ChatMessage types
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
  
  const { 
    currentSessionId, 
    addSession,
    setCurrentSessionId,
    updateSession,
    sessions,
    saveSession,
    fetchSessions
  } = useChatSessions();
  
  // Create a new session ID if one doesn't exist
  useEffect(() => {
    if (!currentSessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCurrentSessionId(newSessionId);
      console.log("Created new session ID:", newSessionId);
    }
  }, [currentSessionId, setCurrentSessionId]);
  
  useEffect(() => {
    if (!currentSessionId) return;
    
    const currentSession = sessions.find(session => session.id === currentSessionId);
    
    if (currentSession) {
      if (currentSession.messages && currentSession.messages.length > 0) {
        console.log("Loading messages from session:", currentSession.messages);
        // Convert ChatMessage[] to Message[]
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
        
        // Save this initial message to the session
        updateSession(currentSessionId, {
          messages: [convertToChatMessage(initialMessage)],
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
      
      // Create new session with the initial greeting message
      addSession({
        id: newId,
        title: "New Conversation",
        preview: initialMessage.content,
        createdAt: new Date().toISOString(),
        messages: [convertToChatMessage(initialMessage)]
      });
      
      // Set this as the current session
      setCurrentSessionId(newId);
    } else if (!isSessionInitialized) {
      // Also ensure we save the initial greeting message when reusing an existing session ID
      updateSession(currentSessionId, {
        messages: [convertToChatMessage(initialMessage)],
      });
    }
  }, [currentSessionId, addSession, messages.length, isSessionInitialized, updateSession, setCurrentSessionId]);
  
  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;
    
    // Ensure we have a valid session ID
    if (!currentSessionId) {
      const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCurrentSessionId(newId);
      console.log("Created new session ID before sending message:", newId);
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Immediately update local messages state to show user input
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    
    const waitingMessageId = (Date.now() + 1).toString();
    // Add waiting message to show loading state
    setMessages(prev => [...prev, {
      id: waitingMessageId,
      content: "",
      sender: 'assistant',
      timestamp: new Date()
    }]);
    
    try {
      // Initialize the session with the first user message
      if (!isSessionInitialized && currentSessionId) {
        setIsSessionInitialized(true);
        // Convert Message[] to ChatMessage[]
        const chatMessages = updatedMessages.map(convertToChatMessage);
        
        // Create/update the session with user message immediately so it appears in sidebar
        const sessionToUpdate = {
          id: currentSessionId,
          title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
          preview: inputValue,
          createdAt: new Date().toISOString(),
          messages: chatMessages
        };
        
        // Save the session to ensure it appears in the sidebar
        saveSession(sessionToUpdate);
        
        // Trigger a sidebar refresh
        await fetchSessions();
      }
      
      console.log("Sending message with session ID:", currentSessionId);
      const response = await N8nService.sendChatMessage(inputValue, currentSessionId);
      
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
          // Convert Message[] to ChatMessage[]
          const chatMessages = finalMessages.map(convertToChatMessage);
          
          // Update the session with the response
          const sessionToUpdate = {
            id: currentSessionId,
            title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
            preview: responseText,
            messages: chatMessages
          };
          
          // Use saveSession instead of updateSession to ensure it triggers a sidebar update
          saveSession(sessionToUpdate);
          
          // Refresh sessions to update sidebar
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
        // Convert Message[] to ChatMessage[]
        const chatMessages = finalMessages.map(convertToChatMessage);
        
        // Update the session with the fallback message
        saveSession({
          id: currentSessionId,
          title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
          preview: fallbackMessage.content,
          createdAt: new Date().toISOString(),
          messages: chatMessages
        });
        
        // Refresh sessions to update sidebar
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
