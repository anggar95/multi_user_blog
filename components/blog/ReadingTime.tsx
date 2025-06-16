'use client';

import { useEffect, useState } from 'react';

interface ReadingTimeProps {
  content: string;
}

export function ReadingTime({ content }: ReadingTimeProps) {
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const calculateReadingTime = () => {
      const text = content.replace(/<[^>]*>/g, '');

      const words = text.trim().split(/\s+/).length;
      
      const minutes = Math.ceil(words / 200);
      
      setReadingTime(minutes);
    };

    calculateReadingTime();
  }, [content]);

  return (
    <span className="text-sm text-gray-500">
      {readingTime} min read
    </span>
  );
} 