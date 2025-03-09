
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResearchModeToggleProps {
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function ResearchModeToggle({ isActive, onClick, disabled = false }: ResearchModeToggleProps) {
  return (
    <Button
      onClick={onClick}
      variant={isActive ? 'default' : 'outline'}
      className="flex items-center gap-2"
      type="button"
      size="sm"
      disabled={disabled}
    >
      <Search className="h-4 w-4" />
      Deep Research
    </Button>
  );
}
