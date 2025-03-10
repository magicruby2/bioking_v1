
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

// Mock data for sectors
const sectors = [
  { name: "Technology", change: "+1.23%", isPositive: true },
  { name: "Healthcare", change: "+0.89%", isPositive: true },
  { name: "Financials", change: "-0.32%", isPositive: false },
  { name: "Energy", change: "+2.14%", isPositive: true },
  { name: "Consumer Discretionary", change: "-0.67%", isPositive: false },
  { name: "Communication Services", change: "+0.95%", isPositive: true },
];

const SectorList = () => {
  return (
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
  );
};

export default SectorList;
