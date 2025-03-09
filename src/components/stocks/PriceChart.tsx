
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
  const barWidth = width * 0.6; // Candlestick body width
  
  // Center the bar on the data point
  const barX = x - (barWidth / 2);
  
  // Calculate the y positions for open, close, high, and low
  const highY = y;
  const lowY = y + height;
  const openY = y + ((open - high) / (low - high)) * height;
  const closeY = y + ((close - high) / (low - high)) * height;
  
  // Determine the rectangle's y position and height based on whether price closed higher or lower
  const rectY = isPositive ? closeY : openY;
  const rectHeight = Math.max(1, Math.abs(closeY - openY)); // Ensure minimum height of 1px
  
  return (
    <g key={x + y}>
      {/* Wick line (high to low) */}
      <line
        x1={x}
        y1={highY}
        x2={x}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      
      {/* Body rectangle (open to close) */}
      <rect
        x={barX}
        y={rectY}
        width={barWidth}
        height={rectHeight}
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
