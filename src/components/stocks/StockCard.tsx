
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
  volume?: number;
}

interface StockCardProps {
  stock: StockData;
  onClick?: () => void;
}

const StockCard = ({ stock, onClick }: StockCardProps) => {
  return (
    <Card className="hover:shadow-md transition-all cursor-pointer" onClick={onClick}>
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
  );
};

export default StockCard;
