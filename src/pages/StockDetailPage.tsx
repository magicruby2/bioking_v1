
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import StockSummary from '@/components/stocks/StockSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const StockDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Here we would typically fetch data for the specific stock
  useEffect(() => {
    console.log(`Fetching data for stock: ${symbol}`);
    // Simulate loading time (in a real app, this would be a PostgreSQL query)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [symbol]);
  
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-auto">
        <main className="h-full">
          <div className="container py-6">
            <div className="mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBack}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Stocks
              </Button>
              
              <StockSummary symbol={symbol || 'AAPL'} loading={loading} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockDetailPage;
