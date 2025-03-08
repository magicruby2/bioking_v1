
import { Clock, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { NewsArticle } from './types';

interface ArticleCardProps {
  article: NewsArticle;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article 
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
  );
};

export default ArticleCard;
