
import { useState } from 'react';
import { StockSummary as StockSummaryType, getStockSummary, getFundamentalsData } from './stockSummaryData';
import PriceChart from './PriceChart';
import StockFundamentalsChart from './StockFundamentalsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, TrendingUp, TrendingDown, Info, FileText } from 'lucide-react';
import { dummyStockData } from './dummyData';

interface StockSummaryProps {
  symbol: string;
  loading?: boolean;
}

const StockSummary = ({ symbol, loading = false }: StockSummaryProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isChartCollapsed, setIsChartCollapsed] = useState(false);
  const [isFundamentalsCollapsed, setIsFundamentalsCollapsed] = useState(false);
  
  // In a real app, this would be fetched from PostgreSQL
  const stockSummary: StockSummaryType = getStockSummary(symbol);
  const fundamentalsData = getFundamentalsData(symbol);
  
  const toggleChart = () => {
    setIsChartCollapsed(!isChartCollapsed);
  };
  
  const toggleFundamentals = () => {
    setIsFundamentalsCollapsed(!isFundamentalsCollapsed);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-10 w-[180px] mb-4" />
                <Skeleton className="h-6 w-[120px] mb-2" />
              </div>
              <div className="text-right">
                <Skeleton className="h-8 w-[100px] mb-2" />
                <Skeleton className="h-5 w-[80px]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const isPositive = stockSummary.priceChange >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? "text-green-500" : "text-red-500";
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-1">
                {stockSummary.name} ({stockSummary.symbol})
              </h1>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Volume: {stockSummary.volume.toLocaleString()} | Avg: {stockSummary.avgVolume.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-bold">${stockSummary.price.toFixed(2)}</div>
              <div className={`flex items-center justify-end gap-1 ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="font-medium">${Math.abs(stockSummary.priceChange).toFixed(2)} ({Math.abs(stockSummary.percentChange).toFixed(2)}%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <PriceChart 
        stockData={dummyStockData} 
        isCollapsed={isChartCollapsed}
        onToggleCollapse={toggleChart}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="fundamentals" className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Fundamentals</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <p className="font-medium">{stockSummary.marketCap}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">P/E Ratio</span>
                  <p className="font-medium">{stockSummary.peRatio.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Dividend Yield</span>
                  <p className="font-medium">{stockSummary.dividendYield.toFixed(2)}%</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">52-Week High</span>
                  <p className="font-medium">${stockSummary.high52Week.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">52-Week Low</span>
                  <p className="font-medium">${stockSummary.low52Week.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fundamentals" className="space-y-4">
          <StockFundamentalsChart 
            data={fundamentalsData}
            isCollapsed={isFundamentalsCollapsed}
            onToggleCollapse={toggleFundamentals}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StockSummary;
