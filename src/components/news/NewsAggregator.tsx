
import { useState, useEffect } from 'react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";
import { NewsArticle, categories } from './types';
import { dummyNewsArticles } from './dummyData';
import ArticleCard from './ArticleCard';
import CategoryFilter from './CategoryFilter';
import SearchBar from './SearchBar';
import NoArticlesFound from './NoArticlesFound';
import GradeFilter from './GradeFilter';
import { Separator } from '@/components/ui/separator';

export function NewsAggregator() {
  const { toast } = useToast();
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(dummyNewsArticles);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(dummyNewsArticles);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fetchNewsData = async () => {
    setIsLoading(true);
    
    try {
      const response = await N8nService.fetchNewsData(selectedCategory, 10);
      
      if (response.success && response.data) {
        console.log('Received news data:', response.data);
        setNewsArticles(dummyNewsArticles);
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
    
    if (selectedGrade !== 'all') {
      filtered = filtered.filter(article => article.grade === selectedGrade);
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
  }, [newsArticles, selectedCategory, selectedGrade, searchQuery]);
  
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleGradeChange = (articleId: string, grade: string) => {
    const updatedArticles = newsArticles.map(article => 
      article.id === articleId ? { ...article, grade: grade as NewsArticle['grade'] } : article
    );
    
    setNewsArticles(updatedArticles);
    
    toast({
      title: "Article Graded",
      description: `Article marked as "${grade.charAt(0).toUpperCase() + grade.slice(1)}"`,
    });
  };
  
  return (
    <div className="h-full overflow-y-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar with filters */}
        <div className="w-full md:w-64 space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">News Feed</h1>
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
          
          <div className="space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              onRefresh={fetchNewsData}
              isLoading={isLoading}
            />
            
            <Separator className="my-4" />
            
            <GradeFilter 
              selectedGrade={selectedGrade}
              onSelectGrade={handleGradeSelect}
            />
          </div>
        </div>
        
        {/* Main content area with articles */}
        <div className="flex-1">
          {filteredArticles.length === 0 ? (
            <NoArticlesFound />
          ) : (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onGradeChange={handleGradeChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsAggregator;
