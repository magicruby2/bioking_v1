
import { useRef, useEffect } from 'react';
import { Message } from './types';

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
                <div className="flex flex-col items-center py-2">
                  <img 
                    src="/Epic-chess-battle.gif" 
                    alt="Loading" 
                    className="h-16 w-16 mb-2"
                  />
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
  );
}

export default MessageList;
