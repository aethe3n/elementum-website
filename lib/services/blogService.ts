import { BlogPost } from '@/lib/types/blog';
import { marked } from 'marked';

// Initial blog posts data
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to ElementumGlobal: Pioneering AI-Powered Commodities Intelligence',
    slug: 'welcome-to-elementumglobal',
    excerpt: 'Introducing our groundbreaking Premium Market AI Agent for professional and institutional trading solutions.',
    content: `
<div class="space-y-8 font-montserrat">

<h1 class="text-[#B87D3B] text-4xl font-light tracking-tight">Welcome to ElementumGlobal: Pioneering AI-Powered Commodities Intelligence</h1>

At ElementumGlobal, we're thrilled to announce a groundbreaking addition to our suite of professional and institutional trading solutions - the launch of our Premium Market AI Agent. This innovative tool represents a significant leap forward in how professional and institutional investors and traders interact with commodities market intelligence.

<h2 class="text-[#B87D3B] text-2xl font-light tracking-tight mt-8">Transforming Market Intelligence</h2>

Our Premium Market AI Chat platform harnesses cutting-edge artificial intelligence to deliver real-time market insights, predictive analytics, and comprehensive trading intelligence. This sophisticated system has been meticulously designed to process vast amounts of market data, providing institutional clients with actionable insights at unprecedented speed.

<h2 class="text-[#B87D3B] text-3xl font-light tracking-tight mt-8">Revolutionary Features</h2>

<h3 class="text-[#B87D3B] text-xl font-light tracking-tight mt-6">Advanced Market Analysis</h3>
The platform offers sophisticated pattern recognition capabilities, enabling traders to identify market trends and opportunities with greater precision. Our AI-powered system continuously analyzes market conditions, providing institutional-grade insights that drive informed decision-making.

<h3 class="text-[#B87D3B] text-xl font-light tracking-tight mt-6">Real-Time Intelligence</h3>
- Dynamic market sentiment analysis
- Instant access to global commodities data
- Automated risk assessment protocols
- Custom alert systems for market movements

<h2 class="text-[#B87D3B] text-2xl font-light tracking-tight mt-8">Institutional Excellence</h2>

As a Delaware-based commodities trading company, ElementumGlobal remains committed to delivering exceptional value to our institutional clients. The Premium Market AI Agent represents our dedication to technological innovation while maintaining the highest standards of market intelligence and compliance.

<h2 class="text-[#B87D3B] text-2xl font-light tracking-tight mt-8">Looking Forward</h2>

The launch of our Premium Market AI Agent platform marks just the beginning of our journey to revolutionize commodities trading. We invite you to join us in embracing the future of institutional trading, where artificial intelligence meets human expertise to create unprecedented market opportunities.

Stay tuned for exclusive access to our Premium Market AI Agent platform, where the future of commodities trading becomes reality.

</div>
    `,
    coverImage: '/images/Elementum Global-1000x1000.png',
    author: {
      name: 'Elementum Team',
      avatar: '/images/Elementum Global-1000x1000.png'
    },
    tags: ['AI', 'Trading', 'Market Intelligence', 'Innovation'],
    publishedAt: '2024-02-08T20:00:00Z',
    readingTime: '5 min',
    category: 'Update'
  }
];

export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  // In a real application, this would fetch from an API or database
  return blogPosts;
};

export const fetchBlogPost = async (slug: string): Promise<BlogPost | null> => {
  // In a real application, this would fetch from an API or database
  const post = blogPosts.find(post => post.slug === slug);
  
  if (!post) {
    return null;
  }

  // Convert markdown content to HTML using marked
  const postCopy = { ...post };
  postCopy.content = await marked(post.content);
  
  return postCopy;
};

export const fetchLatestPosts = async (limit: number = 3): Promise<BlogPost[]> => {
  // In a real application, this would fetch from an API or database
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const fetchPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  // In a real application, this would fetch from an API or database
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

export const fetchPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  // In a real application, this would fetch from an API or database
  return blogPosts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}; 