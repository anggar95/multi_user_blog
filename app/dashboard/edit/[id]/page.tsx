'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PostEditor } from '../../../../components/blog/PostEditor';

export default function EditPostPage({
  params
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/posts/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch post');
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [params.id]);

  const handleSubmit = async (data: { title: string; content: string }) => {
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update post');

      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8">Edit Post</h1>
      <PostEditor
        initialTitle={post.title}
        initialContent={post.content}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 