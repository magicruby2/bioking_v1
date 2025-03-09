
export interface StockData {
  date: string;
  price: number;
  volume: number;
}

export const dummyStockData: StockData[] = [
  { date: '2023-01-01', price: 150.21, volume: 1520000 },
  { date: '2023-01-02', price: 152.36, volume: 1620000 },
  { date: '2023-01-03', price: 148.97, volume: 1820000 },
  { date: '2023-01-04', price: 150.42, volume: 1420000 },
  { date: '2023-01-05', price: 153.17, volume: 1920000 },
  { date: '2023-01-06', price: 156.78, volume: 2120000 },
  { date: '2023-01-07', price: 155.23, volume: 1720000 },
  { date: '2023-01-08', price: 158.46, volume: 1990000 },
  { date: '2023-01-09', price: 160.12, volume: 2220000 },
  { date: '2023-01-10', price: 161.87, volume: 2320000 },
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
