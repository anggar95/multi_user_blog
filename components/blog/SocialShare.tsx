'use client';

import { useState } from 'react';
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [isCopied, setIsCopied] = useState(false);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };
  const handleShare = async (platform: keyof typeof shareLinks | 'link') => {
    if (platform === 'link') {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    } else {
      window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 text-gray-500 hover:text-blue-400"
        title="Share on Twitter"
      >
        <Twitter size={20} />
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="p-2 text-gray-500 hover:text-blue-600"
        title="Share on Facebook"
      >
        <Facebook size={20} />
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="p-2 text-gray-500 hover:text-blue-700"
        title="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </button>
      <button
        onClick={() => handleShare('link')}
        className="p-2 text-gray-500 hover:text-gray-900"
        title="Copy link"
      >
        <LinkIcon size={20} />
      </button>
      {isCopied && (
        <span className="text-sm text-green-600">Copied!</span>
      )}
    </div>
  );
} 