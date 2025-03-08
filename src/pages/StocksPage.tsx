
import { useState } from 'react';
import Header from '@/components/layout/Header';
import StockAnalysis from '@/components/stocks/StockAnalysis';

const StocksPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full">
          <StockAnalysis />
        </main>
      </div>
    </div>
  );
};

export default StocksPage;
