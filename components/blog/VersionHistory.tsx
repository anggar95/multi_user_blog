'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { History, ChevronDown, ChevronUp } from 'lucide-react';

interface Version {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  createdBy: {
    name: string | null;
    image: string | null;
  };
}

interface VersionHistoryProps {
  postId: string;
  onVersionSelect: (version: Version) => void;
}

export function VersionHistory({ postId, onVersionSelect }: VersionHistoryProps) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/versions`);
      const data = await response.json();
      setVersions(data.versions);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      fetchVersions();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="border rounded-lg">
      <button
        onClick={handleToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <History size={20} />
          <span className="font-medium">Version History</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="p-4 border-t">
          {isLoading ? (
            <div className="text-center text-gray-500">Loading versions...</div>
          ) : versions.length === 0 ? (
            <div className="text-center text-gray-500">No versions found</div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div
                  key={version.id}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onVersionSelect(version)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={version.createdBy.image || '/default-avatar.png'}
                      alt={version.createdBy.name || 'Anonymous'}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium">
                      {version.createdBy.name || 'Anonymous'}
                    </span>
                    <span className="text-gray-500">
                      {formatDistanceToNow(new Date(version.createdAt))} ago
                    </span>
                  </div>
                  <h4 className="font-medium">{version.title}</h4>
                  <div className="mt-2 flex gap-2">
                    {version.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 