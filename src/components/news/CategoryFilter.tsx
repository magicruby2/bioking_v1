
import { RefreshCw } from 'lucide-react';
import { Category } from './types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  onRefresh,
  isLoading
}: CategoryFilterProps) => {
  return (
    <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {category.name}
        </button>
      ))}
      
      <button
        onClick={onRefresh}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 ml-2"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        <span className="sr-only">Refresh</span>
      </button>
    </div>
  );
};

export default CategoryFilter;
