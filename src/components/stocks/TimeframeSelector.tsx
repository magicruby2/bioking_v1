
import { RefreshCw } from 'lucide-react';

interface TimeframeSelectorProps {
  timeframeOptions: string[];
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  refreshData: () => void;
  isLoading: boolean;
}

export function TimeframeSelector({
  timeframeOptions,
  timeframe,
  setTimeframe,
  refreshData,
  isLoading
}: TimeframeSelectorProps) {
  return (
    <div className="mb-6 flex overflow-x-auto">
      <div className="flex space-x-2">
        {timeframeOptions.map((option) => (
          <button
            key={option}
            onClick={() => setTimeframe(option)}
            className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors ${
              timeframe === option
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {option}
          </button>
        ))}
        <button
          onClick={refreshData}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
    </div>
  );
}

export default TimeframeSelector;
