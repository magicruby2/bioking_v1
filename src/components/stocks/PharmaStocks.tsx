
import { useNavigate } from 'react-router-dom';
import StockCard from './StockCard';

interface StockData {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
  volume?: number;
}

interface PharmaStocksProps {
  stocks: StockData[];
}

const PharmaStocks = ({ stocks }: PharmaStocksProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stocks.map((stock) => (
        <StockCard 
          key={stock.symbol} 
          stock={stock} 
          onClick={() => navigate(`/stock/${stock.symbol}`)} 
        />
      ))}
    </div>
  );
};

export default PharmaStocks;
