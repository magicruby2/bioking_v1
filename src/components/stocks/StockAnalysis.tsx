
import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Scatter, CandlestickChart, Candlestick } from 'recharts';
import { RefreshCw, Calendar, Search, ChartCandlestick } from 'lucide-react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";

interface StockData {
  date: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

const dummyStockData: StockData[] = [
  { date: '2023-01-01', price: 150.21, volume: 1520000, open: 149.50, close: 150.21, high: 151.20, low: 148.90 },
  { date: '2023-01-02', price: 152.36, volume: 1620000, open: 150.30, close: 152.36, high: 153.10, low: 150.10 },
  { date: '2023-01-03', price: 148.97, volume: 1820000, open: 152.00, close: 148.97, high: 152.50, low: 148.20 },
  { date: '2023-01-04', price: 150.42, volume: 1420000, open: 149.00, close: 150.42, high: 151.30, low: 148.80 },
  { date: '2023-01-05', price: 153.17, volume: 1920000, open: 150.50, close: 153.17, high: 154.20, low: 150.10 },
  { date: '2023-01-06', price: 156.78, volume: 2120000, open: 153.20, close: 156.78, high: 157.50, low: 153.00 },
  { date: '2023-01-07', price: 155.23, volume: 1720000, open: 156.80, close: 155.23, high: 157.00, low: 154.50 },
  { date: '2023-01-08', price: 158.46, volume: 1990000, open: 155.50, close: 158.46, high: 159.20, low: 155.10 },
  { date: '2023-01-09', price: 160.12, volume: 2220000, open: 158.50, close: 160.12, high: 161.30, low: 158.20 },
  { date: '2023-01-10', price: 161.87, volume: 2320000, open: 160.20, close: 161.87, high: 162.50, low: 159.90 },
];

const timeframeOptions = ['1D', '1W', '1M', '3M', '1Y', 'YTD'];

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
          price: item.price * (0.9 + Math.random() * 0.2)
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
  
  const currentPrice = stockData[stockData.length - 1]?.price.toFixed(2);
  const previousPrice = stockData[stockData.length - 2]?.price;
  const priceDiff = currentPrice && previousPrice 
    ? (parseFloat(currentPrice) - previousPrice).toFixed(2)
    : '0.00';
    
  const percentDiff = currentPrice && previousPrice 
    ? ((parseFloat(priceDiff) / previousPrice) * 100).toFixed(2)
    : '0.00';
    
  const isPositive = parseFloat(priceDiff) >= 0;
  
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{stockSymbol}</h1>
            <div className="mt-1 flex items-center">
              <span className="text-3xl font-bold">${currentPrice}</span>
              <span className={`ml-2 flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? '+' : ''}{priceDiff} ({percentDiff}%)
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search symbol..."
                className="flex h-10 w-full rounded-l-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="mb-6 flex overflow-x-auto">
          <div className="flex space-x-2">
            {timeframeOptions.map((option) => (
              <button
                key={option}
                onClick={() => setTimeframe(option)}
                className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors ${
                  timeframe === option
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {option}
              </button>
            ))}
            <button
              onClick={fetchStockData}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </button>
          </div>
        </div>
        
        <div className="mb-8 overflow-hidden rounded-xl border border-border/40 bg-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartCandlestick className="h-5 w-5" />
              <h2 className="text-lg font-medium">Price Chart</h2>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <CandlestickChart
                data={stockData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip
                  content={(props) => {
                    if (!props.active || !props.payload || props.payload.length === 0) return null;
                    const data = props.payload[0].payload;
                    return (
                      <div className="bg-background border border-border/40 p-2 rounded-md shadow-md">
                        <p className="font-medium">{data.date}</p>
                        <p className="text-sm">Open: ${data.open.toFixed(2)}</p>
                        <p className="text-sm">Close: ${data.close.toFixed(2)}</p>
                        <p className="text-sm">High: ${data.high.toFixed(2)}</p>
                        <p className="text-sm">Low: ${data.low.toFixed(2)}</p>
                      </div>
                    );
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <Candlestick
                  fill="transparent"
                  yAccessor={(data) => [data.open, data.high, data.low, data.close]}
                  stroke={(data) => (data.close > data.open ? "hsl(var(--success))" : "hsl(var(--destructive))")}
                  wickStroke={(data) => (data.close > data.open ? "hsl(var(--success))" : "hsl(var(--destructive))")}
                  fillOpacity={1}
                />
              </CandlestickChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mb-8 overflow-hidden rounded-xl border border-border/40 bg-card p-4">
          <div className="mb-4">
            <h2 className="text-lg font-medium">Volume</h2>
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={stockData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-border/40 bg-card">
          <div className="p-4">
            <h2 className="text-lg font-medium">Technical Indicators</h2>
            <p className="text-sm text-muted-foreground">
              Based on current price action
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border-t border-border/40">
            {[
              { name: 'RSI', value: '45.23', status: 'Neutral' },
              { name: 'MACD', value: '-0.42', status: 'Bearish' },
              { name: 'Moving Avg (50)', value: '$153.42', status: isPositive ? 'Above' : 'Below' },
              { name: 'Moving Avg (200)', value: '$148.76', status: 'Above' },
              { name: 'Volume Avg', value: '1.8M', status: 'Normal' },
              { name: 'Bollinger Bands', value: '$145-162', status: 'Inside' },
            ].map((indicator) => (
              <div 
                key={indicator.name}
                className="rounded-lg border border-border/40 p-3"
              >
                <div className="text-sm font-medium">{indicator.name}</div>
                <div className="mt-1 text-lg font-semibold">{indicator.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{indicator.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockAnalysis;
