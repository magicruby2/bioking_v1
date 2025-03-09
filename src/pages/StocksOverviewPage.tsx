
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { MarketOverview } from '@/components/stocks/MarketOverview';

const StocksOverviewPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full p-4 md:p-6 max-w-7xl mx-auto">
          <MarketOverview />
        </main>
      </div>
    </div>
  );
};

export default StocksOverviewPage;
