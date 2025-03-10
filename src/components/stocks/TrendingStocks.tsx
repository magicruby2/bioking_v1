
import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import StockCard from './StockCard';
import StockNewsItem from './StockNewsItem';

// Mock related news for each stock
const stockRelatedNews = {
  'LLY': [
    { title: "Eli Lilly's Diabetes Drug Shows Promise in Weight Loss Study", date: "2023-09-15" },
    { title: "Eli Lilly Increases Production Capacity for GLP-1 Medications", date: "2023-08-22" },
    { title: "Analysts Raise Price Targets for Eli Lilly Following Strong Earnings", date: "2023-07-30" }
  ],
  'NVO': [
    { title: "Novo Nordisk Partners with Valo Health on AI Drug Discovery", date: "2023-09-10" },
    { title: "Novo Nordisk's Wegovy Supply Issues Begin to Resolve", date: "2023-08-18" },
    { title: "Novo Nordisk Reports Record Sales Driven by Obesity Treatments", date: "2023-08-05" }
  ],
  'ABBV': [
    { title: "AbbVie's Humira Biosimilar Competition Intensifies", date: "2023-09-12" },
    { title: "AbbVie Announces New Immunology Pipeline Developments", date: "2023-08-25" },
    { title: "AbbVie Receives FDA Approval for New Skyrizi Indication", date: "2023-07-28" }
  ],
  'MRK': [
    { title: "Merck's Keytruda Shows Promising Results in New Cancer Trial", date: "2023-09-14" },
    { title: "Merck Expands Manufacturing Facilities in Ireland", date: "2023-08-20" },
    { title: "Merck Signs $4 Billion Deal for Novel Cancer Drug Candidate", date: "2023-08-02" }
  ],
  'AMGN': [
    { title: "Amgen's Obesity Drug Enters Phase 2 Clinical Trials", date: "2023-09-08" },
    { title: "Amgen Settles Patent Dispute with Biosimilar Manufacturer", date: "2023-08-15" },
    { title: "Amgen Reports Mixed Q2 Results as Legacy Products Face Pressure", date: "2023-08-03" }
  ],
  'PFE': [
    { title: "Pfizer Invests in mRNA Research Beyond COVID-19 Vaccines", date: "2023-09-11" },
    { title: "Pfizer's Cost-Cutting Measures to Focus on Commercial Operations", date: "2023-08-23" },
    { title: "Pfizer Faces Revenue Decline as COVID-19 Product Demand Wanes", date: "2023-08-01" }
  ]
};

interface StockData {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
  volume?: number;
}

interface TrendingStocksProps {
  stocks: StockData[];
}

const TrendingStocks = ({ stocks }: TrendingStocksProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} onClick={() => navigate(`/stock/${stock.symbol}`)} />
        ))}
      </div>
      
      {/* Stock Related News List */}
      <div className="mt-6 bg-card border border-border/40 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Newspaper className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-bold">Related Stock News</h2>
        </div>
        
        <div className="space-y-6">
          {stocks.map((stock) => {
            const newsItems = stockRelatedNews[stock.symbol as keyof typeof stockRelatedNews];
            if (newsItems) {
              return (
                <StockNewsItem 
                  key={stock.symbol} 
                  symbol={stock.symbol} 
                  name={stock.name} 
                  news={newsItems} 
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendingStocks;
