import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import StockSummary from '@/components/stocks/StockSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import N8nService from '@/services/n8nService';
import { ScrollArea } from '@/components/ui/scroll-area';

const StockDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const fetchStockData = async () => {
      console.log(`Fetching data for stock: ${symbol}`);
      setLoading(true);
      
      try {
        const response = await N8nService.fetchStockData(symbol || 'AAPL', '1D');
        
        if (response.success) {
          console.log('Stock data fetched successfully:', response.data);
        } else {
          console.error('Failed to fetch stock data:', response.error);
        }
        
        toast({
          title: `${symbol} data loaded`,
          description: "Stock information has been retrieved successfully",
        });
      } catch (error) {
        console.error('Error fetching stock data:', error);
        toast({
          title: "Error loading data",
          description: "Failed to load stock information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStockData();
  }, [symbol, toast]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="container py-6 pb-20">
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
        </ScrollArea>
      </div>
    </div>
  );
};

export default StockDetailPage;
