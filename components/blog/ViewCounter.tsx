'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
  postId: string;
}

export function ViewCounter({ postId }: ViewCounterProps) {
  useEffect(() => {
    const recordView = async () => {
      try {
        await fetch(`/api/posts/${postId}/view`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    recordView();
  }, [postId]);

  return null;
} 