
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { NewsArticle } from '@/components/news/types';
import { dummyNewsArticles } from '@/components/news/dummyData';
import ArticleContent from '@/components/news/ArticleContent';
import Header from '@/components/layout/Header';
import NoArticlesFound from '@/components/news/NoArticlesFound';

const ArticlePage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    setIsLoading(true);
    // In a real app, we would fetch the article from an API
    // For now, we'll use our dummy data
    const foundArticle = dummyNewsArticles.find(a => a.id === id) || null;
    setArticle(foundArticle);
    setIsLoading(false);
  }, [id]);
  
  return (
    <div className="flex h-screen flex-col">
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading article...</p>
            </div>
          ) : article ? (
            <ArticleContent article={article} />
          ) : (
            <div className="max-w-4xl mx-auto pt-12">
              <NoArticlesFound />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ArticlePage;
