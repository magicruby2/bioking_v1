
import { useState, useEffect } from 'react';
import { PlusCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { fetchStocks, Stock } from '@/services/supabaseStockService';

export function StockList() {
  const { toast } = useToast();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const loadStocks = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching stocks...');
      const stocksData = await fetchStocks();
      console.log('Stocks fetched:', stocksData);
      setStocks(stocksData);
    } catch (error) {
      console.error('Error in loadStocks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stocks data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadStocks();
  }, []);
  
  const handleRefresh = () => {
    loadStocks();
  };
  
  return (
    <div className="rounded-xl border border-border/40 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Stock List</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="inline-flex h-9 items-center justify-center rounded-md bg-secondary px-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            disabled={isLoading}
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
      ) : stocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No stocks found in your bio_stock schema.</p>
          <p className="text-sm text-muted-foreground mt-2">Add your first stock to get started.</p>
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
