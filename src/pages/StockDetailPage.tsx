
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import StockSummary from '@/components/stocks/StockSummary';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import N8nService from '@/services/n8nService';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getStockSummary } from '@/components/stocks/stockSummaryData';

const StockDetailPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'ko'>('en');
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ko' : 'en';
    setLanguage(newLanguage);
    
    toast({
      title: newLanguage === 'en' ? 'Language Changed' : '언어가 변경됨',
      description: newLanguage === 'en' ? 'Switched to English' : '한국어로 전환됨',
    });
  };
  
  useEffect(() => {
    const fetchStockData = async () => {
      console.log(`Fetching data for stock: ${symbol}`);
      setLoading(true);
      
      try {
        const response = await N8nService.fetchStockData(symbol || 'AAPL', '1D');
        
        if (response.success) {
          console.log('Stock data fetched successfully:', response.data);
          
          toast({
            title: `${symbol} data loaded`,
            description: "Stock information has been retrieved successfully",
          });
        } else {
          console.error('Failed to fetch stock data:', response.error);
          
          toast({
            title: "Warning",
            description: "Using fallback stock data as real-time data couldn't be fetched",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
        
        toast({
          title: "Using sample data",
          description: "Failed to connect to data service, using offline sample data",
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
  
  // Language-specific content
  const texts = {
    en: {
      back: 'Back to Stocks',
      analysis: 'Analysis',
    },
    ko: {
      back: '주식 목록으로 돌아가기',
      analysis: '분석',
    }
  };
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-2 h-full">
          {/* Left half - Stock summary */}
          <div className="border-r border-border/40 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 pb-20">
                <div className="flex justify-between items-center mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBack}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {texts[language].back}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLanguage}
                    className="flex items-center gap-1"
                  >
                    <Globe className="h-4 w-4" />
                    {language === 'en' ? 'English' : '한국어'}
                  </Button>
                </div>
                
                <StockSummary symbol={symbol || 'AAPL'} loading={loading} />
              </div>
            </ScrollArea>
          </div>
          
          {/* Right half - Analysis */}
          <div className="overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 pb-20">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                    {texts[language].analysis}: {stockData.name} ({stockData.symbol})
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
