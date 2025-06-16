'use client';

import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface PostPreviewProps {
  title: string;
  content: string;
}

export function PostPreview({ title, content }: PostPreviewProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Preview</h2>
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {isPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {isPreview ? (
        <div className="prose max-w-none">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      ) : (
        <div data-color-mode="light">
          <MDEditor
            value={content}
            preview="edit"
            height={400}
          />
        </div>
      )}
    </div>
  );
} 