
import { useState } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { Message } from './types';
import { extractResponseText } from './chatUtils';

export function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant integrated with n8n. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Generate a session ID when the component is mounted
  const [sessionId] = useState(() => {
    const storedId = localStorage.getItem('chatSessionId');
    if (storedId) return storedId;
    
    // Generate a random session ID if none exists
    const newId = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chatSessionId', newId);
    return newId;
  });
  
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
      const response = await N8nService.sendChatMessage(inputValue, sessionId);
      
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
        
        setMessages(prev => [...prev, assistantMessage]);
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
      
      setMessages(prev => [...prev, fallbackMessage]);
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
