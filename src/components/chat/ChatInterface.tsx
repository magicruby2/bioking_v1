
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
    sender: chatMessage.role,
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
    updateSession,
    sessions
  } = useChatSessions();
  
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
      const newId = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      
      // Create new session with the initial greeting message
      addSession({
        id: newId,
        title: "New Conversation",
        preview: initialMessage.content,
        createdAt: new Date().toISOString(),
        messages: [convertToChatMessage(initialMessage)]
      });
    } else if (!isSessionInitialized) {
      // Also ensure we save the initial greeting message when reusing an existing session ID
      updateSession(currentSessionId, {
        messages: [convertToChatMessage(initialMessage)],
      });
    }
  }, [currentSessionId, addSession, messages.length, isSessionInitialized, updateSession]);
  
  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;
    
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
        updateSession(currentSessionId, {
          title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
          preview: inputValue,
          messages: chatMessages
        });
      }
      
      const response = await N8nService.sendChatMessage(inputValue, currentSessionId || '');
      
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
          updateSession(currentSessionId, {
            preview: responseText,
            messages: chatMessages
          });
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
        updateSession(currentSessionId, {
          preview: fallbackMessage.content,
          messages: chatMessages
        });
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
