"use client";

import { useState, useEffect } from 'react';
import { BlogPost } from '@/lib/types/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Tag, Clock, User } from 'lucide-react';
import { fetchBlogPosts } from '@/lib/services/blogService';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = ['All', 'Update', 'Project', 'News', 'Tutorial'];

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error loading blog posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

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
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#E4C9B0] via-[#FC9D44] to-[#BF946B] bg-clip-text text-transparent">
            Latest Updates & Insights
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Stay updated with our latest developments, market insights, and trading strategies
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BF946B]" />
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/30 border-[#BF946B]/20 rounded-full focus:border-[#FC9D44] focus:ring-[#FC9D44] transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={`rounded-full border-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-[#FC9D44] text-white border-[#FC9D44] hover:bg-[#BF946B] hover:border-[#BF946B]'
                    : 'text-[#BF946B] border-[#BF946B] hover:bg-[#BF946B]/10'
                }`}
                onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-black/30 rounded-2xl overflow-hidden border border-[#BF946B]/20 transition-all duration-300 hover:border-[#FC9D44]/50 hover:shadow-lg hover:shadow-[#FC9D44]/5 backdrop-blur-sm">
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
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
                    <Badge variant="outline" className="bg-[#BF946B]/10 text-[#FC9D44] border-[#FC9D44] rounded-full px-3">
                      {post.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#BF946B]" />
                      {post.readingTime}
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold leading-tight group-hover:text-[#FC9D44] transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-neutral-400 text-sm line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#BF946B]/20">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-[#BF946B]" />
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
                        className="flex items-center text-xs text-[#FC9D44] bg-[#BF946B]/5 px-2 py-1 rounded-full"
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

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 bg-black/30 rounded-2xl border border-[#BF946B]/20 backdrop-blur-sm">
            <p className="text-neutral-400">No posts found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
} 