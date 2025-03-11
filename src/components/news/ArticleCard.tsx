
import { Clock, ExternalLink, Bookmark, Share2, Check } from 'lucide-react';
import { NewsArticle, importanceGrades } from './types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: NewsArticle;
  onGradeChange?: (articleId: string, grade: string) => void;
}

export const ArticleCard = ({ article, onGradeChange }: ArticleCardProps) => {
  // Helper function to format the date in a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Find matching grade info
  const gradeInfo = article.grade ? 
    importanceGrades.find(g => g.id === article.grade) : 
    importanceGrades[0];

  // Get opacity based on article grade
  const getOpacityClass = () => {
    if (article.grade === 'uninteresting') return 'opacity-60';
    return '';
  };

  return (
    <article 
      className={cn(
        "overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-200 hover:shadow-md animate-fade-in",
        getOpacityClass()
      )}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image section - only rendered if imageUrl exists */}
        {article.imageUrl && (
          <div className="h-48 w-full md:h-auto md:w-1/3">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        
        {/* Content section - adapts width based on image presence */}
        <div className={`flex flex-col p-4 ${article.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
          {/* Top row with category, grade badge and action buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
              
              {/* Grade badge */}
              {article.grade && gradeInfo && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${gradeInfo.color}`}>
                  {gradeInfo.name}
                </span>
              )}
            </div>
            
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
          
          {/* Article title - clickable, navigates to article detail */}
          <h2 className="mt-2 text-xl font-bold leading-tight">
            <Link 
              to={`/article/${article.id}`} 
              className="hover:text-primary hover:underline"
              onClick={(e) => {
                // Ensure the event propagates correctly
                e.stopPropagation();
              }}
            >
              {article.title}
            </Link>
          </h2>
          
          {/* Article summary */}
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            {article.summary}
          </p>
          
          {/* Footer with metadata, grade buttons and read more link */}
          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
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
              
              {/* Read more link */}
              <Link
                to={`/article/${article.id}`}
                className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-primary hover:underline"
              >
                Read more
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
            
            {/* Super compact grade buttons */}
            {onGradeChange && (
              <div className="flex flex-wrap gap-1 mt-2">
                {importanceGrades.slice(1).map((grade) => (
                  <Button
                    key={grade.id}
                    size="sm"
                    variant={article.grade === grade.id ? "default" : "outline"}
                    className={cn(
                      "text-xs h-6 px-2 py-0 min-w-0",
                      article.grade === grade.id ? `${grade.color} flex items-center gap-1` : "border-gray-200"
                    )}
                    onClick={() => onGradeChange(article.id, grade.id)}
                  >
                    {article.grade === grade.id && <Check className="h-3 w-3" />}
                    <span>{grade.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
