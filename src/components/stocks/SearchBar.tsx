
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getAllStocks } from './stockSummaryData';

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      const matchedStock = getAllStocks().find(stock => 
        stock.symbol.toLowerCase() === searchInput.toLowerCase() ||
        stock.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      
      if (matchedStock) {
        navigate(`/stock/${matchedStock.symbol}`);
        setSearchInput('');
        setShowResults(false);
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.trim().length > 0) {
      const filtered = getAllStocks().filter(stock => 
        stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
        stock.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5)); // Limit to 5 results
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };
  
  const handleResultClick = (symbol: string) => {
    navigate(`/stock/${symbol}`);
    setSearchInput('');
    setShowResults(false);
  };
  
  return (
    <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
      <div className="relative flex flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="Search symbol or company..."
          className="flex h-10 w-full rounded-l-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onBlur={() => {
            // Delay hiding results to allow for clicks
            setTimeout(() => setShowResults(false), 200);
          }}
          onFocus={() => {
            if (searchInput.trim().length > 0) {
              setShowResults(true);
            }
          }}
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Search
      </button>
      
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-10 max-h-60 overflow-auto">
          {searchResults.map((stock) => (
            <div
              key={stock.symbol}
              className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
              onClick={() => handleResultClick(stock.symbol)}
            >
              <div>
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
              <div className={`${stock.percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${stock.price.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
