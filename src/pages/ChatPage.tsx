
import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { ChatSessionProvider } from '@/components/chat/ChatSessionContext';
import { Loader2 } from 'lucide-react';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleNewChat = () => {
    console.log('Creating new chat...');
    // Clear session ID to start a new chat
    localStorage.removeItem('chatSessionId');
    // Reload the page to create a new session
    window.location.reload();
  };
  
  return (
    <ChatSessionProvider>
      <div className="flex h-screen flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onNewChat={handleNewChat} />
          
          <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
            <ChatInterface />
          </main>
        </div>
      </div>
    </ChatSessionProvider>
  );
};

export default ChatPage;
