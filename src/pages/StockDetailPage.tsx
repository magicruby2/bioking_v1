
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import StockAnalysis from '@/components/stocks/StockAnalysis';

const StockDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { symbol } = useParams<{ symbol: string }>();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Here we would typically fetch data for the specific stock
  useEffect(() => {
    console.log(`Fetching data for stock: ${symbol}`);
    // In a real app, you would fetch data for the specific stock here
  }, [symbol]);
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full">
          <StockAnalysis stockSymbol={symbol} />
        </main>
      </div>
    </div>
  );
};

export default StockDetailPage;
