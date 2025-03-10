
export interface StockSummary {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  percentChange: number;
  marketCap: string;
  peRatio: number;
  dividendYield: number;
  volume: number;
  avgVolume: number;
  high52Week: number;
  low52Week: number;
  description: string; // Markdown text
}

// This mimics data we would fetch from PostgreSQL in the future
export const getStockSummary = (symbol: string): StockSummary => {
  const stockData: Record<string, StockSummary> = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 187.68,
      priceChange: 1.24,
      percentChange: 0.67,
      marketCap: '2.94T',
      peRatio: 29.23,
      dividendYield: 0.53,
      volume: 48561200,
      avgVolume: 55429800,
      high52Week: 199.62,
      low52Week: 143.90,
      description: `
## Apple Inc. (AAPL)

Apple designs a wide variety of consumer electronics, including smartphones (iPhone), tablets (iPad), PCs (Mac), smartwatches (Apple Watch), and AirPods. Apple's hardware products are often accompanied by services such as the App Store, Apple Music, Apple TV+, and Apple Pay.

### Recent Developments

- Apple is focusing heavily on AI integration across its product ecosystem
- Services revenue continues to grow, representing a larger portion of total revenue
- iPhone remains the primary revenue driver, accounting for over 50% of sales

### Outlook

Apple faces increasing competition in the smartphone market but maintains strong brand loyalty and an ecosystem advantage. The company's push into services provides a growing revenue stream with higher margins than hardware.

### Risks

- Supply chain disruptions
- Regulatory scrutiny in multiple markets
- Slowing upgrade cycles for flagship products
      `
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: 422.88,
      priceChange: 2.56,
      percentChange: 0.61,
      marketCap: '3.14T',
      peRatio: 36.51,
      dividendYield: 0.72,
      volume: 20543200,
      avgVolume: 22154300,
      high52Week: 430.82,
      low52Week: 309.45,
      description: `
## Microsoft Corporation (MSFT)

Microsoft develops and licenses consumer and enterprise software. Its most well-known offerings include Windows, Office, and Azure cloud services. The company also manufactures Surface tablets and Xbox gaming consoles.

### Recent Developments

- Major investments in AI capabilities across product portfolio
- Azure cloud services continues strong growth trajectory
- Expansion of gaming division through strategic acquisitions

### Outlook

Microsoft is well-positioned in the enterprise software and cloud computing markets. The company's diverse revenue streams and strong recurring revenue model provide stability and growth potential.

### Risks

- Increasing competition in cloud services
- Cybersecurity threats targeting Microsoft products
- Antitrust concerns as the company expands
      `
    },
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 165.86,
      priceChange: -0.92,
      percentChange: -0.55,
      marketCap: '2.06T',
      peRatio: 25.13,
      dividendYield: 0.52,
      volume: 21324500,
      avgVolume: 20876400,
      high52Week: 167.84,
      low52Week: 115.36,
      description: `
## Alphabet Inc. (GOOGL)

Alphabet is the parent company of Google, which includes the world's most widely used search engine and video sharing site YouTube. The company also offers hardware products like Pixel smartphones and enterprise cloud services.

### Recent Developments

- Increased competition in digital advertising space
- Growing cloud business providing diversification from ad revenue
- Investments in AI and autonomous driving technology

### Outlook

Alphabet maintains dominant positions in search and digital advertising. The company continues to invest in new technologies while facing increased regulatory scrutiny.

### Risks

- Regulatory challenges in multiple jurisdictions
- Privacy concerns impacting advertising business
- Competition from specialized search services
      `
    }
  };

  // Return the requested stock or a default if not found
  return stockData[symbol] || {
    symbol: symbol,
    name: `${symbol} Corporation`,
    price: 150.00,
    priceChange: 0.75,
    percentChange: 0.5,
    marketCap: "Unknown",
    peRatio: 20.0,
    dividendYield: 1.5,
    volume: 10000000,
    avgVolume: 12000000,
    high52Week: 180.00,
    low52Week: 120.00,
    description: `## ${symbol}\n\nNo detailed information available for this stock symbol.`
  };
};

// Fundamental data for the chart
export interface FundamentalData {
  category: string;
  value: number;
  average: number;
}

export const getFundamentalsData = (symbol: string): FundamentalData[] => {
  const fundamentalsData: Record<string, FundamentalData[]> = {
    'AAPL': [
      { category: 'P/E Ratio', value: 29.23, average: 25.0 },
      { category: 'P/B Ratio', value: 45.67, average: 35.0 },
      { category: 'ROE', value: 105.23, average: 85.0 },
      { category: 'Debt/Equity', value: 1.2, average: 1.5 },
      { category: 'Profit Margin', value: 25.3, average: 22.0 },
    ],
    'MSFT': [
      { category: 'P/E Ratio', value: 36.51, average: 30.0 },
      { category: 'P/B Ratio', value: 14.27, average: 10.0 },
      { category: 'ROE', value: 43.08, average: 36.0 },
      { category: 'Debt/Equity', value: 0.38, average: 0.6 },
      { category: 'Profit Margin', value: 36.9, average: 25.0 },
    ],
    'GOOGL': [
      { category: 'P/E Ratio', value: 25.13, average: 23.0 },
      { category: 'P/B Ratio', value: 6.45, average: 5.2 },
      { category: 'ROE', value: 26.42, average: 20.0 },
      { category: 'Debt/Equity', value: 0.06, average: 0.3 },
      { category: 'Profit Margin', value: 25.7, average: 22.0 },
    ]
  };

  // Return the requested fundamentals or default data if not found
  return fundamentalsData[symbol] || [
    { category: 'P/E Ratio', value: 20.0, average: 22.0 },
    { category: 'P/B Ratio', value: 5.0, average: 4.5 },
    { category: 'ROE', value: 15.0, average: 18.0 },
    { category: 'Debt/Equity', value: 0.8, average: 1.0 },
    { category: 'Profit Margin', value: 15.0, average: 18.0 },
  ];
};
