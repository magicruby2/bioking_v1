
import { Clock, ExternalLink, Bookmark, Share2, Flag } from 'lucide-react';
import { NewsArticle, importanceGrades } from './types';
import { Link } from 'react-router-dom';

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

  // Get color for grade badge
  const getGradeColor = () => {
    if (!article.grade) return 'bg-secondary text-secondary-foreground';
    const grade = importanceGrades.find(g => g.id === article.grade);
    return grade ? grade.color : 'bg-secondary text-secondary-foreground';
  };

  // Handle grade change
  const handleGradeChange = (grade: string) => {
    if (onGradeChange) {
      onGradeChange(article.id, grade);
    }
  };

  return (
    <article 
      className={`overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-200 hover:shadow-md animate-fade-in ${article.grade === 'uninteresting' ? 'opacity-60' : ''}`}
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
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </span>
              
              {article.grade && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getGradeColor()}`}>
                  <Flag className="h-3 w-3 mr-1" />
                  {article.grade.charAt(0).toUpperCase() + article.grade.slice(1)}
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
            
            <div className="flex items-center gap-2">
              {onGradeChange && (
                <div className="relative group">
                  <button className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary">
                    <Flag className="h-3 w-3 mr-1" />
                    Grade
                  </button>
                  <div className="absolute right-0 mt-1 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-1">
                      {importanceGrades.slice(1).map((grade) => (
                        <button 
                          key={grade.id}
                          className={`block w-full px-4 py-2 text-left text-sm hover:bg-secondary ${article.grade === grade.id ? 'font-bold' : ''}`}
                          onClick={() => handleGradeChange(grade.id)}
                        >
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${grade.color.split(' ')[0]}`}></span>
                          {grade.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <Link
                to={`/article/${article.id}`}
                className="inline-flex items-center rounded-md px-3 py-1 text-xs font-medium text-primary hover:underline"
              >
                Read more
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
