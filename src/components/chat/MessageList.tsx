
import { useRef, useEffect } from 'react';
import { Message } from './types';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex items-start gap-3",
              message.sender === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.sender === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                AI
              </div>
            )}
            
            <div 
              className={cn(
                "rounded-lg px-4 py-3 max-w-[75%] shadow-sm animate-fade-in",
                message.sender === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-secondary text-secondary-foreground rounded-tl-none"
              )}
            >
              {message.content || message.content === '' ? (
                message.content ? (
                  <div className="prose">
                    {message.content.split('\n').map((paragraph, i) => (
                      <p key={i} className="m-0 leading-relaxed text-left">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-2">
                    <img 
                      src="/Epic-chess-battle.gif" 
                      alt="Loading" 
                      className="h-12 w-12 mb-1"
                    />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                )
              ) : null}
              <div className="mt-1 text-right">
                <span className="text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
            
            {message.sender === 'user' && (
              <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                You
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default MessageList;
