
export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
  readTime: number;
  content?: string; // Added content field
  grade?: 'critical' | 'important' | 'useful' | 'interesting'; // News importance grade - reduced to 4
}

export interface Category {
  id: string;
  name: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'All News' },
  { id: 'pharmaceutical', name: 'Pharmaceutical' },
  { id: 'regulatory', name: 'Regulatory' },
  { id: 'technology', name: 'Technology' },
  { id: 'finance', name: 'Finance' },
  { id: 'business', name: 'Business' },
  { id: 'general', name: 'General' },
];

// Importance grades for news articles - reduced to 4
export const importanceGrades = [
  { id: 'all', name: 'All Grades', color: 'bg-secondary text-secondary-foreground' },
  { id: 'critical', name: 'Critical', color: 'bg-rose-600 text-white' },
  { id: 'important', name: 'Important', color: 'bg-amber-500 text-white' },
  { id: 'useful', name: 'Useful', color: 'bg-yellow-400 text-black' },
  { id: 'interesting', name: 'Interesting', color: 'bg-neutral-400 text-black' },
];
