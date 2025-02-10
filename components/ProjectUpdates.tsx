"use client";

import { useEffect, useState } from 'react';
import { ProjectUpdate } from '@/lib/types/blog';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { fetchPostsByCategory } from '@/lib/services/blogService';

export default function ProjectUpdates() {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const posts = await fetchPostsByCategory('Update');
        const projectUpdates: ProjectUpdate[] = posts.map(post => ({
          id: post.id,
          title: post.title,
          description: post.excerpt,
          status: 'Completed',
          date: post.publishedAt,
          link: `/blog/${post.slug}`,
          tags: post.tags
        }));
        setUpdates(projectUpdates);
      } catch (error) {
        console.error('Error loading project updates:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUpdates();
  }, []);

  // Create placeholder updates for empty slots
  const placeholderUpdates: ProjectUpdate[] = [
    {
      id: 'placeholder-1',
      title: 'Coming Soon',
      description: 'Stay tuned for more exciting updates about our platform and services.',
      status: 'Planned' as const,
      date: new Date().toISOString(),
      tags: ['Future Update'],
      link: undefined
    },
    {
      id: 'placeholder-2',
      title: 'Future Announcement',
      description: 'More features and improvements are on the way.',
      status: 'Planned' as const,
      date: new Date().toISOString(),
      tags: ['Upcoming'],
      link: undefined
    }
  ];

  // Combine real updates with placeholders to always show 3 items
  const displayUpdates = [...updates, ...placeholderUpdates].slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-12 px-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-gradient-to-b from-black/50 to-transparent">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Stay informed about our latest developments
            </p>
          </div>
          <Link
            href="/blog"
            className="flex items-center text-[#B87D3B] hover:text-[#96652F] transition-colors text-sm"
          >
            View all updates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {displayUpdates.map((update, index) => (
            <div
              key={update.id}
              className={`bg-black/30 rounded-lg p-4 border border-neutral-800 hover:border-[#B87D3B]/50 transition-all duration-300 ${
                update.id.includes('placeholder') ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <Badge
                  variant="outline"
                  className={`
                    ${update.status === 'Completed' ? 'bg-green-900/10 border-green-500 text-green-500' : ''}
                    ${update.status === 'In Progress' ? 'bg-[#B87D3B]/10 border-[#B87D3B] text-[#B87D3B]' : ''}
                    ${update.status === 'Planned' ? 'bg-blue-900/10 border-blue-500 text-blue-500' : ''}
                  `}
                >
                  {update.status}
                </Badge>
                <div className="text-xs text-neutral-400">
                  {new Date(update.date).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-base font-semibold mb-2 text-white line-clamp-1">
                {update.title}
              </h3>

              <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                {update.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-2">
                {update.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center text-xs text-[#B87D3B]"
                  >
                    <GitBranch className="w-3 h-3 mr-1" />
                    {tag}
                  </div>
                ))}
              </div>

              {update.link && !update.id.includes('placeholder') && (
                <Link
                  href={update.link}
                  className="text-xs text-[#B87D3B] hover:text-[#96652F] transition-colors flex items-center"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 