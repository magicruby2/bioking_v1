
import { Calendar } from 'lucide-react';
import { 
  ComposedChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import type { StockData } from './dummyData';

interface PriceChartProps {
  stockData: StockData[];
}

// Custom renderer for candlestick
const renderCandlestick = (
  { x, y, width, height, open, close, low, high }: any
) => {
  const isPositive = close >= open;
  const color = isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))";
  const barWidth = width * 0.6; // Slightly narrower for better appearance
  const barX = x - (barWidth / 2); // Center the bar on the x position
  const wickX = x; // Center the wick line
  
  // Calculate the y positions for open and close
  const openY = y + height - (height * (open - low) / (high - low));
  const closeY = y + height - (height * (close - low) / (high - low));
  
  return (
    <g key={x + y}>
      {/* Wick line (high to low) */}
      <line
        x1={wickX}
        y1={y + height - (height * (high - low) / (high - low))} // Top of the wick (high)
        x2={wickX}
        y2={y + height - (height * (low - low) / (high - low))} // Bottom of the wick (low)
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle (open to close) */}
      <rect
        x={barX}
        y={isPositive ? closeY : openY} // Position based on whether it's up or down
        width={barWidth}
        height={Math.max(1, Math.abs(openY - closeY))} // Ensure minimum height of 1
        fill={color}
        stroke={color}
      />
    </g>
  );
};

export function PriceChart({ stockData }: PriceChartProps) {
  // Calculate the data for candlestick display
  const candlestickData = stockData.map(item => ({
    ...item,
    // These props are needed for custom candlestick rendering
    highLowDiff: item.high - item.low,
    openCloseDiff: Math.abs(item.open - item.close),
  }));

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border/40 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Price Chart</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={candlestickData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              formatter={(value: any, name: string) => {
                // Format tooltip values with proper type checking
                if (name === 'open') return ['Open: $' + (typeof value === 'number' ? value.toFixed(2) : value)];
                if (name === 'high') return ['High: $' + (typeof value === 'number' ? value.toFixed(2) : value)];
                if (name === 'low') return ['Low: $' + (typeof value === 'number' ? value.toFixed(2) : value)];
                if (name === 'close') return ['Close: $' + (typeof value === 'number' ? value.toFixed(2) : value)];
                return [value];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            
            {/* Using Bar with custom shape for candlestick */}
            <Bar
              dataKey="highLowDiff"
              shape={renderCandlestick}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriceChart;
