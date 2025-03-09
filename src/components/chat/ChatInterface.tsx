
import { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Loader2 } from 'lucide-react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface N8nChatResponse {
  index?: number;
  message?: {
    role?: string;
    content?: string;
    refusal?: null | string;
  };
  logprobs?: null | any;
  finish_reason?: string;
  output?: string;
  reply?: string;
  [key: string]: any;
}

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
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const extractResponseText = (data: any): string => {
    console.log("Processing response data:", data);
    
    // New format: {"index":0,"message":{"role":"assistant","content":"Hello!"},"logprobs":null,"finish_reason":"stop"}
    if (data && data.message && data.message.content) {
      return data.message.content;
    }
    
    // Check if the response follows the original expected format with an array
    if (Array.isArray(data) && data.length > 0) {
      if (data[0]?.output) {
        return data[0].output;
      }
      if (data[0]?.message?.content) {
        return data[0].message.content;
      }
    }
    
    // Handle case where data is an N8nChatResponse object (original format)
    const responseData = data as N8nChatResponse;
    if (responseData.output) return responseData.output;
    if (responseData.reply) return responseData.reply;
    if (responseData.message && typeof responseData.message === 'string' && 
        responseData.message !== "Workflow was started") {
      return responseData.message;
    }
    
    // Fallback response
    return "I received your message, but I'm not sure how to respond to it. Please try again or ask something else.";
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
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
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-xl px-4 py-3 transition-all duration-300 ease-in-out animate-fade-in ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}
                style={{
                  maxWidth: '80%',
                  boxShadow: message.sender === 'user' 
                    ? '0 2px 6px rgba(0,0,0,0.05)' 
                    : '0 2px 6px rgba(0,0,0,0.05)'
                }}
              >
                {message.content ? (
                  <div className="prose">
                    {message.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="m-0 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                )}
                <div className="mt-1 text-right">
                  <span className="text-xs opacity-60">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <div className="border-t border-border/40 bg-background p-4 md:p-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="min-h-[80px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 pr-12 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute bottom-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Messages are processed by n8n workflows. Press Enter to send.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
