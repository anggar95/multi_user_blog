'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
}

export function FollowButton({ userId, initialIsFollowing }: FollowButtonProps) {
  const { isSignedIn } = useUser();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    if (!isSignedIn) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md ${
        isFollowing
          ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          : 'bg-black text-white hover:bg-gray-800'
      } disabled:opacity-50`}
    >
      {isLoading
        ? 'Loading...'
        : isFollowing
        ? 'Following'
        : 'Follow'}
    </button>
  );
} 