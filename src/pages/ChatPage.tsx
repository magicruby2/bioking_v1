
import { useState, useEffect } from 'react';
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
    // Generate a new session ID
    const newId = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    
    // Create a new session
    addSession({
      id: newId,
      title: "New Conversation",
      preview: "Start a new conversation",
      timestamp: new Date()
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
        
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
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
