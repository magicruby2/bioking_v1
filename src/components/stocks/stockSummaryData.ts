
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
  category?: string;
}

// Full stock list
const stockList: StockSummary[] = [
  // Tech stocks
  {
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
    category: 'trending',
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
  {
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
    category: 'trending',
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
  {
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
    category: 'trending',
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
  },
  // Pharmaceutical stocks
  {
    symbol: 'LLY',
    name: 'Eli Lilly and Company Common Stock',
    price: 782.06,
    priceChange: 5.24,
    percentChange: 0.67,
    marketCap: '743.3B',
    peRatio: 134.83,
    dividendYield: 0.67,
    volume: 3212400,
    avgVolume: 3102300,
    high52Week: 800.78,
    low52Week: 369.68,
    category: 'pharma',
    description: `
## Eli Lilly and Company (LLY)

Eli Lilly is a global pharmaceutical company known for its medications in areas including diabetes, oncology, and neuroscience. The company has a strong focus on innovation and research and development.

### Recent Developments

- Significant advancements in diabetes and weight management medications
- Expanding portfolio of oncology treatments
- Investments in Alzheimer's disease research

### Outlook

Eli Lilly is positioned for continued growth with a robust pipeline of potential blockbuster drugs. The company's focus on high-need therapeutic areas provides substantial revenue opportunities.

### Risks

- Patent expirations on key products
- Pricing pressure from governments and payers
- Regulatory hurdles for new drug approvals
    `
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson Common Stock',
    price: 146.84,
    priceChange: -0.63,
    percentChange: -0.43,
    marketCap: '353.7B',
    peRatio: 23.83,
    dividendYield: 3.15,
    volume: 8541300,
    avgVolume: 7453200,
    high52Week: 175.97,
    low52Week: 143.13,
    category: 'pharma',
    description: `
## Johnson & Johnson (JNJ)

Johnson & Johnson is one of the largest and most diverse healthcare companies in the world. The company operates in three segments: pharmaceutical, medical devices, and consumer health products.

### Recent Developments

- Completed separation of consumer health business (Kenvue)
- Focus on pharmaceutical and medical technology innovation
- Expanding presence in oncology and immunology markets

### Outlook

Johnson & Johnson's diverse product portfolio and strong financial position provide stability. The company's increased focus on higher-margin pharmaceutical products may drive future growth.

### Risks

- Ongoing litigation related to various products
- Competition from biosimilars and generics
- Integration challenges with acquisitions
    `
  },
  {
    symbol: 'NVO',
    name: 'Novo Nordisk A/S Common Stock',
    price: 129.27,
    priceChange: 2.18,
    percentChange: 1.71,
    marketCap: '578.2B',
    peRatio: 45.51,
    dividendYield: 1.18,
    volume: 3985700,
    avgVolume: 4532100,
    high52Week: 133.94,
    low52Week: 67.68,
    category: 'pharma',
    description: `
## Novo Nordisk A/S (NVO)

Novo Nordisk is a global healthcare company with a leading position in diabetes care, obesity treatment, hemophilia care, and growth hormone therapy.

### Recent Developments

- Strong demand for GLP-1 receptor agonists for diabetes and obesity
- Expanding manufacturing capacity to meet demand
- Continued innovation in peptide and protein engineering

### Outlook

Novo Nordisk has significant growth potential in the obesity market alongside its established diabetes franchise. The company's focus on chronic diseases provides a stable revenue base.

### Risks

- Increasing competition in GLP-1 market
- Supply constraints for key products
- Potential pricing pressure in major markets
    `
  },
  {
    symbol: 'ABBV',
    name: 'AbbVie Inc. Common Stock',
    price: 162.38,
    priceChange: 1.37,
    percentChange: 0.85,
    marketCap: '286.5B',
    peRatio: 53.93,
    dividendYield: 3.62,
    volume: 5412300,
    avgVolume: 6023100,
    high52Week: 182.89,
    low52Week: 130.96,
    category: 'pharma',
    description: `
## AbbVie Inc. (ABBV)

AbbVie is a research-based biopharmaceutical company that develops and markets advanced therapies for complex and serious diseases. The company emerged from a split with Abbott Laboratories.

### Recent Developments

- Navigating Humira patent cliff with newer immunology products
- Expanding oncology portfolio through internal development and acquisitions
- Growth in aesthetics segment following Allergan acquisition

### Outlook

AbbVie is working to offset Humira revenue losses with a diverse portfolio of growth products across immunology, oncology, and aesthetics.

### Risks

- Revenue impact from Humira biosimilar competition
- Integration challenges from acquisitions
- Pricing pressure in competitive therapeutic areas
    `
  },
  {
    symbol: 'AZN',
    name: 'AstraZeneca PLC American Depositary Shares',
    price: 78.63,
    priceChange: 0.42,
    percentChange: 0.54,
    marketCap: '243.8B',
    peRatio: 37.62,
    dividendYield: 1.98,
    volume: 4251200,
    avgVolume: 5124300,
    high52Week: 79.54,
    low52Week: 60.47,
    category: 'pharma',
    description: `
## AstraZeneca PLC (AZN)

AstraZeneca is a global, science-led biopharmaceutical company focused on the discovery, development, and commercialization of prescription medicines in oncology, rare diseases, and biopharmaceuticals.

### Recent Developments

- Strong performance in oncology portfolio
- Expanding presence in rare diseases through acquisitions
- Continued pipeline development in respiratory and cardiovascular areas

### Outlook

AstraZeneca's strategic focus on oncology and biopharmaceuticals positions the company for sustainable growth. The company has successfully transformed its portfolio following patent expirations.

### Risks

- Research and development setbacks
- Competition in key therapeutic areas
- Integration challenges from acquisitions
    `
  },
  {
    symbol: 'ABT',
    name: 'Abbott Laboratories Common Stock',
    price: 107.29,
    priceChange: -0.18,
    percentChange: -0.17,
    marketCap: '186.2B',
    peRatio: 33.73,
    dividendYield: 2.06,
    volume: 5423100,
    avgVolume: 5982400,
    high52Week: 121.64,
    low52Week: 89.67,
    category: 'pharma',
    description: `
## Abbott Laboratories (ABT)

Abbott Laboratories is a global healthcare company that develops, manufactures, and sells a diverse line of products in nutrition, diagnostics, medical devices, and established pharmaceuticals.

### Recent Developments

- Transition from COVID-19 testing to core business growth
- Innovation in continuous glucose monitoring systems
- Expansion in structural heart and electrophysiology devices

### Outlook

Abbott's diversified business model provides stability and multiple growth drivers. The company's leading positions in diabetes care and cardiovascular devices support long-term growth potential.

### Risks

- Competitive pressure in diabetes management
- Economic sensitivity in certain segments
- Regulatory challenges in medical device approvals
    `
  },
  {
    symbol: 'MRK',
    name: 'Merck & Company Inc. Common Stock (new)',
    price: 129.45,
    priceChange: 1.82,
    percentChange: 1.43,
    marketCap: '327.6B',
    peRatio: 144.19,
    dividendYield: 2.36,
    volume: 8921400,
    avgVolume: 9214300,
    high52Week: 133.10,
    low52Week: 99.89,
    category: 'pharma',
    description: `
## Merck & Company Inc. (MRK)

Merck is a global healthcare company that delivers innovative health solutions through prescription medicines, vaccines, biologic therapies, and animal health products.

### Recent Developments

- Strong performance of key cancer drug Keytruda
- Expanding pipeline through strategic acquisitions
- Development of new vaccines and infectious disease treatments

### Outlook

Merck's oncology franchise continues to drive growth, while the company works to diversify beyond Keytruda. The company's strong cash flow supports both dividend growth and business development activities.

### Risks

- High revenue concentration in Keytruda
- Patent expirations for key products
- Clinical development and regulatory risks
    `
  },
  {
    symbol: 'NVS',
    name: 'Novartis AG Common Stock',
    price: 97.21,
    priceChange: 0.61,
    percentChange: 0.63,
    marketCap: '198.4B',
    peRatio: 26.41,
    dividendYield: 3.74,
    volume: 1342600,
    avgVolume: 1523400,
    high52Week: 108.78,
    low52Week: 92.11,
    category: 'pharma',
    description: `
## Novartis AG (NVS)

Novartis is a global healthcare company based in Switzerland that develops, manufactures, and markets a wide range of healthcare products. The company operates through two divisions: Innovative Medicines and Sandoz (generics).

### Recent Developments

- Completed spin-off of Sandoz generics business
- Focus on core therapeutic areas with high unmet need
- Investment in advanced therapy platforms including gene and cell therapies

### Outlook

Novartis's transformation into a focused innovative medicines company may improve margins and growth profile. The company's strong presence in multiple therapeutic areas provides diversification.

### Risks

- Research and development productivity
- Patent expirations and generic competition
- Pricing pressure in major markets
    `
  },
  {
    symbol: 'AMGN',
    name: 'Amgen Inc. Common Stock',
    price: 271.54,
    priceChange: -1.21,
    percentChange: -0.44,
    marketCap: '145.8B',
    peRatio: 21.73,
    dividendYield: 3.32,
    volume: 2421500,
    avgVolume: 2732100,
    high52Week: 329.72,
    low52Week: 211.71,
    category: 'pharma',
    description: `
## Amgen Inc. (AMGN)

Amgen is one of the world's leading biotechnology companies, focused on developing innovative therapies for serious illnesses in areas including oncology, cardiovascular disease, and inflammation.

### Recent Developments

- Integration of Horizon Therapeutics acquisition
- Expansion of biosimilar portfolio
- Development of novel therapeutics in obesity and other areas

### Outlook

Amgen's combination of established products, biosimilars, and innovative pipeline provides a balanced approach to growth. The company's strong cash flow supports both shareholder returns and business development.

### Risks

- Biosimilar competition for legacy products
- Pricing pressure in major markets
- Research and development execution
    `
  },
  {
    symbol: 'PFE',
    name: 'Pfizer Inc. Common Stock',
    price: 27.67,
    priceChange: 0.25,
    percentChange: 0.91,
    marketCap: '156.7B',
    peRatio: null,
    dividendYield: 5.78,
    volume: 38421500,
    avgVolume: 42731900,
    high52Week: 41.99,
    low52Week: 25.76,
    category: 'pharma',
    description: `
## Pfizer Inc. (PFE)

Pfizer is a global pharmaceutical company that discovers, develops, manufactures, and markets prescription medicines, vaccines, and consumer healthcare products.

### Recent Developments

- Post-COVID revenue normalization
- Strategic acquisitions to rebuild pipeline
- Cost-reduction initiatives to enhance operational efficiency

### Outlook

Pfizer is focused on rebuilding growth after the decline in COVID-19 product revenues. The company's extensive commercial infrastructure and financial resources support its business development strategy.

### Risks

- Pipeline productivity challenges
- Integration risks from acquisitions
- Pricing pressure in competitive therapeutic areas
    `
  },
  // Add more stock data as needed
];

// Retrieve stock data from PostgreSQL-like structure
export const getStockSummary = (symbol: string): StockSummary => {
  const stock = stockList.find(s => s.symbol === symbol);
  
  // Return the requested stock or a default if not found
  return stock || {
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

// Get stocks by category (trending, pharma, etc.)
export const getStocksByCategory = (category: string): StockSummary[] => {
  return stockList.filter(stock => stock.category === category);
};

// Get all stocks for search functionality
export const getAllStocks = (): StockSummary[] => {
  return stockList;
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
    ],
    'LLY': [
      { category: 'P/E Ratio', value: 134.83, average: 40.0 },
      { category: 'P/B Ratio', value: 36.4, average: 20.0 },
      { category: 'ROE', value: 185.3, average: 90.0 },
      { category: 'Debt/Equity', value: 1.54, average: 1.2 },
      { category: 'Profit Margin', value: 34.6, average: 25.0 },
    ],
    'JNJ': [
      { category: 'P/E Ratio', value: 23.83, average: 18.0 },
      { category: 'P/B Ratio', value: 5.12, average: 4.5 },
      { category: 'ROE', value: 25.64, average: 22.0 },
      { category: 'Debt/Equity', value: 0.45, average: 0.5 },
      { category: 'Profit Margin', value: 18.2, average: 15.0 },
    ],
    'NVO': [
      { category: 'P/E Ratio', value: 45.51, average: 30.0 },
      { category: 'P/B Ratio', value: 29.87, average: 15.0 },
      { category: 'ROE', value: 73.21, average: 50.0 },
      { category: 'Debt/Equity', value: 0.31, average: 0.4 },
      { category: 'Profit Margin', value: 32.8, average: 25.0 },
    ],
    'ABBV': [
      { category: 'P/E Ratio', value: 53.93, average: 25.0 },
      { category: 'P/B Ratio', value: 24.63, average: 12.0 },
      { category: 'ROE', value: 108.42, average: 70.0 },
      { category: 'Debt/Equity', value: 4.32, average: 3.0 },
      { category: 'Profit Margin', value: 11.2, average: 15.0 },
    ],
    'AZN': [
      { category: 'P/E Ratio', value: 37.62, average: 22.0 },
      { category: 'P/B Ratio', value: 5.87, average: 4.0 },
      { category: 'ROE', value: 15.34, average: 18.0 },
      { category: 'Debt/Equity', value: 0.81, average: 0.7 },
      { category: 'Profit Margin', value: 13.6, average: 15.0 },
    ],
    'ABT': [
      { category: 'P/E Ratio', value: 33.73, average: 25.0 },
      { category: 'P/B Ratio', value: 5.12, average: 4.0 },
      { category: 'ROE', value: 15.87, average: 18.0 },
      { category: 'Debt/Equity', value: 0.42, average: 0.5 },
      { category: 'Profit Margin', value: 18.7, average: 15.0 },
    ],
    'MRK': [
      { category: 'P/E Ratio', value: 144.19, average: 35.0 },
      { category: 'P/B Ratio', value: 7.52, average: 5.5 },
      { category: 'ROE', value: 12.43, average: 20.0 },
      { category: 'Debt/Equity', value: 0.64, average: 0.5 },
      { category: 'Profit Margin', value: 14.2, average: 15.0 },
    ],
    'NVS': [
      { category: 'P/E Ratio', value: 26.41, average: 20.0 },
      { category: 'P/B Ratio', value: 4.87, average: 4.0 },
      { category: 'ROE', value: 18.73, average: 15.0 },
      { category: 'Debt/Equity', value: 0.38, average: 0.4 },
      { category: 'Profit Margin', value: 32.5, average: 25.0 },
    ],
    'AMGN': [
      { category: 'P/E Ratio', value: 21.73, average: 18.0 },
      { category: 'P/B Ratio', value: 13.82, average: 8.0 },
      { category: 'ROE', value: 112.57, average: 80.0 },
      { category: 'Debt/Equity', value: 5.75, average: 3.0 },
      { category: 'Profit Margin', value: 27.3, average: 20.0 },
    ],
    'PFE': [
      { category: 'P/E Ratio', value: null, average: 15.0 },
      { category: 'P/B Ratio', value: 1.68, average: 2.5 },
      { category: 'ROE', value: -9.83, average: 12.0 },
      { category: 'Debt/Equity', value: 0.53, average: 0.4 },
      { category: 'Profit Margin', value: -5.2, average: 15.0 },
    ],
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
