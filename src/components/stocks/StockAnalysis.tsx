import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StockHeader from '@/components/stocks/StockHeader';
import PriceChart from '@/components/stocks/PriceChart';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy data type for stocks
export type StockData = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

// Dummy stock data (replace with actual API call)
const dummyStockData: StockData[] = [
  { date: '2024-01-01', open: 150.00, high: 152.00, low: 149.50, close: 151.25, volume: 1000000 },
  { date: '2024-01-02', open: 151.25, high: 153.50, low: 150.50, close: 153.00, volume: 1200000 },
  { date: '2024-01-03', open: 153.00, high: 154.00, low: 152.00, close: 152.50, volume: 900000 },
  { date: '2024-01-04', open: 152.50, high: 153.00, low: 151.00, close: 152.00, volume: 1100000 },
  { date: '2024-01-05', open: 152.00, high: 154.50, low: 151.50, close: 154.00, volume: 1300000 },
  { date: '2024-01-08', open: 154.00, high: 155.00, low: 153.00, close: 154.75, volume: 1250000 },
  { date: '2024-01-09', open: 154.75, high: 156.00, low: 154.00, close: 155.50, volume: 1400000 },
  { date: '2024-01-10', open: 155.50, high: 156.50, low: 155.00, close: 156.00, volume: 1350000 },
  { date: '2024-01-11', open: 156.00, high: 157.00, low: 155.50, close: 156.50, volume: 1500000 },
  { date: '2024-01-12', open: 156.50, high: 157.50, low: 156.00, close: 157.00, volume: 1450000 },
];

interface StockAnalysisProps {
  stockSymbol?: string;
}

const StockAnalysis = ({ stockSymbol: propStockSymbol }: StockAnalysisProps) => {
  const [stockSymbol, setStockSymbol] = useState(propStockSymbol || 'AAPL');
  const [currentPrice, setCurrentPrice] = useState('150.00');
  const [priceDiff, setPriceDiff] = useState('2.50');
  const [percentDiff, setPercentDiff] = useState('1.67');
  const [isPositive, setIsPositive] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStockSymbol(searchInput.toUpperCase());
  };
  
  return (
    <div className="container py-8">
      {loading ? (
        <Card className="mb-8">
          <CardContent className="p-4">
            <Skeleton className="h-10 w-[200px] mb-4" />
            <Skeleton className="h-6 w-[150px] mb-2" />
            <Skeleton className="h-4 w-[100px]" />
          </CardContent>
        </Card>
      ) : (
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
      )}
      
      {loading ? (
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-[300px]" />
          </CardContent>
        </Card>
      ) : (
        <PriceChart stockData={dummyStockData} />
      )}
    </div>
  );
};

export default StockAnalysis;
