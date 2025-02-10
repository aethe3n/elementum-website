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

  if (isLoading) {
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="max-w-[1200px] mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-black/50 to-transparent">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
              Latest Updates
            </h2>
            <p className="text-neutral-400 mt-2">
              Stay informed about our latest developments and upcoming features
            </p>
          </div>
          <Link
            href="/blog"
            className="flex items-center text-[#B87D3B] hover:text-[#96652F] transition-colors"
          >
            View all updates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {updates.map((update) => (
            <div
              key={update.id}
              className="bg-black/30 rounded-lg p-6 border border-neutral-800 hover:border-[#B87D3B]/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
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
                <div className="text-sm text-neutral-400">
                  {new Date(update.date).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2 text-white">
                {update.title}
              </h3>

              <p className="text-neutral-400 text-sm mb-4">
                {update.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
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

              {update.link && (
                <Link
                  href={update.link}
                  className="text-sm text-[#B87D3B] hover:text-[#96652F] transition-colors flex items-center"
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