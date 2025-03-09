
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
      const stocksData = await fetchStocks();
      setStocks(stocksData);
      toast({
        title: "Success",
        description: "Stock data loaded successfully.",
      });
    } catch (error) {
      console.error('Error fetching stocks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stocks data from Supabase.",
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
      ) : (
        <div className="overflow-x-auto">
          {stocks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No stocks found. Add your first stock to get started.
            </div>
          ) : (
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
                    <TableCell className="text-right">${stock.current_price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell className={`text-right ${parseFloat(String(stock.change_percent)) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {parseFloat(String(stock.change_percent)) >= 0 ? '+' : ''}{parseFloat(String(stock.change_percent)).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">{new Date(stock.last_updated).toLocaleTimeString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </div>
  );
}

export default StockList;
