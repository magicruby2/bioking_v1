
import { Calendar } from 'lucide-react';
import { 
  ComposedChart, 
  Bar,
  Line,
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
  
  // Calculate the center X position for the candlestick
  const centerX = x + (width / 2);
  const barX = centerX - (barWidth / 2);
  
  // Calculate the y positions for open, close, high, and low
  const highY = y;
  const lowY = y + height;
  const openY = y + ((open - high) / (low - high)) * height;
  const closeY = y + ((close - high) / (low - high)) * height;
  
  // Determine the rectangle's y position and height based on whether price closed higher or lower
  const rectY = isPositive ? closeY : openY;
  const rectHeight = Math.max(1, Math.abs(closeY - openY)); // Ensure minimum height of 1px
  
  return (
    <g key={`${x}-${y}`}>
      {/* Wick line (high to low) */}
      <line
        x1={centerX}
        y1={highY}
        x2={centerX}
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
    // Add color based on price movement for volume bars
    volumeColor: item.close >= item.open ? "hsl(var(--success))" : "hsl(var(--destructive))"
  }));

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-border/40 bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Price & Volume</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={candlestickData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            
            {/* Primary YAxis for price */}
            <YAxis 
              yAxisId="price"
              domain={['auto', 'auto']} 
              orientation="right"
              label={{ value: 'Price ($)', angle: -90, position: 'insideRight' }}
            />
            
            {/* Secondary YAxis for volume */}
            <YAxis 
              yAxisId="volume"
              domain={['auto', 'auto']}
              orientation="left"
              label={{ value: 'Volume', angle: -90, position: 'insideLeft' }}
            />
            
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
                if (name === 'volume') return [Number(value).toLocaleString(), 'Volume'];
                return [value];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            
            {/* Using Bar with custom shape for candlestick */}
            <Bar
              yAxisId="price"
              dataKey="highLowDiff"
              shape={renderCandlestick}
              isAnimationActive={false}
            />
            
            {/* Volume bars at the bottom */}
            <Bar 
              yAxisId="volume"
              dataKey="volume" 
              fill="rgba(0, 0, 0, 0.2)" 
              stroke="rgba(0, 0, 0, 0.2)"
              barSize={20}
              isAnimationActive={false}
              name="Volume"
            />
            
            {/* Colored overlay for volume bars based on price movement */}
            <Bar 
              yAxisId="volume"
              dataKey="volume" 
              fill="transparent" 
              stroke="transparent"
              isAnimationActive={false}
              fillOpacity={0.7}
              strokeOpacity={0}
              name="Volume"
              shape={(props) => {
                const { x, y, width, height, volumeColor } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={props.payload.close >= props.payload.open ? 
                      "rgba(139, 92, 246, 0.7)" : // Purple for positive (using success color)
                      "rgba(217, 70, 239, 0.7)"  // Pink for negative (using destructive color)
                    }
                    stroke="none"
                  />
                );
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriceChart;
