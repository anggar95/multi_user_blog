'use client';

import { useState } from 'react';
import { Download, FileText, Share2 } from 'lucide-react';

interface PostExportProps {
  post: {
    title: string;
    content: string;
    author: {
      name: string | null;
    };
    createdAt: string;
  };
}

export function PostExport({ post }: PostExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportAsMarkdown = () => {
    const markdown = `# ${post.title}

By ${post.author.name || 'Anonymous'} on ${new Date(post.createdAt).toLocaleDateString()}

${post.content.replace(/<[^>]*>/g, '')}`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${post.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/posts/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) throw new Error('Failed to export PDF');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${post.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportAsMarkdown}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
      >
        <FileText size={16} />
        Export as Markdown
      </button>
      <button
        onClick={exportAsPDF}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
      >
        <Download size={16} />
        {isExporting ? 'Exporting...' : 'Export as PDF'}
      </button>
    </div>
  );
} 