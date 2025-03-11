
import { Clock, ExternalLink, Check } from 'lucide-react';
import { NewsArticle, importanceGrades } from './types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: NewsArticle;
  onGradeChange?: (articleId: string, grade: string) => void;
}

export const ArticleCard = ({ article, onGradeChange }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const gradeInfo = article.grade ? 
    importanceGrades.find(g => g.id === article.grade) : 
    importanceGrades[0];

  const getOpacityClass = () => {
    if (article.grade === 'uninteresting') return 'opacity-60';
    return '';
  };

  return (
    <article 
      className={cn(
        "overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-200",
        getOpacityClass()
      )}
    >
      <div className="flex flex-col">
        <div className="flex gap-4 p-3">
          {/* Grade Selection Toolbar */}
          {onGradeChange && (
            <div className="flex flex-col justify-center">
              <div className="flex flex-col gap-1">
                {importanceGrades.slice(1).map((grade) => (
                  <Button
                    key={grade.id}
                    size="sm"
                    variant={article.grade === grade.id ? "default" : "outline"}
                    className={cn(
                      "text-xs h-6 px-2 py-0.5 min-w-0",
                      article.grade === grade.id ? `${grade.color} flex items-center gap-1` : "border-gray-200"
                    )}
                    onClick={() => onGradeChange(article.id, grade.id)}
                  >
                    {article.grade === grade.id && <Check className="h-3 w-3" />}
                    <span>{grade.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {article.imageUrl && (
            <div className="w-32 h-24">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                  {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
                </span>
              </div>
            </div>
            
            <h2 className="text-base font-semibold leading-tight mb-1">
              <Link 
                to={`/article/${article.id}`} 
                className="hover:text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {article.title}
              </Link>
            </h2>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-foreground">{article.source}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {article.readTime} min read
                </span>
              </div>
              
              <Link
                to={`/article/${article.id}`}
                className="text-xs font-medium text-primary hover:underline flex items-center"
              >
                Read more
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
