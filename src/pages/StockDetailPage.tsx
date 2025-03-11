
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import StockSummary from '@/components/stocks/StockSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import N8nService from '@/services/n8nService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStockSummary } from '@/components/stocks/stockSummaryData';

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

  // Get stock data for analysis display
  const stockData = getStockSummary(symbol || 'AAPL');
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 h-full">
          {/* Left half - Stock summary */}
          <div className="border-r border-border/40">
            <ScrollArea className="h-full w-full">
              <div className="p-6 pb-20">
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
            </ScrollArea>
          </div>
          
          {/* Right half - Analysis */}
          <div>
            <ScrollArea className="h-full w-full">
              <div className="p-6 pb-20">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                    Analysis: {stockData.name} ({stockData.symbol})
                  </h1>
                  <div className="rounded-lg border border-border/40 bg-card p-6 markdown-content" 
                    dangerouslySetInnerHTML={{ __html: markdownToHtml(stockData.description) }} 
                  />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple markdown to HTML converter
function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mt-3 mb-2">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-base font-medium mt-2 mb-1">$1</h4>')
    .replace(/^\- (.*$)/gim, '<ul class="list-disc list-inside mb-2"><li>$1</li></ul>')
    .replace(/^\* (.*$)/gim, '<ul class="list-disc list-inside mb-2"><li>$1</li></ul>')
    .replace(/\n/gim, '<br>')
    .replace(/<\/ul>\s*<ul>/gim, '')
    .replace(/^([^<]+)$/gim, '<p>$1</p>');
}

export default StockDetailPage;
