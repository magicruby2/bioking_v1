import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, BarChart2, ArrowUpRight, ArrowDownRight, Pill, Newspaper, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllStocks, getStocksByCategory } from './stockSummaryData';
import ArticleCard from '../news/ArticleCard';
import { dummyNewsData } from '../news/dummyData';

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

// Mock related news for each stock
const stockRelatedNews = {
  'LLY': [
    { title: "Eli Lilly's Diabetes Drug Shows Promise in Weight Loss Study", date: "2023-09-15" },
    { title: "Eli Lilly Increases Production Capacity for GLP-1 Medications", date: "2023-08-22" },
    { title: "Analysts Raise Price Targets for Eli Lilly Following Strong Earnings", date: "2023-07-30" }
  ],
  'NVO': [
    { title: "Novo Nordisk Partners with Valo Health on AI Drug Discovery", date: "2023-09-10" },
    { title: "Novo Nordisk's Wegovy Supply Issues Begin to Resolve", date: "2023-08-18" },
    { title: "Novo Nordisk Reports Record Sales Driven by Obesity Treatments", date: "2023-08-05" }
  ],
  'ABBV': [
    { title: "AbbVie's Humira Biosimilar Competition Intensifies", date: "2023-09-12" },
    { title: "AbbVie Announces New Immunology Pipeline Developments", date: "2023-08-25" },
    { title: "AbbVie Receives FDA Approval for New Skyrizi Indication", date: "2023-07-28" }
  ],
  'MRK': [
    { title: "Merck's Keytruda Shows Promising Results in New Cancer Trial", date: "2023-09-14" },
    { title: "Merck Expands Manufacturing Facilities in Ireland", date: "2023-08-20" },
    { title: "Merck Signs $4 Billion Deal for Novel Cancer Drug Candidate", date: "2023-08-02" }
  ],
  'AMGN': [
    { title: "Amgen's Obesity Drug Enters Phase 2 Clinical Trials", date: "2023-09-08" },
    { title: "Amgen Settles Patent Dispute with Biosimilar Manufacturer", date: "2023-08-15" },
    { title: "Amgen Reports Mixed Q2 Results as Legacy Products Face Pressure", date: "2023-08-03" }
  ],
  'PFE': [
    { title: "Pfizer Invests in mRNA Research Beyond COVID-19 Vaccines", date: "2023-09-11" },
    { title: "Pfizer's Cost-Cutting Measures to Focus on Commercial Operations", date: "2023-08-23" },
    { title: "Pfizer Faces Revenue Decline as COVID-19 Product Demand Wanes", date: "2023-08-01" }
  ]
};

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
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  // Filter news data to get pharma related news
  const pharmaNews = dummyNewsData.filter(news => 
    news.category === 'healthcare' || news.category === 'business'
  ).slice(0, 3); // Get top 3 relevant news
  
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
            {displayTrendingStocks.map((stock) => (
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
          
          {/* Stock Related News List */}
          <div className="mt-6 bg-card border border-border/40 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Newspaper className="h-5 w-5 mr-2" />
              <h2 className="text-xl font-bold">Related Stock News</h2>
            </div>
            
            <div className="space-y-6">
              {displayTrendingStocks.map((stock) => (
                <div key={stock.symbol} className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center">
                    <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded mr-2 text-sm">
                      {stock.symbol}
                    </span>
                    {stock.name}
                  </h3>
                  
                  <ul className="space-y-2 pl-2 border-l-2 border-muted ml-2">
                    {stockRelatedNews[stock.symbol as keyof typeof stockRelatedNews]?.map((news, index) => (
                      <li key={index} className="hover:bg-muted/50 p-2 rounded transition-colors">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <p className="font-medium">{news.title}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {news.date}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
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

export default MarketOverview;
