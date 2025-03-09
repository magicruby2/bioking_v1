
import { useState } from 'react';
import { Search } from 'lucide-react';

interface StockHeaderProps {
  stockSymbol: string;
  currentPrice: string;
  priceDiff: string;
  percentDiff: string;
  isPositive: boolean;
  searchInput: string;
  setSearchInput: (value: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export function StockHeader({
  stockSymbol,
  currentPrice,
  priceDiff,
  percentDiff,
  isPositive,
  searchInput,
  setSearchInput,
  handleSearch
}: StockHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{stockSymbol}</h1>
        <div className="mt-1 flex items-center">
          <span className="text-3xl font-bold">${currentPrice}</span>
          <span className={`ml-2 flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{priceDiff} ({percentDiff}%)
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSearch} className="flex w-full md:w-auto">
        <div className="relative flex flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search symbol..."
            className="flex h-10 w-full rounded-l-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-r-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </form>
    </div>
  );
}

export default StockHeader;
