
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BarChart2, ArrowUpRight, ArrowDownRight, Pill } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllStocks, getStocksByCategory } from './stockSummaryData';

// Mock data for market indices
const marketIndices = [
  { name: "S&P 500", value: "4,587.64", change: "+0.57%", isPositive: true },
  { name: "Dow Jones", value: "37,986.40", change: "+0.35%", isPositive: true },
  { name: "NASDAQ", value: "14,261.50", change: "-0.28%", isPositive: false },
  { name: "Russell 2000", value: "1,941.85", change: "+0.67%", isPositive: true },
];

// Mock data for sectors
const sectors = [
  { name: "Technology", change: "+1.23%", isPositive: true },
  { name: "Healthcare", change: "+0.89%", isPositive: true },
  { name: "Financials", change: "-0.32%", isPositive: false },
  { name: "Energy", change: "+2.14%", isPositive: true },
  { name: "Consumer Discretionary", change: "-0.67%", isPositive: false },
  { name: "Communication Services", change: "+0.95%", isPositive: true },
];

export function MarketOverview() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const matchedStock = getAllStocks().find(stock => 
        stock.symbol.toLowerCase() === searchInput.toLowerCase() ||
        stock.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      
      if (matchedStock) {
        navigate(`/stock/${matchedStock.symbol}`);
        setSearchInput('');
        setShowResults(false);
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.trim().length > 0) {
      const filtered = getAllStocks().filter(stock => 
        stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const handleResultClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    setSearchInput('');
    setShowResults(false);
  };
  
  const trendingStocks = getStocksByCategory("trending");
  const pharmaStocks = getStocksByCategory("pharma");
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Market Overview</h1>
          <p className="text-muted-foreground">Latest market trends and performance</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
          <div className="relative flex flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={handleInputChange}
              placeholder="Search symbol or company..."
              className="flex h-10 w-full rounded-l-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              onBlur={() => {
                // Delay hiding results to allow for clicks
                setTimeout(() => setShowResults(false), 200);
              }}
              onFocus={() => {
                if (searchInput.trim().length > 0) {
                  setShowResults(true);
                }
              }}
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search
          </button>
          
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-10 max-h-60 overflow-auto">
              {searchResults.map((stock) => (
                <div
                  key={stock.symbol}
                  className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                  onClick={() => handleResultClick(stock.symbol)}
                >
                  <div>
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">{stock.name}</div>
                  </div>
                  <div className={`${stock.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${stock.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketIndices.map((index) => (
          <Card key={index.name} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <p className="font-medium">{index.name}</p>
                <div className={`flex items-center ${index.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {index.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  <span>{index.change}</span>
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{index.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingStocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-all cursor-pointer" 
                onClick={() => navigate(`/stock/${stock.symbol}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className={`flex items-center ${stock.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      <span>{stock.percentChange >= 0 ? "+" : ""}{stock.percentChange.toFixed(2)}%</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold mt-2">${stock.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pharma" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pharmaStocks.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-all cursor-pointer" 
                onClick={() => navigate(`/stock/${stock.symbol}`)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className={`flex items-center ${stock.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {stock.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      <span>{stock.percentChange >= 0 ? "+" : ""}{stock.percentChange.toFixed(2)}%</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold mt-2">${stock.price.toFixed(2)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sectors">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sector) => (
              <Card key={sector.name} className="hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{sector.name}</p>
                    <div className={`flex items-center ${sector.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {sector.isPositive ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      <span>{sector.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
