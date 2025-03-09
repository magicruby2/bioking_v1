
import { useState, useEffect } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from './types';
import { extractResponseText } from './chatUtils';
import { useChatSessions } from './ChatSessionContext';

export function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    currentSessionId, 
    addSession, 
    updateSession,
    sessions
  } = useChatSessions();
  
  // Generate a session ID when the component is mounted
  useEffect(() => {
    const storedId = localStorage.getItem('chatSessionId');
    
    // If we already have a session ID stored, load that session
    if (storedId && currentSessionId) {
      const existingSession = sessions.find(session => session.id === currentSessionId);
      if (existingSession) {
        console.log("Loading existing session", existingSession);
        return;
      }
    }
    
    // Add default welcome message
    setMessages([{
      id: '1',
      content: "Hello! I'm your AI assistant integrated with n8n. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }]);
    
    // Create a new session if none exists
    if (!currentSessionId) {
      const newId = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      
      // Create a new session in the database
      addSession({
        id: newId,
        title: "New Conversation",
        preview: "Hello! I'm your AI assistant integrated with n8n. How can I help you today?",
        timestamp: new Date()
      });
    }
  }, [currentSessionId, addSession, sessions]);
  
  const handleSendMessage = async (inputValue: string) => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Add a temporary waiting message
    const waitingMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: waitingMessageId,
      content: "",
      sender: 'assistant',
      timestamp: new Date()
    }]);
    
    try {
      // Update the session title and preview after first user message
      if (messages.length <= 1 && currentSessionId) {
        updateSession(currentSessionId, {
          title: inputValue.substring(0, 30) + (inputValue.length > 30 ? '...' : ''),
          preview: inputValue,
          timestamp: new Date()
        });
      }
      
      const response = await N8nService.sendChatMessage(inputValue, currentSessionId || '');
      
      // Remove the waiting message
      setMessages(prev => prev.filter(msg => msg.id !== waitingMessageId));
      
      if (response.success) {
        // Extract the text response from the data structure
        const responseText = extractResponseText(response.data);
        
        const assistantMessage: Message = {
          id: (Date.now() + 2).toString(),
          content: responseText,
          sender: 'assistant',
          timestamp: new Date()
        };
        
        const updatedMessages = [...messages.filter(msg => msg.id !== waitingMessageId), userMessage, assistantMessage];
        setMessages(updatedMessages);
        
        // Update the session with the latest messages
        if (currentSessionId) {
          updateSession(currentSessionId, {
            preview: responseText,
            timestamp: new Date()
          });
        }
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Remove the waiting message
      setMessages(prev => prev.filter(msg => msg.id !== waitingMessageId));
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      // Add a fallback message when the real webhook fails
      const fallbackMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "I'm having trouble connecting to the n8n workflow. This is a simulated response until the connection is restored. How else can I assist you?",
        sender: 'assistant',
        timestamp: new Date()
      };
      
      const updatedMessages = [...messages.filter(msg => msg.id !== waitingMessageId), userMessage, fallbackMessage];
      setMessages(updatedMessages);
      
      // Update the session with the fallback message
      if (currentSessionId) {
        updateSession(currentSessionId, {
          preview: fallbackMessage.content,
          timestamp: new Date()
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <MessageList messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default ChatInterface;
