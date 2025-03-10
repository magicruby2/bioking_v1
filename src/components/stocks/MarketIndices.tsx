
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Mock data for market indices
const marketIndices = [
  { name: "S&P 500", value: "4,587.64", change: "+0.57%", isPositive: true },
  { name: "Dow Jones", value: "37,986.40", change: "+0.35%", isPositive: true },
  { name: "NASDAQ", value: "14,261.50", change: "-0.28%", isPositive: false },
  { name: "Russell 2000", value: "1,941.85", change: "+0.67%", isPositive: true },
];

const MarketIndices = () => {
  return (
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
  );
};

export default MarketIndices;
