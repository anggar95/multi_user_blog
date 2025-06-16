'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  author: {
    name: string | null;
    image: string | null;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { isSignedIn } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded-md"
            rows={3}
          />
          <button
            type="submit"
            className="mt-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-8">Sign in to leave a comment</p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-4">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={comment.author.image || '/default-avatar.png'}
                alt={comment.author.name || 'Anonymous'}
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium">
                {comment.author.name || 'Anonymous'}
              </span>
              <span className="text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt))} ago
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 