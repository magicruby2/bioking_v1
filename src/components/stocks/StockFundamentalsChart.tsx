
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { FundamentalData } from './stockSummaryData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoIcon } from 'lucide-react';

interface StockFundamentalsChartProps {
  data: FundamentalData[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const StockFundamentalsChart = ({ 
  data, 
  isCollapsed = false,
  onToggleCollapse 
}: StockFundamentalsChartProps) => {
  if (isCollapsed) {
    return null;
  }

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border border-border rounded-md shadow-sm">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">Value: <span className="text-primary font-medium">{payload[0].value.toFixed(2)}</span></p>
          <p className="text-sm">Industry Avg: <span className="text-secondary font-medium">{payload[1].value.toFixed(2)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <InfoIcon className="w-4 h-4 mr-2" /> Fundamental Metrics
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              barGap={0}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="category" 
                angle={-45} 
                textAnchor="end" 
                height={60} 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={renderCustomTooltip} />
              <Legend verticalAlign="top" height={36} />
              <Bar name="Company Value" dataKey="value" fill="hsl(var(--primary))" />
              <Bar name="Industry Average" dataKey="average" fill="hsl(var(--muted-foreground))" opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockFundamentalsChart;
