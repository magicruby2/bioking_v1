
export interface StockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const dummyStockData: StockData[] = [
  { date: '2023-01-01', open: 150.21, high: 153.45, low: 149.76, close: 152.36, volume: 1520000 },
  { date: '2023-01-02', open: 152.36, high: 154.28, low: 151.19, close: 148.97, volume: 1620000 },
  { date: '2023-01-03', open: 148.97, high: 151.50, low: 147.80, close: 150.42, volume: 1820000 },
  { date: '2023-01-04', open: 150.42, high: 153.99, low: 149.33, close: 153.17, volume: 1420000 },
  { date: '2023-01-05', open: 153.17, high: 157.23, low: 152.45, close: 156.78, volume: 1920000 },
  { date: '2023-01-06', open: 156.78, high: 158.11, low: 154.92, close: 155.23, volume: 2120000 },
  { date: '2023-01-07', open: 155.23, high: 159.34, low: 154.67, close: 158.46, volume: 1720000 },
  { date: '2023-01-08', open: 158.46, high: 161.25, low: 157.81, close: 160.12, volume: 1990000 },
  { date: '2023-01-09', open: 160.12, high: 162.34, low: 159.56, close: 161.87, volume: 2220000 },
  { date: '2023-01-10', open: 161.87, high: 164.52, low: 160.23, close: 163.41, volume: 2320000 },
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
