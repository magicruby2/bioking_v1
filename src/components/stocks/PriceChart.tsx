
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

interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface PriceChartProps {
  stockData: StockData[];
}

// Custom renderer for candlestick
const renderCandlestick = (props: any) => {
  const { x, y, width, height, open, close, low, high, index } = props;
  const isPositive = close >= open;
  const color = isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))";
  const yOpen = y + height * (1 - (open - low) / (high - low));
  const yClose = y + height * (1 - (close - low) / (high - low));
  const barHeight = Math.abs(yOpen - yClose);

  return (
    <g key={`candlestick-${index}`}>
      {/* Wick line (high to low) */}
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      {/* Candle body */}
      <rect
        x={x + width * 0.25}
        y={isPositive ? yClose : yOpen}
        width={width * 0.5}
        height={barHeight === 0 ? 1 : barHeight}
        fill={color}
        stroke={color}
      />
    </g>
  );
};

export function PriceChart({ stockData }: PriceChartProps) {
  // Prepare data for candlestick chart
  const candleData = stockData.map(item => ({
    date: item.date,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close,
    // Additional data used by our custom renderer
    openCloseDiff: item.close - item.open,
    highLowDiff: item.high - item.low,
    isPositive: item.close >= item.open
  }));

  // Calculate domain for YAxis
  const allValues = stockData.flatMap(item => [item.high, item.low, item.open, item.close]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

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
            data={candleData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis domain={[minValue - padding, maxValue + padding]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              formatter={(value: any, name: string) => {
                if (name === 'openCloseDiff' || name === 'highLowDiff' || name === 'isPositive') {
                  return null; // Don't show these helper properties in tooltip
                }
                return typeof value === 'number' ? value.toFixed(2) : value;
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            {/* Custom candlestick chart using Bar component with custom shape */}
            <Bar
              dataKey="openCloseDiff" // We need a numeric dataKey for the bar to work
              shape={renderCandlestick}
              isAnimationActive={false}
            />
            {/* Reference line at 0 for demonstration */}
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PriceChart;
