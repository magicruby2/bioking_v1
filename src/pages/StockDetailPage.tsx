
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import StockAnalysis from '@/components/stocks/StockAnalysis';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const StockDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Here we would typically fetch data for the specific stock
  useEffect(() => {
    console.log(`Fetching data for stock: ${symbol}`);
    // In a real app, you would fetch data for the specific stock here
  }, [symbol]);
  
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          <div className="container py-2">
            <StockAnalysis stockSymbol={symbol} showBackButton={true} onBack={handleBack} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockDetailPage;
