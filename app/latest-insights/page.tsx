"use client";

import { useEffect, useState } from 'react';
import { BlogPost } from '@/lib/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Tag } from 'lucide-react';
import { fetchLatestPosts } from '@/lib/services/blogService';

export default function LatestInsightsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchLatestPosts(6);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
            Latest Market Insights
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Stay informed with our latest market analysis, trends, and trading insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-black/30 rounded-lg overflow-hidden border border-neutral-800 transition-all duration-300 hover:border-[#B87D3B]/50 hover:shadow-lg hover:shadow-[#B87D3B]/5">
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Badge variant="outline" className="bg-[#B87D3B]/10 text-[#B87D3B] border-[#B87D3B]">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readingTime}
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold leading-tight group-hover:text-[#B87D3B] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-neutral-400 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-[#B87D3B]" />
                      <span className="text-neutral-400">{post.author.name}</span>
                    </div>
                    <div className="text-sm text-neutral-400">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center text-xs text-[#B87D3B]"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-400">No insights available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
} 