"use client";

import { useEffect, useState } from 'react';
import { BlogPost } from '@/lib/types/blog';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogPost } from '@/lib/services/blogService';

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (typeof params.slug === 'string') {
        try {
          const fetchedPost = await fetchBlogPost(params.slug);
          setPost(fetchedPost);
        } catch (error) {
          console.error('Error loading blog post:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadPost();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#B87D3B] border-r-2"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-neutral-400 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blog"
            className="inline-flex items-center text-[#B87D3B] hover:text-[#96652F]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white py-20 px-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-[#B87D3B]/5 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#B87D3B" strokeWidth="0.5" strokeOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <article className="relative z-10 max-w-[800px] mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center text-[#B87D3B] hover:text-[#96652F] mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        {post.coverImage && (
          <div className="relative h-[400px] w-[400px] mx-auto mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-contain"
              priority
            />
          </div>
        )}

        <div className="space-y-4 mb-12">
          <Badge variant="outline" className="bg-[#B87D3B]/10 text-[#B87D3B] border-[#B87D3B]">
            {post.category}
          </Badge>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#B87D3B] via-[#96652F] to-[#B87D3B] bg-clip-text text-transparent">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author.name}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readingTime}
            </div>
            <div>
              {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none prose-headings:text-[#B87D3B] prose-a:text-[#B87D3B] hover:prose-a:text-[#96652F] prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-li:text-base bg-black/30 rounded-lg p-8 shadow-lg border border-neutral-800">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="space-y-6 [&>h1]:font-bold [&>h2]:font-bold [&>h3]:font-bold [&>h1]:mb-6 [&>h2]:mb-4 [&>h3]:mb-3 [&>p]:text-neutral-300 [&>ul]:text-neutral-300 [&>h2]:text-2xl [&>h3]:text-xl [&>h2]:mt-8 [&>h3]:mt-6 [&>h1]:pb-4 [&>h1]:border-b [&>h1]:border-[#B87D3B]/20"
          />
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center text-sm text-[#B87D3B] bg-[#B87D3B]/5 px-3 py-1 rounded-full"
              >
                <Tag className="w-4 h-4 mr-1" />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
} 