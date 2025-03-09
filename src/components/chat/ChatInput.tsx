
import { useState } from 'react';
import { Send, RefreshCw, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (message: string, mode: 'research' | 'report' | null) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedMode, setSelectedMode] = useState<'research' | 'report' | null>(null);
  
  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    onSendMessage(inputValue, selectedMode);
    setInputValue('');
    setSelectedMode(null);
  };

  const toggleMode = (mode: 'research' | 'report') => {
    setSelectedMode(currentMode => currentMode === mode ? null : mode);
  };
  
  return (
    <div className="border-t border-border/40 bg-background p-4 md:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex gap-2">
          <Button
            onClick={() => toggleMode('research')}
            variant={selectedMode === 'research' ? 'default' : 'outline'}
            className="flex items-center gap-2"
            type="button"
            size="sm"
          >
            <Search className="h-4 w-4" />
            Deep Research
          </Button>
          <Button
            onClick={() => toggleMode('report')}
            variant={selectedMode === 'report' ? 'default' : 'outline'}
            className="flex items-center gap-2"
            type="button"
            size="sm"
          >
            <FileText className="h-4 w-4" />
            Report
          </Button>
        </div>
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={selectedMode ? `Type a message for ${selectedMode === 'research' ? 'deep research' : 'report'}...` : "Type a message..."}
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
          {selectedMode 
            ? `${selectedMode === 'research' ? 'Deep Research' : 'Report'} mode activated. Press Enter to send.` 
            : 'Messages are processed by n8n workflows. Press Enter to send.'}
        </p>
      </div>
    </div>
  );
}

export default ChatInput;
