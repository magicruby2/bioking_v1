
import { TrendingUp, BarChart2, Pill } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStocksByCategory } from './stockSummaryData';
import SearchBar from './SearchBar';
import MarketIndices from './MarketIndices';
import TrendingStocks from './TrendingStocks';
import PharmaStocks from './PharmaStocks';
import SectorList from './SectorList';

// Define the stock interface for n8n trending stocks
interface N8nStock {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
  volume: number;
}

interface MarketOverviewProps {
  trendingStocks?: N8nStock[];
}

export function MarketOverview({ trendingStocks = [] }: MarketOverviewProps) {
  // Get pharmaceutical stocks for trending display
  const pharmaStocks = getStocksByCategory("pharma");
  
  // Use the top 3 pharmaceutical stocks as trending if no n8n data
  const displayTrendingStocks = trendingStocks && trendingStocks.length > 0 
    ? trendingStocks 
    : pharmaStocks.slice(0, 3); // Only show top 3 pharma stocks as trending
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Market Overview</h1>
          <p className="text-muted-foreground">Latest market trends and performance</p>
        </div>
        
        <SearchBar />
      </div>
      
      <MarketIndices />
      
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="trending" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Stocks
          </TabsTrigger>
          <TabsTrigger value="pharma" className="flex items-center">
            <Pill className="h-4 w-4 mr-2" />
            Pharmaceutical
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Sectors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trending" className="space-y-4">
          <TrendingStocks stocks={displayTrendingStocks} />
        </TabsContent>
        
        <TabsContent value="pharma" className="space-y-4">
          <PharmaStocks stocks={pharmaStocks} />
        </TabsContent>
        
        <TabsContent value="sectors">
          <SectorList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MarketOverview;
