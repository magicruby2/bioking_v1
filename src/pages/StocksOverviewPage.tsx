
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { MarketOverview } from '@/components/stocks/MarketOverview';
import N8nService from '@/services/n8nService';
import { ScrollArea } from '@/components/ui/scroll-area';

const StocksOverviewPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Connect to n8n webhook
        const userAgent = navigator.userAgent;
        const response = await N8nService.sendStocksOverviewVisit(userAgent);
        
        if (response.success) {
          console.log('Successfully connected to n8n webhook:', response.data);
          toast({
            title: "Connected to n8n",
            description: "Successfully connected to the stocks webhook",
          });
          
          // Get top 3 pharmaceutical stocks as trending from n8n
          const trendingResponse = await N8nService.fetchTrendingStocks();
          if (trendingResponse.success && trendingResponse.data) {
            // Use only 3 stocks for trending display
            const stocks = trendingResponse.data.stocks || [];
            setTrendingStocks(stocks.slice(0, 3));
          }
        } else {
          console.error('Failed to connect to n8n webhook:', response.error);
          toast({
            title: "Connection Failed",
            description: "Failed to connect to the n8n webhook",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error connecting to n8n webhook:', error);
        toast({
          title: "Connection Error",
          description: "Error connecting to the n8n webhook",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <MarketOverview trendingStocks={trendingStocks} />
            )}
          </main>
        </ScrollArea>
      </div>
    </div>
  );
};

export default StocksOverviewPage;
