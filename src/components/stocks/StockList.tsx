
import { useState, useEffect } from 'react';
import { PlusCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

interface Stock {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  change_percent: number;
  last_updated: string;
}

export function StockList() {
  const { toast } = useToast();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchStocks = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, we'd fetch from Supabase
      // For now using sample data
      const sampleStocks: Stock[] = [
        { id: '1', symbol: 'AAPL', name: 'Apple Inc.', current_price: 172.40, change_percent: 0.8, last_updated: new Date().toISOString() },
        { id: '2', symbol: 'MSFT', name: 'Microsoft Corp.', current_price: 339.31, change_percent: 1.2, last_updated: new Date().toISOString() },
        { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc.', current_price: 139.80, change_percent: -0.5, last_updated: new Date().toISOString() },
        { id: '4', symbol: 'AMZN', name: 'Amazon.com Inc.', current_price: 123.20, change_percent: 2.1, last_updated: new Date().toISOString() },
        { id: '5', symbol: 'META', name: 'Meta Platforms Inc.', current_price: 308.65, change_percent: 1.7, last_updated: new Date().toISOString() },
        { id: '6', symbol: 'TSLA', name: 'Tesla Inc.', current_price: 274.39, change_percent: -1.3, last_updated: new Date().toISOString() },
        { id: '7', symbol: 'NVDA', name: 'NVIDIA Corp.', current_price: 431.60, change_percent: 3.2, last_updated: new Date().toISOString() },
      ];

      // Simulate API delay
      setTimeout(() => {
        setStocks(sampleStocks);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stocks data.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStocks();
  }, []);
  
  const handleRefresh = () => {
    fetchStocks();
  };
  
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Stock List</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Stock
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price ($)</TableHead>
                <TableHead className="text-right">Change (%)</TableHead>
                <TableHead className="text-right">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{stock.symbol}</TableCell>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell className="text-right">${stock.current_price.toFixed(2)}</TableCell>
                  <TableCell className={`text-right ${stock.change_percent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.change_percent >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">{new Date(stock.last_updated).toLocaleTimeString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default StockList;
