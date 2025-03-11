
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Categories</h3>
        <button
          onClick={onRefresh}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
      
      <div className="flex flex-col space-y-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-secondary/80'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
