'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
}

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const { isSignedIn } = useUser();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    if (!isSignedIn) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 ${
        isLiked ? 'text-red-500' : 'text-gray-500'
      }`}
    >
      <Heart className={isLiked ? 'fill-current' : ''} />
      <span>{likes}</span>
    </button>
  );
} 