import { useState, useEffect } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import StockHeader from './StockHeader';
import TimeframeSelector from './TimeframeSelector';
import PriceChart from './PriceChart';
import TechnicalIndicators from './TechnicalIndicators';
import { dummyStockData, timeframeOptions, getDefaultIndicators, StockData } from './dummyData';

export function StockAnalysis() {
  const { toast } = useToast();
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [searchInput, setSearchInput] = useState('');
  const [timeframe, setTimeframe] = useState('1M');
  const [stockData, setStockData] = useState<StockData[]>(dummyStockData);
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchStockData = async () => {
    setIsLoading(true);
    
    try {
      const response = await N8nService.fetchStockData(stockSymbol, timeframe);
      
      if (response.success && response.data) {
        // In a real implementation, we'd use the actual data from the n8n webhook
        console.log('Received stock data:', response.data);
        // For now we'll use our dummy data with slight variations
        setStockData(dummyStockData.map(item => ({
          ...item,
          open: item.open * (0.9 + Math.random() * 0.2),
          high: item.high * (0.95 + Math.random() * 0.1),
          low: item.low * (0.9 + Math.random() * 0.1),
          close: item.close * (0.9 + Math.random() * 0.2)
        })));
      } else {
        throw new Error(response.error || 'Failed to fetch stock data');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Using sample data instead.",
        variant: "destructive",
      });
      // Keep the current data in case of error
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStockData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stockSymbol, timeframe]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setStockSymbol(searchInput.toUpperCase());
      setSearchInput('');
    }
  };
  
  const currentPrice = stockData[stockData.length - 1]?.close.toFixed(2);
  const previousPrice = stockData[stockData.length - 2]?.close;
  const priceDiff = currentPrice && previousPrice 
    ? (parseFloat(currentPrice) - previousPrice).toFixed(2)
    : '0.00';
    
  const percentDiff = currentPrice && previousPrice 
    ? ((parseFloat(priceDiff) / previousPrice) * 100).toFixed(2)
    : '0.00';
    
  const isPositive = parseFloat(priceDiff) >= 0;
  const indicators = getDefaultIndicators(isPositive);
  
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <StockHeader 
          stockSymbol={stockSymbol}
          currentPrice={currentPrice}
          priceDiff={priceDiff}
          percentDiff={percentDiff}
          isPositive={isPositive}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
        />
        
        <TimeframeSelector 
          timeframeOptions={timeframeOptions}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          refreshData={fetchStockData}
          isLoading={isLoading}
        />
        
        <PriceChart stockData={stockData} />
        
        <TechnicalIndicators indicators={indicators} />
      </div>
    </div>
  );
}

export default StockAnalysis;
