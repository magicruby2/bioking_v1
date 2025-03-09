
import { useState } from 'react';
import Header from '@/components/layout/Header';
import StockAnalysis from '@/components/stocks/StockAnalysis';
import StockList from '@/components/stocks/StockList';

const StocksPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto pb-8">
          <div className="mx-auto max-w-4xl px-4 py-4 md:px-6">
            <h1 className="mb-6 text-3xl font-bold">Stock Dashboard</h1>
            
            <div className="mb-8">
              <StockList />
            </div>
            
            <StockAnalysis />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StocksPage;
