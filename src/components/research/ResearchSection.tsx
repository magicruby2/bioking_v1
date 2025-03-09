
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatSessions, ChatSession } from '@/components/chat/ChatSessionContext';

interface ResearchSectionProps {
  expanded: boolean;
  onSelectChat: (chatId: string) => void;
  currentSessionId: string | null;
  onDeleteSession: (e: React.MouseEvent, chatId: string) => void;
}

export function ResearchSection({ 
  expanded,
  onSelectChat,
  currentSessionId,
  onDeleteSession
}: ResearchSectionProps) {
  const { sessions } = useChatSessions();
  
  // Filter only research type sessions
  const researchSessions = sessions.filter(
    session => session.type === 'research'
  );

  if (researchSessions.length === 0) {
    return expanded ? (
      <div className="ml-4 mt-1 py-2 text-sm text-muted-foreground">
        No research sessions yet
      </div>
    ) : null;
  }

  return (
    <>
      {expanded && (
        <div className="ml-4 mt-1 flex flex-col gap-1">
          {researchSessions.map(session => (
            <ResearchSessionItem 
              key={session.id}
              session={session}
              isActive={currentSessionId === session.id}
              onSelect={() => onSelectChat(session.id)}
              onDelete={(e) => onDeleteSession(e, session.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}

interface ResearchSessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

function ResearchSessionItem({ 
  session, 
  isActive, 
  onSelect, 
  onDelete 
}: ResearchSessionItemProps) {
  return (
    <div 
      className={cn(
        "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-sm text-left group",
        isActive 
          ? 'bg-secondary text-foreground' 
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
      )}
    >
      <button
        onClick={onSelect}
        className="flex items-start gap-2 w-full overflow-hidden"
      >
        <Search className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="flex flex-col items-start w-full overflow-hidden">
          <span className="font-medium text-foreground truncate w-full text-left">
            {session.title}
          </span>
          <span className="truncate w-full text-xs text-left">
            {session.preview}
          </span>
        </div>
      </button>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex h-5 w-5 items-center justify-center rounded-sm hover:bg-destructive/10 hover:text-destructive"
        title="Delete research"
      >
        <span className="h-3 w-3">×</span>
      </button>
    </div>
  );
}

export default ResearchSection;
