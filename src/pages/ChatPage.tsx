
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatSessionProvider, useChatSessions } from '@/components/chat/ChatSessionContext';
import { useToast } from '@/hooks/use-toast';

const ChatPageContent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { setCurrentSessionId, addSession } = useChatSessions();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleNewChat = () => {
    console.log('Creating new chat...');
    // Generate a new session ID with a more consistent format
    const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create a new session
    addSession({
      id: newId,
      title: "New Conversation",
      preview: "Start a new conversation",
      createdAt: new Date().toISOString(),
      messages: [] // Initialize with empty messages array
    });
    
    // Set as current session
    setCurrentSessionId(newId);
    
    toast({
      title: "New Chat Created",
      description: "Started a fresh conversation",
    });
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onNewChat={handleNewChat} />
        
        <main className="flex-1 w-full">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
};

const ChatPage = () => {
  return (
    <ChatSessionProvider>
      <ChatPageContent />
    </ChatSessionProvider>
  );
};

export default ChatPage;
