
import { useState } from 'react';
import { Plus, Folder, FolderPlus, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChatSessions, ChatSession } from '@/components/chat/ChatSessionContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ChatFolder {
  id: string;
  name: string;
  expanded: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onNewChat: () => void;
}

export function Sidebar({ isOpen, onNewChat }: SidebarProps) {
  const { 
    sessions: chats, 
    setCurrentSessionId, 
    fetchSessions, 
    isLoading, 
    currentSessionId,
    clearAllSessions
  } = useChatSessions();
  
  const { toast } = useToast();
  
  const [folders, setFolders] = useState<ChatFolder[]>([
    { id: 'f1', name: 'Work Related', expanded: true },
    { id: 'f2', name: 'Personal Projects', expanded: false },
  ]);
  
  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, expanded: !folder.expanded } 
        : folder
    ));
  };
  
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: ChatFolder = {
        id: `f${folders.length + 1}`,
        name: newFolderName,
        expanded: true
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowFolderInput(false);
    }
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentSessionId(chatId);
  };

  const handleRefreshSessions = async () => {
    try {
      await fetchSessions();
      toast({
        title: "Sessions refreshed",
        description: "Chat history has been updated",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh chat history",
        variant: "destructive",
      });
    }
  };

  const handleClearAllSessions = async () => {
    if (confirm("Are you sure you want to clear all chat history? This action cannot be undone.")) {
      await clearAllSessions();
      toast({
        title: "History cleared",
        description: "All chat sessions have been deleted",
      });
      onNewChat(); // Create a new chat after clearing
    }
  };
  
  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border/40 bg-background transition-transform duration-300 ease-in-out md:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6">
          <span className="text-lg font-semibold">Chat History</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRefreshSessions}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              disabled={isLoading}
              title="Refresh chat history"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </button>
            <button
              onClick={handleClearAllSessions}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Clear all chat history"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Clear history</span>
            </button>
          </div>
        </div>
        
        <div className="px-4 md:px-6 mt-4">
          <button
            onClick={onNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </button>
        </div>
        
        <div className="mt-6 flex items-center justify-between px-4 md:px-6">
          <h2 className="text-sm font-medium text-muted-foreground">Folders</h2>
          <button
            onClick={() => setShowFolderInput(true)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <FolderPlus className="h-4 w-4" />
            <span className="sr-only">Create folder</span>
          </button>
        </div>
        
        {showFolderInput && (
          <div className="mt-2 px-4 md:px-6">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') setShowFolderInput(false);
                }}
              />
              <button
                onClick={handleCreateFolder}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          </div>
        )}
        
        <nav className="hide-scrollbar mt-2 flex flex-col gap-1 overflow-y-auto px-2 md:px-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">Loading sessions...</p>
            </div>
          ) : (
            <>
              {folders.map((folder) => (
                <div key={folder.id} className="animate-fade-in">
                  <button
                    onClick={() => toggleFolder(folder.id)}
                    className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      <span className="truncate">{folder.name}</span>
                    </div>
                    <span className="text-xs">{folder.expanded ? '▾' : '▸'}</span>
                  </button>
                  
                  {folder.expanded && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {chats
                        .filter(chat => chat.folderId === folder.id)
                        .map(chat => (
                          <button
                            key={chat.id}
                            onClick={() => handleChatSelect(chat.id)}
                            className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                              currentSessionId === chat.id 
                                ? 'bg-secondary text-foreground' 
                                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                            }`}
                          >
                            <MessageCircle className="h-4 w-4 shrink-0" />
                            <span className="truncate w-full text-left">{chat.title}</span>
                          </button>
                        ))
                      }
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-2">
                <h2 className="px-2 py-1 text-xs font-medium text-muted-foreground">Recent Chats</h2>
                
                {chats.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    No recent chats found
                  </div>
                ) : (
                  chats
                    .filter(chat => !chat.folderId)
                    .map(chat => (
                      <button
                        key={chat.id}
                        onClick={() => handleChatSelect(chat.id)}
                        className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-sm ${
                          currentSessionId === chat.id 
                            ? 'bg-secondary text-foreground' 
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        }`}
                      >
                        <MessageCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <div className="flex flex-col items-start w-full overflow-hidden">
                          <span className="font-medium text-foreground truncate w-full">{chat.title}</span>
                          <span className="truncate w-full text-xs text-left">{chat.preview}</span>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
