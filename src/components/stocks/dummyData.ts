
export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const dummyStockData: StockData[] = [
  { date: '2023-01-01', open: 149.50, high: 152.80, low: 148.70, close: 150.21, volume: 1520000 },
  { date: '2023-01-02', open: 150.30, high: 153.42, low: 150.10, close: 152.36, volume: 1620000 },
  { date: '2023-01-03', open: 152.40, high: 152.50, low: 147.30, close: 148.97, volume: 1820000 },
  { date: '2023-01-04', open: 148.50, high: 151.20, low: 148.40, close: 150.42, volume: 1420000 },
  { date: '2023-01-05', open: 150.60, high: 154.10, low: 150.20, close: 153.17, volume: 1920000 },
  { date: '2023-01-06', open: 153.40, high: 157.80, low: 153.00, close: 156.78, volume: 2120000 },
  { date: '2023-01-07', open: 157.10, high: 157.30, low: 154.50, close: 155.23, volume: 1720000 },
  { date: '2023-01-08', open: 155.50, high: 159.20, low: 155.10, close: 158.46, volume: 1990000 },
  { date: '2023-01-09', open: 158.60, high: 161.40, low: 158.10, close: 160.12, volume: 2220000 },
  { date: '2023-01-10', open: 160.30, high: 162.30, low: 159.70, close: 161.87, volume: 2320000 },
];

export const timeframeOptions = ['1D', '1W', '1M', '3M', '1Y', 'YTD'];

export interface IndicatorItem {
  name: string;
  value: string;
  status: string;
}

export function getDefaultIndicators(isPositive: boolean): IndicatorItem[] {
  return [
    { name: 'RSI', value: '45.23', status: 'Neutral' },
    { name: 'MACD', value: '-0.42', status: 'Bearish' },
    { name: 'Moving Avg (50)', value: '$153.42', status: isPositive ? 'Above' : 'Below' },
    { name: 'Moving Avg (200)', value: '$148.76', status: 'Above' },
    { name: 'Volume Avg', value: '1.8M', status: 'Normal' },
    { name: 'Bollinger Bands', value: '$145-162', status: 'Inside' },
  ];
}
