
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockData {
  date: string;
  price: number;
  volume: number;
}

interface VolumeChartProps {
  stockData: StockData[];
}

export function VolumeChart({ stockData }: VolumeChartProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border/40 bg-card p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium">Volume</h2>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stockData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default VolumeChart;
