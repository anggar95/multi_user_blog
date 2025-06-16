'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  author: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
  tags: { name: string }[];
}

interface RecommendedPostsProps {
  currentPostId: string;
  currentTags: string[];
}

export function RecommendedPosts({ currentPostId, currentTags }: RecommendedPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const response = await fetch(
          `/api/posts/recommended?postId=${currentPostId}&tags=${currentTags.join(',')}`
        );
        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching recommended posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedPosts();
  }, [currentPostId, currentTags]);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recommended Posts</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-4">
            <Link href={`/posts/${post.id}`}>
              <h4 className="font-medium hover:text-gray-600">{post.title}</h4>
            </Link>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
              <img
                src={post.author.image || '/default-avatar.png'}
                alt={post.author.name || 'Anonymous'}
                className="w-5 h-5 rounded-full"
              />
              <span>{post.author.name || 'Anonymous'}</span>
              <span>•</span>
              <time>{formatDistanceToNow(new Date(post.createdAt))} ago</time>
            </div>
            <div className="mt-2 flex gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 