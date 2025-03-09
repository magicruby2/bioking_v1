
interface IndicatorItem {
  name: string;
  value: string;
  status: string;
}

interface TechnicalIndicatorsProps {
  indicators: IndicatorItem[];
}

export function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/40 bg-card">
      <div className="p-4">
        <h2 className="text-lg font-medium">Technical Indicators</h2>
        <p className="text-sm text-muted-foreground">
          Based on current price action
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border-t border-border/40">
        {indicators.map((indicator) => (
          <div 
            key={indicator.name}
            className="rounded-lg border border-border/40 p-3"
          >
            <div className="text-sm font-medium">{indicator.name}</div>
            <div className="mt-1 text-lg font-semibold">{indicator.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{indicator.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnicalIndicators;
