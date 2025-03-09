
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
  const barWidth = width * 0.8;
  const barX = x - (barWidth / 2);
  const wickX = x;
  
  return (
    <g key={x + y}>
      {/* Wick line (high to low) */}
      <line
        x1={wickX}
        y1={y + height - (height * (high - open) / (high - low))}
        x2={wickX}
        y2={y + height - (height * (low - open) / (high - low))}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body rectangle (open to close) */}
      <rect
        x={barX}
        y={isPositive 
          ? y + height - (height * (close - open) / (high - low)) 
          : y + height - (height * (open - open) / (high - low))}
        width={barWidth}
        height={Math.abs(
          (height * (close - open) / (high - low))
        )}
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
              formatter={(value, name) => {
                // Format tooltip values
                if (name === 'open') return ['Open: $' + value.toFixed(2)];
                if (name === 'high') return ['High: $' + value.toFixed(2)];
                if (name === 'low') return ['Low: $' + value.toFixed(2)];
                if (name === 'close') return ['Close: $' + value.toFixed(2)];
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
