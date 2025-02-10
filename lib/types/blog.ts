export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags: string[];
  publishedAt: string;
  readingTime: string;
  category: 'Update' | 'Project' | 'News' | 'Tutorial';
}

export interface ProjectUpdate {
  id: string;
  title: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Planned';
  date: string;
  link?: string;
  tags: string[];
} 