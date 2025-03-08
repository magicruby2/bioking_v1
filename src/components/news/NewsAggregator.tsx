
import { useState, useEffect } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import { NewsArticle, categories } from './types';
import { dummyNewsData } from './dummyData';
import ArticleCard from './ArticleCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import NoArticlesFound from './NoArticlesFound';

export function NewsAggregator() {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(dummyNewsData);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(dummyNewsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchNewsData = async () => {
    setIsLoading(true);
    
    try {
      const response = await N8nService.fetchNewsData(selectedCategory, 10);
      
      if (response.success && response.data) {
        // In a real implementation, we'd use the actual data from the n8n webhook
        console.log('Received news data:', response.data);
        // For now we'll use our dummy data
        setNewsArticles(dummyNewsData);
      } else {
        throw new Error(response.error || 'Failed to fetch news data');
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news data. Using sample data instead.",
        variant: "destructive",
      });
      // Keep the current data in case of error
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchNewsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);
  
  useEffect(() => {
    let filtered = [...newsArticles];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.summary.toLowerCase().includes(query)
      );
    }
    
    setFilteredArticles(filtered);
  }, [newsArticles, selectedCategory, searchQuery]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="h-full p-4 md:p-6 overflow-y-hidden">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">News Feed</h1>
          
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />
        </div>
        
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
          onRefresh={fetchNewsData}
          isLoading={isLoading}
        />
        
        {filteredArticles.length === 0 ? (
          <NoArticlesFound />
        ) : (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsAggregator;
