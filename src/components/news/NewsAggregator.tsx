
import { useState, useEffect } from 'react';
import { RefreshCw, Clock, Share2, Search, ExternalLink, Bookmark } from 'lucide-react';
import { N8nService } from '@/services/n8nService';
import { useToast } from "@/hooks/use-toast";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
  readTime: number;
}

const dummyNewsData: NewsArticle[] = [
  {
    id: '1',
    title: 'Tech Giants Announce New AI Collaboration Framework',
    summary: 'Leading technology companies have agreed to establish a new collaborative framework for AI development, focusing on safety and ethical considerations.',
    source: 'Tech Daily',
    publishedAt: '2023-10-12T14:30:00Z',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    category: 'technology',
    readTime: 4
  },
  {
    id: '2',
    title: 'Global Markets React to New Financial Regulations',
    summary: 'Stock markets worldwide showed mixed reactions to the announcement of comprehensive financial regulations aimed at increasing transparency.',
    source: 'Financial Times',
    publishedAt: '2023-10-11T09:15:00Z',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f',
    category: 'finance',
    readTime: 5
  },
  {
    id: '3',
    title: 'Breakthrough in Renewable Energy Storage Technology',
    summary: 'Scientists have developed a new battery technology that could significantly improve the efficiency of renewable energy storage systems.',
    source: 'Science Today',
    publishedAt: '2023-10-10T11:45:00Z',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e',
    category: 'technology',
    readTime: 6
  },
  {
    id: '4',
    title: 'Major Retail Chain Announces Expansion Plans',
    summary: 'A leading retail chain has unveiled plans to open 50 new stores across the country, creating an estimated 2,000 jobs.',
    source: 'Business Insider',
    publishedAt: '2023-10-09T16:20:00Z',
    url: '#',
    imageUrl: 'https://images.unsplash.com/photo-1565705671002-2d37671fd3b7',
    category: 'business',
    readTime: 3
  },
  {
    id: '5',
    title: 'New Study Reveals Impact of Remote Work on Productivity',
    summary: 'Research findings suggest that remote work arrangements have led to increased productivity in certain sectors while presenting challenges in others.',
    source: 'Workforce Weekly',
    publishedAt: '2023-10-08T13:10:00Z',
    url: '#',
    category: 'business',
    readTime: 7
  },
];

const categories = [
  { id: 'all', name: 'All News' },
  { id: 'technology', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
  { id: 'business', name: 'Business' },
  { id: 'general', name: 'General' },
];

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
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="h-full p-4 md:p-6 overflow-y-auto">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">News Feed</h1>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        
        <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
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
            onClick={fetchNewsData}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 ml-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </button>
        </div>
        
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/40 p-8 text-center">
            <div className="text-lg font-medium">No articles found</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search query or category filter
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArticles.map((article) => (
              <article 
                key={article.id} 
                className="overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-200 hover:shadow-md animate-fade-in"
              >
                <div className="flex flex-col md:flex-row">
                  {article.imageUrl && (
                    <div className="h-48 w-full md:h-auto md:w-1/3">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className={`flex flex-col p-4 ${article.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Bookmark className="h-4 w-4" />
                          <span className="sr-only">Save article</span>
                        </button>
                        <button
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share article</span>
                        </button>
                      </div>
                    </div>
                    
                    <h2 className="mt-2 text-xl font-bold leading-tight">
                      {article.title}
                    </h2>
                    
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">
                      {article.summary}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{article.source}</span>
                        <span className="mx-2">•</span>
                        <span>{formatDate(article.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {article.readTime} min read
                        </span>
                      </div>
                      
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-primary hover:underline"
                      >
                        Read more
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsAggregator;
