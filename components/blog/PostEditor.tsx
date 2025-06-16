'use client';

import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { TagInput } from './TagInput';
import { PostExport } from './PostExport';
import { useAutoSave } from '../../hooks/useAutoSave';

interface PostEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  initialPublished?: boolean;
  postId?: string;
  onSubmit: (data: {
    title: string;
    content: string;
    tags: string[];
    published: boolean;
  }) => void;
}

export function PostEditor({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  initialPublished = false,
  postId,
  onSubmit,
}: PostEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData, isSaving, lastSaved } = useAutoSave(
    {
      title: initialTitle,
      content: initialContent,
      tags: initialTags,
      published: initialPublished,
    },
    {
      delay: 1000,
      onSave: async (data) => {
        if (!postId) return;
        await fetch(`/api/posts/${postId}/draft`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      },
    }
  );

  const handleSubmit = async (published: boolean) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...data,
        published,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {isSaving ? 'Saving...' : lastSaved ? `Last saved at ${lastSaved.toLocaleTimeString()}` : ''}
        </div>
        {postId && <PostExport post={{...data, author: { name: '' }, createdAt: new Date().toISOString() }} />}
      </div>

      <form className="space-y-4">
        <div>
          <input
            type="text"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Post title"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div data-color-mode="light">
          <MDEditor
            value={data.content}
            onChange={(value) => setData({ ...data, content: value || '' })}
            height={400}
          />
        </div>

        <TagInput
          tags={data.tags}
          onChange={(tags) => setData({ ...data, tags })}
          placeholder="Add tags..."
        />

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
} 